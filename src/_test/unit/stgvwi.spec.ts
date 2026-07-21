import { Policy } from 'onroute-policy-engine';
import currentConfig from '../policy-config/_current-config.json';
import validSTGVWI from '../permit-app/valid-stgvwi.json';
import dayjs from 'dayjs';
import { PermitAppInfo } from '../../enum/permit-app-info';

describe('Single Trip GVW Increase (STGVWI) Validator', () => {
  const policy: Policy = new Policy(currentConfig);

  it('should validate STGVWI successfully', async () => {
    const permit = JSON.parse(JSON.stringify(validSTGVWI));

    permit.permitData.startDate = dayjs().format(
      PermitAppInfo.PermitDateFormat.toString(),
    );

    const validationResult = await policy.validate(permit);

    expect(validationResult.violations).toHaveLength(0);
  });

  it('should validate STGVWI successfully with 6 day duration', async () => {
    const permit = JSON.parse(JSON.stringify(validSTGVWI));

    permit.permitData.startDate = dayjs().format(
      PermitAppInfo.PermitDateFormat.toString(),
    );

    permit.permitData.permitDuration = 6;

    const validationResult = await policy.validate(permit);

    expect(validationResult.violations).toHaveLength(0);
  });

  it('should validate STGVWI successfully with 7 day duration', async () => {
    const permit = JSON.parse(JSON.stringify(validSTGVWI));

    permit.permitData.startDate = dayjs().format(
      PermitAppInfo.PermitDateFormat.toString(),
    );

    permit.permitData.permitDuration = 7;

    const validationResult = await policy.validate(permit);

    expect(validationResult.violations).toHaveLength(0);
  });

  it('should fail validation for STGVWI with 8 day duration', async () => {
    const permit = JSON.parse(JSON.stringify(validSTGVWI));

    permit.permitData.startDate = dayjs().format(
      PermitAppInfo.PermitDateFormat.toString(),
    );

    permit.permitData.permitDuration = 8;

    const validationResult = await policy.validate(permit);

    expect(validationResult.violations).toHaveLength(1);
  });

  it('should fail validation for STGVWI with 0 day duration', async () => {
    const permit = JSON.parse(JSON.stringify(validSTGVWI));

    permit.permitData.startDate = dayjs().format(
      PermitAppInfo.PermitDateFormat.toString(),
    );

    permit.permitData.permitDuration = 0;

    const validationResult = await policy.validate(permit);

    expect(validationResult.violations).toHaveLength(1);
  });

  it('should fail validation when Actual GVW is not provided', async () => {
    const permit = JSON.parse(JSON.stringify(validSTGVWI));

    permit.permitData.startDate = dayjs().format(
      PermitAppInfo.PermitDateFormat.toString(),
    );

    permit.permitData.vehicleConfiguration.actualGVW = null;

    const validationResult = await policy.validate(permit);

    expect(validationResult.violations).toHaveLength(1);
  });

  it('should fail validation when Actual GVW is equal to Licensed GVW', async () => {
    const permit = JSON.parse(JSON.stringify(validSTGVWI));

    permit.permitData.startDate = dayjs().format(
      PermitAppInfo.PermitDateFormat.toString(),
    );

    permit.permitData.vehicleConfiguration.actualGVW =
      permit.permitData.vehicleDetails.licensedGVW;

    const validationResult = await policy.validate(permit);

    expect(validationResult.violations).toHaveLength(1);
  });

  it('should fail validation when Actual GVW is less than Licensed GVW', async () => {
    const permit = JSON.parse(JSON.stringify(validSTGVWI));

    permit.permitData.startDate = dayjs().format(
      PermitAppInfo.PermitDateFormat.toString(),
    );

    permit.permitData.vehicleConfiguration.actualGVW =
      permit.permitData.vehicleDetails.licensedGVW - 500;

    const validationResult = await policy.validate(permit);

    expect(validationResult.violations).toHaveLength(1);
  });

  it('should validate when Actual GVW is greater than Licensed GVW', async () => {
    const permit = JSON.parse(JSON.stringify(validSTGVWI));

    permit.permitData.startDate = dayjs().format(
      PermitAppInfo.PermitDateFormat.toString(),
    );

    permit.permitData.vehicleConfiguration.actualGVW =
      permit.permitData.vehicleDetails.licensedGVW + 1;

    const validationResult = await policy.validate(permit);

    expect(validationResult.violations).toHaveLength(0);
  });

  it('should validate STGVWI with Actual GVW exactly 63,500kg', async () => {
    const permit = JSON.parse(JSON.stringify(validSTGVWI));

    permit.permitData.startDate = dayjs().format(
      PermitAppInfo.PermitDateFormat.toString(),
    );

    permit.permitData.vehicleDetails.licensedGVW = 40000;
    permit.permitData.vehicleConfiguration.actualGVW = 63500;

    const validationResult = await policy.validate(permit);

    expect(validationResult.violations).toHaveLength(0);
  });

  it('should fail validation when Actual GVW exceeds 63,500kg', async () => {
    const permit = JSON.parse(JSON.stringify(validSTGVWI));

    permit.permitData.startDate = dayjs().format(
      PermitAppInfo.PermitDateFormat.toString(),
    );

    permit.permitData.vehicleDetails.licensedGVW = 40000;
    permit.permitData.vehicleConfiguration.actualGVW = 63501;

    const validationResult = await policy.validate(permit);

    expect(validationResult.violations).toHaveLength(1);
  });
});
