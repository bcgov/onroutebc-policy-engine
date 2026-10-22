import { Policy } from '../../policy-engine';
import { POWER_UNIT_CODES } from '../../constants/power-unit-codes';
import { TRAILER_CODES } from '../../constants/trailer-codes';
import { COMMODITY_CODES } from '../../constants/commodity-codes';
import { PolicyCheckId, PolicyCheckResultType } from '../../enum';
import { AxleConfiguration } from '../../types';
import config from '../policy-config/_current-config.json';

const policy = new Policy(config);
const axles = (
  driveCount: number,
  trailerCount: number,
  spacing: number | undefined,
  weight: number,
): AxleConfiguration[] => [
  { numberOfAxles: 1, vehicleIndex: 0, axleUnitWeight: 0 },
  { numberOfAxles: driveCount, vehicleIndex: 0, axleUnitWeight: 0 },
  {
    numberOfAxles: trailerCount,
    vehicleIndex: 1,
    axleUnitWeight: weight,
    axleSpread: 240,
    interaxleSpacing: spacing,
  },
];

// BSA confirmed D1/D2/E3: Pony/Fixed Equipment Pony after a Power Unit.
// XLS rows 107–133, 137–145; N supplies the minimum spacing in metres.
describe.each([
  [TRAILER_CODES.PONY_TRAILERS, POWER_UNIT_CODES.TRUCKS],
  [
    TRAILER_CODES.FIXED_EQUIPMENT_PONY_TRAILERS,
    POWER_UNIT_CODES.FIXED_EQUIPMENT_TRUCKS_GRADERS,
  ],
  // H=Power Unit also includes the engine's multisteer category.
  [
    TRAILER_CODES.PONY_TRAILERS,
    POWER_UNIT_CODES.OIL_AND_GAS_SERVICE_RIGS_HEAVY_FRONT_CRANE,
  ],
  [
    TRAILER_CODES.FIXED_EQUIPMENT_PONY_TRAILERS,
    POWER_UNIT_CODES.OIL_AND_GAS_SERVICE_RIGS_HEAVY_FRONT_CRANE,
  ],
])('configured neighbour weights for %s after %s', (trailer, powerUnit) => {
  it.each<[number, number, number | undefined, number, number]>([
    // Trailer axles, drive axles, spacing (cm), legal, permittable.
    [1, 1, 300, 9100, 11000],
    [1, 2, 300, 9100, 9100],
    [1, 3, 300, 9100, 9100],
    [1, 2, 299, 9100, 11000],
    [1, 2, undefined, 9100, 11000],
    [3, 1, 300, 17000, 17000],
    [3, 1, 299, 21000, 21000],
    [3, 1, undefined, 21000, 21000],
    [3, 2, 550, 17000, 21000],
    [3, 2, 549, 21000, 21000],
    [3, 3, 600, 21000, 21000],
    [2, 2, 500, 17000, 21000],
  ])(
    '%i trailer axles after %i drive axles at %s cm: %i/%i kg',
    (trailerCount, driveCount, spacing, legal, permittable) => {
      for (const weight of new Set([
        legal,
        legal + 1,
        permittable,
        permittable + 1,
      ])) {
        const { results } = policy.runAxleCalculation(
          [powerUnit, trailer],
          axles(driveCount, trailerCount, spacing, weight),
          100000,
          COMMODITY_CODES.NONE,
        );
        expect(results).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              id: PolicyCheckId.LegalWeight,
              startAxleUnit: 3,
              thresholdWeight: legal,
              result:
                weight <= legal
                  ? PolicyCheckResultType.Pass
                  : PolicyCheckResultType.Warning,
            }),
            expect.objectContaining({
              id: PolicyCheckId.PermittableWeight,
              startAxleUnit: 3,
              thresholdWeight: permittable,
              result:
                weight <= permittable
                  ? PolicyCheckResultType.Pass
                  : PolicyCheckResultType.Fail,
            }),
          ]),
        );
      }
    },
  );
});

// BSA confirmed E4: XLS K269/274/275/280/281 are exceptions to 5709-6.
it.each([
  [
    TRAILER_CODES.SEMI_TRAILERS_WHEELERS,
    COMMODITY_CODES.EMPTY,
    POWER_UNIT_CODES.PICKER_TRUCK_TRACTORS,
    40000,
  ],
  [
    TRAILER_CODES.SEMI_TRAILERS_WHEELERS,
    'MFHOMEL',
    POWER_UNIT_CODES.TRUCK_TRACTORS,
    28000,
  ],
  [
    TRAILER_CODES.SEMI_TRAILERS_WIDE_WHEELERS,
    COMMODITY_CODES.EMPTY,
    POWER_UNIT_CODES.PICKER_TRUCK_TRACTORS,
    52000,
  ],
  [
    TRAILER_CODES.SEMI_TRAILERS_WIDE_WHEELERS,
    COMMODITY_CODES.NON_REDUCIBLE_LOADS,
    POWER_UNIT_CODES.TRUCK_WITH_PME,
    52000,
  ],
  // Other subtypes retain their prior limits.
  [
    TRAILER_CODES.PLATFORM_TRAILERS_WHEELERS,
    COMMODITY_CODES.EMPTY,
    POWER_UNIT_CODES.TRUCK_TRACTORS,
    29000,
  ],
  [
    TRAILER_CODES.MANUFACTURED_HOMES_OVER_5M,
    COMMODITY_CODES.NONE,
    POWER_UNIT_CODES.TRUCK_TRACTORS,
    21000,
  ],
] as const)(
  'uses %s / %s / %s permit limit %i',
  (trailer, commodity, powerUnit, limit) => {
    for (const weight of [limit, limit + 1]) {
      const { results } = policy.runAxleCalculation(
        [powerUnit, trailer],
        axles(2, 3, 550, weight),
        100000,
        commodity,
      );
      expect(results).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: PolicyCheckId.PermittableWeight,
            startAxleUnit: 3,
            thresholdWeight: limit,
            result:
              weight === limit
                ? PolicyCheckResultType.Pass
                : PolicyCheckResultType.Fail,
          }),
        ]),
      );
    }
  },
);
