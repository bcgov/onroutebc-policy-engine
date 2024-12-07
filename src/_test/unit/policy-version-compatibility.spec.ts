import { Policy } from 'onroute-policy-engine';
import currentConfig from '../policy-config/_current-config.json';
import { version } from '../../version';
import semver from 'semver';

describe('Policy configuration JSON version compatibility tests', () => {
  it('should construct Policy object without any errors with matching versions', async () => {
    const policyConfig = JSON.parse(JSON.stringify(currentConfig));
    policyConfig.minPEVersion = version;
    expect(() => new Policy(policyConfig)).not.toThrow();
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

  it('should throw an error if PE version ahead of policy config min version by major', async () => {
    const policyConfig = JSON.parse(JSON.stringify(currentConfig));
    const peMajorVer = semver.major(version);
    if (peMajorVer > 0) {
      policyConfig.minPEVersion = `${peMajorVer - 1}.${semver.minor(version)}.${semver.patch(version)}`;
      expect(() => new Policy(policyConfig)).toThrow();
    }
  });

  it('should construct without error if PE version ahead of policy config min version by minor', async () => {
    const policyConfig = JSON.parse(JSON.stringify(currentConfig));
    const peMinorVer = semver.minor(version);
    if (peMinorVer > 1) {
      policyConfig.minPEVersion = `${semver.major(version)}.${peMinorVer - 1}.${semver.patch(version)}`;
      expect(() => new Policy(policyConfig)).not.toThrow();
    }
  });
});
