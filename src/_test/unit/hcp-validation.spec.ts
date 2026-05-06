import { Policy } from 'onroute-policy-engine';
import currentConfig from '../policy-config/_current-config.json';
import validHcp from '../permit-app/valid-hcp.json';
import dayjs from 'dayjs';
import { PermitAppInfo } from '../../enum/permit-app-info';

describe('Highway Crossing Permit (HCP) Validation Tests', () => {
  const policy: Policy = new Policy(currentConfig);

  const getPermit = () => {
    const permit = JSON.parse(JSON.stringify(validHcp));
    permit.permitData.startDate = dayjs().format(
      PermitAppInfo.PermitDateFormat.toString(),
    );
    return permit;
  };

  it('should validate HCP successfully', async () => {
    const permit = getPermit();

    const validationResult = await policy.validate(permit);
    expect(validationResult.violations).toHaveLength(0);
  });

  it('should calculate HCP as a flat $30 permit', async () => {
    const permit = getPermit();

    const validationResult = await policy.validate(permit);
    const cost = validationResult.cost.reduce(
      (total, result) => total + (result.cost ?? 0),
      0,
    );
    expect(cost).toBe(30);
  });

  it('should return only mandatory CVSE-1070 for HCP conditions', () => {
    const permit = getPermit();

    const conditions = policy.getConditionsForPermit(permit);
    expect(conditions).toHaveLength(1);
    expect(conditions[0].condition).toBe('CVSE-1070');
    expect(conditions[0].mandatory).toBe(true);
  });

  it('should leave HCP start-date windows to the consuming application', async () => {
    const permit = getPermit();
    permit.permitData.startDate = dayjs()
      .subtract(90, 'day')
      .format(PermitAppInfo.PermitDateFormat.toString());

    const pastValidationResult = await policy.validate(permit);
    expect(pastValidationResult.violations).toHaveLength(0);

    permit.permitData.startDate = dayjs()
      .add(120, 'day')
      .format(PermitAppInfo.PermitDateFormat.toString());

    const futureValidationResult = await policy.validate(permit);
    expect(futureValidationResult.violations).toHaveLength(0);
  });
});
