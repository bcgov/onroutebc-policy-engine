import { Policy } from '../../policy-engine';
import { AxleConfiguration } from '../../types';
import minimalPolicyDef from '../policy-config/mimimal.sample.json';

const threeAxleConfig: Array<AxleConfiguration> = [
  {
    numberOfAxles: 1,
    spacingToNext: 350,
    weight: 6700,
  },
  {
    numberOfAxles: 2,
    spread: 160,
    spacingToNext: 700,
    weight: 12000,
  },
  {
    numberOfAxles: 3,
    spread: 220,
    weight: 22000,
  },
];

describe('Bridge Calculation Results Validation Tests', () => {
  const policy: Policy = new Policy(minimalPolicyDef);

  it('should return three successful axle group results with a valid three axle configuration', async () => {
    const res = policy.calculateBridge(threeAxleConfig);
    // three results
    expect(res.length).toBe(3);
    // all successful
    expect(res.filter((r) => r.success).length).toBe(3);
  });

  it('should return correct values in the bridge calc response', async () => {
    const res = policy.calculateBridge(threeAxleConfig);
    // three results
    expect(res.length).toBe(3);
    const group12 = res.find((r) => r.startAxleUnit == 1 && r.endAxleUnit == 2);
    expect(group12).not.toBeFalsy();
    expect(group12?.actualWeight).toBe(18700);
    expect(group12?.maxBridge).toBe(33300);

    const group13 = res.find((r) => r.startAxleUnit == 1 && r.endAxleUnit == 3);
    expect(group13).not.toBeFalsy();
    expect(group13?.actualWeight).toBe(40700);
    expect(group13?.maxBridge).toBe(60900);

    const group23 = res.find((r) => r.startAxleUnit == 2 && r.endAxleUnit == 3);
    expect(group23).not.toBeFalsy();
    expect(group23?.actualWeight).toBe(34000);
    expect(group23?.maxBridge).toBe(50400);
  });

  it('should return one unsuccessful axle group result with a single axle group failure', async () => {
    const conf = JSON.parse(JSON.stringify(threeAxleConfig));
    conf[1].weight = 22000;
    conf[2].weight = 29000;
    const res = policy.calculateBridge(conf);
    // three results
    expect(res.length).toBe(3);
    // two successful
    expect(res.filter((r) => r.success).length).toBe(2);
    // one unsuccessful
    expect(res.filter((r) => !r.success).length).toBe(1);
  });

  it('should return two unsuccessful axle group results with two axle group failures', async () => {
    const conf = JSON.parse(JSON.stringify(threeAxleConfig));
    conf[1].weight = 26000;
    conf[2].weight = 29000;
    const res = policy.calculateBridge(conf);
    // three results
    expect(res.length).toBe(3);
    // one successful
    expect(res.filter((r) => r.success).length).toBe(1);
    // two unsuccessful
    expect(res.filter((r) => !r.success).length).toBe(2);
  });
});

describe('Bridge Calculation Input Validation Error Tests', () => {
  const policy: Policy = new Policy(minimalPolicyDef);

  it('should throw no errors with valid input', async () => {
    expect(() => policy.calculateBridge(threeAxleConfig)).not.toThrow();
  });

  it('should throw an error with fewer than 2 axle units', async () => {
    expect(() => policy.calculateBridge(threeAxleConfig.slice(2))).toThrow();
  });

  it('should throw an error with a zero-valued number of axles', async () => {
    const conf = JSON.parse(JSON.stringify(threeAxleConfig));
    conf[0].numberOfAxles = 0;
    expect(() => policy.calculateBridge(conf)).toThrow();
  });

  it('should throw an error with a negative-valued number of axles', async () => {
    const conf = JSON.parse(JSON.stringify(threeAxleConfig));
    conf[0].numberOfAxles = -1;
    expect(() => policy.calculateBridge(conf)).toThrow();
  });

  it('should throw an error with a zero-valued weight on first axle group', async () => {
    const conf = JSON.parse(JSON.stringify(threeAxleConfig));
    conf[0].weight = 0;
    expect(() => policy.calculateBridge(conf)).toThrow();
  });

  it('should throw an error with a zero-valued weight on last axle group', async () => {
    const conf = JSON.parse(JSON.stringify(threeAxleConfig));
    conf[2].weight = 0;
    expect(() => policy.calculateBridge(conf)).toThrow();
  });

  it('should throw an error with a negative-valued weight on first axle group', async () => {
    const conf = JSON.parse(JSON.stringify(threeAxleConfig));
    conf[0].weight = -1;
    expect(() => policy.calculateBridge(conf)).toThrow();
  });

  it('should throw an error with a negative-valued weight on last axle group', async () => {
    const conf = JSON.parse(JSON.stringify(threeAxleConfig));
    conf[2].weight = -1;
    expect(() => policy.calculateBridge(conf)).toThrow();
  });

  it('should throw an error with an undefined weight on first axle group', async () => {
    const conf = JSON.parse(JSON.stringify(threeAxleConfig));
    delete conf[0].weight;
    expect(() => policy.calculateBridge(conf)).toThrow();
  });

  it('should throw an error with an undefined weight on last axle group', async () => {
    const conf = JSON.parse(JSON.stringify(threeAxleConfig));
    delete conf[2].weight;
    expect(() => policy.calculateBridge(conf)).toThrow();
  });

  it('should throw an error with a zero-valued spread for a tandem axle unit', async () => {
    const conf = JSON.parse(JSON.stringify(threeAxleConfig));
    conf[1].spread = 0;
    expect(() => policy.calculateBridge(conf)).toThrow();
  });

  it('should throw an error with a negative-valued spread for a tandem axle unit', async () => {
    const conf = JSON.parse(JSON.stringify(threeAxleConfig));
    conf[1].spread = -1;
    expect(() => policy.calculateBridge(conf)).toThrow();
  });

  it('should throw an error with an undefined spread for a tandem axle unit', async () => {
    const conf = JSON.parse(JSON.stringify(threeAxleConfig));
    delete conf[1];
    expect(() => policy.calculateBridge(conf)).toThrow();
  });

  it('should throw an error with a negative-valued spread for a single axle unit', async () => {
    const conf = JSON.parse(JSON.stringify(threeAxleConfig));
    conf[0].spread = -1;
    expect(() => policy.calculateBridge(conf)).toThrow();
  });

  it('should throw an error with a zero-valued spacing for the first axle unit', async () => {
    const conf = JSON.parse(JSON.stringify(threeAxleConfig));
    conf[0].spacingToNext = 0;
    expect(() => policy.calculateBridge(conf)).toThrow();
  });

  it('should throw an error with a negative-valued spacing for the first axle unit', async () => {
    const conf = JSON.parse(JSON.stringify(threeAxleConfig));
    conf[0].spacingToNext = -1;
    expect(() => policy.calculateBridge(conf)).toThrow();
  });

  it('should throw an error with an undefined spacing for the first axle unit', async () => {
    const conf = JSON.parse(JSON.stringify(threeAxleConfig));
    delete conf[0].spacingToNext;
    expect(() => policy.calculateBridge(conf)).toThrow();
  });
});
