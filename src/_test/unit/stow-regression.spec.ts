import { Policy } from '../../policy-engine';
import currentPolicyConfig from '../policy-config/_current-config.json';
import expectedSurface from '../policy-config/stow-regression.expected.json';

interface StowRegressionSurface {
  commodities: string[];
  powerUnits: Record<string, string[]>;
  trailers: Record<string, string[]>;
  nextVehicles: Record<string, string[]>;
}

describe('STOW regression surface', () => {
  const policy = new Policy(currentPolicyConfig);

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
