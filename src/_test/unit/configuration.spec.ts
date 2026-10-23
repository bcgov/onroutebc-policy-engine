import { COMMODITY_CODES } from '../../constants/commodity-codes';
import { PERMIT_CODES } from '../../constants/permit-codes';
import { POWER_UNITS } from '../../constants/power-units';
import { TRAILERS } from '../../constants/trailers';
import { Policy } from '../../policy-engine';
import currentPolicyConfig from '../policy-config/_current-config.json';
import specialAuth from '../policy-config/special-auth-lcv.sample.json';

describe('Policy Engine Oversize Configuration Functions', () => {
  const policy: Policy = new Policy(currentPolicyConfig);
  const lcvPolicy: Policy = new Policy(currentPolicyConfig, specialAuth);

  it('should retrieve all permittable power unit types for STOS', async () => {
    const puTypes = policy.getPermittablePowerUnitTypes(
      PERMIT_CODES.SINGLE_TRIP_OVERSIZE,
      COMMODITY_CODES.EMPTY,
    );
    expect(puTypes.size).toBe(5);
    expect(puTypes.keys()).toContain(POWER_UNITS.TRUCK_TRACTORS.id);
    expect(puTypes.keys()).toContain(POWER_UNITS.PICKER_TRUCK_TRACTORS.id);
    expect(puTypes.keys()).toContain(POWER_UNITS.PICKER_TRUCKS.id);
    expect(puTypes.keys()).toContain(POWER_UNITS.TRUCK_WITH_PME.id);
    expect(puTypes.keys()).toContain(POWER_UNITS.TRUCK_TRACTOR_WITH_PME.id);
  });

  it('should retrieve valid power unit types for STOW', async () => {
    const puTypesNone = policy.getPermittablePowerUnitTypes(
      PERMIT_CODES.SINGLE_TRIP_OVERWEIGHT,
      COMMODITY_CODES.NONE,
    );
    expect(puTypesNone.keys()).toContain(POWER_UNITS.TRUCK_TRACTORS.id);
    expect(puTypesNone.keys()).toContain(POWER_UNITS.CRANES_ALL_TERRAIN.id);
    expect(puTypesNone.keys()).not.toContain(
      POWER_UNITS.TELESCOPIC_CONVEYOR_TRUCKS.id,
    );

    const puTypesNonredu = policy.getPermittablePowerUnitTypes(
      PERMIT_CODES.SINGLE_TRIP_OVERWEIGHT,
      COMMODITY_CODES.NON_REDUCIBLE_LOADS,
    );
    expect(puTypesNonredu.keys()).toContain(POWER_UNITS.TRUCKS.id);
    expect(puTypesNonredu.keys()).toContain(
      POWER_UNITS.PICKER_TRUCK_TRACTORS.id,
    );
    expect(puTypesNonredu.keys()).not.toContain(
      POWER_UNITS.TRUCK_TRACTORS_STINGER_STEERED.id,
    );
  });

  it('should throw an error for invalid permit type', async () => {
    expect(() => {
      policy.getPermittablePowerUnitTypes('_INVALID', COMMODITY_CODES.EMPTY);
    }).toThrow();
  });

  it('should return an empty map for invalid commodity', async () => {
    const puTypes = policy.getPermittablePowerUnitTypes(
      PERMIT_CODES.SINGLE_TRIP_OVERSIZE,
      '_INVALID',
    );
    expect(puTypes.size).toBe(0);
  });

  it('should return only non-lcv power unit types if not authorized for lcv', async () => {
    const puTypes = policy.getPermittablePowerUnitTypes(
      PERMIT_CODES.SINGLE_TRIP_OVERSIZE,
      COMMODITY_CODES.NONE,
    );
    const nonLcvPULength = puTypes.size;

    expect(puTypes.keys()).not.toContain(
      POWER_UNITS.LCV_ROCKY_MOUNTAIN_DOUBLES.id,
    );
    expect(puTypes.keys()).not.toContain(POWER_UNITS.LCV_TURNPIKE_DOUBLES.id);

    const lcvPuTypes = lcvPolicy.getPermittablePowerUnitTypes(
      PERMIT_CODES.SINGLE_TRIP_OVERSIZE,
      COMMODITY_CODES.NONE,
    );
    // There are 2 permittable LCV types
    expect(lcvPuTypes.size - nonLcvPULength).toBe(2);
    expect(lcvPuTypes.keys()).toContain(
      POWER_UNITS.LCV_ROCKY_MOUNTAIN_DOUBLES.id,
    );
    expect(lcvPuTypes.keys()).toContain(POWER_UNITS.LCV_TURNPIKE_DOUBLES.id);
  });
});

describe('Policy Engine Vehicle Configuration Helpers', () => {
  const policy: Policy = new Policy(currentPolicyConfig);

  it('should combine power unit and trailer axle configurations with vehicle indexes', () => {
    const combinedAxleConfiguration = policy.combineAxleConfigurations(
      [
        {
          numberOfAxles: 1,
          axleUnitWeight: 5000,
        },
        {
          numberOfAxles: 2,
          axleUnitWeight: 12000,
        },
      ],
      [
        {
          vehicleSubType: TRAILERS.SEMI_TRAILERS.id,
          axleConfiguration: [
            {
              numberOfAxles: 2,
              axleUnitWeight: 10000,
            },
          ],
        },
        {
          vehicleSubType: TRAILERS.BOOSTER.id,
          axleConfiguration: null,
        },
        {
          vehicleSubType: TRAILERS.DOLLIES.id,
          axleConfiguration: [
            {
              numberOfAxles: 1,
              axleUnitWeight: 4000,
            },
          ],
        },
      ],
    );

    expect(combinedAxleConfiguration).toEqual([
      {
        numberOfAxles: 1,
        axleUnitWeight: 5000,
        vehicleIndex: 0,
      },
      {
        numberOfAxles: 2,
        axleUnitWeight: 12000,
        vehicleIndex: 0,
      },
      {
        numberOfAxles: 2,
        axleUnitWeight: 10000,
        vehicleIndex: 1,
      },
      {
        numberOfAxles: 1,
        axleUnitWeight: 4000,
        vehicleIndex: 3,
      },
    ]);
  });
});

describe('Policy Engine Get Next Permittable Vehicles', () => {
  const policy: Policy = new Policy(currentPolicyConfig);
  const lcvPolicy: Policy = new Policy(currentPolicyConfig, specialAuth);

  it('should return permittable power units for STOS with empty current configuration', async () => {
    const vehicles = policy.getNextPermittableVehicles(
      PERMIT_CODES.SINGLE_TRIP_OVERSIZE,
      COMMODITY_CODES.LAMINATED_BEAMS,
      [],
    );
    expect(vehicles.size).toBe(1);
    expect(vehicles.keys()).toContain(POWER_UNITS.TRUCK_TRACTORS.id);
  });

  it('should return permittable power units for STOW with empty current configuration', async () => {
    const vehicles = policy.getNextPermittableVehicles(
      PERMIT_CODES.SINGLE_TRIP_OVERWEIGHT,
      COMMODITY_CODES.LAMINATED_BEAMS,
      [],
    );
    expect(vehicles.size).toBe(1);
    expect(vehicles.keys()).toContain(POWER_UNITS.TRUCK_TRACTORS.id);
  });

  it('should return only non-lcv permittable power units with empty current configuration', async () => {
    const vehicles = policy.getNextPermittableVehicles(
      PERMIT_CODES.SINGLE_TRIP_OVERSIZE,
      COMMODITY_CODES.NONE,
      [],
    );
    expect(vehicles.keys()).not.toContain(
      POWER_UNITS.LCV_ROCKY_MOUNTAIN_DOUBLES.id,
    );
    expect(vehicles.keys()).not.toContain(POWER_UNITS.LCV_TURNPIKE_DOUBLES.id);
  });

  it('should return lcv permittable power units with empty current configuration and lcv auth', async () => {
    const vehicles = lcvPolicy.getNextPermittableVehicles(
      PERMIT_CODES.SINGLE_TRIP_OVERSIZE,
      COMMODITY_CODES.NONE,
      [],
    );
    expect(vehicles.keys()).toContain(
      POWER_UNITS.LCV_ROCKY_MOUNTAIN_DOUBLES.id,
    );
    expect(vehicles.keys()).toContain(POWER_UNITS.LCV_TURNPIKE_DOUBLES.id);
  });

  it('should return no next vehicles with lcv pu and no lcv auth', async () => {
    const vehicles = policy.getNextPermittableVehicles(
      PERMIT_CODES.SINGLE_TRIP_OVERSIZE,
      COMMODITY_CODES.NONE,
      [POWER_UNITS.LCV_ROCKY_MOUNTAIN_DOUBLES.id],
    );
    expect(vehicles.size).toBe(0);
  });

  it('should return one semi-trailer with lcv pu and lcv auth', async () => {
    const vehicles = lcvPolicy.getNextPermittableVehicles(
      PERMIT_CODES.SINGLE_TRIP_OVERSIZE,
      COMMODITY_CODES.NONE,
      [POWER_UNITS.LCV_ROCKY_MOUNTAIN_DOUBLES.id],
    );
    expect(vehicles.size).toBe(1);
    expect(vehicles.keys()).toContain(TRAILERS.SEMI_TRAILERS.id);
  });

  // ORV2-3953
  it('should not return invalid trailers after jeep selected (STOS)', async () => {
    const vehicles = policy.getNextPermittableVehicles(
      PERMIT_CODES.SINGLE_TRIP_OVERSIZE,
      'BRSHCUT',
      [POWER_UNITS.TRUCK_TRACTORS.id, TRAILERS.JEEPS.id],
    );
    expect(vehicles.size).toBe(2);
    expect(vehicles.keys()).not.toContain(TRAILERS.SEMI_TRAILERS.id);
  });

  it('should not return invalid trailers after jeep selected (STOW)', async () => {
    const vehicles = policy.getNextPermittableVehicles(
      PERMIT_CODES.SINGLE_TRIP_OVERWEIGHT,
      'OILFILD',
      [POWER_UNITS.OIL_AND_GAS_BED_TRUCKS.id, TRAILERS.JEEPS.id],
    );
    expect(vehicles.size).toBe(2);
    expect(vehicles.keys()).not.toContain(TRAILERS.EXPANDO_SEMI_TRAILERS.id);
  });

  it('should return jeep and trailer when current config is just power unit (STOS)', async () => {
    const vehicles = policy.getNextPermittableVehicles(
      PERMIT_CODES.SINGLE_TRIP_OVERSIZE,
      COMMODITY_CODES.LAMINATED_BEAMS,
      [POWER_UNITS.TRUCK_TRACTORS.id],
    );
    expect(vehicles.size).toBe(3);
    expect(vehicles.keys()).toContain(TRAILERS.JEEPS.id);
    expect(vehicles.keys()).toContain(TRAILERS.POLE_TRAILERS.id);
    expect(vehicles.keys()).toContain(TRAILERS.HIBOYS_EXPANDOS.id);
  });

  it('should return jeep and trailer when current config is just power unit (STOW)', async () => {
    const vehicles = policy.getNextPermittableVehicles(
      PERMIT_CODES.SINGLE_TRIP_OVERWEIGHT,
      COMMODITY_CODES.LAMINATED_BEAMS,
      [POWER_UNITS.TRUCK_TRACTORS.id],
    );
    expect(vehicles.size).toBe(2);
    expect(vehicles.keys()).toContain(TRAILERS.JEEPS.id);
    expect(vehicles.keys()).toContain(TRAILERS.HIBOYS_EXPANDOS.id);
  });

  it('should return jeep and a trailer when current config is power unit and jeep', async () => {
    const vehicles = policy.getNextPermittableVehicles(
      PERMIT_CODES.SINGLE_TRIP_OVERSIZE,
      COMMODITY_CODES.LAMINATED_BEAMS,
      [POWER_UNITS.TRUCK_TRACTORS.id, TRAILERS.JEEPS.id],
    );
    expect(vehicles.size).toBe(3);
    expect(vehicles.keys()).toContain(TRAILERS.JEEPS.id);
    expect(vehicles.keys()).toContain(TRAILERS.POLE_TRAILERS.id);
    expect(vehicles.keys()).toContain(TRAILERS.HIBOYS_EXPANDOS.id);
  });

  it('should return booster when current config is power unit and trailer', async () => {
    const vehicles = policy.getNextPermittableVehicles(
      PERMIT_CODES.SINGLE_TRIP_OVERSIZE,
      COMMODITY_CODES.LAMINATED_BEAMS,
      [POWER_UNITS.TRUCK_TRACTORS.id, TRAILERS.POLE_TRAILERS.id],
    );
    expect(vehicles.size).toBe(1);
    expect(vehicles.keys()).toContain(TRAILERS.BOOSTER.id);
  });

  it('should return empty map when current configuration is invalid', async () => {
    const vehicles = policy.getNextPermittableVehicles(
      PERMIT_CODES.SINGLE_TRIP_OVERSIZE,
      COMMODITY_CODES.LAMINATED_BEAMS,
      [POWER_UNITS.TRUCK_TRACTORS.id, '_INVALID'],
    );
    expect(vehicles.size).toBe(0);
  });

  it('should not return additional axle for STOW and CRANEAT', async () => {
    const vehicles = policy.getNextPermittableVehicles(
      PERMIT_CODES.SINGLE_TRIP_OVERWEIGHT,
      COMMODITY_CODES.NONE,
      [POWER_UNITS.CRANES_ALL_TERRAIN.id],
    );
    expect(vehicles.size).toBe(2);
    expect(vehicles.keys()).toContain(TRAILERS.DOLLIES.id);
    expect(vehicles.keys()).toContain(COMMODITY_CODES.NONE);
  });
});

describe('Policy Engine Configuration Validation', () => {
  const policy: Policy = new Policy(currentPolicyConfig);

  it('should return true for a valid STOS configuration with power unit and trailer', async () => {
    const isValid = policy.isConfigurationValid(
      PERMIT_CODES.SINGLE_TRIP_OVERSIZE,
      COMMODITY_CODES.LAMINATED_BEAMS,
      [POWER_UNITS.TRUCK_TRACTORS.id, TRAILERS.HIBOYS_EXPANDOS.id],
    );
    expect(isValid).toBe(true);
  });

  it('should return true for a valid STOW configuration with power unit and trailer', async () => {
    const isValid = policy.isConfigurationValid(
      PERMIT_CODES.SINGLE_TRIP_OVERWEIGHT,
      COMMODITY_CODES.LAMINATED_BEAMS,
      [POWER_UNITS.TRUCK_TRACTORS.id, TRAILERS.HIBOYS_EXPANDOS.id],
    );
    expect(isValid).toBe(true);
  });

  it('should return true for a valid STOS configuration with power unit and trailer and jeep and booster', async () => {
    const isValid = policy.isConfigurationValid(
      PERMIT_CODES.SINGLE_TRIP_OVERSIZE,
      COMMODITY_CODES.LAMINATED_BEAMS,
      [
        POWER_UNITS.TRUCK_TRACTORS.id,
        TRAILERS.JEEPS.id,
        TRAILERS.POLE_TRAILERS.id,
        TRAILERS.BOOSTER.id,
      ],
    );
    expect(isValid).toBe(true);
  });

  it('should return true for a valid STOW configuration with power unit and trailer and jeep and booster', async () => {
    const isValid = policy.isConfigurationValid(
      PERMIT_CODES.SINGLE_TRIP_OVERWEIGHT,
      COMMODITY_CODES.LAMINATED_BEAMS,
      [
        POWER_UNITS.TRUCK_TRACTORS.id,
        TRAILERS.JEEPS.id,
        TRAILERS.HIBOYS_EXPANDOS.id,
        TRAILERS.BOOSTER.id,
      ],
    );
    expect(isValid).toBe(true);
  });

  it('should return false for a STOS configuration out of order', async () => {
    const isValid = policy.isConfigurationValid(
      PERMIT_CODES.SINGLE_TRIP_OVERSIZE,
      COMMODITY_CODES.LAMINATED_BEAMS,
      [
        POWER_UNITS.TRUCK_TRACTORS.id,
        TRAILERS.POLE_TRAILERS.id,
        TRAILERS.JEEPS.id,
        TRAILERS.BOOSTER.id,
      ],
    );
    expect(isValid).toBe(false);
  });

  it('should return false for a STOW configuration out of order', async () => {
    const isValid = policy.isConfigurationValid(
      PERMIT_CODES.SINGLE_TRIP_OVERWEIGHT,
      COMMODITY_CODES.LAMINATED_BEAMS,
      [
        POWER_UNITS.TRUCK_TRACTORS.id,
        TRAILERS.POLE_TRAILERS.id,
        TRAILERS.JEEPS.id,
        TRAILERS.BOOSTER.id,
      ],
    );
    expect(isValid).toBe(false);
  });

  it('should throw an error for an invalid permit type', async () => {
    expect(() => {
      policy.isConfigurationValid('_INVALID', COMMODITY_CODES.LAMINATED_BEAMS, [
        POWER_UNITS.TRUCK_TRACTORS.id,
        TRAILERS.POLE_TRAILERS.id,
      ]);
    }).toThrow();
  });

  it('should throw an error for an invalid STOS commodity', async () => {
    expect(() => {
      policy.isConfigurationValid(
        PERMIT_CODES.SINGLE_TRIP_OVERSIZE,
        '_INVALID',
        [POWER_UNITS.TRUCK_TRACTORS.id, TRAILERS.POLE_TRAILERS.id],
      );
    }).toThrow();
  });

  it('should throw an error for an invalid STOW commodity', async () => {
    expect(() => {
      policy.isConfigurationValid(
        PERMIT_CODES.SINGLE_TRIP_OVERWEIGHT,
        '_INVALID',
        [POWER_UNITS.TRUCK_TRACTORS.id, TRAILERS.POLE_TRAILERS.id],
      );
    }).toThrow();
  });

  it('should return false for a STOS configuration missing a trailer', async () => {
    const isValid = policy.isConfigurationValid(
      PERMIT_CODES.SINGLE_TRIP_OVERSIZE,
      COMMODITY_CODES.LAMINATED_BEAMS,
      [POWER_UNITS.TRUCK_TRACTORS.id, TRAILERS.JEEPS.id],
    );
    expect(isValid).toBe(false);
  });

  it('should return false for a STOW configuration missing a trailer', async () => {
    const isValid = policy.isConfigurationValid(
      PERMIT_CODES.SINGLE_TRIP_OVERWEIGHT,
      COMMODITY_CODES.LAMINATED_BEAMS,
      [POWER_UNITS.TRUCK_TRACTORS.id, TRAILERS.JEEPS.id],
    );
    expect(isValid).toBe(false);
  });

  it('should return true for a partial STOS configuration missing a trailer', async () => {
    const isValid = policy.isConfigurationValid(
      PERMIT_CODES.SINGLE_TRIP_OVERSIZE,
      COMMODITY_CODES.LAMINATED_BEAMS,
      [POWER_UNITS.TRUCK_TRACTORS.id, TRAILERS.JEEPS.id],
      true,
    );
    expect(isValid).toBe(true);
  });

  it('should return true for a partial STOW configuration missing a trailer', async () => {
    const isValid = policy.isConfigurationValid(
      PERMIT_CODES.SINGLE_TRIP_OVERWEIGHT,
      COMMODITY_CODES.LAMINATED_BEAMS,
      [POWER_UNITS.TRUCK_TRACTORS.id, TRAILERS.JEEPS.id],
      true,
    );
    expect(isValid).toBe(true);
  });

  it('should return true for a valid STOW configuration with one additional crane axle', async () => {
    const isValid = policy.isConfigurationValid(
      PERMIT_CODES.SINGLE_TRIP_OVERWEIGHT,
      COMMODITY_CODES.NONE,
      [
        POWER_UNITS.CRANES_ALL_TERRAIN.id,
        TRAILERS.ADDITIONAL_AXLE_UNIT_ALL_TERRAIN_CRANE.id,
        TRAILERS.NONE.id,
      ],
    );
    expect(isValid).toBe(true);
  });

  it('should return true for a valid STOW configuration with multiple additional crane axles', async () => {
    const isValid = policy.isConfigurationValid(
      PERMIT_CODES.SINGLE_TRIP_OVERWEIGHT,
      COMMODITY_CODES.NONE,
      [
        POWER_UNITS.CRANES_ALL_TERRAIN.id,
        TRAILERS.ADDITIONAL_AXLE_UNIT_ALL_TERRAIN_CRANE.id,
        TRAILERS.ADDITIONAL_AXLE_UNIT_ALL_TERRAIN_CRANE.id,
        TRAILERS.ADDITIONAL_AXLE_UNIT_ALL_TERRAIN_CRANE.id,
        TRAILERS.NONE.id,
      ],
    );
    expect(isValid).toBe(true);
  });

  it('should return true for a valid STOW configuration with additional crane axle and trailer', async () => {
    const isValid = policy.isConfigurationValid(
      PERMIT_CODES.SINGLE_TRIP_OVERWEIGHT,
      COMMODITY_CODES.NONE,
      [
        POWER_UNITS.CRANES_ALL_TERRAIN.id,
        TRAILERS.ADDITIONAL_AXLE_UNIT_ALL_TERRAIN_CRANE.id,
        TRAILERS.DOLLIES.id,
      ],
    );
    expect(isValid).toBe(true);
  });

  it('should return false for a STOW configuration with additional axle out of order', async () => {
    const isValid = policy.isConfigurationValid(
      PERMIT_CODES.SINGLE_TRIP_OVERWEIGHT,
      COMMODITY_CODES.NONE,
      [
        POWER_UNITS.CRANES_ALL_TERRAIN.id,
        TRAILERS.NONE.id,
        TRAILERS.ADDITIONAL_AXLE_UNIT_ALL_TERRAIN_CRANE.id,
      ],
    );
    expect(isValid).toBe(false);
  });

  it('should return true for a valid STOW simple configuration with additional platform trailer axle', async () => {
    const isValid = policy.isConfigurationValid(
      PERMIT_CODES.SINGLE_TRIP_OVERWEIGHT,
      COMMODITY_CODES.NON_REDUCIBLE_LOADS,
      [
        POWER_UNITS.TRUCK_TRACTORS.id,
        TRAILERS.PLATFORM_TRAILERS.id,
        TRAILERS.ADDITIONAL_AXLE_UNIT_PLATFORM_TRAILER.id,
      ],
    );
    expect(isValid).toBe(true);
  });

  it('should return true for a valid STOW simple configuration with multiple additional platform trailer axles', async () => {
    const isValid = policy.isConfigurationValid(
      PERMIT_CODES.SINGLE_TRIP_OVERWEIGHT,
      COMMODITY_CODES.NON_REDUCIBLE_LOADS,
      [
        POWER_UNITS.TRUCK_TRACTORS.id,
        TRAILERS.PLATFORM_TRAILERS.id,
        TRAILERS.ADDITIONAL_AXLE_UNIT_PLATFORM_TRAILER.id,
        TRAILERS.ADDITIONAL_AXLE_UNIT_PLATFORM_TRAILER.id,
        TRAILERS.ADDITIONAL_AXLE_UNIT_PLATFORM_TRAILER.id,
      ],
    );
    expect(isValid).toBe(true);
  });

  it('should return true for a valid STOW complex configuration with multiple additional platform trailer axles', async () => {
    const isValid = policy.isConfigurationValid(
      PERMIT_CODES.SINGLE_TRIP_OVERWEIGHT,
      COMMODITY_CODES.NON_REDUCIBLE_LOADS,
      [
        POWER_UNITS.TRUCK_TRACTORS.id,
        TRAILERS.JEEPS.id,
        TRAILERS.JEEPS.id,
        TRAILERS.JEEPS.id,
        TRAILERS.PLATFORM_TRAILERS_WHEELERS.id,
        TRAILERS.ADDITIONAL_AXLE_UNIT_PLATFORM_TRAILER.id,
        TRAILERS.ADDITIONAL_AXLE_UNIT_PLATFORM_TRAILER.id,
        TRAILERS.ADDITIONAL_AXLE_UNIT_PLATFORM_TRAILER.id,
        TRAILERS.BOOSTER.id,
        TRAILERS.BOOSTER.id,
      ],
    );
    expect(isValid).toBe(true);
  });

  it('should throw an error for a permit type not requiring commodity', async () => {
    expect(() => {
      policy.isConfigurationValid(
        PERMIT_CODES.TERM_OVERSIZE,
        COMMODITY_CODES.LAMINATED_BEAMS,
        [POWER_UNITS.TRUCK_TRACTORS.id],
      );
    }).toThrow();
  });

  it('should return all standard tire sizes', async () => {
    const tireSizes = policy.getStandardTireSizes();
    expect(tireSizes).toHaveLength(26);
  });

  it('should return all standard tire sizes', async () => {
    const policyAlt: Policy = new Policy(currentPolicyConfig);
    delete policyAlt.policyDefinition.standardTireSizes;

    const tireSizes = policyAlt.getStandardTireSizes();
    expect(tireSizes).toBeTruthy();
    expect(tireSizes).toHaveLength(0);
  });

  it('should allow axle units to be added for allowed power units', async () => {
    const canAddAxleUnits1 = policy.canAddAxleUnitsToPowerUnit(
      PERMIT_CODES.SINGLE_TRIP_OVERWEIGHT,
      COMMODITY_CODES.NONE,
      POWER_UNITS.CONCRETE_PUMPER_TRUCKS.id,
    );
    const canAddAxleUnits2 = policy.canAddAxleUnitsToPowerUnit(
      PERMIT_CODES.SINGLE_TRIP_OVERWEIGHT,
      COMMODITY_CODES.NONE,
      POWER_UNITS.CRANES_ALL_TERRAIN.id,
    );

    expect(canAddAxleUnits1).toBe(true);
    expect(canAddAxleUnits2).toBe(true);
  });

  it('should not allow axle units to be added for non-allowable power units', async () => {
    const canAddAxleUnits1 = policy.canAddAxleUnitsToPowerUnit(
      PERMIT_CODES.SINGLE_TRIP_OVERWEIGHT,
      COMMODITY_CODES.NONE,
      POWER_UNITS.CRANES_MOBILE.id,
    );
    const canAddAxleUnits2 = policy.canAddAxleUnitsToPowerUnit(
      PERMIT_CODES.SINGLE_TRIP_OVERWEIGHT,
      COMMODITY_CODES.NONE,
      POWER_UNITS.TRUCK_TRACTORS.id,
    );

    expect(canAddAxleUnits1).toBe(false);
    expect(canAddAxleUnits2).toBe(false);
  });

  it('should allow axle units to be added for allowed trailers', async () => {
    const canAddAxleUnits1 = policy.canAddAxleUnitsToTrailer(
      PERMIT_CODES.SINGLE_TRIP_OVERWEIGHT,
      COMMODITY_CODES.NONE,
      POWER_UNITS.CRANES_MOBILE.id,
      TRAILERS.DOLLIES.id,
    );
    const canAddAxleUnits2 = policy.canAddAxleUnitsToTrailer(
      PERMIT_CODES.SINGLE_TRIP_OVERWEIGHT,
      COMMODITY_CODES.NONE,
      POWER_UNITS.PICKER_TRUCK_TRACTORS.id,
      TRAILERS.PLATFORM_TRAILERS_WHEELERS.id,
    );

    expect(canAddAxleUnits1).toBe(true);
    expect(canAddAxleUnits2).toBe(true);
  });

  it('should not allow axle units to be added for non-allowable trailers', async () => {
    const canAddAxleUnits1 = policy.canAddAxleUnitsToTrailer(
      PERMIT_CODES.SINGLE_TRIP_OVERWEIGHT,
      COMMODITY_CODES.EMPTY,
      POWER_UNITS.PICKER_TRUCK_TRACTORS.id,
      TRAILERS.SEMI_TRAILERS.id,
    );
    const canAddAxleUnits2 = policy.canAddAxleUnitsToTrailer(
      PERMIT_CODES.SINGLE_TRIP_OVERWEIGHT,
      COMMODITY_CODES.NON_REDUCIBLE_LOADS,
      POWER_UNITS.PICKER_TRUCK_TRACTORS.id,
      TRAILERS.SEMI_TRAILERS.id,
    );

    expect(canAddAxleUnits1).toBe(false);
    expect(canAddAxleUnits2).toBe(false);
  });
});
