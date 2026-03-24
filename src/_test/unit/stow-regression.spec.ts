import { Policy } from '../../policy-engine';
import currentPolicyConfig from '../policy-config/_current-config.json';
import expectedSurface from '../policy-config/stow-regression.expected.json';
import specialAuthLcv from '../policy-config/special-auth-lcv.sample.json';

interface StowRegressionSurface {
  commodities: string[];
  powerUnits: Record<string, string[]>;
  trailers: Record<string, string[]>;
  nextVehicles: Record<string, string[]>;
}

describe('STOW regression surface', () => {
  const policy = new Policy(currentPolicyConfig);
  // The audit tools compare against an LCV-authorized policy instance so XLS LCV rows
  // are not reported as missing, but the default engine behavior should still hide them.
  const lcvPolicy = new Policy(currentPolicyConfig, specialAuthLcv);

  it('should match the canonical STOW API surface', () => {
    expect(collectStowSurface(policy)).toEqual(expectedSurface);
  });

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

  it('should expose the conveyor booster cases after trailer selection', () => {
    expect(
      Array.from(
        policy.getNextPermittableVehicles('STOW', 'FIXEDEQ', [
          'TRKTRAC',
          'FECVYRX',
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
    ).toContain('BOOSTER');
  });

  it('should hide LCV power units by default and expose them with LCV auth', () => {
    expect(
      Array.from(policy.getPermittablePowerUnitTypes('STOW', 'XXXXXXX').keys()),
    ).not.toEqual(expect.arrayContaining(['LCVRMDB', 'LCVTPDB']));

    expect(
      Array.from(lcvPolicy.getPermittablePowerUnitTypes('STOW', 'XXXXXXX').keys()),
    ).toEqual(expect.arrayContaining(['LCVRMDB', 'LCVTPDB']));
  });

  it('should require LCV auth before STOW LCV trailers and boosters become selectable', () => {
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
    ).toContain('BOOSTER');
  });
});

function collectStowSurface(policy: Policy): StowRegressionSurface {
  const commodities = Array.from(policy.getCommodities('STOW').keys()).sort();
  const surface: StowRegressionSurface = {
    commodities,
    powerUnits: {},
    trailers: {},
    nextVehicles: {},
  };

  for (const commodityId of commodities) {
    const powerUnits = Array.from(
      policy.getPermittablePowerUnitTypes('STOW', commodityId).keys(),
    ).sort();
    surface.powerUnits[commodityId] = powerUnits;

    for (const powerUnitId of powerUnits) {
      const trailers = Array.from(
        policy.getNextPermittableVehicles('STOW', commodityId, [powerUnitId]).keys(),
      ).sort();
      surface.trailers[`${commodityId}:${powerUnitId}`] = trailers;

      for (const trailerId of trailers) {
        const nextVehicles = Array.from(
          policy
            .getNextPermittableVehicles('STOW', commodityId, [powerUnitId, trailerId])
            .keys(),
        ).sort();

        if (nextVehicles.length > 0) {
          surface.nextVehicles[`${commodityId}:${powerUnitId}:${trailerId}`] = nextVehicles;
        }
      }
    }
  }

  return surface;
}
