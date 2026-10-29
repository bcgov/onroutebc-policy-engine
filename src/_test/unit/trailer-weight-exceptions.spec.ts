import { Policy } from '../../policy-engine';
import { COMMODITY_CODES } from '../../constants/commodity-codes';
import { PolicyCheckId, PolicyCheckResultType } from '../../enum';
import { AxleConfiguration } from '../../types';
import config from '../policy-config/_current-config.json';
import { POWER_UNITS } from '../../constants/power-units';
import { POWER_UNIT_CODES } from '../../constants/power-unit-codes';
import { TRAILERS } from '../../constants/trailers';

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
// ORORV2-6029: PO confirmed 21,000 kg for pony tridems, replacing the XLS limits.
describe.each([
  [TRAILERS.PONY_TRAILERS.id, POWER_UNITS.TRUCKS.id],
  [
    TRAILERS.FIXED_EQUIPMENT_PONY_TRAILERS.id,
    POWER_UNITS.FIXED_EQUIPMENT_TRUCKS_GRADERS.id,
  ],
  // H=Power Unit also includes the engine's multisteer category.
  [
    TRAILERS.PONY_TRAILERS.id,
    POWER_UNITS.OIL_AND_GAS_SERVICE_RIGS_HEAVY_FRONT_CRANE.id,
  ],
  [
    TRAILERS.FIXED_EQUIPMENT_PONY_TRAILERS.id,
    POWER_UNITS.OIL_AND_GAS_SERVICE_RIGS_HEAVY_FRONT_CRANE.id,
  ],
])('configured neighbour weights for %s after %s', (trailer, powerUnit) => {
  it.each<[number, number, number | undefined, number, number]>([
    // Trailer axles, drive axles, spacing (cm), legal, permittable.
    [1, 1, 300, 9100, 11000],
    [1, 2, 300, 9100, 9100],
    [1, 3, 300, 9100, 9100],
    [1, 2, 299, 9100, 11000],
    [1, 2, undefined, 9100, 11000],
    [3, 1, 300, 21000, 21000],
    [3, 1, 299, 21000, 21000],
    [3, 1, undefined, 21000, 21000],
    [3, 2, 550, 21000, 21000],
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

describe.each([
  TRAILERS.PONY_TRAILERS.id,
  TRAILERS.FIXED_EQUIPMENT_PONY_TRAILERS.id,
])('ORORV2-6029: Fixed Equipment with Trucks and %s', (trailer) => {
  it.each([
    [1, 300],
    [2, 550],
    [3, 600],
  ])('uses 21,000 kg after %i drive axles at %i cm', (driveCount, spacing) => {
    for (const weight of [21000, 21001, 28000]) {
      const { results } = policy.runAxleCalculation(
        [POWER_UNIT_CODES.TRUCKS, trailer],
        axles(driveCount, 3, spacing, weight),
        100000,
        COMMODITY_CODES.FIXED_EQUIPMENT,
      );
      expect(results).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: PolicyCheckId.LegalWeight,
            startAxleUnit: 3,
            thresholdWeight: 21000,
            result:
              weight <= 21000
                ? PolicyCheckResultType.Pass
                : PolicyCheckResultType.Warning,
            message:
              weight <= 21000
                ? 'Axle Unit Weight for Axle Unit 3 is legal'
                : 'Axle Unit Weight for Axle Unit 3 must not exceed 21000 kg.',
          }),
          expect.objectContaining({
            id: PolicyCheckId.PermittableWeight,
            startAxleUnit: 3,
            thresholdWeight: 21000,
            result:
              weight <= 21000
                ? PolicyCheckResultType.Pass
                : PolicyCheckResultType.Fail,
          }),
        ]),
      );
    }
  });
});

// BSA confirmed E4: XLS K269/274/275/280/281 are exceptions to 5709-6.
it.each([
  [
    TRAILERS.SEMI_TRAILERS_WHEELERS.id,
    COMMODITY_CODES.EMPTY,
    POWER_UNITS.PICKER_TRUCK_TRACTORS.id,
    40000,
  ],
  [
    TRAILERS.SEMI_TRAILERS_WHEELERS.id,
    'MFHOMEL',
    POWER_UNITS.TRUCK_TRACTORS.id,
    28000,
  ],
  [
    TRAILERS.SEMI_TRAILERS_WIDE_WHEELERS.id,
    COMMODITY_CODES.EMPTY,
    POWER_UNITS.PICKER_TRUCK_TRACTORS.id,
    52000,
  ],
  [
    TRAILERS.SEMI_TRAILERS_WIDE_WHEELERS.id,
    COMMODITY_CODES.NON_REDUCIBLE_LOADS,
    POWER_UNITS.TRUCK_WITH_PME.id,
    52000,
  ],
  // XLS K335/K336: new Wide Wheeler commodity weights.
  [
    TRAILERS.SEMI_TRAILERS_WIDE_WHEELERS.id,
    'MFHOMEL',
    POWER_UNITS.TRUCK_TRACTORS.id,
    28000,
  ],
  [
    TRAILERS.SEMI_TRAILERS_WIDE_WHEELERS.id,
    COMMODITY_CODES.NONE,
    POWER_UNITS.TRUCK_TRACTORS.id,
    52000,
  ],
  // S3: manufactured-home Tridem Dolly, confirmed spread starts at 2.4 m.
  [TRAILERS.DOLLIES.id, 'MFHOMEL', POWER_UNITS.TRUCK_TRACTORS.id, 28000],
  // Other subtypes retain their prior limits.
  [
    TRAILERS.PLATFORM_TRAILERS_WHEELERS.id,
    COMMODITY_CODES.EMPTY,
    POWER_UNITS.TRUCK_TRACTORS.id,
    29000,
  ],
  [
    TRAILERS.MANUFACTURED_HOMES_OVER_5M.id,
    COMMODITY_CODES.NONE,
    POWER_UNITS.TRUCK_TRACTORS.id,
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

// These weight entries preserve selection until eligibility is confirmed by the BSA.
it.each(['MFHOMEL', COMMODITY_CODES.NONE])(
  'preserves STOW vehicle selection for %s with the new Wide Wheeler weights',
  (commodity) => {
    expect(
      policy
        .getNextPermittableVehicles('STOW', commodity, [
          POWER_UNITS.TRUCK_TRACTORS.id,
        ])
        .has(TRAILERS.SEMI_TRAILERS_WIDE_WHEELERS.id),
    ).toBe(false);
  },
);
