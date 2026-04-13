import { Policy } from '../../policy-engine';
import currentPolicyConfig from '../policy-config/_current-config.json';

describe('STOW booster regression surface', () => {
  const policy = new Policy(currentPolicyConfig);

  it('should keep first-sheet booster-capable trailers selectable after trailer selection', () => {
    expect(
      Array.from(
        policy.getNextPermittableVehicles('STOW', 'XXXXXXX', [
          'TRKTRAC',
          'FEDRMMX',
        ]).keys(),
      ),
    ).toContain('BOOSTER');
  });

  it('should not expose boosters for trailers that are only suggested by the trailer weight sheet', () => {
    expect(
      Array.from(
        policy.getNextPermittableVehicles('STOW', 'XXXXXXX', [
          'TRKTRAC',
          'FECVYRX',
        ]).keys(),
      ),
    ).not.toContain('BOOSTER');

    expect(
      Array.from(
        policy.getNextPermittableVehicles('STOW', 'XXXXXXX', [
          'TRKTRAC',
          'SEMITRL',
        ]).keys(),
      ),
    ).not.toContain('BOOSTER');
  });
});
