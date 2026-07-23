import { Policy } from '../../policy-engine';
import currentPolicyConfig from '../policy-config/_current-config.json';


// The purpose of this file is to basically add tests for the new PME type, make sure it's there and properly configured.
// Added on July 2026. 

describe('PME power-unit policy configuration foundation', () => {
  const policy = new Policy(currentPolicyConfig);
  const pmeTypes = [
    ['TRUCKPME', 'Truck with PME'],
    ['TRACPME', 'Truck Tractor with PME'],
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
      const pickerTruckTractor = policy.getPowerUnitDefinition('PICKRTT');
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
          policy.getDefaultPowerUnitWeight('PICKRTT', axleConfiguration),
        );
      }
    },
  );

  it.each(['XXXXXXX', 'EMPTYXX', 'NONREDU'])(
    'makes both PME types selectable wherever PICKRTT is selectable for STOW %s',
    (commodityType) => {
      const powerUnits = policy.getPermittablePowerUnitTypes(
        'STOW',
        commodityType,
      );

      expect(powerUnits.keys()).toContain('PICKRTT');
      expect(powerUnits.keys()).toContain('TRUCKPME');
      expect(powerUnits.keys()).toContain('TRACPME');
    },
  );

  it.each(pmeTypes)(
    'accepts STOW / NONREDU / %s with a semi-trailer',
    (vehicleType) => {
      expect(
        policy.isConfigurationValid(
          'STOW',
          'NONREDU',
          [vehicleType, 'SEMITRL'],
          false,
        ),
      ).toBe(true);
    },
  );

  it('clones normalized PICKRTT commodity and trailer eligibility for both PME types', () => {
    for (const commodity of currentPolicyConfig.commodities) {
      const pickerTruckTractor = commodity.powerUnits.find(
        (powerUnit) => powerUnit.type === 'PICKRTT',
      );

      if (!pickerTruckTractor) {
        expect(
          commodity.powerUnits.some(({ type }) =>
            ['TRUCKPME', 'TRACPME'].includes(type),
          ),
        ).toBe(false);
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
    const pickerDefinition = policy.getPowerUnitDefinition('PICKRTT');

    expect(pickerDefinition).toMatchObject({
      id: 'PICKRTT',
      name: 'Picker Truck Tractors',
      category: 'powerunit',
      displayCodePrefix: 'TT',
      displayCodeSteerAxle: 'S',
      displayCodeDriveAxle: 'D',
    });
    expect(
      policy.isConfigurationValid(
        'STOW',
        'NONREDU',
        ['PICKRTT', 'SEMITRL'],
        false,
      ),
    ).toBe(true);

    for (const permitType of currentPolicyConfig.permitTypes) {
      if (!permitType.allowedVehicles?.includes('PICKRTT')) {
        continue;
      }

      expect(permitType.allowedVehicles).toEqual(
        expect.arrayContaining(['TRUCKPME', 'TRACPME']),
      );
    }
  });
});
