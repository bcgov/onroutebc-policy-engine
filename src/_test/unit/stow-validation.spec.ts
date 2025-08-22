import { Policy } from 'onroute-policy-engine';
import currentConfig from '../policy-config/_current-config.json';
import testStow from '../permit-app/test-stow.json';
import dayjs from 'dayjs';
import { PermitAppInfo } from '../../enum/permit-app-info';

describe('Single Trip Overweight Policy Configuration Validator', () => {
  const policy: Policy = new Policy(currentConfig);

  it('should validate STOW successfully', async () => {
    const permit = JSON.parse(JSON.stringify(testStow));
    // Set startDate to today
    permit.permitData.startDate = dayjs().format(
      PermitAppInfo.PermitDateFormat.toString(),
    );

    const validationResult = await policy.validate(permit);
    expect(validationResult.violations).toHaveLength(0);
  });
});
