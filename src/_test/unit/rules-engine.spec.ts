import { Policy } from 'onroute-policy-engine';
import { addRuntimeFacts } from '../../helper/facts.helper';
import minimalPolicyConfig from '../policy-config/mimimal.sample.json';

describe('Policy Engine Rules Engine', () => {
  it('should retrieve a fact added to a policy rules engine', async () => {
    const policy = new Policy(minimalPolicyConfig);
    const rulesEngine = policy.rulesEngines.get('TROS');

    expect(rulesEngine).toBeDefined();

    rulesEngine!.addFact('test', 100);

    const { almanac } = await rulesEngine!.run();

    await expect(almanac.factValue('test')).resolves.toBe(100);
  });

  it('should retrieve a function fact added by the runtime facts helper', async () => {
    const policy = new Policy(minimalPolicyConfig);
    const rulesEngine = policy.rulesEngines.get('TROS');

    expect(rulesEngine).toBeDefined();

    addRuntimeFacts(rulesEngine!, policy);

    const { almanac } = await rulesEngine!.run();

    await expect(almanac.factValue('testFunction')).resolves.toBe(200);
  });
});
