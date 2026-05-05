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
  const axleCalculationOptions = {
    permitTypeId: 'STOW',
    commodityId: 'XXXXXXX',
  };

  it('should pass when a power unit is configured with three axle units', async () => {
    const results = policy.runAxleCalculation(
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
      axleCalculationOptions,
    );

    expect(results.totalOverload).toBe(0);
    expect(
      results.results.every((r) => r.result === PolicyCheckResultType.Pass),
    ).toBe(true);
  });

  it('should pass when a trailer configuration has an extra axle unit', async () => {
    const results = policy.runAxleCalculation(
      ['TRKTRAC', 'STROPRT'],
      [
        {
          numberOfAxles: 1,
          axleUnitWeight: 5000,
          numberOfTires: 2,
          tireSize: 279,
        },
        { ...axleUnit },
        { ...axleUnit },
        { ...axleUnit },
      ],
      20000,
      axleCalculationOptions,
    );

    expect(results.totalOverload).toBe(0);
    expect(
      results.results.every((r) => r.result === PolicyCheckResultType.Pass),
    ).toBe(true);
  });

  it('should pass when trailer and booster configuration has four axle units', async () => {
    const results = policy.runAxleCalculation(
      ['TRKTRAC', 'STROPRT', 'BOOSTER'],
      [
        {
          numberOfAxles: 1,
          axleUnitWeight: 5000,
          numberOfTires: 2,
          tireSize: 279,
        },
        { ...axleUnit },
        { ...axleUnit },
        { ...axleUnit },
      ],
      20000,
      axleCalculationOptions,
    );

    expect(results.totalOverload).toBe(0);
    expect(
      results.results.every((r) => r.result === PolicyCheckResultType.Pass),
    ).toBe(true);
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
  const axleCalculationOptions = {
    permitTypeId: 'STOW',
    commodityId: 'XXXXXXX',
  };

  it('should map legacy configurations to two power unit axle units and one trailer axle unit', () => {
    const axleConfiguration = [
      { ...axleUnit },
      { ...axleUnit },
      { ...axleUnit },
    ];

    const axleUnitVehicleIndexes = getAxleUnitVehicleIndexes(
      policy,
      ['TRKTRAC', 'SEMITRL'],
      axleConfiguration,
    );

    expect(axleUnitVehicleIndexes).toEqual([0, 0, 1]);
  });

  it('should assign surplus axle units to the power unit when only the power unit can add axle units', () => {
    const axleConfiguration = [
      { ...axleUnit },
      { ...axleUnit },
      { ...axleUnit },
    ];

    const axleUnitVehicleIndexes = getAxleUnitVehicleIndexes(
      policy,
      ['CONCRET'],
      axleConfiguration,
      axleCalculationOptions,
    );

    // This is not ambiguous: the configuration has no trailers, and CONCRET is
    // configured to accept additional axle units. The surplus unit must belong
    // to vehicleConfiguration[0].
    expect(axleUnitVehicleIndexes).toEqual([0, 0, 0]);
  });

  it('should assign surplus axle units to the trailer when only the trailer can add axle units', () => {
    const axleConfiguration = [
      { ...axleUnit },
      { ...axleUnit },
      { ...axleUnit },
      { ...axleUnit },
    ];

    const axleUnitVehicleIndexes = getAxleUnitVehicleIndexes(
      policy,
      ['TRKTRAC', 'STROPRT'],
      axleConfiguration,
      axleCalculationOptions,
    );

    // This is not ambiguous under current config: TRKTRAC cannot add axle units
    // for STOW/XXXXXXX, while STROPRT can. The surplus unit is assigned to
    // vehicleConfiguration[1].
    expect(axleUnitVehicleIndexes).toEqual([0, 0, 1, 1]);
  });

  it('should document the current ambiguity when the power unit and trailer can both add axle units', () => {
    const axleConfiguration = [
      { ...axleUnit },
      { ...axleUnit },
      { ...axleUnit },
      { ...axleUnit },
    ];

    const axleUnitVehicleIndexes = getAxleUnitVehicleIndexes(
      policy,
      ['CRANEAT', 'DOLLIES'],
      axleConfiguration,
      axleCalculationOptions,
    );

    // This is ambiguous: both CRANEAT and DOLLIES can add axle units for this
    // commodity, and the axleConfiguration array does not tell us which vehicle
    // the surplus axle unit belongs to. Current logic resolves this by assigning
    // surplus axle units to the first eligible vehicle, so CRANEAT gets it:
    // [0, 0, 0, 1].
    //
    // That could be wrong if the consuming application intended the extra axle
    // unit to belong to DOLLIES instead: [0, 0, 1, 1]. A future API may need to
    // accept explicit axle-unit ownership from the consuming application.
    expect(axleUnitVehicleIndexes).toEqual([0, 0, 0, 1]);
  });
});
