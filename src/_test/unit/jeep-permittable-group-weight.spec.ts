import { COMMODITY_CODES } from '../../constants/commodity-codes';
import { POWER_UNITS } from '../../constants/power-units';
import { TRAILERS } from '../../constants/trailers';
import {
  PermitAppInfo,
  PolicyCheckId,
  PolicyCheckResultType,
} from '../../enum';
import {
  convertToTimezone,
  getUtcDatetime,
  TIMEZONE_IDS,
} from '../../helper/date.helper';
import { CheckPermittableWeight } from '../../helper/policy-check.helper';
import { Policy } from '../../policy-engine';
import { AxleConfiguration } from '../../types';
import currentPolicyConfig from '../policy-config/_current-config.json';
import testStow from '../permit-app/test-stow.json';

describe('ORV2-6163 single axle jeep permittable group weight', () => {
  const policy = new Policy(currentPolicyConfig);
  const vehicleConfiguration = [
    POWER_UNITS.TRUCK_TRACTORS.id,
    TRAILERS.JEEPS.id,
  ];
  const getAxleConfiguration = (
    groupSpacing: number,
    groupWeight: number,
  ): Array<AxleConfiguration> => [
    {
      numberOfAxles: 1,
      axleUnitWeight: 6000,
      numberOfTires: 2,
      tireSize: 455,
      vehicleIndex: 0,
    },
    {
      numberOfAxles: 2,
      axleSpread: 120,
      interaxleSpacing: 500,
      axleUnitWeight: 22000,
      numberOfTires: 8,
      tireSize: 455,
      vehicleIndex: 0,
    },
    {
      numberOfAxles: 1,
      interaxleSpacing: groupSpacing - 120,
      axleUnitWeight: groupWeight - 22000,
      numberOfTires: 4,
      tireSize: 455,
      vehicleIndex: 1,
    },
  ];

  it.each([
    [240, 28000],
    [300, 28000],
    [301, 29000],
    [370, 29000],
  ])('checks the %i cm tier against %i kg', (groupSpacing, limit) => {
    for (const excess of [-1, 0, 1]) {
      const results = CheckPermittableWeight(
        policy,
        vehicleConfiguration,
        getAxleConfiguration(groupSpacing, limit + excess),
        COMMODITY_CODES.NONE,
      );

      expect(results).toHaveLength(3);
      if (excess > 0) {
        expect(results).toContainEqual({
          id: PolicyCheckId.PermittableWeight,
          result: PolicyCheckResultType.Fail,
          message: `Axle Unit 2 and Axle Unit 3 combined must not exceed ${limit} kg.`,
          startAxleUnit: 2,
          endAxleUnit: 3,
          actualWeight: limit + excess,
          thresholdWeight: limit,
        });
      }
      // The drive remains within its own limit; the jeep reports the group failure.
      expect(
        results
          .slice(0, 2)
          .every((result) => result.result === PolicyCheckResultType.Pass),
      ).toBe(true);
      if (excess <= 0) {
        expect(results[2].result).toBe(PolicyCheckResultType.Pass);
      }
    }
  });

  it.each([28000, 28001])(
    'checks both limits when the jeep unit is overweight and the group is %i kg',
    (groupWeight) => {
      const axles = getAxleConfiguration(300, groupWeight);
      axles[1].axleUnitWeight = groupWeight - 11001;
      axles[2].axleUnitWeight = 11001;
      const result = CheckPermittableWeight(
        policy,
        vehicleConfiguration,
        axles,
      )[2];

      expect(result).toMatchObject({
        result: PolicyCheckResultType.Fail,
        thresholdWeight: groupWeight > 28000 ? 28000 : 11000,
        message:
          groupWeight > 28000
            ? 'Axle Unit 2 and Axle Unit 3 combined must not exceed 28000 kg.'
            : 'Weight for axle unit 3 must not exceed 11000 kgs',
      });
    },
  );

  it('leaves other axle configurations unchanged', () => {
    const axleConfiguration = getAxleConfiguration(300, 28001);
    const cases = [
      {
        vehicles: [POWER_UNITS.TRUCK_TRACTORS.id, TRAILERS.SEMI_TRAILERS.id],
        axles: axleConfiguration,
      },
      {
        vehicles: vehicleConfiguration,
        axles: axleConfiguration.map((axle, index) =>
          index === 2 ? { ...axle, numberOfAxles: 2, axleSpread: 120 } : axle,
        ),
      },
      {
        vehicles: vehicleConfiguration,
        axles: axleConfiguration.map((axle, index) =>
          index === 1 ? { ...axle, numberOfAxles: 3 } : axle,
        ),
      },
      {
        vehicles: vehicleConfiguration,
        axles: getAxleConfiguration(239, 28001),
      },
      {
        vehicles: vehicleConfiguration,
        axles: getAxleConfiguration(371, 29001),
      },
    ];

    for (const { vehicles, axles } of cases) {
      expect(
        CheckPermittableWeight(policy, vehicles, axles).every(
          (result) => 'axleUnit' in result,
        ),
      ).toBe(true);
    }
  });

  it('returns the group failure through runAxleCalculation and validate', async () => {
    const axleConfiguration = getAxleConfiguration(300, 28001);
    const failure = {
      id: PolicyCheckId.PermittableWeight,
      result: PolicyCheckResultType.Fail,
      message: 'Axle Unit 2 and Axle Unit 3 combined must not exceed 28000 kg.',
      startAxleUnit: 2,
      endAxleUnit: 3,
      actualWeight: 28001,
      thresholdWeight: 28000,
    };
    expect(
      policy.runAxleCalculation(
        vehicleConfiguration,
        axleConfiguration,
        100000,
        COMMODITY_CODES.NONE,
      ).results,
    ).toContainEqual(failure);

    const permit = JSON.parse(JSON.stringify(testStow));
    permit.permitData.startDate = convertToTimezone(
      getUtcDatetime(),
      TIMEZONE_IDS.PACIFIC,
    ).format(PermitAppInfo.PermitDateFormat.toString());
    // Keep the fixture's main trailer and booster after the drive/jeep pair.
    permit.permitData.vehicleConfiguration.axleConfiguration.splice(
      0,
      3,
      ...axleConfiguration.map((axle) => {
        const permitAxle = { ...axle };
        delete permitAxle.vehicleIndex;
        return permitAxle;
      }),
    );
    const validation = await policy.validate(permit);

    expect(validation.axleCalculationResults?.results).toContainEqual(failure);
    expect(validation.violations).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          message:
            'Vehicle configuration failed axle calculation policy checks',
          details: expect.arrayContaining([failure.message]),
        }),
      ]),
    );
  });
});
