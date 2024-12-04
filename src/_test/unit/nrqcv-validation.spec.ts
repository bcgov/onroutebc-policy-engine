import { Policy } from 'onroute-policy-engine';
import { completePolicyConfig } from '../policy-config/complete-in-progress.sample';
import { validNrqcv } from '../permit-app/valid-nrqcv';
import dayjs from 'dayjs';
import quarterOfYear from 'dayjs/plugin/quarterOfYear';
import { PermitAppInfo } from '../../enum/permit-app-info';

dayjs.extend(quarterOfYear);

describe('Non-Resident Quarterly Validation Tests', () => {
  const policy: Policy = new Policy(completePolicyConfig);

  it('should validate NRQCV successfully', async () => {
    const permit = JSON.parse(JSON.stringify(validNrqcv));
    // Set startDate to today, end date to the end of the quarter
    const dateFrom = dayjs();
    permit.permitData.startDate = dateFrom.format(
      PermitAppInfo.PermitDateFormat.toString(),
    );
    permit.permitData.expiryDate = dateFrom
      .endOf('quarter')
      .format(PermitAppInfo.PermitDateFormat.toString());

    const validationResult = await policy.validate(permit);
    expect(validationResult.violations).toHaveLength(0);
  });

  it('should fail validation for NRQCV with invalid vehicle subtype', async () => {
    const permit = JSON.parse(JSON.stringify(validNrqcv));
    // Set startDate to today, end date to the end of the quarter
    const dateFrom = dayjs();
    permit.permitData.startDate = dateFrom.format(
      PermitAppInfo.PermitDateFormat.toString(),
    );
    permit.permitData.expiryDate = dateFrom
      .endOf('quarter')
      .format(PermitAppInfo.PermitDateFormat.toString());

    permit.permitData.vehicleDetails.vehicleSubType = '__INVALID';

    const validationResult = await policy.validate(permit);
    expect(validationResult.violations).toHaveLength(1);
  });

  it('should fail validation for NRQCV with start date not end of quarter', async () => {
    const permit = JSON.parse(JSON.stringify(validNrqcv));
    // Set startDate to today, end date to the end of the quarter
    const dateFrom = dayjs();
    permit.permitData.startDate = dateFrom.format(
      PermitAppInfo.PermitDateFormat.toString(),
    );
    permit.permitData.expiryDate = permit.permitData.startDate;

    const validationResult = await policy.validate(permit);
    expect(validationResult.violations).toHaveLength(1);
  });

  it('should fail validation for NRQCV with loadedGVW greater than 63,500', async () => {
    const permit = JSON.parse(JSON.stringify(validNrqcv));
    // Set startDate to today, end date to the end of the quarter
    const dateFrom = dayjs();
    permit.permitData.startDate = dateFrom.format(
      PermitAppInfo.PermitDateFormat.toString(),
    );
    permit.permitData.expiryDate = dateFrom
      .endOf('quarter')
      .format(PermitAppInfo.PermitDateFormat.toString());

    // Set loadedGVW to 63501
    permit.permitData.vehicleConfiguration.loadedGVW = 63501;

    const validationResult = await policy.validate(permit);
    expect(validationResult.violations).toHaveLength(1);
  });

  it('should fail validation for NRQCV with loadedGVW of a farm vehicle greater than 24,400', async () => {
    const permit = JSON.parse(JSON.stringify(validNrqcv));
    // Set startDate to today, end date to the end of the quarter
    const dateFrom = dayjs();
    permit.permitData.startDate = dateFrom.format(
      PermitAppInfo.PermitDateFormat.toString(),
    );
    permit.permitData.expiryDate = dateFrom
      .endOf('quarter')
      .format(PermitAppInfo.PermitDateFormat.toString());

    // Set loadedGVW to 24401
    permit.permitData.vehicleConfiguration.loadedGVW = 24401;

    // Set conditionalLicensingFee to farm
    permit.permitData.conditionalLicensingFee = 'farm';

    const validationResult = await policy.validate(permit);
    expect(validationResult.violations).toHaveLength(1);
  });

  it('should fail validation for NRQCV with loadedGVW of zero', async () => {
    const permit = JSON.parse(JSON.stringify(validNrqcv));
    // Set startDate to today, end date to the end of the quarter
    const dateFrom = dayjs();
    permit.permitData.startDate = dateFrom.format(
      PermitAppInfo.PermitDateFormat.toString(),
    );
    permit.permitData.expiryDate = dateFrom
      .endOf('quarter')
      .format(PermitAppInfo.PermitDateFormat.toString());

    // Set loadedGVW to 0
    permit.permitData.vehicleConfiguration.loadedGVW = 0;

    const validationResult = await policy.validate(permit);
    expect(validationResult.violations).toHaveLength(1);
  });

  it('should fail validation for NRQCV with negative loadedGVW', async () => {
    const permit = JSON.parse(JSON.stringify(validNrqcv));
    // Set startDate to today, end date to the end of the quarter
    const dateFrom = dayjs();
    permit.permitData.startDate = dateFrom.format(
      PermitAppInfo.PermitDateFormat.toString(),
    );
    permit.permitData.expiryDate = dateFrom
      .endOf('quarter')
      .format(PermitAppInfo.PermitDateFormat.toString());

    // Set loadedGVW to -1000
    permit.permitData.vehicleConfiguration.loadedGVW = -1000;

    const validationResult = await policy.validate(permit);
    expect(validationResult.violations).toHaveLength(1);
  });

  it('should pass validation for NRQCV with loadedGVW exactly 63,500', async () => {
    const permit = JSON.parse(JSON.stringify(validNrqcv));
    // Set startDate to today, end date to the end of the quarter
    const dateFrom = dayjs();
    permit.permitData.startDate = dateFrom.format(
      PermitAppInfo.PermitDateFormat.toString(),
    );
    permit.permitData.expiryDate = dateFrom
      .endOf('quarter')
      .format(PermitAppInfo.PermitDateFormat.toString());

    // Set loadedGVW to 63500
    permit.permitData.vehicleConfiguration.loadedGVW = 63500;

    const validationResult = await policy.validate(permit);
    expect(validationResult.violations).toHaveLength(0);
  });

  it('should pass validation for NRQCV with loadedGVW 1 kg', async () => {
    const permit = JSON.parse(JSON.stringify(validNrqcv));
    // Set startDate to today, end date to the end of the quarter
    const dateFrom = dayjs();
    permit.permitData.startDate = dateFrom.format(
      PermitAppInfo.PermitDateFormat.toString(),
    );
    permit.permitData.expiryDate = dateFrom
      .endOf('quarter')
      .format(PermitAppInfo.PermitDateFormat.toString());

    // Set loadedGVW to 1
    permit.permitData.vehicleConfiguration.loadedGVW = 1;

    const validationResult = await policy.validate(permit);
    expect(validationResult.violations).toHaveLength(0);
  });

  it('should pass validation for NRQCV with conditional licensing fee none', async () => {
    const permit = JSON.parse(JSON.stringify(validNrqcv));
    // Set startDate to today, end date to the end of the quarter
    const dateFrom = dayjs();
    permit.permitData.startDate = dateFrom.format(
      PermitAppInfo.PermitDateFormat.toString(),
    );
    permit.permitData.expiryDate = dateFrom
      .endOf('quarter')
      .format(PermitAppInfo.PermitDateFormat.toString());

    // Set conditionalLicensingFee to none
    permit.permitData.conditionalLicensingFee = 'none';

    const validationResult = await policy.validate(permit);
    expect(validationResult.violations).toHaveLength(0);
  });

  it('should pass validation for NRQCV with conditional licensing fee x-plated', async () => {
    const permit = JSON.parse(JSON.stringify(validNrqcv));
    // Set startDate to today, end date to the end of the quarter
    const dateFrom = dayjs();
    permit.permitData.startDate = dateFrom.format(
      PermitAppInfo.PermitDateFormat.toString(),
    );
    permit.permitData.expiryDate = dateFrom
      .endOf('quarter')
      .format(PermitAppInfo.PermitDateFormat.toString());

    // Set conditionalLicensingFee to x-plated
    permit.permitData.conditionalLicensingFee = 'x-plated';

    const validationResult = await policy.validate(permit);
    expect(validationResult.violations).toHaveLength(0);
  });

  it('should pass validation for NRQCV with conditional licensing fee farm', async () => {
    const permit = JSON.parse(JSON.stringify(validNrqcv));
    // Set startDate to today, end date to the end of the quarter
    const dateFrom = dayjs();
    permit.permitData.startDate = dateFrom.format(
      PermitAppInfo.PermitDateFormat.toString(),
    );
    permit.permitData.expiryDate = dateFrom
      .endOf('quarter')
      .format(PermitAppInfo.PermitDateFormat.toString());

    // Set conditionalLicensingFee to farm
    permit.permitData.conditionalLicensingFee = 'farm';

    const validationResult = await policy.validate(permit);
    expect(validationResult.violations).toHaveLength(0);
  });

  it('should pass validation for NRQCV with conditional licensing fee conditional', async () => {
    const permit = JSON.parse(JSON.stringify(validNrqcv));
    // Set startDate to today, end date to the end of the quarter
    const dateFrom = dayjs();
    permit.permitData.startDate = dateFrom.format(
      PermitAppInfo.PermitDateFormat.toString(),
    );
    permit.permitData.expiryDate = dateFrom
      .endOf('quarter')
      .format(PermitAppInfo.PermitDateFormat.toString());

    // Set conditionalLicensingFee to conditional
    permit.permitData.conditionalLicensingFee = 'conditional';

    const validationResult = await policy.validate(permit);
    expect(validationResult.violations).toHaveLength(0);
  });

  it('should fail validation for NRQCV with conditional licensing fee __invalid', async () => {
    const permit = JSON.parse(JSON.stringify(validNrqcv));
    // Set startDate to today, end date to the end of the quarter
    const dateFrom = dayjs();
    permit.permitData.startDate = dateFrom.format(
      PermitAppInfo.PermitDateFormat.toString(),
    );
    permit.permitData.expiryDate = dateFrom
      .endOf('quarter')
      .format(PermitAppInfo.PermitDateFormat.toString());

    // Set conditionalLicensingFee to __invalid
    permit.permitData.conditionalLicensingFee = '__invalid';

    const validationResult = await policy.validate(permit);
    expect(validationResult.violations).toHaveLength(1);
  });

  it('should fail validation for NRQCV with undefined conditional licensing fee', async () => {
    const permit = JSON.parse(JSON.stringify(validNrqcv));
    // Set startDate to today, end date to the end of the quarter
    const dateFrom = dayjs();
    permit.permitData.startDate = dateFrom.format(
      PermitAppInfo.PermitDateFormat.toString(),
    );
    permit.permitData.expiryDate = dateFrom
      .endOf('quarter')
      .format(PermitAppInfo.PermitDateFormat.toString());

    // deletee conditionalLicensingFee
    delete permit.permitData.conditionalLicensingFee;

    const validationResult = await policy.validate(permit);
    expect(validationResult.violations).toHaveLength(1);
  });

  it('should calculate NRQCV conditional cost correctly', async () => {
    const permit = JSON.parse(JSON.stringify(validNrqcv));
    // Set startDate to today, end date to the end of the quarter
    const dateFrom = dayjs();
    permit.permitData.startDate = dateFrom.format(
      PermitAppInfo.PermitDateFormat.toString(),
    );
    permit.permitData.expiryDate = dateFrom
      .endOf('quarter')
      .format(PermitAppInfo.PermitDateFormat.toString());
    // Set conditionalLicensingFee to conditional
    permit.permitData.conditionalLicensingFee = 'conditional';

    const validationResult = await policy.validate(permit);
    expect(validationResult.cost).not.toHaveLength(0);
    const initialValue: number = 0;
    const cost = validationResult.cost.reduce(
      (prev: any, curr: any) => prev + curr.cost,
      initialValue,
    );
    expect(cost).toBe(3);
  });

  it('should calculate NRQCV cv (none) vehicle cost correctly for 6000kg', async () => {
    const permit = JSON.parse(JSON.stringify(validNrqcv));
    // Set startDate to today, end date to the end of the quarter
    const dateFrom = dayjs();
    permit.permitData.startDate = dateFrom.format(
      PermitAppInfo.PermitDateFormat.toString(),
    );
    permit.permitData.expiryDate = dateFrom
      .endOf('quarter')
      .format(PermitAppInfo.PermitDateFormat.toString());
    // Set conditionalLicensingFee to none
    permit.permitData.conditionalLicensingFee = 'none';
    // Set loadedGVW to 6000
    permit.permitData.vehicleConfiguration.loadedGVW = 6000;

    const validationResult = await policy.validate(permit);
    expect(validationResult.cost).not.toHaveLength(0);
    const initialValue: number = 0;
    const cost = validationResult.cost.reduce(
      (prev: any, curr: any) => prev + curr.cost,
      initialValue,
    );
    expect(cost).toBe(53);
  });

  it('should calculate NRQCV cv (none) vehicle cost correctly for 25000kg', async () => {
    const permit = JSON.parse(JSON.stringify(validNrqcv));
    // Set startDate to today, end date to the end of the quarter
    const dateFrom = dayjs();
    permit.permitData.startDate = dateFrom.format(
      PermitAppInfo.PermitDateFormat.toString(),
    );
    permit.permitData.expiryDate = dateFrom
      .endOf('quarter')
      .format(PermitAppInfo.PermitDateFormat.toString());
    // Set conditionalLicensingFee to none
    permit.permitData.conditionalLicensingFee = 'none';
    // Set loadedGVW to 25000
    permit.permitData.vehicleConfiguration.loadedGVW = 25000;

    const validationResult = await policy.validate(permit);
    expect(validationResult.cost).not.toHaveLength(0);
    const initialValue: number = 0;
    const cost = validationResult.cost.reduce(
      (prev: any, curr: any) => prev + curr.cost,
      initialValue,
    );
    expect(cost).toBe(313);
  });

  it('should calculate NRQCV x-plated cost correctly', async () => {
    const permit = JSON.parse(JSON.stringify(validNrqcv));
    // Set startDate to today, end date to the end of the quarter
    const dateFrom = dayjs();
    permit.permitData.startDate = dateFrom.format(
      PermitAppInfo.PermitDateFormat.toString(),
    );
    permit.permitData.expiryDate = dateFrom
      .endOf('quarter')
      .format(PermitAppInfo.PermitDateFormat.toString());
    // Set conditionalLicensingFee to x-plated
    permit.permitData.conditionalLicensingFee = 'x-plated';
    // Set loadedGVW to 6000
    permit.permitData.vehicleConfiguration.loadedGVW = 6000;

    const validationResult = await policy.validate(permit);
    expect(validationResult.cost).not.toHaveLength(0);
    const initialValue: number = 0;
    const cost = validationResult.cost.reduce(
      (prev: any, curr: any) => prev + curr.cost,
      initialValue,
    );
    expect(cost).toBe(28);
  });

  it('should calculate NRQCV farm vehicle cost correctly', async () => {
    const permit = JSON.parse(JSON.stringify(validNrqcv));
    // Set startDate to today, end date to the end of the quarter
    const dateFrom = dayjs();
    permit.permitData.startDate = dateFrom.format(
      PermitAppInfo.PermitDateFormat.toString(),
    );
    permit.permitData.expiryDate = dateFrom
      .endOf('quarter')
      .format(PermitAppInfo.PermitDateFormat.toString());
    // Set conditionalLicensingFee to farm
    permit.permitData.conditionalLicensingFee = 'farm';
    // Set loadedGVW to 24400
    permit.permitData.vehicleConfiguration.loadedGVW = 24400;

    const validationResult = await policy.validate(permit);
    expect(validationResult.cost).not.toHaveLength(0);
    const initialValue: number = 0;
    const cost = validationResult.cost.reduce(
      (prev: any, curr: any) => prev + curr.cost,
      initialValue,
    );
    expect(cost).toBe(327);
  });
});
