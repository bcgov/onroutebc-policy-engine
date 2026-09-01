import { POWER_UNIT_CODES } from '../../constants/power-unit-codes';
import { TRAILER_CODES } from '../../constants/trailer-codes';
import { Policy } from '../../policy-engine';
import currentPolicyConfig from '../policy-config/_current-config.json';

describe('Policy Engine Jeep and Booster Configuration Functions', () => {
  const policy: Policy = new Policy(currentPolicyConfig);

  it('should return false instead of throwing when checking whether axle units can be added to a jeep', async () => {
    expect(() => {
      policy.canAddAxleUnitsToTrailer(
        'STOS',
        'LAMBEAM',
        POWER_UNIT_CODES.TRUCK_TRACTORS,
        TRAILER_CODES.JEEPS,
      );
    }).not.toThrow();

    const canAddAxleUnits = policy.canAddAxleUnitsToTrailer(
      'STOS',
      'LAMBEAM',
      POWER_UNIT_CODES.TRUCK_TRACTORS,
      TRAILER_CODES.JEEPS,
    );

    expect(canAddAxleUnits).toBe(false);
  });

  it('should return false instead of throwing when checking whether axle units can be added to a booster', async () => {
    expect(() => {
      policy.canAddAxleUnitsToTrailer(
        'STOS',
        'LAMBEAM',
        POWER_UNIT_CODES.TRUCK_TRACTORS,
        TRAILER_CODES.BOOSTER,
      );
    }).not.toThrow();

    const canAddAxleUnits = policy.canAddAxleUnitsToTrailer(
      'STOS',
      'LAMBEAM',
      POWER_UNIT_CODES.TRUCK_TRACTORS,
      TRAILER_CODES.BOOSTER,
    );

    expect(canAddAxleUnits).toBe(false);
  });
});
