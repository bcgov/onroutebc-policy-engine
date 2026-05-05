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

  it('should document ambiguity when multiple STOW/XXXXXXX trailers can both add axle units', () => {
    const axleConfiguration = [
      { ...axleUnit },
      { ...axleUnit },
      { ...axleUnit },
      { ...axleUnit },
      { ...axleUnit },
    ];

    const axleUnitVehicleIndexes = getAxleUnitVehicleIndexes(
      policy,
      ['TRKTRAC', 'STROPRT', 'STRSELF'],
      axleConfiguration,
      axleCalculationOptions,
    );

    // This is ambiguous: both STROPRT and STRSELF can add axle units for
    // STOW/XXXXXXX. The axleConfiguration array only tells us there is one
    // surplus axle unit; it does not tell us whether the user added it to
    // STROPRT or STRSELF in the consuming application.
    //
    // Current logic assigns the surplus axle unit to the first eligible trailer:
    // [0, 0, 1, 1, 2]. That could be wrong if the intended ownership was
    // [0, 0, 1, 2, 2].
    expect(axleUnitVehicleIndexes).toEqual([0, 0, 1, 1, 2]);
  });

  it('should document ambiguity when multiple STOW/EMPTYXX trailers can both add axle units', () => {
    const axleConfiguration = [
      { ...axleUnit },
      { ...axleUnit },
      { ...axleUnit },
      { ...axleUnit },
      { ...axleUnit },
    ];

    const axleUnitVehicleIndexes = getAxleUnitVehicleIndexes(
      policy,
      ['TRKTRAC', 'PLATFRM', 'PLATWHE'],
      axleConfiguration,
      { permitTypeId: 'STOW', commodityId: 'EMPTYXX' },
    );

    // This is ambiguous for the same reason: PLATFRM and PLATWHE can both add
    // axle units. Current logic maps the surplus unit to PLATFRM because it is
    // the first eligible trailer: [0, 0, 1, 1, 2].
    //
    // If the consuming app intended the extra axle unit to belong to PLATWHE,
    // the desired mapping would be [0, 0, 1, 2, 2].
    expect(axleUnitVehicleIndexes).toEqual([0, 0, 1, 1, 2]);
  });

  it('should document ambiguity when several STOW/NONREDU trailers can add axle units', () => {
    const axleConfiguration = [
      { ...axleUnit },
      { ...axleUnit },
      { ...axleUnit },
      { ...axleUnit },
      { ...axleUnit },
      { ...axleUnit },
    ];

    const axleUnitVehicleIndexes = getAxleUnitVehicleIndexes(
      policy,
      ['TRKTRAC', 'PLATFRM', 'PLATWHE', 'STROPRT'],
      axleConfiguration,
      { permitTypeId: 'STOW', commodityId: 'NONREDU' },
    );

    // This is even more ambiguous: PLATFRM, PLATWHE, and STROPRT can all add
    // axle units for STOW/NONREDU. With one surplus axle unit, current logic
    // assigns it to the first eligible trailer, PLATFRM: [0, 0, 1, 1, 2, 3].
    //
    // The same axleConfiguration length could also represent an extra axle on
    // PLATWHE ([0, 0, 1, 2, 2, 3]) or STROPRT ([0, 0, 1, 2, 3, 3]).
    expect(axleUnitVehicleIndexes).toEqual([0, 0, 1, 1, 2, 3]);
  });
});
