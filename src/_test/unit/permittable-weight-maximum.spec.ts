import { Policy } from '../../policy-engine';
import { PolicyCheckId, PolicyCheckResultType } from '../../enum/policy-check';
import { AxleConfiguration, PolicyDefinition } from '../../types';
import currentPolicyConfig from '../policy-config/_current-config.json';

describe('ORV2-5709 permittable weight maximums', () => {
  const policy = new Policy(currentPolicyConfig);

  type Scenario = {
    axleUnit: 1 | 2 | 3;
    axleCount: number;
    actualWeight: number;
    spread?: number;
    boosterAxleCount?: number;
  };

  const getPermittableResult = ({
    axleUnit,
    axleCount,
    actualWeight,
    spread,
    boosterAxleCount,
  }: Scenario) => {
    const hasTrailer = axleUnit === 3;
    const hasBooster = boosterAxleCount !== undefined;
    const vehicleConfiguration = [
      'TRKTRAC',
      ...(hasTrailer ? ['SEMITRL'] : []),
      ...(hasBooster ? ['BOOSTER'] : []),
    ];
    const axleConfiguration: Array<AxleConfiguration> = [
      {
        numberOfAxles: axleUnit === 1 ? axleCount : 1,
        axleSpread:
          axleUnit === 1 && axleCount > 1 ? (spread ?? 160) : undefined,
        axleUnitWeight: axleUnit === 1 ? actualWeight : 6000,
        numberOfTires: (axleUnit === 1 ? axleCount : 1) * 2,
        tireSize: 455,
        vehicleIndex: 0,
      },
      {
        numberOfAxles: axleUnit === 2 ? axleCount : 2,
        axleSpread:
          axleUnit === 2 ? (axleCount > 1 ? (spread ?? 160) : undefined) : 160,
        interaxleSpacing: 500,
        axleUnitWeight: axleUnit === 2 ? actualWeight : 17000,
        numberOfTires: (axleUnit === 2 ? axleCount : 2) * 4,
        tireSize: 455,
        vehicleIndex: 0,
      },
    ];

    if (hasTrailer) {
      axleConfiguration.push({
        numberOfAxles: axleCount,
        axleSpread: axleCount > 1 ? spread : undefined,
        interaxleSpacing: 500,
        axleUnitWeight: actualWeight,
        numberOfTires: axleCount * 4,
        tireSize: 455,
        vehicleIndex: 1,
      });
    }
    if (hasBooster) {
      axleConfiguration.push({
        numberOfAxles: boosterAxleCount,
        axleSpread: boosterAxleCount > 1 ? 160 : undefined,
        interaxleSpacing: 500,
        axleUnitWeight: 10000,
        numberOfTires: boosterAxleCount * 4,
        tireSize: 455,
        vehicleIndex: 2,
      });
    }

    return policy
      .runAxleCalculation(vehicleConfiguration, axleConfiguration, 100000)
      .results.find(
        (result) =>
          result.id === PolicyCheckId.CheckPermittableWeight &&
          result.startAxleUnit === axleUnit,
      )!;
  };

  const expectPermittableResult = (
    scenario: Scenario,
    thresholdWeight: number,
    expectedResult: PolicyCheckResultType,
  ) => {
    expect(getPermittableResult(scenario)).toMatchObject({
      actualWeight: scenario.actualWeight,
      thresholdWeight,
      result: expectedResult,
    });
  };

  // Source: ASW Permit Weight Maximums.feature @orv2-5709-1.
  describe('base axle-unit policy maximums', () => {
    it.each([
      [1, 1, 9100, undefined, 9100],
      [2, 1, 11000, undefined, 11000],
      [2, 2, 23000, undefined, 23000],
      [3, 3, 28000, 230, 28000],
    ])(
      'evaluates axle unit %i with %i axles at %i kg (spread %s, threshold %i kg)',
      (axleUnit, axleCount, actualWeight, spread, thresholdWeight) => {
        expectPermittableResult(
          {
            axleUnit: axleUnit as 1 | 2 | 3,
            axleCount: axleCount as number,
            actualWeight: actualWeight as number,
            spread: spread as number | undefined,
          },
          thresholdWeight as number,
          PolicyCheckResultType.Pass,
        );
      },
    );
  });

  // Source: ASW Permit Weight Maximums.feature @orv2-5709-2.
  describe('single steering axle boundary', () => {
    it.each([
      [9100, PolicyCheckResultType.Pass],
      [9101, PolicyCheckResultType.Fail],
    ])('evaluates %i kg', (actualWeight, expectedResult) => {
      expectPermittableResult(
        { axleUnit: 1, axleCount: 1, actualWeight },
        9100,
        expectedResult,
      );
    });
  });

  // Source: ASW Permit Weight Maximums.feature @orv2-5709-3.
  describe('single non-steering axle boundary', () => {
    it.each([
      [11000, PolicyCheckResultType.Pass],
      [11001, PolicyCheckResultType.Fail],
    ])('evaluates %i kg', (actualWeight, expectedResult) => {
      expectPermittableResult(
        { axleUnit: 2, axleCount: 1, actualWeight },
        11000,
        expectedResult,
      );
    });
  });

  // Source: ASW Permit Weight Maximums.feature @orv2-5709-4.
  describe('tandem axle boundary', () => {
    it.each([
      [23000, PolicyCheckResultType.Pass],
      [23001, PolicyCheckResultType.Fail],
    ])('evaluates %i kg', (actualWeight, expectedResult) => {
      expectPermittableResult(
        { axleUnit: 2, axleCount: 2, actualWeight },
        23000,
        expectedResult,
      );
    });
  });

  // Source: ASW Permit Weight Maximums.feature @orv2-5709-5.
  describe('default tridem axle boundary', () => {
    it.each([
      [28000, PolicyCheckResultType.Pass],
      [28001, PolicyCheckResultType.Fail],
    ])('evaluates %i kg', (actualWeight, expectedResult) => {
      expectPermittableResult(
        {
          axleUnit: 3,
          axleCount: 3,
          spread: 230,
          actualWeight,
        },
        28000,
        expectedResult,
      );
    });
  });

  // Source: ASW Permit Weight Maximums.feature @orv2-5709-6.
  describe('tridem spread and immediately following booster', () => {
    it.each([
      [240, undefined, 29000, 29000, PolicyCheckResultType.Pass],
      [370, 1, 29000, 29000, PolicyCheckResultType.Pass],
      [370, 1, 29001, 29000, PolicyCheckResultType.Fail],
      [230, undefined, 29000, 28000, PolicyCheckResultType.Fail],
      [380, undefined, 29000, 28000, PolicyCheckResultType.Fail],
      [280, 2, 28000, 28000, PolicyCheckResultType.Pass],
      [280, 2, 29000, 28000, PolicyCheckResultType.Fail],
      [280, 3, 29000, 28000, PolicyCheckResultType.Fail],
    ])(
      'evaluates spread %i cm, booster axles %s, and %i kg',
      (
        spread,
        boosterAxleCount,
        actualWeight,
        thresholdWeight,
        expectedResult,
      ) => {
        expectPermittableResult(
          {
            axleUnit: 3,
            axleCount: 3,
            spread: spread as number,
            boosterAxleCount: boosterAxleCount as number | undefined,
            actualWeight: actualWeight as number,
          },
          thresholdWeight as number,
          expectedResult as PolicyCheckResultType,
        );
      },
    );
  });

  // Source: ASW Permit Weight Maximums.feature @orv2-5709-7.
  describe('lower applicable checks remain independently binding', () => {
    it('keeps a 21,000 kg Bridge Formula maximum below a 23,000 kg policy maximum', () => {
      const axleConfiguration: Array<AxleConfiguration> = [
        {
          numberOfAxles: 1,
          axleUnitWeight: 9000,
          numberOfTires: 2,
          tireSize: 455,
        },
        {
          numberOfAxles: 1,
          interaxleSpacing: 100,
          axleUnitWeight: 12001,
          numberOfTires: 4,
          tireSize: 455,
        },
      ];
      const results = policy.runAxleCalculation(
        ['TRKTRAC'],
        axleConfiguration,
        100000,
      ).results;

      expect(policy.calculateBridge(axleConfiguration)[0].maxBridge).toBe(
        21000,
      );
      expect(
        getPermittableResult({
          axleUnit: 2,
          axleCount: 2,
          actualWeight: 23000,
        }),
      ).toMatchObject({
        thresholdWeight: 23000,
        result: PolicyCheckResultType.Pass,
      });
      expect(results).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: PolicyCheckId.BridgeFormula,
            result: PolicyCheckResultType.Fail,
          }),
        ]),
      );
    });

    it('keeps a 20,500 kg tire-load maximum below a 23,000 kg policy maximum', () => {
      const axleConfiguration: Array<AxleConfiguration> = [
        {
          numberOfAxles: 1,
          axleUnitWeight: 6000,
          numberOfTires: 2,
          tireSize: 455,
        },
        {
          numberOfAxles: 2,
          axleSpread: 160,
          interaxleSpacing: 500,
          axleUnitWeight: 20501,
          numberOfTires: 8,
          tireSize: 256.25,
        },
      ];
      const results = policy.runAxleCalculation(
        ['TRKTRAC'],
        axleConfiguration,
        100000,
      ).results;

      expect(results).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: PolicyCheckId.CheckPermittableWeight,
            startAxleUnit: 2,
            thresholdWeight: 23000,
            result: PolicyCheckResultType.Pass,
          }),
          expect.objectContaining({
            id: PolicyCheckId.MaxTireLoad,
            startAxleUnit: 2,
            result: PolicyCheckResultType.Fail,
          }),
        ]),
      );
      expect(8 * 256.25 * 10).toBe(20500);
    });

    it('keeps a 22,000 kg axle-group maximum below a 23,000 kg policy maximum', () => {
      const axleConfiguration: Array<AxleConfiguration> = [
        {
          numberOfAxles: 1,
          axleUnitWeight: 6000,
          numberOfTires: 2,
          tireSize: 455,
          vehicleIndex: 0,
        },
        {
          numberOfAxles: 2,
          axleSpread: 160,
          interaxleSpacing: 500,
          axleUnitWeight: 12000,
          numberOfTires: 8,
          tireSize: 455,
          vehicleIndex: 0,
        },
        {
          numberOfAxles: 1,
          interaxleSpacing: 180,
          axleUnitWeight: 10001,
          numberOfTires: 4,
          tireSize: 455,
          vehicleIndex: 1,
        },
      ];
      const results = policy.runAxleCalculation(
        ['TRKTRAC', 'SEMITRL'],
        axleConfiguration,
        100000,
      ).results;

      expect(results).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: PolicyCheckId.CheckPermittableWeight,
            startAxleUnit: 2,
            thresholdWeight: 23000,
            result: PolicyCheckResultType.Pass,
          }),
          expect.objectContaining({
            id: PolicyCheckId.AxleGroupMaximumLegalWeightThreshold,
            startAxleUnit: 2,
            endAxleUnit: 3,
            thresholdWeight: 22000,
            result: PolicyCheckResultType.Fail,
          }),
        ]),
      );
    });
  });

  it('lets feature values override conflicting configured permittable values', () => {
    const conflictingConfig = JSON.parse(
      JSON.stringify(currentPolicyConfig),
    ) as PolicyDefinition;
    const singleSteerTandemDrive =
      conflictingConfig.globalWeightDefaults!.powerUnits.find(
        ({ axles }) => axles === 12,
      )!;
    singleSteerTandemDrive.saPermittable = 1;
    singleSteerTandemDrive.daPermittable = 2;
    const conflictingPolicy = new Policy(conflictingConfig);
    const results = conflictingPolicy
      .runAxleCalculation(
        ['TRKTRAC'],
        [
          {
            numberOfAxles: 1,
            axleUnitWeight: 9100,
            numberOfTires: 2,
            tireSize: 455,
          },
          {
            numberOfAxles: 2,
            axleSpread: 160,
            interaxleSpacing: 500,
            axleUnitWeight: 23000,
            numberOfTires: 8,
            tireSize: 455,
          },
        ],
        100000,
      )
      .results.filter(({ id }) => id === PolicyCheckId.CheckPermittableWeight);

    expect(results.map(({ thresholdWeight }) => thresholdWeight)).toEqual([
      9100, 23000,
    ]);
  });

  it('preserves configured tandem-steering limits', () => {
    const configuredPolicyDefinition = JSON.parse(
      JSON.stringify(currentPolicyConfig),
    ) as PolicyDefinition;
    const tandemSteerTandemDrive =
      configuredPolicyDefinition.globalWeightDefaults!.powerUnits.find(
        ({ axles }) => axles === 22,
      )!;
    tandemSteerTandemDrive.saPermittable = 16555;
    const configuredPolicy = new Policy(configuredPolicyDefinition);
    const result = configuredPolicy
      .runAxleCalculation(
        ['TRKTRAC'],
        [
          {
            numberOfAxles: 2,
            axleSpread: 160,
            axleUnitWeight: 16555,
            numberOfTires: 4,
            tireSize: 455,
          },
          {
            numberOfAxles: 2,
            axleSpread: 160,
            interaxleSpacing: 500,
            axleUnitWeight: 17000,
            numberOfTires: 8,
            tireSize: 455,
          },
        ],
        100000,
      )
      .results.find(
        ({ id, startAxleUnit }) =>
          id === PolicyCheckId.CheckPermittableWeight && startAxleUnit === 1,
      );

    expect(result).toMatchObject({
      thresholdWeight: 16555,
      result: PolicyCheckResultType.Pass,
    });
  });
});
