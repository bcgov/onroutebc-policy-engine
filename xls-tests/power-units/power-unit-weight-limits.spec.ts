import { Policy } from '../../src/policy-engine';
import {
  CheckLegalWeight,
  CheckPermittableWeight,
} from '../../src/helper/policy-check.helper';
import { PolicyCheckResultType } from '../../src/enum/policy-check';
import { AxleConfiguration } from '../../src/types';
import currentPolicyConfig from '../../src/_test/policy-config/_current-config.json';
import { getAxleCount } from '../shared/axle-types';
import { findCommodities, getOnlyCommodity } from '../shared/commodities';
import { getWeightLimit } from '../shared/weight-limit';
import { POWER_UNIT_VEHICLE_CODES } from './vehicle-codes';

type PowerUnitRow = {
  row: number;
  hidden: boolean;
  commodity: string;
  vehicle: string;
  steer: string;
  drive: string;
  limits: Record<string, unknown>;
};

// load-power-unit-rows.cjs (the Jest globalSetup) reads the workbook rows
// before the tests start, and puts them in this environment variable.
const {
  file,
  sheet,
  rows,
}: { file: string; sheet: string; rows: PowerUnitRow[] } = JSON.parse(
  process.env.POLICY_XLS_TEST_DATA!,
);

const policy = new Policy(currentPolicyConfig);

const STEER_AXLE_INDEX = 0;
const DRIVE_AXLE_INDEX = 1;

// Each check reads the steer limit and the drive limit from different columns.
const WEIGHT_CHECKS = [
  {
    name: 'CheckLegalWeight',
    check: CheckLegalWeight,
    steerColumn: 'D',
    driveColumn: 'I',
    resultAboveLimit: PolicyCheckResultType.Warning,
  },
  {
    name: 'CheckPermittableWeight',
    check: CheckPermittableWeight,
    steerColumn: 'E',
    driveColumn: 'J',
    resultAboveLimit: PolicyCheckResultType.Fail,
  },
];

// Each workbook row gives 8 tests:
// 2 checks (legal, permittable)
// x 2 axle units (steer, drive)
// x 2 weights (at the limit, and 1 kg above the limit).
describe(`XLS weight conformance: ${file}`, () => {
  describe.each(WEIGHT_CHECKS)(
    '$name',
    ({ check, steerColumn, driveColumn, resultAboveLimit }) => {
      const testCases = rows.flatMap((row) =>
        [
          { column: steerColumn, axleIndex: STEER_AXLE_INDEX },
          { column: driveColumn, axleIndex: DRIVE_AXLE_INDEX },
        ].flatMap(({ column, axleIndex }) =>
          [0, 1].map((kgAboveLimit) => ({
            row,
            column,
            axleIndex,
            kgAboveLimit,
            label: `${sheet}!${column}${row.row} | hidden=${row.hidden} | ${row.vehicle || '(missing vehicle)'} | ${row.commodity} | ${row.steer}/${row.drive} | limit=${row.limits[column]} + ${kgAboveLimit} kg`,
          })),
        ),
      );

      it.each(testCases)(
        '$label',
        ({ row, column, axleIndex, kgAboveLimit }) => {
          const vehicleCode = POWER_UNIT_VEHICLE_CODES[row.vehicle];
          if (!vehicleCode) {
            throw new Error(`Unmapped spreadsheet vehicle: '${row.vehicle}'`);
          }
          if (!policy.getPowerUnitDefinition(vehicleCode)) {
            throw new Error(
              `Missing JSON power-unit definition: ${vehicleCode}`,
            );
          }
          const steerAxleCount = getAxleCount(row.steer);
          const driveAxleCount = getAxleCount(row.drive);
          const limit = getWeightLimit(row.limits, column, row.row);
          const commodity = getOnlyCommodity(
            findCommodities(policy, row.commodity),
            row.commodity,
          );

          // Only the axle unit under test carries weight.
          // These checks need only the axle counts, weights, and vehicle,
          // not a full vehicle configuration.
          const weight = limit + kgAboveLimit;
          const axles: AxleConfiguration[] = [
            {
              numberOfAxles: steerAxleCount,
              vehicleIndex: 0,
              axleUnitWeight: axleIndex === STEER_AXLE_INDEX ? weight : 0,
            },
            {
              numberOfAxles: driveAxleCount,
              vehicleIndex: 0,
              axleUnitWeight: axleIndex === DRIVE_AXLE_INDEX ? weight : 0,
            },
          ];

          const results = check(policy, [vehicleCode], axles, commodity.id);

          expect(results[axleIndex]).toMatchObject({
            axleUnit: axleIndex + 1,
            actualWeight: weight,
            thresholdWeight: limit,
            result:
              kgAboveLimit === 0
                ? PolicyCheckResultType.Pass
                : resultAboveLimit,
          });
        },
      );
    },
  );
});
