import { Policy } from '../../src/policy-engine';
import {
  CheckLegalWeight,
  CheckPermittableWeight,
} from '../../src/helper/policy-check.helper';
import { PolicyCheckResultType } from '../../src/enum/policy-check';
import { Commodity } from '../../src/types';
import currentPolicyConfig from '../../src/_test/policy-config/_current-config.json';
import { findCommodities, getOnlyCommodity } from '../shared/commodities';
import { getWeightLimit } from '../shared/weight-limit';
import { getSourceGeometryCases } from './source-geometry';
import {
  buildTrailerFixture,
  getNeighbourAxleTypes,
  getTrailerFixturePowerUnits,
} from './trailer-fixture';
import { TRAILER_VEHICLE_CODES } from './vehicle-codes';

type TrailerRow = {
  row: number;
  hidden: boolean;
  commodity: string;
  category: string;
  vehicle: string;
  axleType: string;
  before: string;
  after: string;
  neighbourCategory: string;
  neighbourAxleType: string;
  limits: Record<string, unknown>;
  geometry: Record<string, unknown>;
  notes: string;
};

type TrailerTestCase = {
  row: TrailerRow;
  commodities: Commodity[];
  powerUnitCode: string;
  neighbourAxleType: string;
  spreadCm: number | undefined;
  spacingCm: number | undefined;
  geometryError: string | undefined;
  kgAboveLimit: number;
  label: string;
};

// load-trailer-rows.cjs (the Jest globalSetup) reads the workbook rows
// before the tests start, and puts them in this environment variable.
const {
  file,
  sheet,
  rows,
  geometryColumns,
}: {
  file: string;
  sheet: string;
  rows: TrailerRow[];
  geometryColumns: [string, string, string, string];
} = JSON.parse(process.env.POLICY_TRAILER_XLS_TEST_DATA!);

const policy = new Policy(currentPolicyConfig);

const WEIGHT_CHECKS = [
  {
    name: 'CheckLegalWeight',
    check: CheckLegalWeight,
    column: 'J',
    resultAboveLimit: PolicyCheckResultType.Warning,
  },
  {
    name: 'CheckPermittableWeight',
    check: CheckPermittableWeight,
    column: 'K',
    resultAboveLimit: PolicyCheckResultType.Fail,
  },
];

/**
 * Returns the test cases for one workbook row and one weight column.
 * One row can give many tests. There is one test for each combination of:
 *   - power unit (see getTrailerFixturePowerUnits)
 *   - neighbour axle type (column I "All" gives Single, Tandem, and Tridem)
 *   - geometry endpoint (each min and max spread and spacing value)
 *   - weight (at the limit, and 1 kg above the limit)
 */
function getTestCases(row: TrailerRow, column: string): TrailerTestCase[] {
  const commodities = findCommodities(policy, row.commodity);
  const powerUnitCodes = getTrailerFixturePowerUnits(
    commodities[0]?.powerUnits || [],
    TRAILER_VEHICLE_CODES[row.vehicle],
    row.neighbourCategory,
  );
  const neighbourAxleTypes = getNeighbourAxleTypes(row.neighbourAxleType);
  const geometryCases = getSourceGeometryCases(
    row.geometry,
    row.row,
    geometryColumns,
  );

  const testCases: TrailerTestCase[] = [];
  for (const powerUnitCode of powerUnitCodes) {
    for (const neighbourAxleType of neighbourAxleTypes) {
      for (const geometry of geometryCases) {
        for (const kgAboveLimit of [0, 1]) {
          testCases.push({
            row,
            commodities,
            powerUnitCode,
            neighbourAxleType,
            spreadCm: geometry.spreadCm,
            spacingCm: geometry.spacingCm,
            geometryError: geometry.error,
            kgAboveLimit,
            label: `${sheet}!${column}${row.row} | hidden=${row.hidden} | ${row.vehicle || '(missing vehicle)'} | ${row.commodity} | ${row.axleType} | before=${row.before} after=${row.after} neighbour=${row.neighbourCategory}/${neighbourAxleType} | spreadCm=${geometry.spreadCm} spacingCm=${geometry.spacingCm} | limit=${row.limits[column]} + ${kgAboveLimit} kg | powerUnit=${powerUnitCode}`,
          });
        }
      }
    }
  }
  return testCases;
}

describe(`XLS trailer weight conformance: ${file}`, () => {
  describe.each(WEIGHT_CHECKS)(
    '$name',
    ({ check, column, resultAboveLimit }) => {
      const testCases = rows.flatMap((row) => getTestCases(row, column));

      it.each(testCases)('$label', (testCase) => {
        const { row, kgAboveLimit } = testCase;
        if (testCase.geometryError) {
          throw new Error(testCase.geometryError);
        }
        const commodity = getOnlyCommodity(testCase.commodities, row.commodity);
        const trailerCode = TRAILER_VEHICLE_CODES[row.vehicle];
        if (!trailerCode) {
          throw new Error(`Unmapped spreadsheet trailer: '${row.vehicle}'`);
        }
        if (!policy.getTrailerDefinition(trailerCode)) {
          throw new Error(`Missing JSON trailer definition: ${trailerCode}`);
        }
        const limit = getWeightLimit(row.limits, column, row.row);
        const weight = limit + kgAboveLimit;

        const { vehicles, axles, targetAxleIndex } = buildTrailerFixture(
          {
            row: row.row,
            powerUnitCode: testCase.powerUnitCode,
            vehicleCode: trailerCode,
            axleType: row.axleType,
            before: row.before,
            after: row.after,
            neighbourCategory: row.neighbourCategory,
            neighbourAxleType: testCase.neighbourAxleType,
            spreadCm: testCase.spreadCm,
            spacingCm: testCase.spacingCm,
          },
          weight,
        );

        const results = check(policy, vehicles, axles, commodity.id);

        expect(results[targetAxleIndex]).toMatchObject({
          axleUnit: targetAxleIndex + 1,
          actualWeight: weight,
          thresholdWeight: limit,
          result:
            kgAboveLimit === 0 ? PolicyCheckResultType.Pass : resultAboveLimit,
        });
      });
    },
  );
});
