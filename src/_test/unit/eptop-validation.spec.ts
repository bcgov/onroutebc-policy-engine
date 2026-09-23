import { Policy } from 'onroute-policy-engine';

import currentConfig from '../policy-config/_current-config.json';
import validEPTOP from '../permit-app/valid-eptop.json';
import { PermitAppInfo } from '../../enum/permit-app-info';
import {
  convertToTimezone,
  getUtcDatetime,
  TIMEZONE_IDS,
} from '../../helper/date.helper';

describe('Extra-Provincial Temporary Operating Permit (EPTOP) Validation Tests', () => {
  const policy: Policy = new Policy(currentConfig);

  const getPermit = () => {
    const permit = JSON.parse(JSON.stringify(validEPTOP));

    const today = convertToTimezone(
      getUtcDatetime(),
      TIMEZONE_IDS.PACIFIC,
    );

    permit.permitData.startDate = today
      .format(PermitAppInfo.PermitDateFormat);
    
    permit.permitData.expiryDate = today
      .add(6, "day")
      .format(PermitAppInfo.PermitDateFormat);
    
    return permit;
  };

  it('should validate EPTOP successfully', async () => {
    const permit = getPermit();
    const validationResult = await policy.validate(permit);
    expect(validationResult.violations).toHaveLength(0);
  });

  it('should calculate EPTOP as a flat $25 permit', async () => {
    const permit = getPermit();

    const validationResult = await policy.validate(permit);
    const cost = validationResult.cost.reduce(
      (total, result) => total + (result.cost ?? 0),
      0,
    );
    
    expect(cost).toBe(25);
  });

  it('should return no EPTOP conditions', () => {
    const permit = getPermit();

    const conditions = policy.getConditionsForPermit(permit);
    expect(conditions).toHaveLength(0);
  });

  it('should not have vehicle province as BC', async () => {
    const permit = getPermit();
    permit.permitData.vehicleDetails.provinceCode = "BC";
    permit.permitData.vehicleDetails.countryCode = "CA";

    const validationResult = await policy.validate(permit);
    expect(validationResult.violations).toHaveLength(1);
  });

  it('should have allowable vehicle subtype', async () => {
    const permit = getPermit();
    permit.permitData.vehicleDetails.vehicleType = "powerUnit";
    permit.permitData.vehicleDetails.vehicleSubType = "PUTAXIS";

    const validationResult = await policy.validate(permit);
    expect(validationResult.violations).toHaveLength(0);
  });

  it('should not have invalid vehicle subtype', async () => {
    const permit = getPermit();
    permit.permitData.vehicleDetails.vehicleType = "powerUnit";
    permit.permitData.vehicleDetails.vehicleSubType = "__INVALID";

    const validationResult = await policy.validate(permit);
    expect(validationResult.violations).toHaveLength(1);
  });

  it('should have entry point', async () => {
    const permit = getPermit();
    permit.permitData.permittedRoute.manualRoute.entryPoint = "";

    const validationResult = await policy.validate(permit);
    expect(validationResult.violations).toHaveLength(1);
  });
});
