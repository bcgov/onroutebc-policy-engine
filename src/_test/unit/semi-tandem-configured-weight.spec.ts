import { Policy } from '../../policy-engine';
import { PolicyCheckId, PolicyCheckResultType } from '../../enum';
import { AxleConfiguration, PolicyDefinition } from '../../types';
import { COMMODITY_CODES } from '../../constants/commodity-codes';
import { CheckPermittableWeight } from '../../helper/policy-check.helper';
import config from '../policy-config/_current-config.json';
import { VEHICLE_CATEGORIES } from '../../constants/vehicle-categories';
import { POWER_UNITS } from '../../constants/power-units';
import { TRAILERS } from '../../constants/trailers';

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
      [POWER_UNITS.TRUCK_TRACTORS.id, TRAILERS.SEMI_TRAILERS_SPREAD_TANDEMS.id],
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
      [POWER_UNITS.TRUCK_TRACTORS.id, TRAILERS.SEMI_TRAILERS.id],
      axles(19501),
      COMMODITY_CODES.NONE,
    );
    expect(results[2]).toMatchObject({
      thresholdWeight: 19500,
      result: PolicyCheckResultType.Fail,
    });
  });

  it.each([
    TRAILERS.PLATFORM_TRAILERS_WHEELERS.id,
    TRAILERS.DOLLIES.id,
    TRAILERS.BOOSTER.id,
  ])('preserves the existing tandem maximum for %s', (trailerType) => {
    const results = CheckPermittableWeight(
      new Policy(config),
      [POWER_UNITS.TRUCK_TRACTORS.id, trailerType],
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
describe('configured pony and wheeler tandem weights', () => {
  it.each<[string, number]>([
    [TRAILERS.PONY_TRAILERS.id, 21000],
    [TRAILERS.FIXED_EQUIPMENT_PONY_TRAILERS.id, 21000],
    [TRAILERS.MANUFACTURED_HOMES_OVER_5M.id, 21000],
    [TRAILERS.FIXED_EQUIPMENT_WHEELER_SEMI_TRAILERS.id, 31000],
    // XLS: regular/Wide Wheeler Tandems, K320/323/327/329/330/331/333/337.
    [TRAILERS.SEMI_TRAILERS_WHEELERS.id, 31000],
    // TODO the category for this trailer has been updated from 'wheeler' to 'wide-wheelers' in accordance with the OWDS. This causes this test to fail
    // TODO: Uncomment after reviewing the missing wide-wheelers category weight defaults.
    // [TRAILERS.SEMI_TRAILERS_WIDE_WHEELERS.id, 31000],
  ])('uses the configured %s maximum of %i kg', (trailerType, limit) => {
    for (const weight of [limit, limit + 1]) {
      const calculated = new Policy(config).runAxleCalculation(
        [POWER_UNITS.TRUCK_TRACTORS.id, trailerType],
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
    [TRAILERS.PONY_TRAILERS.id, VEHICLE_CATEGORIES.PONY_TRAILER, 19500],
    [TRAILERS.PONY_TRAILERS.id, VEHICLE_CATEGORIES.PONY_TRAILER, 0],
    [
      TRAILERS.FIXED_EQUIPMENT_WHEELER_SEMI_TRAILERS.id,
      VEHICLE_CATEGORIES.WHEELER,
      31500,
    ],
    [
      TRAILERS.FIXED_EQUIPMENT_WHEELER_SEMI_TRAILERS.id,
      VEHICLE_CATEGORIES.WHEELER,
      0,
    ],
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
        [POWER_UNITS.TRUCK_TRACTORS.id, trailerType],
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
