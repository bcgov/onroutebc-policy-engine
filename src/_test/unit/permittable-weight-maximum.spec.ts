import { Policy } from '../../policy-engine';
import { PolicyCheckId, PolicyCheckResultType } from '../../enum/policy-check';
import { AxleConfiguration, PolicyDefinition } from '../../types';
import currentPolicyConfig from '../policy-config/_current-config.json';
import { POWER_UNIT_CODES } from '../../constants/power-unit-codes';
import { TRAILER_CODES } from '../../constants/trailer-codes';
import { CheckPermittableWeight } from '../../helper/policy-check.helper';

describe('ORV2-5709 permittable weight maximums', () => {
  const policy = new Policy(currentPolicyConfig);

  type Scenario = {
    axleUnit: 1 | 2 | 3;
    axleCount: number;
    actualWeight: number;
    spread?: number;
    boosterAxleCount?: number;
    powerUnitType?: string;
    trailerType?: string;
  };

  const getPermittableResult = (
    {
      axleUnit,
      axleCount,
      actualWeight,
      spread,
      boosterAxleCount,
      powerUnitType = POWER_UNIT_CODES.TRUCK_TRACTORS,
      trailerType = TRAILER_CODES.SEMI_TRAILERS,
    }: Scenario,
    // Allow isolated tests to prove that modified JSON controls the limit.
    configuredPolicy = policy,
  ) => {
    const hasTrailer = axleUnit === 3;
    const hasBooster = boosterAxleCount !== undefined;
    const vehicleConfiguration = [
      powerUnitType,
      ...(hasTrailer ? [trailerType] : []),
      ...(hasBooster ? [TRAILER_CODES.BOOSTER] : []),
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

    return configuredPolicy
      .runAxleCalculation(vehicleConfiguration, axleConfiguration, 100000)
      .results.find(
        (result) =>
          result.id === PolicyCheckId.PermittableWeight &&
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

  describe('configured power-unit tandem-drive limits', () => {
    // Over Weight Dimension Set: Rocky Mountain/Turnpike LCVs, commodity None, Single/Tandem drive = 17,000 kg.
    it.each([
      [
        POWER_UNIT_CODES.LCV_ROCKY_MOUNTAIN_DOUBLES,
        17000,
        PolicyCheckResultType.Pass,
      ],
      [
        POWER_UNIT_CODES.LCV_ROCKY_MOUNTAIN_DOUBLES,
        17001,
        PolicyCheckResultType.Fail,
      ],
      [
        POWER_UNIT_CODES.LCV_TURNPIKE_DOUBLES,
        17000,
        PolicyCheckResultType.Pass,
      ],
      [
        POWER_UNIT_CODES.LCV_TURNPIKE_DOUBLES,
        17001,
        PolicyCheckResultType.Fail,
      ],
    ])(
      'evaluates %s drive at %i kg',
      (powerUnitType, actualWeight, expectedResult) => {
        expectPermittableResult(
          {
            axleUnit: 2,
            axleCount: 2,
            powerUnitType: powerUnitType as string,
            actualWeight: actualWeight as number,
          },
          17000,
          expectedResult as PolicyCheckResultType,
        );
      },
    );

    it.each([
      [17000, 17000, PolicyCheckResultType.Pass],
      [17000, 17001, PolicyCheckResultType.Fail],
      [25000, 25000, PolicyCheckResultType.Pass],
      [25000, 25001, PolicyCheckResultType.Fail],
      [0, 0, PolicyCheckResultType.Pass],
      [0, 1, PolicyCheckResultType.Fail],
    ])(
      'uses configured tandem-drive limit %i at %i kg',
      (limit, actualWeight, expectedResult) => {
        const configuredPolicyDefinition = JSON.parse(
          JSON.stringify(currentPolicyConfig),
        ) as PolicyDefinition;
        configuredPolicyDefinition.globalWeightDefaults!.powerUnits.find(
          ({ axles }) => axles === 12,
        )!.daPermittable = limit as number;
        expect(
          getPermittableResult(
            { axleUnit: 2, axleCount: 2, actualWeight: actualWeight as number },
            new Policy(configuredPolicyDefinition),
          ),
        ).toMatchObject({
          thresholdWeight: limit,
          actualWeight,
          result: expectedResult,
        });
      },
    );

    // Trailer and additional power-unit tandem migrations are separately scoped in A7.
    it.each([
      TRAILER_CODES.PONY_TRAILERS,
      TRAILER_CODES.SEMI_TRAILERS_WHEELERS,
    ])('preserves the existing tandem limit for %s', (trailerType) => {
      for (const actualWeight of [23000, 23001]) {
        expectPermittableResult(
          { axleUnit: 3, axleCount: 2, actualWeight, spread: 160, trailerType },
          23000,
          actualWeight === 23000
            ? PolicyCheckResultType.Pass
            : PolicyCheckResultType.Fail,
        );
      }
    });

    it.each([23000, 23001])(
      'preserves an additional power-unit tandem at %i kg',
      (actualWeight) => {
        const results = CheckPermittableWeight(
          policy,
          [POWER_UNIT_CODES.LCV_ROCKY_MOUNTAIN_DOUBLES],
          [
            { numberOfAxles: 1, axleUnitWeight: 6000, vehicleIndex: 0 },
            { numberOfAxles: 2, axleUnitWeight: 17000, vehicleIndex: 0 },
            { numberOfAxles: 2, axleUnitWeight: actualWeight, vehicleIndex: 0 },
          ],
        );
        expect(results[2]).toMatchObject({
          axleUnit: 3,
          thresholdWeight: 23000,
          actualWeight,
          result:
            actualWeight === 23000
              ? PolicyCheckResultType.Pass
              : PolicyCheckResultType.Fail,
        });
      },
    );
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
    describe.each([
      POWER_UNIT_CODES.PICKER_TRUCK_TRACTORS,
      POWER_UNIT_CODES.TRUCK_TRACTOR_WITH_PME,
      POWER_UNIT_CODES.TRUCK_WITH_PME,
    ])(
      '%s drive does not receive the trailer spread allowance',
      (powerUnitType) => {
        // These below values come from the Overweight Dimension Set: Picker Truck Tractors, and truck/tractors with PME, commodity None
        // Single-steer/tridem-drive = 24,000 kg; tandem-steer/tridem-drive = 28,000 kg.
        // @orv2-5709-6 supplies the trailer-only allowance exclusion, not the 24,000 kg subtype limit (from Overweight Dimension Set xls)
        it.each([
          [1, 24000, 24000, PolicyCheckResultType.Pass],
          [1, 24001, 24000, PolicyCheckResultType.Fail],
          [2, 28000, 28000, PolicyCheckResultType.Pass],
          [2, 28001, 28000, PolicyCheckResultType.Fail],
        ])(
          'evaluates %i steer axles and tridem drive at %i kg (limit %i)',
          (steerAxles, actualWeight, thresholdWeight, expectedResult) => {
            const result = policy
              .runAxleCalculation(
                [powerUnitType],
                [
                  {
                    numberOfAxles: steerAxles as number,
                    axleUnitWeight: 9100,
                    axleSpread: steerAxles === 2 ? 160 : undefined,
                    numberOfTires: (steerAxles as number) * 2,
                    tireSize: 455,
                    vehicleIndex: 0,
                  },
                  {
                    numberOfAxles: 3,
                    axleUnitWeight: actualWeight as number,
                    axleSpread: 240,
                    interaxleSpacing: 500,
                    numberOfTires: 12,
                    tireSize: 455,
                    vehicleIndex: 0,
                  },
                ],
                100000,
              )
              .results.find(
                ({ id, startAxleUnit }) =>
                  id === PolicyCheckId.PermittableWeight && startAxleUnit === 2,
              );
            expect(result).toMatchObject({
              actualWeight,
              thresholdWeight,
              result: expectedResult,
            });
          },
        );
      },
    );

    it('allows 29,000 kg on a qualifying lowbed semi-trailer tridem', () => {
      expectPermittableResult(
        {
          axleUnit: 3,
          axleCount: 3,
          actualWeight: 29000,
          spread: 240,
          trailerType:
            TRAILER_CODES.SEMI_TRAILERS_SINGLE_DOUBLE_DROP_STEP_DECK_LOWBED,
        },
        29000,
        PolicyCheckResultType.Pass,
      );
    });

    it('allows 29,000 kg on a qualifying jeep tridem', () => {
      expectPermittableResult(
        {
          axleUnit: 3,
          axleCount: 3,
          actualWeight: 29000,
          spread: 240,
          trailerType: TRAILER_CODES.JEEPS,
        },
        29000,
        PolicyCheckResultType.Pass,
      );
    });

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
        [POWER_UNIT_CODES.TRUCK_TRACTORS],
        axleConfiguration,
        100000,
      ).results;

      const vehicleConfiguration = [
        POWER_UNIT_CODES.TRUCK_TRACTORS,
        TRAILER_CODES.SEMI_TRAILERS,
      ];

      expect(
        policy.calculateBridge(axleConfiguration, vehicleConfiguration)[0]
          .maxBridge,
      ).toBe(21000);
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
        [POWER_UNIT_CODES.TRUCK_TRACTORS],
        axleConfiguration,
        100000,
      ).results;

      expect(results).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: PolicyCheckId.PermittableWeight,
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
        [POWER_UNIT_CODES.TRUCK_TRACTORS, TRAILER_CODES.SEMI_TRAILERS],
        axleConfiguration,
        100000,
      ).results;

      expect(results).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: PolicyCheckId.PermittableWeight,
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

  it.each([
    [8750, 8750, PolicyCheckResultType.Pass],
    [8750, 8751, PolicyCheckResultType.Fail],
    [12000, 12000, PolicyCheckResultType.Pass],
    [12000, 12001, PolicyCheckResultType.Fail],
    [0, 0, PolicyCheckResultType.Pass],
    [0, 1, PolicyCheckResultType.Fail],
  ])(
    'uses configured single-steer limit %i at %i kg',
    (limit, actualWeight, expectedResult) => {
      const conflictingConfig = JSON.parse(
        JSON.stringify(currentPolicyConfig),
      ) as PolicyDefinition;
      const singleSteerTandemDrive =
        conflictingConfig.globalWeightDefaults!.powerUnits.find(
          ({ axles }) => axles === 12,
        )!;
      singleSteerTandemDrive.saPermittable = limit as number;
      const conflictingPolicy = new Policy(conflictingConfig);
      const results = conflictingPolicy
        .runAxleCalculation(
          [POWER_UNIT_CODES.TRUCK_TRACTORS],
          [
            {
              numberOfAxles: 1,
              axleUnitWeight: actualWeight as number,
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
        .results.find(
          ({ id, startAxleUnit }) =>
            id === PolicyCheckId.PermittableWeight && startAxleUnit === 1,
        );

      expect(results).toMatchObject({
        thresholdWeight: limit,
        actualWeight,
        result: expectedResult,
      });
    },
  );

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
        [POWER_UNIT_CODES.TRUCK_TRACTORS],
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
          id === PolicyCheckId.PermittableWeight && startAxleUnit === 1,
      );

    expect(result).toMatchObject({
      thresholdWeight: 16555,
      result: PolicyCheckResultType.Pass,
    });
  });
});
