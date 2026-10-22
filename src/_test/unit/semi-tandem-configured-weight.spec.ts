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

  it.each([TRAILER_CODES.PONY_TRAILERS, TRAILER_CODES.SEMI_TRAILERS_WHEELERS])(
    'preserves the existing tandem maximum for %s',
    (trailerType) => {
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
    },
  );
});
