import dayjs from 'dayjs';
import { Policy } from '../../policy-engine';
import {
  PermitAppInfo,
  PolicyCheckId,
  PolicyCheckResultType,
} from '../../enum';
import { AxleConfiguration } from '../../types';
import {
  CheckAxleGroupMaximumLegalWeightThreshold,
  getMaximumLegalAxleGroupWeightThreshold,
} from '../../helper/policy-check.helper';
import { getCtr717TableValue } from '../../helper/ctr-717.helper';
import currentPolicyConfig from '../policy-config/_current-config.json';
import testStow from '../permit-app/test-stow.json';

describe('ORV2-5617 axle group maximum legal weight threshold', () => {
  const policy = new Policy(currentPolicyConfig);

  type GroupOptions = {
    vehicleConfiguration?: Array<string>;
    spreadCm?: number;
    driveAxleCount?: number;
    trailingAxleCount?: number;
    driveWeight?: number;
    trailingWeight?: number;
    includeVehicleIndexes?: boolean;
  };

  const getThreeUnitConfiguration = ({
    vehicleConfiguration = ['TRKTRAC', 'SEMITRL'],
    spreadCm = 315,
    driveAxleCount = 2,
    trailingAxleCount = 1,
    driveWeight = 11000,
    trailingWeight = 10000,
    includeVehicleIndexes = true,
  }: GroupOptions = {}): {
    vehicleConfiguration: Array<string>;
    axleConfiguration: Array<AxleConfiguration>;
  } => {
    const driveAxleSpread = driveAxleCount > 1 ? 160 : 0;
    const trailingAxleSpread = trailingAxleCount > 1 ? 100 : 0;
    const interaxleSpacing = spreadCm - driveAxleSpread - trailingAxleSpread;
    const axleConfiguration: Array<AxleConfiguration> = [
      {
        numberOfAxles: 1,
        axleUnitWeight: 6700,
        numberOfTires: 2,
        tireSize: 355,
      },
      {
        numberOfAxles: driveAxleCount,
        axleSpread: driveAxleSpread || undefined,
        interaxleSpacing: 350,
        axleUnitWeight: driveWeight,
        numberOfTires: driveAxleCount * 4,
        tireSize: 330,
      },
      {
        numberOfAxles: trailingAxleCount,
        axleSpread: trailingAxleSpread || undefined,
        interaxleSpacing,
        axleUnitWeight: trailingWeight,
        numberOfTires: trailingAxleCount * 4,
        tireSize: 330,
      },
    ];

    if (includeVehicleIndexes) {
      axleConfiguration[0].vehicleIndex = 0;
      axleConfiguration[1].vehicleIndex = 0;
      axleConfiguration[2].vehicleIndex = 1;
    }

    return { vehicleConfiguration, axleConfiguration };
  };

  const getResults = (options: GroupOptions = {}) => {
    const { vehicleConfiguration, axleConfiguration } =
      getThreeUnitConfiguration(options);
    return CheckAxleGroupMaximumLegalWeightThreshold(
      policy,
      vehicleConfiguration,
      axleConfiguration,
    );
  };

  describe('authoritative CTR 7.17 table lookup', () => {
    it.each([
      [0, 9100],
      [99, 9100],
      [100, 16500],
      [119, 16500],
      [120, 17000],
      [189, 17000],
      [190, 18000],
      [229, 18000],
      [230, 19000],
      [259, 19000],
      [260, 20000],
      [299, 20000],
      [300, 21000],
      [339, 21000],
      [340, 22000],
      [379, 22000],
      [380, 23000],
      [419, 23000],
      [420, 24000],
      [459, 24000],
      [460, 25000],
      [499, 25000],
      [500, 26000],
      [529, 26000],
      [530, 27000],
      [569, 27000],
      [570, 28000],
      [609, 28000],
      [610, 29000],
      [630, 29000],
      [649, 29000],
      [650, 30000],
      [689, 30000],
      [690, 31000],
      [719, 31000],
      [720, 32000],
      [759, 32000],
      [760, 33000],
      [799, 33000],
      [800, 34000],
      [900, 34000],
    ])('maps %i cm to %i kg', (spreadCm, expectedWeight) => {
      expect(getCtr717TableValue(spreadCm)).toBe(expectedWeight);
    });

    it.each([-1, Number.NaN, Number.POSITIVE_INFINITY])(
      'does not return a table value for invalid spread %s',
      (spreadCm) => {
        expect(getCtr717TableValue(spreadCm)).toBeUndefined();
      },
    );
  });

  describe('threshold selection independent of table lookup', () => {
    it.each([
      [26100, 21000, 21000],
      [26100, 26100, 26100],
      [26100, 30000, 26100],
      [26100, 33000, 26100],
    ])(
      'uses the lower of %i kg individual limits and %i kg supplied CTR value',
      (individualLimitSum, ctr717Value, expectedThreshold) => {
        expect(
          getMaximumLegalAxleGroupWeightThreshold(
            individualLimitSum,
            ctr717Value,
            false,
          ),
        ).toBe(expectedThreshold);
      },
    );

    it.each([
      [21000, 24000],
      [24000, 24000],
      [27000, 27000],
    ])(
      'uses the greater of 24,000 kg and %i kg supplied CTR value for the exception',
      (ctr717Value, expectedThreshold) => {
        expect(
          getMaximumLegalAxleGroupWeightThreshold(0, ctr717Value, true),
        ).toBe(expectedThreshold);
      },
    );
  });

  describe('standard axle groups', () => {
    it.each([
      [315, 21000],
      [420, 24000],
      [510, 26000],
      [760, 26100],
      [790, 26100],
      [800, 26100],
    ])(
      'uses the configured legal-weight sum and authoritative table at %i cm',
      (spreadCm, expectedThreshold) => {
        const [result] = getResults({ spreadCm });

        expect(result).toMatchObject({
          id: PolicyCheckId.AxleGroupMaximumLegalWeightThreshold,
          startAxleUnit: 2,
          endAxleUnit: 3,
          thresholdWeight: expectedThreshold,
        });
      },
    );

    it.each([
      [20999, PolicyCheckResultType.Pass, ''],
      [21000, PolicyCheckResultType.Pass, ''],
      [
        21001,
        PolicyCheckResultType.Fail,
        'Axle Group 2 to 3 exceeds the maximum legal weight threshold of 21000 kg by 1 kg.',
      ],
    ])(
      'evaluates %i kg actual weight against a 21,000 kg threshold',
      (actualWeight, expectedResult, expectedMessage) => {
        const [result] = getResults({
          spreadCm: 315,
          driveWeight: 11000,
          trailingWeight: actualWeight - 11000,
        });

        expect(result).toMatchObject({
          result: expectedResult,
          message: expectedMessage,
          actualWeight,
          thresholdWeight: 21000,
        });
      },
    );

    it('supports legacy flattened axle configurations without vehicle indexes', () => {
      const [result] = getResults({
        spreadCm: 315,
        includeVehicleIndexes: false,
      });

      expect(result).toMatchObject({
        startAxleUnit: 2,
        endAxleUnit: 3,
        thresholdWeight: 21000,
      });
    });

    it('evaluates every contiguous eligible group and excludes axle unit 1', () => {
      const vehicleConfiguration = ['TRKTRAC', 'SEMITRL', 'SEMITRL'];
      const axleConfiguration: Array<AxleConfiguration> = [
        { numberOfAxles: 1, axleUnitWeight: 6000, vehicleIndex: 0 },
        {
          numberOfAxles: 1,
          axleUnitWeight: 8000,
          interaxleSpacing: 350,
          vehicleIndex: 0,
        },
        {
          numberOfAxles: 1,
          axleUnitWeight: 8000,
          interaxleSpacing: 260,
          vehicleIndex: 1,
        },
        {
          numberOfAxles: 1,
          axleUnitWeight: 8000,
          interaxleSpacing: 100,
          vehicleIndex: 2,
        },
      ];

      const results = CheckAxleGroupMaximumLegalWeightThreshold(
        policy,
        vehicleConfiguration,
        axleConfiguration,
      );

      expect(
        results.map(({ startAxleUnit, endAxleUnit }) => [
          startAxleUnit,
          endAxleUnit,
        ]),
      ).toEqual([
        [2, 3],
        [2, 4],
        [3, 4],
      ]);
      expect(results.every((result) => result.startAxleUnit > 1)).toBe(true);
    });

    it.each([801, 810])(
      'does not return the group when its spread is %i cm',
      (spreadCm) => {
        expect(getResults({ spreadCm })).toHaveLength(0);
      },
    );
  });

  describe('tandem-drive/single-jeep exception', () => {
    it.each([
      [315, 24000],
      [420, 24000],
      [500, 26000],
      [630, 29000],
    ])(
      'uses the greater of 24,000 kg and the table value at %i cm',
      (spreadCm, expectedThreshold) => {
        const [result] = getResults({
          vehicleConfiguration: ['TRKTRAC', 'JEEPSRG'],
          spreadCm,
        });

        expect(result.thresholdWeight).toBe(expectedThreshold);
      },
    );

    it.each([
      {
        description: 'another power-unit subtype',
        options: {
          vehicleConfiguration: ['REGTRCK', 'JEEPSRG'],
        } as GroupOptions,
      },
      {
        description: 'a non-single jeep',
        options: {
          vehicleConfiguration: ['TRKTRAC', 'JEEPSRG'],
          trailingAxleCount: 2,
        } as GroupOptions,
      },
      {
        description: 'a non-tandem drive',
        options: {
          vehicleConfiguration: ['TRKTRAC', 'JEEPSRG'],
          driveAxleCount: 3,
        } as GroupOptions,
      },
    ])('does not generalize the exception to $description', ({ options }) => {
      const [result] = getResults({ spreadCm: 315, ...options });

      expect(result.thresholdWeight).toBe(21000);
    });

    it('does not apply the exception when the jeep is not immediately after the power unit', () => {
      const vehicleConfiguration = ['TRKTRAC', 'SEMITRL', 'JEEPSRG'];
      const axleConfiguration: Array<AxleConfiguration> = [
        { numberOfAxles: 1, axleUnitWeight: 6700, vehicleIndex: 0 },
        {
          numberOfAxles: 2,
          axleSpread: 160,
          interaxleSpacing: 350,
          axleUnitWeight: 11000,
          vehicleIndex: 0,
        },
        {
          numberOfAxles: 1,
          interaxleSpacing: 155,
          axleUnitWeight: 10000,
          vehicleIndex: 1,
        },
        {
          numberOfAxles: 1,
          interaxleSpacing: 100,
          axleUnitWeight: 9000,
          vehicleIndex: 2,
        },
      ];

      const [driveAndTrailerResult] = CheckAxleGroupMaximumLegalWeightThreshold(
        policy,
        vehicleConfiguration,
        axleConfiguration,
      );

      expect(driveAndTrailerResult.thresholdWeight).toBe(21000);
    });

    it('uses the standard rule for a larger group containing the exact exception pair', () => {
      const vehicleConfiguration = ['TRKTRAC', 'JEEPSRG', 'SEMITRL'];
      const axleConfiguration: Array<AxleConfiguration> = [
        { numberOfAxles: 1, axleUnitWeight: 6700, vehicleIndex: 0 },
        {
          numberOfAxles: 2,
          axleSpread: 160,
          interaxleSpacing: 350,
          axleUnitWeight: 11000,
          vehicleIndex: 0,
        },
        {
          numberOfAxles: 1,
          interaxleSpacing: 155,
          axleUnitWeight: 10000,
          vehicleIndex: 1,
        },
        {
          numberOfAxles: 1,
          interaxleSpacing: 100,
          axleUnitWeight: 9000,
          vehicleIndex: 2,
        },
      ];

      const results = CheckAxleGroupMaximumLegalWeightThreshold(
        policy,
        vehicleConfiguration,
        axleConfiguration,
      );
      const exceptionPair = results.find(
        (result) => result.startAxleUnit === 2 && result.endAxleUnit === 3,
      );
      const containingGroup = results.find(
        (result) => result.startAxleUnit === 2 && result.endAxleUnit === 4,
      );

      expect(exceptionPair?.thresholdWeight).toBe(24000);
      expect(containingGroup?.thresholdWeight).toBe(23000);
    });
  });

  describe('public calculation and validation paths', () => {
    it('returns the registered failure without repurposing licensed-GVW overload', () => {
      const { vehicleConfiguration, axleConfiguration } =
        getThreeUnitConfiguration({
          spreadCm: 315,
          driveWeight: 11000,
          trailingWeight: 10001,
        });

      const results = policy.runAxleCalculation(
        vehicleConfiguration,
        axleConfiguration,
        100000,
      );
      const failure = results.results.find(
        (result) =>
          result.id === PolicyCheckId.AxleGroupMaximumLegalWeightThreshold,
      );

      expect(failure).toMatchObject({
        result: PolicyCheckResultType.Fail,
        startAxleUnit: 2,
        endAxleUnit: 3,
        actualWeight: 21001,
        thresholdWeight: 21000,
      });
      expect(results.overload).toBe(0);
    });

    const getNestedJeepPermit = (driveWeight: number, jeepWeight: number) => {
      const permit = JSON.parse(JSON.stringify(testStow));
      permit.permitData.startDate = dayjs().format(
        PermitAppInfo.PermitDateFormat.toString(),
      );
      const axleConfiguration =
        permit.permitData.vehicleConfiguration.axleConfiguration;
      axleConfiguration[1].axleUnitWeight = driveWeight;
      axleConfiguration[1].numberOfTires = 8;
      axleConfiguration[2] = {
        numberOfAxles: 1,
        numberOfTires: 4,
        tireSize: 330,
        interaxleSpacing: 155,
        axleUnitWeight: jeepWeight,
      };
      permit.permitData.vehicleConfiguration.axleConfiguration =
        axleConfiguration.slice(0, 2);
      permit.permitData.vehicleConfiguration.trailers[0].axleConfiguration = [
        axleConfiguration[2],
      ];
      permit.permitData.vehicleConfiguration.trailers[1].axleConfiguration = [
        axleConfiguration[3],
      ];
      permit.permitData.vehicleConfiguration.trailers[2].axleConfiguration = [
        axleConfiguration[4],
      ];
      return permit;
    };

    it('exposes a nested trailer failure through validate details and structured results', async () => {
      const validationResult = await policy.validate(
        getNestedJeepPermit(13500, 10501),
      );
      const failure = validationResult.axleCalculationResults?.results.find(
        (result) =>
          result.id === PolicyCheckId.AxleGroupMaximumLegalWeightThreshold &&
          result.result === PolicyCheckResultType.Fail,
      );
      const message =
        'Axle Group 2 to 3 exceeds the maximum legal weight threshold of 24000 kg by 1 kg.';

      expect(failure).toMatchObject({
        message,
        startAxleUnit: 2,
        endAxleUnit: 3,
        actualWeight: 24001,
        thresholdWeight: 24000,
      });
      expect(validationResult.violations).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            message:
              'Vehicle configuration failed axle calculation policy checks',
            details: expect.arrayContaining([message]),
          }),
        ]),
      );
    });

    it('does not add an axle-calculation violation at the exact threshold', async () => {
      const validationResult = await policy.validate(
        getNestedJeepPermit(13500, 10500),
      );
      const axleCalculationViolation = validationResult.violations.find(
        (violation) =>
          violation.message ===
          'Vehicle configuration failed axle calculation policy checks',
      );

      expect(axleCalculationViolation).toBeUndefined();
      expect(
        validationResult.axleCalculationResults?.results.find(
          (result) =>
            result.id === PolicyCheckId.AxleGroupMaximumLegalWeightThreshold &&
            result.startAxleUnit === 2 &&
            result.endAxleUnit === 3,
        ),
      ).toMatchObject({
        result: PolicyCheckResultType.Pass,
        actualWeight: 24000,
        thresholdWeight: 24000,
      });
    });
  });
});
