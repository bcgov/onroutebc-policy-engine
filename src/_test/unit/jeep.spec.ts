import { COMMODITY_CODES } from '../../constants/commodity-codes';
import { PERMIT_CODES } from '../../constants/permit-codes';
import { POWER_UNITS } from '../../constants/power-units';
import { TRAILERS } from '../../constants/trailers';
import { Policy } from '../../policy-engine';
import currentPolicyConfig from '../policy-config/_current-config.json';

describe('Policy Engine Jeep and Booster Configuration Functions', () => {
  const policy: Policy = new Policy(currentPolicyConfig);

  it('should return false instead of throwing when checking whether axle units can be added to a jeep', async () => {
    expect(() => {
      policy.canAddAxleUnitsToTrailer(
        PERMIT_CODES.SINGLE_TRIP_OVERSIZE,
        COMMODITY_CODES.LAMINATED_BEAMS,
        POWER_UNITS.TRUCK_TRACTORS.id,
        TRAILERS.JEEPS.id,
      );
    }).not.toThrow();

    const canAddAxleUnits = policy.canAddAxleUnitsToTrailer(
      PERMIT_CODES.SINGLE_TRIP_OVERSIZE,
      COMMODITY_CODES.LAMINATED_BEAMS,
      POWER_UNITS.TRUCK_TRACTORS.id,
      TRAILERS.JEEPS.id,
    );

    expect(canAddAxleUnits).toBe(false);
  });

  it('should return false instead of throwing when checking whether axle units can be added to a booster', async () => {
    expect(() => {
      policy.canAddAxleUnitsToTrailer(
        PERMIT_CODES.SINGLE_TRIP_OVERSIZE,
        COMMODITY_CODES.LAMINATED_BEAMS,
        POWER_UNITS.TRUCK_TRACTORS.id,
        TRAILERS.BOOSTER.id,
      );
    }).not.toThrow();

    const canAddAxleUnits = policy.canAddAxleUnitsToTrailer(
      PERMIT_CODES.SINGLE_TRIP_OVERSIZE,
      COMMODITY_CODES.LAMINATED_BEAMS,
      POWER_UNITS.TRUCK_TRACTORS.id,
      TRAILERS.BOOSTER.id,
    );

    expect(canAddAxleUnits).toBe(false);
  });
});
