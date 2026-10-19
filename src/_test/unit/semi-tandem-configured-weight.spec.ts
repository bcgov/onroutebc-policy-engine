import { Policy } from '../../policy-engine';
import { PolicyCheckId, PolicyCheckResultType } from '../../enum';
import { AxleConfiguration, PolicyDefinition } from '../../types';
import { POWER_UNIT_CODES } from '../../constants/power-unit-codes';
import { TRAILER_CODES } from '../../constants/trailer-codes';
import { COMMODITY_CODES } from '../../constants/commodity-codes';
import { CheckPermittableWeight } from '../../helper/policy-check.helper';
import config from '../policy-config/_current-config.json';

const axles = (weight: number): AxleConfiguration[] => [
  {
    numberOfAxles: 1,
    axleUnitWeight: 6000,
    numberOfTires: 2,
    tireSize: 455,
    vehicleIndex: 0,
  },
  {
    numberOfAxles: 2,
    axleUnitWeight: 17000,
    axleSpread: 160,
    interaxleSpacing: 500,
    numberOfTires: 8,
    tireSize: 455,
    vehicleIndex: 0,
  },
  {
    numberOfAxles: 2,
    axleUnitWeight: weight,
    axleSpread: 250,
    interaxleSpacing: 500,
    numberOfTires: 8,
    tireSize: 455,
    vehicleIndex: 1,
  },
];

// Over Weight Dimension Set, row 200: spread-tandem semi J/K = 9,100/18,200 kg.
describe('configured semi-trailer tandem weights', () => {
  it.each([
    [PolicyCheckId.LegalWeight, 9100, 9100, PolicyCheckResultType.Pass],
    [PolicyCheckId.LegalWeight, 9101, 9100, PolicyCheckResultType.Warning],
    [PolicyCheckId.PermittableWeight, 18200, 18200, PolicyCheckResultType.Pass],
    [PolicyCheckId.PermittableWeight, 18201, 18200, PolicyCheckResultType.Fail],
  ])('checks %s at %i kg', (checkId, weight, limit, result) => {
    const calculated = new Policy(config).runAxleCalculation(
      [
        POWER_UNIT_CODES.TRUCK_TRACTORS,
        TRAILER_CODES.SEMI_TRAILERS_SPREAD_TANDEMS,
      ],
      axles(weight),
      100000,
      COMMODITY_CODES.NONE,
    );
    expect(
      calculated.results.find(
        ({ id, startAxleUnit }) => id === checkId && startAxleUnit === 3,
      ),
    ).toMatchObject({ thresholdWeight: limit, result });
  });

  it('reads the regular semi tandem maximum from JSON', () => {
    const changed: PolicyDefinition = JSON.parse(JSON.stringify(config));
    changed.globalWeightDefaults.trailers.find(
      ({ axles }) => axles === 2,
    )!.permittable = 19500;

    const results = CheckPermittableWeight(
      new Policy(changed),
      [POWER_UNIT_CODES.TRUCK_TRACTORS, TRAILER_CODES.SEMI_TRAILERS],
      axles(19501),
      COMMODITY_CODES.NONE,
    );
    expect(results[2]).toMatchObject({
      thresholdWeight: 19500,
      result: PolicyCheckResultType.Fail,
    });
  });

  it.each([
    TRAILER_CODES.SEMI_TRAILERS_WHEELERS,
    TRAILER_CODES.SEMI_TRAILERS_WIDE_WHEELERS,
    TRAILER_CODES.DOLLIES,
    TRAILER_CODES.BOOSTER,
  ])('preserves the existing tandem maximum for %s', (trailerType) => {
    const results = CheckPermittableWeight(
      new Policy(config),
      [POWER_UNIT_CODES.TRUCK_TRACTORS, trailerType],
      axles(23000),
      COMMODITY_CODES.NONE,
    );
    expect(results[2]).toMatchObject({
      thresholdWeight: 23000,
      result: PolicyCheckResultType.Pass,
    });
  });
});

// XLS K119–121/128–130/137–139/144/149–151: pony 21,000; K297: fixed wheeler 31,000.
describe('configured pony and fixed wheeler tandem weights', () => {
  it.each<[string, number]>([
    [TRAILER_CODES.PONY_TRAILERS, 21000],
    [TRAILER_CODES.FIXED_EQUIPMENT_PONY_TRAILERS, 21000],
    [TRAILER_CODES.MANUFACTURED_HOMES_OVER_5M, 21000],
    [TRAILER_CODES.FIXED_EQUIPMENT_WHEELER_SEMI_TRAILERS, 31000],
  ])('uses the configured %s maximum of %i kg', (trailerType, limit) => {
    for (const weight of [limit, limit + 1]) {
      const calculated = new Policy(config).runAxleCalculation(
        [POWER_UNIT_CODES.TRUCK_TRACTORS, trailerType],
        axles(weight),
        100000,
        COMMODITY_CODES.NONE,
      );
      expect(
        calculated.results.find(
          ({ id, startAxleUnit }) =>
            id === PolicyCheckId.PermittableWeight && startAxleUnit === 3,
        ),
      ).toMatchObject({
        thresholdWeight: limit,
        actualWeight: weight,
        result:
          weight === limit
            ? PolicyCheckResultType.Pass
            : PolicyCheckResultType.Fail,
      });
    }
  });

  it.each<[string, string, number]>([
    [TRAILER_CODES.PONY_TRAILERS, 'pony', 19500],
    [TRAILER_CODES.PONY_TRAILERS, 'pony', 0],
    [TRAILER_CODES.FIXED_EQUIPMENT_WHEELER_SEMI_TRAILERS, 'wheeler', 31500],
    [TRAILER_CODES.FIXED_EQUIPMENT_WHEELER_SEMI_TRAILERS, 'wheeler', 0],
  ])(
    'reads %s category %s tandem limit %i kg',
    (trailerType, category, limit) => {
      const changed = JSON.parse(JSON.stringify(config)) as typeof config;
      changed.vehicleCategories.trailerCategories
        .find(({ id }) => id === category)!
        .defaultWeightDimensions!.find(
          ({ axles }) => axles === 2,
        )!.permittable = limit;

      const results = CheckPermittableWeight(
        new Policy(changed),
        [POWER_UNIT_CODES.TRUCK_TRACTORS, trailerType],
        axles(limit + 1),
        COMMODITY_CODES.NONE,
      );
      expect(results[2]).toMatchObject({
        thresholdWeight: limit,
        result: PolicyCheckResultType.Fail,
      });
    },
  );
});
