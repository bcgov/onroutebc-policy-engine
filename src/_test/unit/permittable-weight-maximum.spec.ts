import { COMMODITY_CODES } from '../../constants/commodity-codes';
import { Policy } from '../../policy-engine';
import { PolicyCheckId, PolicyCheckResultType } from '../../enum/policy-check';
import { AxleConfiguration, PolicyDefinition } from '../../types';
import currentPolicyConfig from '../policy-config/_current-config.json';
import { CheckPermittableWeight } from '../../helper/policy-check.helper';
import { POWER_UNITS } from '../../constants/power-units';
import { TRAILERS } from '../../constants/trailers';

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
    commodityId?: string;
  };

  const getPermittableResult = (
    {
      axleUnit,
      axleCount,
      actualWeight,
      spread,
      boosterAxleCount,
      powerUnitType = POWER_UNITS.TRUCK_TRACTORS.id,
      trailerType = TRAILERS.SEMI_TRAILERS.id,
      commodityId = COMMODITY_CODES.NONE,
    }: Scenario,
    // Allow isolated tests to prove that modified JSON controls the limit.
    configuredPolicy = policy,
  ) => {
    const hasTrailer = axleUnit === 3;
    const hasBooster = boosterAxleCount !== undefined;
    const vehicleConfiguration = [
      powerUnitType,
      ...(hasTrailer ? [trailerType] : []),
      ...(hasBooster ? [TRAILERS.BOOSTER.id] : []),
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
      .runAxleCalculation(
        vehicleConfiguration,
        axleConfiguration,
        100000,
        commodityId,
      )
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

  // Over Weight Dimension Set, Oil Field Equipment: Service Rigs single-steer permits 12,000 kg;
  // Bed Trucks Tandem/Tridem steer permits 17,000 kg. Other steer and all drive limits are controls.
  it.each([
    [POWER_UNITS.OIL_AND_GAS_SERVICE_RIGS.id, 1, 1, 12000, 11000],
    [POWER_UNITS.OIL_AND_GAS_SERVICE_RIGS.id, 1, 2, 12000, 23000],
    [POWER_UNITS.OIL_AND_GAS_SERVICE_RIGS.id, 1, 3, 12000, 28000],
    [POWER_UNITS.OIL_AND_GAS_SERVICE_RIGS.id, 2, 2, 17000, 23000],
    [POWER_UNITS.OIL_AND_GAS_SERVICE_RIGS.id, 2, 3, 15200, 28000],
    [POWER_UNITS.OIL_AND_GAS_BED_TRUCKS.id, 1, 1, 9100, 11000],
    [POWER_UNITS.OIL_AND_GAS_BED_TRUCKS.id, 1, 2, 9100, 23000],
    [POWER_UNITS.OIL_AND_GAS_BED_TRUCKS.id, 1, 3, 9100, 28000],
    [POWER_UNITS.OIL_AND_GAS_BED_TRUCKS.id, 2, 2, 17000, 23000],
    [POWER_UNITS.OIL_AND_GAS_BED_TRUCKS.id, 2, 3, 17000, 28000],
    // Heavy-front-crane Service Rigs (>14,000 kg tare): tandem steer 20,000; tridem steer remains 24,000 kg.
    [
      POWER_UNITS.OIL_AND_GAS_SERVICE_RIGS_HEAVY_FRONT_CRANE.id,
      2,
      2,
      20000,
      23000,
    ],
    [
      POWER_UNITS.OIL_AND_GAS_SERVICE_RIGS_HEAVY_FRONT_CRANE.id,
      2,
      3,
      20000,
      28000,
    ],
    [
      POWER_UNITS.OIL_AND_GAS_SERVICE_RIGS_HEAVY_FRONT_CRANE.id,
      3,
      3,
      24000,
      28000,
    ],
  ] as const)(
    'preserves %s %i/%i permit boundaries (steer %i, drive %i kg)',
    (powerUnitType, steerAxles, driveAxles, steerLimit, driveLimit) => {
      for (const excess of [0, 1]) {
        const results = policy.runAxleCalculation(
          [powerUnitType],
          [
            {
              numberOfAxles: steerAxles,
              axleUnitWeight: steerLimit + excess,
              axleSpread: steerAxles > 1 ? 160 : undefined,
              numberOfTires: steerAxles * 2,
              tireSize: 455,
              vehicleIndex: 0,
            },
            {
              numberOfAxles: driveAxles,
              axleUnitWeight: driveLimit + excess,
              axleSpread: driveAxles > 1 ? 240 : undefined,
              interaxleSpacing: 500,
              numberOfTires: driveAxles * 4,
              tireSize: 455,
              vehicleIndex: 0,
            },
          ],
          100000,
          COMMODITY_CODES.NONE,
        ).results;
        for (const [index, thresholdWeight] of [
          steerLimit,
          driveLimit,
        ].entries()) {
          expect(
            results.find(
              ({ id, startAxleUnit }) =>
                id === PolicyCheckId.PermittableWeight &&
                startAxleUnit === index + 1,
            ),
          ).toMatchObject({
            thresholdWeight,
            actualWeight: thresholdWeight + excess,
            result:
              excess === 0
                ? PolicyCheckResultType.Pass
                : PolicyCheckResultType.Fail,
          });
        }
      }
    },
  );

  // Over Weight Dimension Set, Oil Field Equipment: Service Rigs single-steer permits 12,000 kg;
  // Bed Trucks Tandem/Tridem steer permits 17,000 kg. Other steer and all drive limits are controls.
  it.each([
    [POWER_UNITS.OIL_AND_GAS_SERVICE_RIGS.id, 1, 1, 12000, 11000],
    [POWER_UNITS.OIL_AND_GAS_SERVICE_RIGS.id, 1, 2, 12000, 23000],
    [POWER_UNITS.OIL_AND_GAS_SERVICE_RIGS.id, 1, 3, 12000, 28000],
    [POWER_UNITS.OIL_AND_GAS_SERVICE_RIGS.id, 2, 2, 17000, 23000],
    [POWER_UNITS.OIL_AND_GAS_SERVICE_RIGS.id, 2, 3, 15200, 28000],
    [POWER_UNITS.OIL_AND_GAS_BED_TRUCKS.id, 1, 1, 9100, 11000],
    [POWER_UNITS.OIL_AND_GAS_BED_TRUCKS.id, 1, 2, 9100, 23000],
    [POWER_UNITS.OIL_AND_GAS_BED_TRUCKS.id, 1, 3, 9100, 28000],
    [POWER_UNITS.OIL_AND_GAS_BED_TRUCKS.id, 2, 2, 17000, 23000],
    [POWER_UNITS.OIL_AND_GAS_BED_TRUCKS.id, 2, 3, 17000, 28000],
    // Heavy-front-crane Service Rigs (>14,000 kg tare): tandem steer 20,000; tridem steer remains 24,000 kg.
    [
      POWER_UNITS.OIL_AND_GAS_SERVICE_RIGS_HEAVY_FRONT_CRANE.id,
      2,
      2,
      20000,
      23000,
    ],
    [
      POWER_UNITS.OIL_AND_GAS_SERVICE_RIGS_HEAVY_FRONT_CRANE.id,
      2,
      3,
      20000,
      28000,
    ],
    [
      POWER_UNITS.OIL_AND_GAS_SERVICE_RIGS_HEAVY_FRONT_CRANE.id,
      3,
      3,
      24000,
      28000,
    ],
  ] as const)(
    'preserves %s %i/%i permit boundaries (steer %i, drive %i kg)',
    (powerUnitType, steerAxles, driveAxles, steerLimit, driveLimit) => {
      for (const excess of [0, 1]) {
        const results = policy.runAxleCalculation(
          [powerUnitType],
          [
            {
              numberOfAxles: steerAxles,
              axleUnitWeight: steerLimit + excess,
              axleSpread: steerAxles > 1 ? 160 : undefined,
              numberOfTires: steerAxles * 2,
              tireSize: 455,
              vehicleIndex: 0,
            },
            {
              numberOfAxles: driveAxles,
              axleUnitWeight: driveLimit + excess,
              axleSpread: driveAxles > 1 ? 240 : undefined,
              interaxleSpacing: 500,
              numberOfTires: driveAxles * 4,
              tireSize: 455,
              vehicleIndex: 0,
            },
          ],
          100000,
          COMMODITY_CODES.NONE,
        ).results;
        for (const [index, thresholdWeight] of [
          steerLimit,
          driveLimit,
        ].entries()) {
          expect(
            results.find(
              ({ id, startAxleUnit }) =>
                id === PolicyCheckId.PermittableWeight &&
                startAxleUnit === index + 1,
            ),
          ).toMatchObject({
            thresholdWeight,
            actualWeight: thresholdWeight + excess,
            result:
              excess === 0
                ? PolicyCheckResultType.Pass
                : PolicyCheckResultType.Fail,
          });
        }
      }
    },
  );

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
        POWER_UNITS.LCV_ROCKY_MOUNTAIN_DOUBLES.id,
        17000,
        PolicyCheckResultType.Pass,
      ],
      [
        POWER_UNITS.LCV_ROCKY_MOUNTAIN_DOUBLES.id,
        17001,
        PolicyCheckResultType.Fail,
      ],
      [POWER_UNITS.LCV_TURNPIKE_DOUBLES.id, 17000, PolicyCheckResultType.Pass],
      [POWER_UNITS.LCV_TURNPIKE_DOUBLES.id, 17001, PolicyCheckResultType.Fail],
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

    // Platform Wheeler, accessory and additional power-unit tandems remain separately scoped.
    it.each([
      TRAILERS.PLATFORM_TRAILERS_WHEELERS.id,
      TRAILERS.JEEPS.id,
      TRAILERS.BOOSTER.id,
    ])('preserves the existing tandem limit for %s', (trailerType) => {
      for (const actualWeight of [23000, 23001]) {
        expectPermittableResult(
          {
            axleUnit: 3,
            axleCount: 2,
            actualWeight,
            spread: 160,
            trailerType,
          },
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
          [POWER_UNITS.LCV_ROCKY_MOUNTAIN_DOUBLES.id],
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
      POWER_UNITS.PICKER_TRUCK_TRACTORS.id,
      POWER_UNITS.TRUCK_TRACTOR_WITH_PME.id,
      POWER_UNITS.TRUCK_WITH_PME.id,
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
                COMMODITY_CODES.NONE,
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
    describe.each([
      POWER_UNITS.PICKER_TRUCK_TRACTORS.id,
      POWER_UNITS.TRUCK_TRACTOR_WITH_PME.id,
      POWER_UNITS.TRUCK_WITH_PME.id,
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
                COMMODITY_CODES.NONE,
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
            TRAILERS.SEMI_TRAILERS_SINGLE_DOUBLE_DROP_STEP_DECK_LOWBED.id,
        },
        29000,
        PolicyCheckResultType.Pass,
      );
    });

    // Nicole's S2/S4 bands. Non-Reducible Oilfield trailers retain 29,000 from 2.4 m.
    it.each<[string, string, number]>([
      [
        TRAILERS.READY_MIX_CONCRETE_PUMP_SEMI_TRAILERS.id,
        COMMODITY_CODES.NONE,
        28000,
      ],
      [TRAILERS.FIXED_EQUIPMENT_SEMI_TRAILERS.id, COMMODITY_CODES.NONE, 28000],
      [TRAILERS.FIXED_EQUIPMENT_CONVEYORS.id, COMMODITY_CODES.NONE, 28000],
      [
        TRAILERS.FIXED_EQUIPMENT_COUNTER_FLOW_ASPHALT_DRUM_MIXERS.id,
        COMMODITY_CODES.NONE,
        28000,
      ],
      [
        TRAILERS.FIXED_EQUIPMENT_PORTABLE_ASPHALT_BAGHOUSES.id,
        COMMODITY_CODES.NONE,
        28000,
      ],
      [
        TRAILERS.OIL_AND_GAS_OVERSIZE_OILFIELD_FLAT_DECK.id,
        COMMODITY_CODES.OIL_FIELD_EQUIPMENT,
        28000,
      ],
      [
        TRAILERS.OIL_AND_GAS_OVERSIZE_OILFIELD_FLAT_DECK.id,
        COMMODITY_CODES.NON_REDUCIBLE_LOADS,
        29000,
      ],
    ])(
      'applies the confirmed spread bands for %s / %s',
      (trailerType, commodityId, lowerLimit) => {
        for (const [spread, limit] of [
          [239, 28000],
          [240, lowerLimit],
          [300, lowerLimit],
          [300.5, 29000],
          [301, 29000],
          [370, 29000],
          [371, 28000],
        ]) {
          for (const actualWeight of [limit, limit + 1]) {
            expectPermittableResult(
              {
                axleUnit: 3,
                axleCount: 3,
                trailerType,
                commodityId,
                spread,
                actualWeight,
              },
              limit,
              actualWeight === limit
                ? PolicyCheckResultType.Pass
                : PolicyCheckResultType.Fail,
            );
          }
        }
        // Single Boosters use the same bands; Tandem/Tridem Boosters remain restricted.
        for (const [boosterAxleCount, spread, limit] of [
          [1, 240, lowerLimit],
          [1, 300, lowerLimit],
          [1, 300.5, 29000],
          [1, 301, 29000],
          [1, 370, 29000],
          [2, 301, 28000],
          [3, 301, 28000],
        ]) {
          expectPermittableResult(
            {
              axleUnit: 3,
              axleCount: 3,
              trailerType,
              commodityId,
              spread,
              boosterAxleCount,
              actualWeight: limit + 1,
            },
            limit,
            PolicyCheckResultType.Fail,
          );
        }
      },
    );

    it.each([
      [TRAILERS.READY_MIX_CONCRETE_PUMP_SEMI_TRAILERS.id, COMMODITY_CODES.NONE],
      [
        TRAILERS.OIL_AND_GAS_OVERSIZE_OILFIELD_FLAT_DECK.id,
        COMMODITY_CODES.OIL_FIELD_EQUIPMENT,
      ],
    ])(
      'reads both spread-band weights from JSON for %s / %s',
      (trailerType, commodityId) => {
        const changed: PolicyDefinition = JSON.parse(
          JSON.stringify(currentPolicyConfig),
        );
        const trailer = changed.commodities
          .find(({ id }) => id === commodityId)!
          .powerUnits.find(
            ({ type }) => type === POWER_UNITS.TRUCK_TRACTORS.id,
          )!
          .trailers.find(({ type }) => type === trailerType)!;
        trailer.weightDimensions!.find(
          (weight) => weight.axles === 3 && !weight.permittableAxleSpread,
        )!.permittable = 27500;
        trailer.weightDimensions!.find(
          (weight) => weight.axles === 3 && weight.permittableAxleSpread,
        )!.permittable = 28500;
        const configuredPolicy = new Policy(changed);

        for (const [spread, boosterAxleCount, limit] of [
          [undefined, undefined, 27500],
          [300, undefined, 27500],
          [300.5, undefined, 28500],
          [300.5, 1, 28500],
          [300.5, 2, 27500],
          [371, undefined, 27500],
        ] as const) {
          expect(
            getPermittableResult(
              {
                axleUnit: 3,
                axleCount: 3,
                trailerType,
                commodityId,
                spread,
                boosterAxleCount,
                actualWeight: limit + 1,
              },
              configuredPolicy,
            ),
          ).toMatchObject({
            thresholdWeight: limit,
            result: PolicyCheckResultType.Fail,
          });
        }
      },
    );

    // XLS: Jeep/Booster limits and S3's confirmed 2.4–3.7 m Dolly spread.
    it.each([
      [TRAILERS.JEEPS.id, 240],
      [TRAILERS.JEEPS.id, 370],
      [TRAILERS.BOOSTER.id, 240],
      [TRAILERS.BOOSTER.id, 310],
      [TRAILERS.DOLLIES.id, 240],
      [TRAILERS.DOLLIES.id, 370],
    ] as const)(
      'keeps %s tridem at 28,000 kg with %i cm spread',
      (trailerType, spread) => {
        for (const actualWeight of [28000, 28001]) {
          expectPermittableResult(
            { axleUnit: 3, axleCount: 3, actualWeight, spread, trailerType },
            28000,
            actualWeight === 28000
              ? PolicyCheckResultType.Pass
              : PolicyCheckResultType.Fail,
          );
        }
      },
    );

    // Booster-specific JSON keeps its 28,000 kg limit when the global default changes.
    it.each<[string, number]>([
      [TRAILERS.JEEPS.id, 27500],
      [TRAILERS.BOOSTER.id, 28000],
      [TRAILERS.DOLLIES.id, 27500],
    ])(
      'reads the %s tridem limit from JSON',
      (trailerType, thresholdWeight) => {
        const changed: PolicyDefinition = JSON.parse(
          JSON.stringify(currentPolicyConfig),
        );
        changed.globalWeightDefaults.trailers.find(
          ({ axles }) => axles === 3,
        )!.permittable = 27500;

        expect(
          getPermittableResult(
            {
              axleUnit: 3,
              axleCount: 3,
              actualWeight: thresholdWeight + 1,
              spread: 240,
              trailerType,
            },
            new Policy(changed),
          ),
        ).toMatchObject({
          thresholdWeight,
          result: PolicyCheckResultType.Fail,
        });
      },
    );

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
        [POWER_UNITS.TRUCK_TRACTORS.id],
        axleConfiguration,
        100000,
        COMMODITY_CODES.NONE,
      ).results;

      const vehicleConfiguration = [
        POWER_UNITS.TRUCK_TRACTORS.id,
        TRAILERS.SEMI_TRAILERS.id,
      ];

      // TODO leaving this code commented for now since we will need to dicuss this with Michael when he returns from vacation
      // const axleUnitVehicleIndexes = getAxleUnitVehicleIndexLookup(
      //   policy,
      //   vehicleConfiguration,
      //   axleConfiguration,
      // );

      expect(
        policy.calculateBridge(
          axleConfiguration,
          vehicleConfiguration,
          // TODO leaving this code commented for now since we will need to dicuss this with Michael when he returns from vacation
          // axleUnitVehicleIndexes,
        )[0].maxBridge,
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
        [POWER_UNITS.TRUCK_TRACTORS.id],
        axleConfiguration,
        100000,
        COMMODITY_CODES.NONE,
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
        [POWER_UNITS.TRUCK_TRACTORS.id, TRAILERS.SEMI_TRAILERS.id],
        axleConfiguration,
        100000,
        COMMODITY_CODES.NONE,
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
          [POWER_UNITS.TRUCK_TRACTORS.id],
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
          COMMODITY_CODES.NONE,
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
        [POWER_UNITS.TRUCK_TRACTORS.id],
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
        COMMODITY_CODES.NONE,
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

/* Source: ASW Permittable Interaxle Spacing - Boosters.feature
 * Although this feature title appears to describe Interaxle Spacing outcomes, the actual outcomes are related to Permittable Weight maximums for booster axles, therefore these tests have been included here.
 */
describe('booster exceptions', () => {
  const configuredPolicyDefinition = JSON.parse(
    JSON.stringify(currentPolicyConfig),
  ) as PolicyDefinition;
  const configuredPolicy = new Policy(configuredPolicyDefinition);
  const vehicleConfiguration = ['TRKTRAC', 'SEMITRL', 'BOOSTER'];
  const axleConfiguration: Array<AxleConfiguration> = [
    {
      numberOfAxles: 1,
      axleUnitWeight: 6000,
      numberOfTires: 2,
      tireSize: 711.2,
      vehicleIndex: 0,
    },
    {
      numberOfAxles: 1,
      interaxleSpacing: 300,
      axleUnitWeight: 7000,
      numberOfTires: 2,
      tireSize: 711.2,
      vehicleIndex: 0,
    },
    {
      numberOfAxles: 3,
      axleSpread: 240,
      interaxleSpacing: 300,
      axleUnitWeight: 16000,
      numberOfTires: 6,
      tireSize: 711.2,
      vehicleIndex: 1,
    },
    {
      numberOfAxles: 1,
      interaxleSpacing: 419,
      axleUnitWeight: 9101,
      numberOfTires: 4,
      tireSize: 711.2,
      vehicleIndex: 2,
    },
  ];

  // Source: ASW Permittable Interaxle Spacing - Boosters.feature @orv2-6030-2
  it('raises interaxle spacing restriction for single axle booster with interaxle spacing between 3.0 m and 4.19 m behind semi trailer', () => {
    axleConfiguration[3].numberOfAxles = 1;
    axleConfiguration[3].interaxleSpacing = 419;
    axleConfiguration[3].axleUnitWeight = 9101;

    const results = configuredPolicy.runAxleCalculation(
      vehicleConfiguration,
      axleConfiguration,
      100000,
      COMMODITY_CODES.FIXED_EQUIPMENT,
    ).results;

    const failedResult = results.find(
      (result) =>
        result.id === PolicyCheckId.PermittableWeight &&
        result.result === PolicyCheckResultType.Fail,
    );

    expect(failedResult?.message).toBe(
      'Interaxle Spacing for Axle Unit 4 restricts Axle Weight to 9100 kg',
    );
  });

  // Source: ASW Permittable Interaxle Spacing - Boosters.feature @orv2-6030-3
  // bridge formula will not be applied in this case, see 'Single Axle Booster Exception' test in bridge-calc.spec.ts
  it('raises interaxle spacing restriction for single axle booster with interaxle spacing below 3.0 m or below behind semi trailer', () => {
    axleConfiguration[3].numberOfAxles = 1;
    axleConfiguration[3].interaxleSpacing = 299;
    axleConfiguration[3].axleUnitWeight = 9101;

    const results = configuredPolicy.runAxleCalculation(
      vehicleConfiguration,
      axleConfiguration,
      100000,
      COMMODITY_CODES.FIXED_EQUIPMENT,
    ).results;

    const failedResult = results.find(
      (result) =>
        result.id === PolicyCheckId.PermittableWeight &&
        result.result === PolicyCheckResultType.Fail,
    );

    expect(failedResult?.message).toBe(
      'Interaxle Spacing for Axle Unit 4 restricts Axle Weight to 9100 kg',
    );
  });
});
