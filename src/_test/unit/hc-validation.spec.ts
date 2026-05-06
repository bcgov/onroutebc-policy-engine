import { Policy } from 'onroute-policy-engine';
import currentConfig from '../policy-config/_current-config.json';
import validHc from '../permit-app/valid-hcp.json';
import dayjs from 'dayjs';
import { PermitAppInfo } from '../../enum/permit-app-info';

describe('Highway Crossing Permit (HC) Validation Tests', () => {
  const policy: Policy = new Policy(currentConfig);

  const getPermit = () => {
    const permit = JSON.parse(JSON.stringify(validHc));
    permit.permitData.startDate = dayjs().format(
      PermitAppInfo.PermitDateFormat.toString(),
    );
    return permit;
  };

  it('should validate HC successfully', async () => {
    const permit = getPermit();

    const validationResult = await policy.validate(permit);
    expect(validationResult.violations).toHaveLength(0);
  });

  it('should calculate HC as a flat $30 permit', async () => {
    const permit = getPermit();

    const validationResult = await policy.validate(permit);
    const cost = validationResult.cost.reduce(
      (total, result) => total + (result.cost ?? 0),
      0,
    );
    expect(cost).toBe(30);
  });

  it('should return only mandatory CVSE-1070 for HC conditions', () => {
    const permit = getPermit();

    const conditions = policy.getConditionsForPermit(permit);
    expect(conditions).toHaveLength(1);
    expect(conditions[0].condition).toBe('CVSE-1070');
    expect(conditions[0].mandatory).toBe(true);
  });
});
