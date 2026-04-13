import { Policy } from '../../policy-engine';
import generatedPolicyConfig from '../policy-config/_current-config.generated.json';
import specialAuthLcv from '../policy-config/special-auth-lcv.sample.json';

describe('STOW regression surface', () => {
  const policy = new Policy(generatedPolicyConfig);
  // The audit tools compare against an LCV-authorized policy instance so XLS LCV rows
  // are not reported as missing, but the default engine behavior should still hide them.
  const lcvPolicy = new Policy(generatedPolicyConfig, specialAuthLcv);

  it('should expose the newly added direct STOW cases', () => {
    expect(
      Array.from(policy.getPermittablePowerUnitTypes('STOW', 'MFHOMEL').keys()),
    ).toContain('TRKTRAC');
    expect(
      Array.from(
        policy.getNextPermittableVehicles('STOW', 'MFHOMEL', ['TRKTRAC']).keys(),
      ),
    ).toEqual(expect.arrayContaining(['DOLLIES', 'STSDBDK', 'STWHELR']));
    expect(
      Array.from(
        policy.getNextPermittableVehicles('STOW', 'XXXXXXX', ['TRKTRAC']).keys(),
      ),
    ).toContain('SEMITRL');
  });

  it('should only expose booster cases that are backed by direct booster-capable rows', () => {
    expect(
      Array.from(
        policy.getNextPermittableVehicles('STOW', 'FIXEDEQ', [
          'TRKTRAC',
          'FEDRMMX',
        ]).keys(),
      ),
    ).toContain('BOOSTER');
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

  it('should hide LCV power units by default and expose them with LCV auth', () => {
    expect(
      Array.from(policy.getPermittablePowerUnitTypes('STOW', 'XXXXXXX').keys()),
    ).not.toEqual(expect.arrayContaining(['LCVRMDB', 'LCVTPDB']));

    expect(
      Array.from(lcvPolicy.getPermittablePowerUnitTypes('STOW', 'XXXXXXX').keys()),
    ).toEqual(expect.arrayContaining(['LCVRMDB', 'LCVTPDB']));
  });

  it('should require LCV auth before STOW LCV trailers become selectable and should not infer boosters from trailer-weight rows alone', () => {
    expect(
      Array.from(
        policy.getNextPermittableVehicles('STOW', 'XXXXXXX', ['LCVRMDB']).keys(),
      ),
    ).toEqual([]);

    expect(
      Array.from(
        lcvPolicy.getNextPermittableVehicles('STOW', 'XXXXXXX', ['LCVRMDB']).keys(),
      ),
    ).toEqual(expect.arrayContaining(['SEMITRL']));

    expect(
      Array.from(
        lcvPolicy
          .getNextPermittableVehicles('STOW', 'XXXXXXX', ['LCVRMDB', 'SEMITRL'])
          .keys(),
      ),
    ).not.toContain('BOOSTER');
  });
});
