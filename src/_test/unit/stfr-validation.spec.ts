import { Policy } from 'onroute-policy-engine';
import { completePolicyConfig } from '../policy-config/complete-in-progress.sample';
import { validStfr30Day } from '../permit-app/valid-stfr-30day';
import dayjs from 'dayjs';
import { PermitAppInfo } from '../../enum/permit-app-info';

describe('Single Trip ICBC (FR) Validator', () => {
  const policy: Policy = new Policy(completePolicyConfig);

  it('should validate STFR successfully', async () => {
    const permit = JSON.parse(JSON.stringify(validStfr30Day));
    // Set startDate to today
    // Note: we do not need to set the expiry date as well because
    // the validation only uses permitDuration, not expiryDate for this
    // permit type.
    permit.permitData.startDate = dayjs().format(
      PermitAppInfo.PermitDateFormat.toString(),
    );

    const validationResult = await policy.validate(permit);
    expect(validationResult.violations).toHaveLength(0);
  });

  it('should validate STFR successfully with 29 day duration', async () => {
    const permit = JSON.parse(JSON.stringify(validStfr30Day));
    // Set startDate to today
    permit.permitData.startDate = dayjs().format(
      PermitAppInfo.PermitDateFormat.toString(),
    );

    // Set duration to 29
    permit.permitData.permitDuration = 29;

    const validationResult = await policy.validate(permit);
    expect(validationResult.violations).toHaveLength(0);
  });

  it('should validate STFR successfully with 30 day duration', async () => {
    const permit = JSON.parse(JSON.stringify(validStfr30Day));
    // Set startDate to today
    permit.permitData.startDate = dayjs().format(
      PermitAppInfo.PermitDateFormat.toString(),
    );

    // Set duration to 30
    permit.permitData.permitDuration = 30;

    const validationResult = await policy.validate(permit);
    expect(validationResult.violations).toHaveLength(0);
  });

  it('should fail validation for STFR with 31 day duration', async () => {
    const permit = JSON.parse(JSON.stringify(validStfr30Day));
    // Set startDate to today
    permit.permitData.startDate = dayjs().format(
      PermitAppInfo.PermitDateFormat.toString(),
    );

    // Set duration to 31
    permit.permitData.permitDuration = 31;

    const validationResult = await policy.validate(permit);
    expect(validationResult.violations).toHaveLength(1);
  });

  it('should fail validation for STFR with 0 day duration', async () => {
    const permit = JSON.parse(JSON.stringify(validStfr30Day));
    // Set startDate to today
    permit.permitData.startDate = dayjs().format(
      PermitAppInfo.PermitDateFormat.toString(),
    );

    // Set duration to 0
    permit.permitData.permitDuration = 0;

    const validationResult = await policy.validate(permit);
    expect(validationResult.violations).toHaveLength(1);
  });

  it('should fail validation for STFR with licensed GVW greater than 63,500', async () => {
    const permit = JSON.parse(JSON.stringify(validStfr30Day));
    // Set startDate to today
    permit.permitData.startDate = dayjs().format(
      PermitAppInfo.PermitDateFormat.toString(),
    );

    // Set licensedGVW to 63501
    permit.permitData.vehicleDetails.licensedGVW = 63501;

    const validationResult = await policy.validate(permit);
    expect(validationResult.violations).toHaveLength(1);
  });

  it('should fail validation for STFR with licensed GVW of zero', async () => {
    const permit = JSON.parse(JSON.stringify(validStfr30Day));
    // Set startDate to today
    permit.permitData.startDate = dayjs().format(
      PermitAppInfo.PermitDateFormat.toString(),
    );

    // Set licensedGVW to 0
    permit.permitData.vehicleDetails.licensedGVW = 0;

    const validationResult = await policy.validate(permit);
    expect(validationResult.violations).toHaveLength(1);
  });

  it('should fail validation for STFR with negative licensed GVW', async () => {
    const permit = JSON.parse(JSON.stringify(validStfr30Day));
    // Set startDate to today
    permit.permitData.startDate = dayjs().format(
      PermitAppInfo.PermitDateFormat.toString(),
    );

    // Set licensedGVW to -1000
    permit.permitData.vehicleDetails.licensedGVW = -1000;

    const validationResult = await policy.validate(permit);
    expect(validationResult.violations).toHaveLength(1);
  });

  it('should pass validation for STFR with licensed GVW exactly 63,500', async () => {
    const permit = JSON.parse(JSON.stringify(validStfr30Day));
    // Set startDate to today
    permit.permitData.startDate = dayjs().format(
      PermitAppInfo.PermitDateFormat.toString(),
    );

    // Set licensedGVW to 63500
    permit.permitData.vehicleDetails.licensedGVW = 63500;

    const validationResult = await policy.validate(permit);
    expect(validationResult.violations).toHaveLength(0);
  });

  it('should pass validation for STFR with licensed GVW 1 kg', async () => {
    const permit = JSON.parse(JSON.stringify(validStfr30Day));
    // Set startDate to today
    permit.permitData.startDate = dayjs().format(
      PermitAppInfo.PermitDateFormat.toString(),
    );

    // Set licensedGVW to 1
    permit.permitData.vehicleDetails.licensedGVW = 1;

    const validationResult = await policy.validate(permit);
    expect(validationResult.violations).toHaveLength(0);
  });

  it('should pass validation for STFR with third party liability GENERAL_GOODS', async () => {
    const permit = JSON.parse(JSON.stringify(validStfr30Day));
    // Set startDate to today
    permit.permitData.startDate = dayjs().format(
      PermitAppInfo.PermitDateFormat.toString(),
    );

    // Set thirdPartyLiability to GENERAL_GOODS
    permit.permitData.thirdPartyLiability = 'GENERAL_GOODS';

    const validationResult = await policy.validate(permit);
    expect(validationResult.violations).toHaveLength(0);
  });

  it('should pass validation for STFR with third party liability DANGEROUS_GOODS', async () => {
    const permit = JSON.parse(JSON.stringify(validStfr30Day));
    // Set startDate to today
    permit.permitData.startDate = dayjs().format(
      PermitAppInfo.PermitDateFormat.toString(),
    );

    // Set thirdPartyLiability to DANGEROUS_GOODS
    permit.permitData.thirdPartyLiability = 'DANGEROUS_GOODS';

    const validationResult = await policy.validate(permit);
    expect(validationResult.violations).toHaveLength(0);
  });

  it('should fail validation for STFR with third party liability dangerous_goods (exact match required)', async () => {
    const permit = JSON.parse(JSON.stringify(validStfr30Day));
    // Set startDate to today
    permit.permitData.startDate = dayjs().format(
      PermitAppInfo.PermitDateFormat.toString(),
    );

    // Set thirdPartyLiability to dangerous_goods
    permit.permitData.thirdPartyLiability = 'dangerous_goods';

    const validationResult = await policy.validate(permit);
    expect(validationResult.violations).toHaveLength(1);
  });

  it('should fail validation for STFR with undefined third party liability', async () => {
    const permit = JSON.parse(JSON.stringify(validStfr30Day));
    // Set startDate to today
    permit.permitData.startDate = dayjs().format(
      PermitAppInfo.PermitDateFormat.toString(),
    );

    // deletee thirdPartyLiability
    delete permit.permitData.thirdPartyLiability;

    const validationResult = await policy.validate(permit);
    expect(validationResult.violations).toHaveLength(1);
  });

  it('should calculate STFR general goods cost correctly', async () => {
    const permit = JSON.parse(JSON.stringify(validStfr30Day));
    // Set startDate to today
    permit.permitData.startDate = dayjs().format(
      PermitAppInfo.PermitDateFormat.toString(),
    );
    // Set thirdPartyLiability to GENERAL_GOODS
    permit.permitData.thirdPartyLiability = 'GENERAL_GOODS';

    const validationResult = await policy.validate(permit);
    expect(validationResult.cost).not.toHaveLength(0);
    const initialValue: number = 0;
    const cost = validationResult.cost.reduce(
      (prev: any, curr: any) => prev + curr.cost,
      initialValue,
    );
    expect(cost).toBe(84);
  });

  it('should calculate STFR dangerous goods cost correctly', async () => {
    const permit = JSON.parse(JSON.stringify(validStfr30Day));
    // Set startDate to today
    permit.permitData.startDate = dayjs().format(
      PermitAppInfo.PermitDateFormat.toString(),
    );
    // Set thirdPartyLiability to DANGEROUS_GOODS
    permit.permitData.thirdPartyLiability = 'DANGEROUS_GOODS';

    const validationResult = await policy.validate(permit);
    expect(validationResult.cost).not.toHaveLength(0);
    const initialValue: number = 0;
    const cost = validationResult.cost.reduce(
      (prev: any, curr: any) => prev + curr.cost,
      initialValue,
    );
    expect(cost).toBe(89);
  });
});
