import { Policy } from 'onroute-policy-engine';
import currentConfig from '../policy-config/_current-config.json';
import { version } from '../../version';
import semver from 'semver';

describe('Policy configuration JSON version compatibility tests', () => {
  it('should construct Policy object without any errors', async () => {
    expect(() => new Policy(currentConfig)).not.toThrow();
  });

  it('should throw an error with an invalid semver', async () => {
    const policyConfig = JSON.parse(JSON.stringify(currentConfig));
    policyConfig.minPEVersion = 'a.b.c';
    expect(() => new Policy(policyConfig)).toThrow();
  });

  it('should throw an error if policy config min version ahead of PE version by patch', async () => {
    const policyConfig = JSON.parse(JSON.stringify(currentConfig));
    policyConfig.minPEVersion = semver.inc(version, 'patch');
    expect(() => new Policy(policyConfig)).toThrow();
  });

  it('should throw an error if policy config min version ahead of PE version by minor', async () => {
    const policyConfig = JSON.parse(JSON.stringify(currentConfig));
    policyConfig.minPEVersion = semver.inc(version, 'minor');
    expect(() => new Policy(policyConfig)).toThrow();
  });

  it('should throw an error if policy config min version ahead of PE version by major', async () => {
    const policyConfig = JSON.parse(JSON.stringify(currentConfig));
    policyConfig.minPEVersion = semver.inc(version, 'major');
    expect(() => new Policy(policyConfig)).toThrow();
  });
});