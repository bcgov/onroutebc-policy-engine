import { Policy } from '../../policy-engine';
import { PolicyCheckResultType } from '../../enum';
import { getAxleUnitVehicleIndexes } from '../../helper/dimensions.helper';
import currentPolicyConfig from '../policy-config/_current-config.json';

describe('Multi-Axle Unit Calculation Tests', () => {
  const policy: Policy = new Policy(currentPolicyConfig);
  const axleUnit = {
    numberOfAxles: 1,
    interaxleSpacing: 200,
    axleUnitWeight: 5000,
    numberOfTires: 2,
    tireSize: 279,
  };

  it('should pass when a power unit is explicitly configured with three axle units', () => {
    const results = policy.runAxleCalculation(
      ['CONCRET'],
      [
        {
          numberOfAxles: 1,
          axleUnitWeight: 5000,
          numberOfTires: 2,
          tireSize: 279,
          vehicleIndex: 0,
        },
        { ...axleUnit, vehicleIndex: 0 },
        { ...axleUnit, vehicleIndex: 0 },
      ],
      15000,
    );

    expect(results.totalOverload).toBe(0);
    expect(
      results.results.every((r) => r.result === PolicyCheckResultType.Pass),
    ).toBe(true);
  });

  it('should pass when a trailer is explicitly configured with an extra axle unit', () => {
    const results = policy.runAxleCalculation(
      ['TRKTRAC', 'STROPRT'],
      [
        {
          numberOfAxles: 1,
          axleUnitWeight: 5000,
          numberOfTires: 2,
          tireSize: 279,
          vehicleIndex: 0,
        },
        { ...axleUnit, vehicleIndex: 0 },
        { ...axleUnit, vehicleIndex: 1 },
        { ...axleUnit, vehicleIndex: 1 },
      ],
      20000,
    );

    expect(results.totalOverload).toBe(0);
    expect(
      results.results.every((r) => r.result === PolicyCheckResultType.Pass),
    ).toBe(true);
  });

  it('should pass when explicit vehicleIndex disambiguates multiple trailer axle units', () => {
    const results = policy.runAxleCalculation(
      ['TRKTRAC', 'STROPRT', 'STRSELF'],
      [
        {
          numberOfAxles: 1,
          axleUnitWeight: 5000,
          numberOfTires: 2,
          tireSize: 279,
          vehicleIndex: 0,
        },
        { ...axleUnit, vehicleIndex: 0 },
        { ...axleUnit, vehicleIndex: 1 },
        { ...axleUnit, vehicleIndex: 2 },
        { ...axleUnit, vehicleIndex: 2 },
      ],
      25000,
    );

    expect(results.totalOverload).toBe(0);
    expect(
      results.results.every((r) => r.result === PolicyCheckResultType.Pass),
    ).toBe(true);
  });

  it('should pass for a crane mounted boom with dollies', () => {
    const results = policy.runAxleCalculation(
      ['CRANEMB', 'DOLLIES'],
      [
        {
          numberOfAxles: 1,
          interaxleSpacing: 200,
          axleUnitWeight: 5000,
          numberOfTires: 2,
          tireSize: 279,
          vehicleIndex: 0,
        },
        {
          numberOfAxles: 1,
          interaxleSpacing: 200,
          axleUnitWeight: 5000,
          numberOfTires: 2,
          tireSize: 279,
          vehicleIndex: 0,
        },
        {
          numberOfAxles: 1,
          interaxleSpacing: 200,
          axleUnitWeight: 5000,
          numberOfTires: 2,
          tireSize: 279,
          vehicleIndex: 1,
        },
      ],
      15000,
    );

    expect(results.totalOverload).toBe(0);
    expect(
      results.results.every((r) => r.result === PolicyCheckResultType.Pass),
    ).toBe(true);
  });

  it('should pass for a pickup truck tractor with a platform wheel trailer', () => {
    const results = policy.runAxleCalculation(
      ['PICKRTT', 'PLATWHE'],
      [
        {
          numberOfAxles: 1,
          interaxleSpacing: 200,
          axleUnitWeight: 5000,
          numberOfTires: 2,
          tireSize: 279,
          vehicleIndex: 0,
        },
        {
          numberOfAxles: 2,
          axleSpread: 160,
          interaxleSpacing: 200,
          axleUnitWeight: 5000,
          numberOfTires: 4,
          tireSize: 279,
          vehicleIndex: 0,
        },
        {
          numberOfAxles: 2,
          axleSpread: 160,
          interaxleSpacing: 200,
          axleUnitWeight: 5000,
          numberOfTires: 4,
          tireSize: 279,
          vehicleIndex: 1,
        },
      ],
      15000,
    );

    expect(results.totalOverload).toBe(0);
    expect(
      results.results.every((r) => r.result === PolicyCheckResultType.Pass),
    ).toBe(true);
  });

  it('should pass for an oilfield bed truck with jeep, trailer, and booster', () => {
    const results = policy.runAxleCalculation(
      ['OGBEDTK', 'JEEPSRG', 'FEDRMMX', 'BOOSTER'],
      [
        {
          numberOfAxles: 1,
          interaxleSpacing: 200,
          axleUnitWeight: 5000,
          numberOfTires: 2,
          tireSize: 279,
          vehicleIndex: 0,
        },
        {
          numberOfAxles: 2,
          axleSpread: 160,
          interaxleSpacing: 200,
          axleUnitWeight: 5000,
          numberOfTires: 4,
          tireSize: 279,
          vehicleIndex: 0,
        },
        {
          numberOfAxles: 3,
          axleSpread: 160,
          interaxleSpacing: 200,
          axleUnitWeight: 5000,
          numberOfTires: 12,
          tireSize: 279,
          vehicleIndex: 1,
        },
        {
          numberOfAxles: 3,
          axleSpread: 160,
          interaxleSpacing: 200,
          axleUnitWeight: 5000,
          numberOfTires: 12,
          tireSize: 279,
          vehicleIndex: 2,
        },
        {
          numberOfAxles: 3,
          axleSpread: 160,
          interaxleSpacing: 200,
          axleUnitWeight: 5000,
          numberOfTires: 12,
          tireSize: 279,
          vehicleIndex: 3,
        },
      ],
      25000,
    );

    expect(results.totalOverload).toBe(0);
    expect(
      results.results.every((r) => r.result === PolicyCheckResultType.Pass),
    ).toBe(true);
  });

  it('should reject multi-axle calculation without vehicleIndex instead of guessing ownership', () => {
    expect(() =>
      policy.runAxleCalculation(
        ['CONCRET'],
        [
          {
            numberOfAxles: 1,
            axleUnitWeight: 5000,
            numberOfTires: 2,
            tireSize: 279,
          },
          { ...axleUnit },
          { ...axleUnit },
        ],
        15000,
      ),
    ).toThrow('Wrong number of axles configured for vehicle configuration');
  });

  it('should reject partially supplied vehicleIndex values from runAxleCalculation', () => {
    expect(() =>
      policy.runAxleCalculation(
        ['TRKTRAC', 'STROPRT'],
        [
          {
            numberOfAxles: 1,
            axleUnitWeight: 5000,
            numberOfTires: 2,
            tireSize: 279,
            vehicleIndex: 0,
          },
          { ...axleUnit, vehicleIndex: 0 },
          { ...axleUnit },
          { ...axleUnit, vehicleIndex: 1 },
        ],
        20000,
      ),
    ).toThrow('All axle units must include vehicleIndex');
  });

  it('should reject vehicleIndex values that contradict steer and drive axle ownership', () => {
    expect(() =>
      policy.runAxleCalculation(
        ['TRKTRAC', 'STROPRT'],
        [
          {
            numberOfAxles: 1,
            axleUnitWeight: 5000,
            numberOfTires: 2,
            tireSize: 279,
            vehicleIndex: 0,
          },
          { ...axleUnit, vehicleIndex: 1 },
          { ...axleUnit, vehicleIndex: 1 },
        ],
        15000,
      ),
    ).toThrow('First two axle units must belong to the power unit');
  });

  it('should reject vehicleIndex values that point backward in physical axle order', () => {
    expect(() =>
      policy.runAxleCalculation(
        ['TRKTRAC', 'STROPRT'],
        [
          {
            numberOfAxles: 1,
            axleUnitWeight: 5000,
            numberOfTires: 2,
            tireSize: 279,
            vehicleIndex: 0,
          },
          { ...axleUnit, vehicleIndex: 0 },
          { ...axleUnit, vehicleIndex: 1 },
          { ...axleUnit, vehicleIndex: 0 },
        ],
        20000,
      ),
    ).toThrow('Axle unit vehicleIndex values must be in vehicle order');
  });
});

describe('Multi-Axle Unit Vehicle Mapping Tests', () => {
  const policy: Policy = new Policy(currentPolicyConfig);
  const axleUnit = {
    numberOfAxles: 1,
    interaxleSpacing: 200,
    axleUnitWeight: 5000,
    numberOfTires: 2,
    tireSize: 279,
  };

  it('should map explicit vehicleIndex values for additional power unit axle units', () => {
    const axleConfiguration = [
      { ...axleUnit, vehicleIndex: 0 },
      { ...axleUnit, vehicleIndex: 0 },
      { ...axleUnit, vehicleIndex: 0 },
    ];

    const axleUnitVehicleIndexes = getAxleUnitVehicleIndexes(
      policy,
      ['CONCRET'],
      axleConfiguration,
    );

    expect(axleUnitVehicleIndexes).toEqual([0, 0, 0]);
  });

  it('should map explicit vehicleIndex values for additional trailer axle units', () => {
    const axleConfiguration = [
      { ...axleUnit, vehicleIndex: 0 },
      { ...axleUnit, vehicleIndex: 0 },
      { ...axleUnit, vehicleIndex: 1 },
      { ...axleUnit, vehicleIndex: 1 },
    ];

    const axleUnitVehicleIndexes = getAxleUnitVehicleIndexes(
      policy,
      ['TRKTRAC', 'STROPRT'],
      axleConfiguration,
    );

    expect(axleUnitVehicleIndexes).toEqual([0, 0, 1, 1]);
  });

  it('should map explicit vehicleIndex values across multiple trailers', () => {
    const axleConfiguration = [
      { ...axleUnit, vehicleIndex: 0 },
      { ...axleUnit, vehicleIndex: 0 },
      { ...axleUnit, vehicleIndex: 1 },
      { ...axleUnit, vehicleIndex: 2 },
      { ...axleUnit, vehicleIndex: 2 },
    ];

    const axleUnitVehicleIndexes = getAxleUnitVehicleIndexes(
      policy,
      ['TRKTRAC', 'STROPRT', 'STRSELF'],
      axleConfiguration,
    );

    expect(axleUnitVehicleIndexes).toEqual([0, 0, 1, 2, 2]);
  });

  it('should reject axle unit mapping without vehicleIndex instead of guessing ownership', () => {
    const axleConfiguration = [
      { ...axleUnit },
      { ...axleUnit },
      { ...axleUnit },
      { ...axleUnit },
    ];

    expect(() =>
      getAxleUnitVehicleIndexes(
        policy,
        ['CRANEAT', 'DOLLIES'],
        axleConfiguration,
      ),
    ).toThrow('All axle units must include vehicleIndex');
  });

  it('should reject partially supplied vehicleIndex values', () => {
    const axleConfiguration = [
      { ...axleUnit, vehicleIndex: 0 },
      { ...axleUnit, vehicleIndex: 0 },
      { ...axleUnit },
    ];

    expect(() =>
      getAxleUnitVehicleIndexes(
        policy,
        ['TRKTRAC', 'SEMITRL'],
        axleConfiguration,
      ),
    ).toThrow('All axle units must include vehicleIndex');
  });

  it('should reject invalid vehicleIndex values', () => {
    const axleConfiguration = [
      { ...axleUnit, vehicleIndex: 0 },
      { ...axleUnit, vehicleIndex: 0 },
      { ...axleUnit, vehicleIndex: 2 },
    ];

    expect(() =>
      getAxleUnitVehicleIndexes(
        policy,
        ['TRKTRAC', 'SEMITRL'],
        axleConfiguration,
      ),
    ).toThrow('Invalid vehicleIndex in axle configuration');
  });

  it('should reject vehicleIndex values that point backward in physical axle order', () => {
    const axleConfiguration = [
      { ...axleUnit, vehicleIndex: 0 },
      { ...axleUnit, vehicleIndex: 0 },
      { ...axleUnit, vehicleIndex: 2 },
      { ...axleUnit, vehicleIndex: 1 },
    ];

    expect(() =>
      getAxleUnitVehicleIndexes(
        policy,
        ['TRKTRAC', 'STROPRT', 'STRSELF'],
        axleConfiguration,
      ),
    ).toThrow('Axle unit vehicleIndex values must be in vehicle order');
  });

  it('should reject mappings where the first two axle units are not power-unit-owned', () => {
    const axleConfiguration = [
      { ...axleUnit, vehicleIndex: 0 },
      { ...axleUnit, vehicleIndex: 1 },
      { ...axleUnit, vehicleIndex: 1 },
    ];

    expect(() =>
      getAxleUnitVehicleIndexes(
        policy,
        ['TRKTRAC', 'SEMITRL'],
        axleConfiguration,
      ),
    ).toThrow('First two axle units must belong to the power unit');
  });
});
