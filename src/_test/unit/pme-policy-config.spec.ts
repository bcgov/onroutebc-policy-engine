import { COMMODITY_CODES } from '../../constants/commodity-codes';
import { PERMIT_CODES } from '../../constants/permit-codes';
import { POWER_UNIT_CODES } from '../../constants/power-unit-codes';
import { TRAILER_CODES } from '../../constants/trailer-codes';
import { Policy } from '../../policy-engine';
import currentPolicyConfig from '../policy-config/_current-config.json';

// The purpose of this file is to basically add tests for the new PME type, make sure it's there and properly configured.
// Added on July 2026.

describe('PME power-unit policy configuration foundation', () => {
  const policy = new Policy(currentPolicyConfig);
  const pmeTypes = [
    [POWER_UNIT_CODES.TRUCK_WITH_PME, 'Truck with PME'],
    [POWER_UNIT_CODES.TRUCK_TRACTOR_WITH_PME, 'Truck Tractor with PME'],
  ] as const;

  const normalizePowerUnitEligibility = (powerUnit: {
    type: string;
    trailers: Array<unknown>;
  }) => ({
    ...powerUnit,
    type: 'NORMALIZED',
  });

  it.each(pmeTypes)(
    'defines %s with the expected name and PICKRTT display metadata',
    (vehicleType, expectedName) => {
      const pickerTruckTractor = policy.getPowerUnitDefinition(
        POWER_UNIT_CODES.PICKER_TRUCK_TRACTORS,
      );
      const pmePowerUnit = policy.getPowerUnitDefinition(vehicleType);

      expect(pmePowerUnit).toEqual({
        ...pickerTruckTractor,
        id: vehicleType,
        name: expectedName,
      });
    },
  );

  it.each(pmeTypes)(
    'inherits the same configured dimensions as PICKRTT for %s',
    (vehicleType) => {
      for (const axleConfiguration of [11, 12, 13, 22, 23]) {
        expect(
          policy.getDefaultPowerUnitWeight(vehicleType, axleConfiguration),
        ).toEqual(
          policy.getDefaultPowerUnitWeight(
            POWER_UNIT_CODES.PICKER_TRUCK_TRACTORS,
            axleConfiguration,
          ),
        );
      }
    },
  );

  it.each([
    COMMODITY_CODES.NONE,
    COMMODITY_CODES.EMPTY,
    COMMODITY_CODES.NON_REDUCIBLE_LOADS,
  ])(
    'makes both PME types selectable wherever PICKRTT is selectable for STOW %s',
    (commodityType) => {
      const powerUnits = policy.getPermittablePowerUnitTypes(
        PERMIT_CODES.SINGLE_TRIP_OVERWEIGHT,
        commodityType,
      );

      expect(powerUnits.keys()).toContain(
        POWER_UNIT_CODES.PICKER_TRUCK_TRACTORS,
      );
      expect(powerUnits.keys()).toContain(POWER_UNIT_CODES.TRUCK_WITH_PME);
      expect(powerUnits.keys()).toContain(
        POWER_UNIT_CODES.TRUCK_TRACTOR_WITH_PME,
      );
    },
  );

  it.each(pmeTypes)(
    'accepts STOW / COMMODITY_CODES.NON_REDUCIBLE_LOADS / %s with a semi-trailer',
    (vehicleType) => {
      expect(
        policy.isConfigurationValid(
          PERMIT_CODES.SINGLE_TRIP_OVERWEIGHT,
          COMMODITY_CODES.NON_REDUCIBLE_LOADS,
          [vehicleType, TRAILER_CODES.SEMI_TRAILERS],
          false,
        ),
      ).toBe(true);
    },
  );

  it('clones normalized PICKRTT commodity and trailer eligibility for both PME types', () => {
    for (const commodity of currentPolicyConfig.commodities) {
      const pickerTruckTractor = commodity.powerUnits.find(
        (powerUnit) =>
          powerUnit.type === POWER_UNIT_CODES.PICKER_TRUCK_TRACTORS,
      );

      if (!pickerTruckTractor) {
        const hasPME = commodity.powerUnits.some(
          ({ type }) =>
            type === POWER_UNIT_CODES.TRUCK_WITH_PME ||
            type === POWER_UNIT_CODES.TRUCK_TRACTOR_WITH_PME,
        );
        expect(hasPME).toBe(false);
        continue;
      }

      for (const [vehicleType] of pmeTypes) {
        const pmePowerUnit = commodity.powerUnits.find(
          (powerUnit) => powerUnit.type === vehicleType,
        );
        expect(normalizePowerUnitEligibility(pmePowerUnit!)).toEqual(
          normalizePowerUnitEligibility(pickerTruckTractor),
        );
      }
    }
  });

  it('clones PICKRTT permit allowed-vehicle eligibility without changing PICKRTT', () => {
    const pickerDefinition = policy.getPowerUnitDefinition(
      POWER_UNIT_CODES.PICKER_TRUCK_TRACTORS,
    );

    expect(pickerDefinition).toMatchObject({
      id: POWER_UNIT_CODES.PICKER_TRUCK_TRACTORS,
      name: 'Picker Truck Tractors',
      category: 'powerunit',
      displayCodePrefix: 'TT',
      displayCodeSteerAxle: 'S',
      displayCodeDriveAxle: 'D',
    });
    expect(
      policy.isConfigurationValid(
        PERMIT_CODES.SINGLE_TRIP_OVERWEIGHT,
        COMMODITY_CODES.NON_REDUCIBLE_LOADS,
        [POWER_UNIT_CODES.PICKER_TRUCK_TRACTORS, TRAILER_CODES.SEMI_TRAILERS],
        false,
      ),
    ).toBe(true);

    for (const permitType of currentPolicyConfig.permitTypes) {
      if (
        !permitType.allowedVehicles?.includes(
          POWER_UNIT_CODES.PICKER_TRUCK_TRACTORS,
        )
      ) {
        continue;
      }

      expect(permitType.allowedVehicles).toEqual(
        expect.arrayContaining([
          POWER_UNIT_CODES.TRUCK_WITH_PME,
          POWER_UNIT_CODES.TRUCK_TRACTOR_WITH_PME,
        ]),
      );
    }
  });
});
