import { Policy } from 'onroute-policy-engine';
import currentConfig from '../policy-config/_current-config.json';
import validMFP from '../permit-app/valid-mfp.json';
import dayjs from 'dayjs';
import { PermitAppInfo } from '../../enum/permit-app-info';

describe('Motive Fuel User Permit (MFP) Validator', () => {
  const policy: Policy = new Policy(currentConfig);

  it('should validate MFP successfully', async () => {
    const permit = JSON.parse(JSON.stringify(validMFP));
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

  it('should validate MFP successfully with 6 day duration', async () => {
    const permit = JSON.parse(JSON.stringify(validMFP));
    // Set startDate to today
    permit.permitData.startDate = dayjs().format(
      PermitAppInfo.PermitDateFormat.toString(),
    );

    // Set duration to 6
    permit.permitData.permitDuration = 6;

    const validationResult = await policy.validate(permit);
    expect(validationResult.violations).toHaveLength(0);
  });

  it('should validate MFP successfully with 7 day duration', async () => {
    const permit = JSON.parse(JSON.stringify(validMFP));
    // Set startDate to today
    permit.permitData.startDate = dayjs().format(
      PermitAppInfo.PermitDateFormat.toString(),
    );

    // Set duration to 7
    permit.permitData.permitDuration = 7;

    const validationResult = await policy.validate(permit);
    expect(validationResult.violations).toHaveLength(0);
  });

  it('should fail validation for MFP with 8 day duration', async () => {
    const permit = JSON.parse(JSON.stringify(validMFP));
    // Set startDate to today
    permit.permitData.startDate = dayjs().format(
      PermitAppInfo.PermitDateFormat.toString(),
    );

    // Set duration to 8
    permit.permitData.permitDuration = 8;

    const validationResult = await policy.validate(permit);
    expect(validationResult.violations).toHaveLength(1);
  });

  it('should fail validation for MFP with 0 day duration', async () => {
    const permit = JSON.parse(JSON.stringify(validMFP));
    // Set startDate to today
    permit.permitData.startDate = dayjs().format(
      PermitAppInfo.PermitDateFormat.toString(),
    );

    // Set duration to 0
    permit.permitData.permitDuration = 0;

    const validationResult = await policy.validate(permit);
    expect(validationResult.violations).toHaveLength(1);
  });

  it('should fail validation for MFP with licensed GVW greater than 63,500', async () => {
    const permit = JSON.parse(JSON.stringify(validMFP));
    // Set startDate to today
    permit.permitData.startDate = dayjs().format(
      PermitAppInfo.PermitDateFormat.toString(),
    );

    // Set licensedGVW to 63501
    permit.permitData.vehicleDetails.licensedGVW = 63501;

    const validationResult = await policy.validate(permit);
    expect(validationResult.violations).toHaveLength(1);
  });

  it('should fail validation for MFP with licensed GVW of zero', async () => {
    const permit = JSON.parse(JSON.stringify(validMFP));
    // Set startDate to today
    permit.permitData.startDate = dayjs().format(
      PermitAppInfo.PermitDateFormat.toString(),
    );

    // Set licensedGVW to 0
    permit.permitData.vehicleDetails.licensedGVW = 0;

    const validationResult = await policy.validate(permit);
    expect(validationResult.violations).toHaveLength(1);
  });

  it('should fail validation for MFP with negative licensed GVW', async () => {
    const permit = JSON.parse(JSON.stringify(validMFP));
    // Set startDate to today
    permit.permitData.startDate = dayjs().format(
      PermitAppInfo.PermitDateFormat.toString(),
    );

    // Set licensedGVW to -1000
    permit.permitData.vehicleDetails.licensedGVW = -1000;

    const validationResult = await policy.validate(permit);
    expect(validationResult.violations).toHaveLength(1);
  });

  it('should pass validation for MFP with licensed GVW exactly 63,500', async () => {
    const permit = JSON.parse(JSON.stringify(validMFP));
    // Set startDate to today
    permit.permitData.startDate = dayjs().format(
      PermitAppInfo.PermitDateFormat.toString(),
    );

    // Set licensedGVW to 63500
    permit.permitData.vehicleDetails.licensedGVW = 63500;

    const validationResult = await policy.validate(permit);
    expect(validationResult.violations).toHaveLength(0);
  });

  it('should pass validation for MFP with licensed GVW 1 kg', async () => {
    const permit = JSON.parse(JSON.stringify(validMFP));
    // Set startDate to today
    permit.permitData.startDate = dayjs().format(
      PermitAppInfo.PermitDateFormat.toString(),
    );

    // Set licensedGVW to 1
    permit.permitData.vehicleDetails.licensedGVW = 1;

    const validationResult = await policy.validate(permit);
    expect(validationResult.violations).toHaveLength(0);
  });

  it('should fail validation for MFP with no origin address', async () => {
    const permit = JSON.parse(JSON.stringify(validMFP));
    // Set startDate to today
    permit.permitData.startDate = dayjs().format(
      PermitAppInfo.PermitDateFormat.toString(),
    );

    // Clear origin
    permit.permitData.permittedRoute.manualRoute.origin = '';

    const validationResult = await policy.validate(permit);
    expect(validationResult.violations).toHaveLength(1);
  });

  it('should fail validation for MFP with no destination address', async () => {
    const permit = JSON.parse(JSON.stringify(validMFP));
    // Set startDate to today
    permit.permitData.startDate = dayjs().format(
      PermitAppInfo.PermitDateFormat.toString(),
    );

    // Clear destination
    permit.permitData.permittedRoute.manualRoute.destination = '';

    const validationResult = await policy.validate(permit);
    expect(validationResult.violations).toHaveLength(1);
  });

  it('should calculate MFP cost correctly over minimum value', async () => {
    const permit = JSON.parse(JSON.stringify(validMFP));
    // Set startDate to today
    permit.permitData.startDate = dayjs().format(
      PermitAppInfo.PermitDateFormat.toString(),
    );
    // Set distance to 200
    permit.permitData.permittedRoute.manualRoute.totalDistance = 200;

    const validationResult = await policy.validate(permit);
    expect(validationResult.cost).not.toHaveLength(0);
    const initialValue: number = 0;
    const cost = validationResult.cost.reduce(
      (prev: any, curr: any) => prev + curr.cost,
      initialValue,
    );
    expect(cost).toBe(14);
  });

  it('should calculate MFP cost correctly under minimum value', async () => {
    const permit = JSON.parse(JSON.stringify(validMFP));
    // Set startDate to today
    permit.permitData.startDate = dayjs().format(
      PermitAppInfo.PermitDateFormat.toString(),
    );
    // Set distance to 180
    permit.permitData.permittedRoute.manualRoute.totalDistance = 100;

    const validationResult = await policy.validate(permit);
    expect(validationResult.cost).not.toHaveLength(0);
    const initialValue: number = 0;
    const cost = validationResult.cost.reduce(
      (prev: any, curr: any) => prev + curr.cost,
      initialValue,
    );
    expect(cost).toBe(10);
  });

  it('should calculate MFP cost correctly over maximum value', async () => {
    const permit = JSON.parse(JSON.stringify(validMFP));
    // Set startDate to today
    permit.permitData.startDate = dayjs().format(
      PermitAppInfo.PermitDateFormat.toString(),
    );
    // Set distance to 2500
    permit.permitData.permittedRoute.manualRoute.totalDistance = 2500;

    const validationResult = await policy.validate(permit);
    expect(validationResult.cost).not.toHaveLength(0);
    const initialValue: number = 0;
    const cost = validationResult.cost.reduce(
      (prev: any, curr: any) => prev + curr.cost,
      initialValue,
    );
    expect(cost).toBe(140);
  });
});
