import { COMMODITY_CODES } from '../../constants/commodity-codes';
import { PERMIT_CODES } from '../../constants/permit-codes';
import { TRAILER_CODES } from '../../constants/trailer-codes';
import { Policy } from '../../policy-engine';
import { PolicyCheckId, PolicyCheckResultType } from '../../enum/policy-check';
import currentPolicyConfig from '../policy-config/_current-config.json';
import { POWER_UNITS } from '../../constants/power-units';

// The purpose of this file is to basically add tests for the new PME type, make sure it's there and properly configured.
// Added on July 2026.

describe('PME power-unit policy configuration foundation', () => {
  const policy = new Policy(currentPolicyConfig);
  const pmeTypes = [
    [POWER_UNITS.TRUCK_WITH_PME.id, 'Truck with PME'],
    [POWER_UNITS.TRUCK_TRACTOR_WITH_PME.id, 'Truck Tractor with PME'],
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
        POWER_UNITS.PICKER_TRUCK_TRACTORS.id,
      );
      const pmePowerUnit = policy.getPowerUnitDefinition(vehicleType);

      // Display metadata is shared; subtype weight limits need not be identical.
      expect(pmePowerUnit).toMatchObject({
        id: vehicleType,
        name: expectedName,
        category: pickerTruckTractor!.category,
        displayCodePrefix: pickerTruckTractor!.displayCodePrefix,
        displayCodeSteerAxle: pickerTruckTractor!.displayCodeSteerAxle,
        displayCodeDriveAxle: pickerTruckTractor!.displayCodeDriveAxle,
      });
    },
  );

  it.each(pmeTypes)(
    'shares PICKRTT dimensions outside the Tandem/Tridem exception for %s',
    (vehicleType) => {
      for (const axleConfiguration of [11, 12, 13, 22]) {
        expect(
          policy.getDefaultPowerUnitWeight(vehicleType, axleConfiguration),
        ).toEqual(
          policy.getDefaultPowerUnitWeight(
            POWER_UNITS.PICKER_TRUCK_TRACTORS.id,
            axleConfiguration,
          ),
        );
      }
    },
  );

  // Over Weight Dimension Set, commodity None, Tandem/Tridem: picker steer permits 17,000; separate PME types 15,200.
  describe.each([
    [POWER_UNITS.PICKER_TRUCK_TRACTORS.id, 17000],
    [POWER_UNITS.TRUCK_TRACTOR_WITH_PME.id, 15200],
    [POWER_UNITS.TRUCK_WITH_PME.id, 15200],
  ] as const)('%s Tandem/Tridem limits', (vehicleType, steerPermittable) => {
    it('preserves legal and drive limits alongside the subtype steer permit limit', () => {
      expect(policy.getDefaultPowerUnitWeight(vehicleType, 23)).toEqual([
        {
          axles: 23,
          saLegal: 15200,
          saPermittable: steerPermittable,
          daLegal: 24000,
          daPermittable: 28000,
        },
      ]);
    });

    it.each([0, 1])(
      'checks the steer permit limit plus %i kg through runAxleCalculation',
      (excess) => {
        const actualWeight = steerPermittable + excess;
        const result = policy
          .runAxleCalculation(
            [vehicleType],
            [
              {
                numberOfAxles: 2,
                axleUnitWeight: actualWeight,
                axleSpread: 100,
                numberOfTires: 4,
                tireSize: 455,
                vehicleIndex: 0,
              },
              {
                numberOfAxles: 3,
                axleUnitWeight: 24000,
                axleSpread: 240,
                interaxleSpacing: 485,
                numberOfTires: 12,
                tireSize: 455,
                vehicleIndex: 0,
              },
            ],
            100000,
            COMMODITY_CODES.NONE,
          )
          .results.find(
            ({ id, startAxleUnit }) =>
              id === PolicyCheckId.PermittableWeight && startAxleUnit === 1,
          );
        expect(result).toMatchObject({
          actualWeight,
          thresholdWeight: steerPermittable,
          result:
            excess === 0
              ? PolicyCheckResultType.Pass
              : PolicyCheckResultType.Fail,
        });
      },
    );
  });

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

      expect(powerUnits.keys()).toContain(POWER_UNITS.PICKER_TRUCK_TRACTORS.id);
      expect(powerUnits.keys()).toContain(POWER_UNITS.TRUCK_WITH_PME.id);
      expect(powerUnits.keys()).toContain(
        POWER_UNITS.TRUCK_TRACTOR_WITH_PME.id,
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
        (powerUnit) => powerUnit.type === POWER_UNITS.PICKER_TRUCK_TRACTORS.id,
      );

      if (!pickerTruckTractor) {
        const hasPME = commodity.powerUnits.some(
          ({ type }) =>
            type === POWER_UNITS.TRUCK_WITH_PME.id ||
            type === POWER_UNITS.TRUCK_TRACTOR_WITH_PME.id,
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
      POWER_UNITS.PICKER_TRUCK_TRACTORS.id,
    );

    expect(pickerDefinition).toMatchObject({
      id: POWER_UNITS.PICKER_TRUCK_TRACTORS.id,
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
        [POWER_UNITS.PICKER_TRUCK_TRACTORS.id, TRAILER_CODES.SEMI_TRAILERS],
        false,
      ),
    ).toBe(true);

    for (const permitType of currentPolicyConfig.permitTypes) {
      if (
        !permitType.allowedVehicles?.includes(
          POWER_UNITS.PICKER_TRUCK_TRACTORS.id,
        )
      ) {
        continue;
      }

      expect(permitType.allowedVehicles).toEqual(
        expect.arrayContaining([
          POWER_UNITS.TRUCK_WITH_PME.id,
          POWER_UNITS.TRUCK_TRACTOR_WITH_PME.id,
        ]),
      );
    }
  });
});
