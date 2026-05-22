import { Policy } from 'onroute-policy-engine';
import dayjs from 'dayjs';

import currentConfig from '../policy-config/_current-config.json';
import validHc from '../permit-app/valid-hcp.json';
import { PermitAppInfo } from '../../enum/permit-app-info';

describe('Highway Crossing Permit (HC) Validation Tests', () => {
  const policy: Policy = new Policy(currentConfig);

  const getPermit = () => {
    const permit = JSON.parse(JSON.stringify(validHc));

    const today = dayjs();
    permit.permitData.startDate = today
      .format(PermitAppInfo.PermitDateFormat);
    
    permit.permitData.expiryDate = today
      .endOf("year")
      .format(PermitAppInfo.PermitDateFormat);
    
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

  it('should not have vehicle description when vehicle type is not Other', async () => {
    const permit = getPermit();
    permit.permitData.vehicleDetails.vehicleType = "powerUnit";
    permit.permitData.vehicleDetails.vehicleSubType = "TRKTRAC";
    permit.permitData.vehicleDetails.vehicleDescription = "Some Description";

    const validationResult = await policy.validate(permit);
    expect(validationResult.violations).toHaveLength(1);
  });

  it('should have vehicle description when vehicle type is Other', async () => {
    const permit = getPermit();
    permit.permitData.vehicleDetails.vehicleType = "other";
    permit.permitData.vehicleDetails.vehicleSubType = "";
    permit.permitData.vehicleDetails.vehicleDescription = "";

    const validationResult = await policy.validate(permit);
    expect(validationResult.violations).toHaveLength(1);
  });

  it('should not have certificate number when ICBC insurance certificate is not used', async () => {
    const permit = getPermit();
    permit.permitData.icbcInsuranceCertificate.haveCertificate = false;
    permit.permitData.icbcInsuranceCertificate.certificateNumber = "D654321";

    const validationResult = await policy.validate(permit);
    expect(validationResult.violations).toHaveLength(1);
  });

  it('should not have different certificate number when compared to vehicle plate', async () => {
    const permit = getPermit();
    permit.permitData.icbcInsuranceCertificate.haveCertificate = true;
    permit.permitData.icbcInsuranceCertificate.certificateNumber = "D654321";
    permit.permitData.vehicleDetails.plate = "D65432";

    const validationResult = await policy.validate(permit);
    expect(validationResult.violations).toHaveLength(1);
  });

  it('should not have vehicle subtype if vehicle type is Other', async () => {
    const permit = getPermit();
    permit.permitData.vehicleDetails.vehicleType = "other";
    permit.permitData.vehicleDetails.vehicleSubType = "TRKTRAC";
    permit.permitData.vehicleDetails.vehicleDescription = "Some Description";

    const validationResult = await policy.validate(permit);
    expect(validationResult.violations).toHaveLength(1);
  });

  it('should have allowable vehicle subtype if vehicle type is not Other', async () => {
    const permit = getPermit();
    permit.permitData.vehicleDetails.vehicleType = "powerUnit";
    permit.permitData.vehicleDetails.vehicleSubType = "TRKTRAC";
    permit.permitData.vehicleDetails.vehicleDescription = "";

    const validationResult = await policy.validate(permit);
    expect(validationResult.violations).toHaveLength(0);
  });

  it('should not have invalid vehicle subtype if vehicle type is not Other', async () => {
    const permit = getPermit();
    permit.permitData.vehicleDetails.vehicleType = "powerUnit";
    permit.permitData.vehicleDetails.vehicleSubType = "__INVALID";
    permit.permitData.vehicleDetails.vehicleDescription = "";

    const validationResult = await policy.validate(permit);
    expect(validationResult.violations).toHaveLength(1);
  });
});
