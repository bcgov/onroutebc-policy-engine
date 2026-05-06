import { Policy } from '../../policy-engine';
import currentPolicyConfig from '../policy-config/_current-config.json';

describe('Policy Engine Jeep and Booster Configuration Functions', () => {
  const policy: Policy = new Policy(currentPolicyConfig);

  it('should return false instead of throwing when checking whether axle units can be added to a jeep', async () => {
    expect(() => {
      policy.canAddAxleUnitsToTrailer('STOS', 'LAMBEAM', 'TRKTRAC', 'JEEPSRG');
    }).not.toThrow();

    const canAddAxleUnits = policy.canAddAxleUnitsToTrailer(
      'STOS',
      'LAMBEAM',
      'TRKTRAC',
      'JEEPSRG',
    );

    expect(canAddAxleUnits).toBe(false);
  });

  it('should return false instead of throwing when checking whether axle units can be added to a booster', async () => {
    expect(() => {
      policy.canAddAxleUnitsToTrailer('STOS', 'LAMBEAM', 'TRKTRAC', 'BOOSTER');
    }).not.toThrow();

    const canAddAxleUnits = policy.canAddAxleUnitsToTrailer(
      'STOS',
      'LAMBEAM',
      'TRKTRAC',
      'BOOSTER',
    );

    expect(canAddAxleUnits).toBe(false);
  });
});
