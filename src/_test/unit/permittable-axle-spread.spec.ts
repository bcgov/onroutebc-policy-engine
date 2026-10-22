import { Policy } from '../../policy-engine';
import { COMMODITY_CODES } from '../../constants/commodity-codes';
import { POWER_UNIT_CODES } from '../../constants/power-unit-codes';
import { TRAILER_CODES } from '../../constants/trailer-codes';
import { PolicyCheckId } from '../../enum';
import {
  PermittableAxleSpread,
  PolicyDefinition,
  TrailerWeightDimension,
} from '../../types';
import { matchesPermittableAxleSpread } from '../../helper/permittable-axle-spread.helper';
import config from '../policy-config/_current-config.json';

it.each([
  [undefined, false, false],
  [239, false, false],
  [240, true, false],
  [300, true, false],
  [300.5, true, true],
  [370, true, true],
  [371, false, false],
  [NaN, false, false],
])(
  'checks inclusive and exclusive spread bounds at %s cm',
  (spread, standard, upper) => {
    expect(matchesPermittableAxleSpread(spread, { min: 240, max: 370 })).toBe(
      standard,
    );
    expect(
      matchesPermittableAxleSpread(spread, { minExclusive: 300, max: 370 }),
    ).toBe(upper);
  },
);

it.each([
  { min: 240, minExclusive: 300, max: 370 },
  { max: 370 },
  { min: 370, max: 240 },
])('rejects an invalid spread condition: %j', (range) => {
  expect(() =>
    matchesPermittableAxleSpread(300, range as PermittableAxleSpread),
  ).toThrow('Invalid permittableAxleSpread');
});

// Use distinct test values to prove that both weights and bounds come from JSON.
it.each(['category', 'subtype', 'commodity'] as const)(
  'selects the %s base or spread allowance and keeps the legal limit unchanged',
  (level) => {
    const definition: PolicyDefinition = JSON.parse(JSON.stringify(config));
    const base: TrailerWeightDimension = {
      axles: 3,
      legal: 24000,
      permittable: 27500,
    };
    const conditional: TrailerWeightDimension = {
      axles: 3,
      legal: 24000,
      permittable: 28500,
      permittableAxleSpread: { min: 250, max: 350 },
    };
    const category = definition.vehicleCategories.trailerCategories.find(
      ({ id }) => id === 'semi',
    )!;
    const subtype = definition.vehicleTypes.trailerTypes.find(
      ({ id }) => id === TRAILER_CODES.SEMI_TRAILERS,
    )!;
    const commodity = definition.commodities
      .find(({ id }) => id === COMMODITY_CODES.NONE)!
      .powerUnits.find(({ type }) => type === POWER_UNIT_CODES.TRUCK_TRACTORS)!
      .trailers.find(({ type }) => type === TRAILER_CODES.SEMI_TRAILERS)!;

    definition.globalWeightDefaults.trailers = [base];
    category.defaultWeightDimensions = [base, conditional];
    if (level === 'subtype')
      subtype.defaultWeightDimensions = [base, conditional];
    if (level === 'commodity') {
      subtype.defaultWeightDimensions = [base];
      commodity.weightDimensions = [base, conditional];
    }
    const policy = new Policy(definition);
    for (const [spread, expected] of [
      [undefined, 27500],
      [249, 27500],
      [250, 28500],
      [350, 28500],
      [351, 27500],
    ]) {
      const results = policy.runAxleCalculation(
        [POWER_UNIT_CODES.TRUCK_TRACTORS, TRAILER_CODES.SEMI_TRAILERS],
        [
          { numberOfAxles: 1, vehicleIndex: 0, axleUnitWeight: 5000 },
          { numberOfAxles: 2, vehicleIndex: 0, axleUnitWeight: 15000 },
          {
            numberOfAxles: 3,
            vehicleIndex: 1,
            axleUnitWeight: 28000,
            axleSpread: spread,
          },
        ],
        100000,
        COMMODITY_CODES.NONE,
      ).results;
      for (const [id, thresholdWeight] of [
        [PolicyCheckId.PermittableWeight, expected],
        [PolicyCheckId.LegalWeight, 24000],
      ]) {
        expect(
          results.find(
            (result) => result.id === id && result.startAxleUnit === 3,
          ),
        ).toMatchObject({ thresholdWeight });
      }
    }
  },
);
