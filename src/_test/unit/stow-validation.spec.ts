import { Policy } from 'onroute-policy-engine';
import currentConfig from '../policy-config/_current-config.json';
import testStow from '../permit-app/test-stow.json';
import dayjs from 'dayjs';
import { PermitAppInfo } from '../../enum/permit-app-info';

describe('Single Trip Overweight Policy Configuration Validator', () => {
  const policy: Policy = new Policy(currentConfig);

  const getDatedPermit = () => {
    const permit = JSON.parse(JSON.stringify(testStow));
    permit.permitData.startDate = dayjs().format(
      PermitAppInfo.PermitDateFormat.toString(),
    );
    return permit;
  };

  it('should validate STOW successfully', async () => {
    const permit = getDatedPermit();

    const validationResult = await policy.validate(permit);
    expect(validationResult.violations).toHaveLength(0);
  });

  it('should raise STOW axle calculation violation when an axle unit has zero axles', async () => {
    const permit = getDatedPermit();
    permit.permitData.vehicleConfiguration.axleConfiguration[1].numberOfAxles =
      0;

    const validationResult = await policy.validate(permit);

    expect(validationResult.violations).toHaveLength(1);
    expect(validationResult.violations[0].message).toBe(
      'Vehicle configuration failed axle calculation policy checks',
    );
    expect(validationResult.violations[0].details).toContain(
      'No. of Axles for Axle Unit 2 cannot be 0.',
    );
  });

  it('should raise STOW axle calculation violation when an axle unit exceeds maximum axles', async () => {
    const permit = getDatedPermit();
    permit.permitData.vehicleConfiguration.axleConfiguration[1].numberOfAxles =
      5;

    const validationResult = await policy.validate(permit);

    expect(validationResult.violations).toHaveLength(1);
    expect(validationResult.violations[0].message).toBe(
      'Vehicle configuration failed axle calculation policy checks',
    );
    expect(validationResult.violations[0].details).toContain(
      'No. of Axles for Axle Unit 2 is not permittable.',
    );
  });
});
