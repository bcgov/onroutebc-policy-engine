import { Policy } from '../../policy-engine';
import { POWER_UNIT_CODES } from '../../constants/power-unit-codes';
import { COMMODITY_CODES } from '../../constants/commodity-codes';
import { PolicyCheckId, PolicyCheckResultType } from '../../enum';
import { AxleConfiguration } from '../../types';
import { PermitAppInfo } from '../../enum/permit-app-info';
import {
  convertToTimezone,
  getUtcDatetime,
  TIMEZONE_IDS,
} from '../../helper/date.helper';
import config from '../policy-config/_current-config.json';
import testStow from '../permit-app/test-stow.json';

const axles = (driveCount: number): AxleConfiguration[] => [
  {
    numberOfAxles: 1,
    axleUnitWeight: 9100,
    numberOfTires: 2,
    tireSize: 455,
    vehicleIndex: 0,
  },
  {
    numberOfAxles: driveCount,
    axleUnitWeight: driveCount === 1 ? 10000 : 25000,
    numberOfTires: driveCount * 4,
    tireSize: 455,
    axleSpread: 300,
    interaxleSpacing: 600,
    vehicleIndex: 0,
  },
];
const policy = new Policy(config);

// XLS J32/J36/J159/J204 (11) and J79/J80/J83/J96 (13).
describe.each([
  POWER_UNIT_CODES.PICKER_TRUCK_TRACTORS,
  POWER_UNIT_CODES.PICKER_TRUCKS,
  POWER_UNIT_CODES.TRUCK_TRACTOR_WITH_PME,
  POWER_UNIT_CODES.TRUCK_WITH_PME,
])('commodity weights for %s', (type) => {
  it.each([
    [COMMODITY_CODES.NON_REDUCIBLE_LOADS, 1, 11000, PolicyCheckResultType.Pass],
    [COMMODITY_CODES.NONE, 1, 9100, PolicyCheckResultType.Fail],
    [COMMODITY_CODES.EMPTY, 1, 9100, PolicyCheckResultType.Fail],
    [COMMODITY_CODES.NON_REDUCIBLE_LOADS, 3, 28000, PolicyCheckResultType.Pass],
    [COMMODITY_CODES.NONE, 3, 24000, PolicyCheckResultType.Fail],
    [COMMODITY_CODES.EMPTY, 3, 24000, PolicyCheckResultType.Fail],
  ])(
    'uses %s limits for %i drive axles',
    (commodity, driveCount, limit, result) => {
      const calculated = policy.runAxleCalculation(
        [type],
        axles(driveCount),
        100000,
        commodity,
      );
      expect(
        calculated.results.find(
          ({ id, startAxleUnit }) =>
            id === PolicyCheckId.PermittableWeight && startAxleUnit === 2,
        ),
      ).toMatchObject({ thresholdWeight: limit, result });
    },
  );
});

describe('invalid commodity', () => {
  it.each([undefined, 'UNKNOWN'])(
    'rejects %s in the public axle API',
    (commodity) => {
      expect(() =>
        policy.runAxleCalculation(
          [POWER_UNIT_CODES.PICKER_TRUCK_TRACTORS],
          axles(1),
          100000,
          commodity as unknown as string,
        ),
      ).toThrow('Unknown commodity');
    },
  );

  it.each([undefined, 'UNKNOWN'])(
    'reports %s through validate without calculating axle weights',
    async (commodity) => {
      const permit = JSON.parse(JSON.stringify(testStow));
      permit.permitData.startDate = convertToTimezone(
        getUtcDatetime(),
        TIMEZONE_IDS.PACIFIC,
      ).format(PermitAppInfo.PermitDateFormat);
      permit.permitData.permittedCommodity.commodityType = commodity;

      const result = await policy.validate(permit);
      expect(result.violations.length).toBeGreaterThan(0);
      expect(result.axleCalculationResults).toBeUndefined();
    },
  );
});
