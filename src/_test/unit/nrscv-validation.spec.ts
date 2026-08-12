import { Policy } from 'onroute-policy-engine';

import currentConfig from '../policy-config/_current-config.json';
import validNrscv from '../permit-app/valid-nrscv-30day.json';
import { PermitAppInfo } from '../../enum/permit-app-info';
import {
  convertToTimezone,
  getUtcDatetime,
  TIMEZONE_IDS,
} from '../../helper/date.helper';

describe('Non-Resident Single Trip Validation Tests', () => {
  const policy: Policy = new Policy(currentConfig);

  it('should validate NRSCV successfully', async () => {
    const permit = JSON.parse(JSON.stringify(validNrscv));

    // Set startDate to today
    // Note: we do not need to set the expiry date as well because
    // the validation only uses permitDuration, not expiryDate for this
    // permit type.
    permit.permitData.startDate = convertToTimezone(
      getUtcDatetime(),
      TIMEZONE_IDS.PACIFIC,
    ).format(
      PermitAppInfo.PermitDateFormat.toString(),
    );

    const validationResult = await policy.validate(permit);
    expect(validationResult.violations).toHaveLength(0);
  });

  it('should fail validation for NRSCV with invalid vehicle subtype', async () => {
    const permit = JSON.parse(JSON.stringify(validNrscv));

    // Set startDate to today
    permit.permitData.startDate = convertToTimezone(
      getUtcDatetime(),
      TIMEZONE_IDS.PACIFIC,
    ).format(
      PermitAppInfo.PermitDateFormat.toString(),
    );

    permit.permitData.vehicleDetails.vehicleSubType = '__INVALID';

    const validationResult = await policy.validate(permit);
    expect(validationResult.violations).toHaveLength(1);
  });

  it('should validate NRSCV successfully with 29 day duration', async () => {
    const permit = JSON.parse(JSON.stringify(validNrscv));

    // Set startDate to today
    permit.permitData.startDate = convertToTimezone(
      getUtcDatetime(),
      TIMEZONE_IDS.PACIFIC,
    ).format(
      PermitAppInfo.PermitDateFormat.toString(),
    );

    permit.permitData.permitDuration = 29;

    const validationResult = await policy.validate(permit);
    expect(validationResult.violations).toHaveLength(0);
  });

  it('should validate NRSCV successfully with 30 day duration', async () => {
    const permit = JSON.parse(JSON.stringify(validNrscv));

    // Set startDate to today
    permit.permitData.startDate = convertToTimezone(
      getUtcDatetime(),
      TIMEZONE_IDS.PACIFIC,
    ).format(
      PermitAppInfo.PermitDateFormat.toString(),
    );

    permit.permitData.permitDuration = 30;

    const validationResult = await policy.validate(permit);
    expect(validationResult.violations).toHaveLength(0);
  });

  it('should fail validation for NRSCV with 31 day duration', async () => {
    const permit = JSON.parse(JSON.stringify(validNrscv));

    // Set startDate to today
    permit.permitData.startDate = convertToTimezone(
      getUtcDatetime(),
      TIMEZONE_IDS.PACIFIC,
    ).format(
      PermitAppInfo.PermitDateFormat.toString(),
    );

    permit.permitData.permitDuration = 31;

    const validationResult = await policy.validate(permit);
    expect(validationResult.violations).toHaveLength(1);
  });

  it('should fail validation for NRSCV with 0 day duration', async () => {
    const permit = JSON.parse(JSON.stringify(validNrscv));

    // Set startDate to today
    permit.permitData.startDate = convertToTimezone(
      getUtcDatetime(),
      TIMEZONE_IDS.PACIFIC,
    ).format(
      PermitAppInfo.PermitDateFormat.toString(),
    );

    permit.permitData.permitDuration = 0;

    const validationResult = await policy.validate(permit);
    expect(validationResult.violations).toHaveLength(1);
  });

  it('should fail validation for NRSCV with loadedGVW greater than 63,500', async () => {
    const permit = JSON.parse(JSON.stringify(validNrscv));

    // Set startDate to today
    permit.permitData.startDate = convertToTimezone(
      getUtcDatetime(),
      TIMEZONE_IDS.PACIFIC,
    ).format(
      PermitAppInfo.PermitDateFormat.toString(),
    );

    permit.permitData.vehicleConfiguration.loadedGVW = 63501;

    const validationResult = await policy.validate(permit);
    expect(validationResult.violations).toHaveLength(1);
  });

  it('should fail validation for NRSCV with netWeight of a farm vehicle greater than 24,400', async () => {
    const permit = JSON.parse(JSON.stringify(validNrscv));

    // Set startDate to today
    permit.permitData.startDate = convertToTimezone(
      getUtcDatetime(),
      TIMEZONE_IDS.PACIFIC,
    ).format(
      PermitAppInfo.PermitDateFormat.toString(),
    );

    permit.permitData.vehicleConfiguration.netWeight = 24401;
    permit.permitData.conditionalLicensingFee = 'farm-vehicle';

    const validationResult = await policy.validate(permit);
    expect(validationResult.violations).toHaveLength(1);
  });

  it('should fail validation for NRSCV with loadedGVW of zero', async () => {
    const permit = JSON.parse(JSON.stringify(validNrscv));

    // Set startDate to today
    permit.permitData.startDate = convertToTimezone(
      getUtcDatetime(),
      TIMEZONE_IDS.PACIFIC,
    ).format(
      PermitAppInfo.PermitDateFormat.toString(),
    );

    permit.permitData.vehicleConfiguration.loadedGVW = 0;

    const validationResult = await policy.validate(permit);
    expect(validationResult.violations).toHaveLength(1);
  });

  it('should fail validation for NRSCV with negative loadedGVW', async () => {
    const permit = JSON.parse(JSON.stringify(validNrscv));

    // Set startDate to today
    permit.permitData.startDate = convertToTimezone(
      getUtcDatetime(),
      TIMEZONE_IDS.PACIFIC,
    ).format(
      PermitAppInfo.PermitDateFormat.toString(),
    );

    permit.permitData.vehicleConfiguration.loadedGVW = -1000;

    const validationResult = await policy.validate(permit);
    expect(validationResult.violations).toHaveLength(1);
  });

  it('should pass validation for NRSCV with loadedGVW exactly 63,500', async () => {
    const permit = JSON.parse(JSON.stringify(validNrscv));

    // Set startDate to today
    permit.permitData.startDate = convertToTimezone(
      getUtcDatetime(),
      TIMEZONE_IDS.PACIFIC,
    ).format(
      PermitAppInfo.PermitDateFormat.toString(),
    );

    permit.permitData.vehicleConfiguration.loadedGVW = 63500;

    const validationResult = await policy.validate(permit);
    expect(validationResult.violations).toHaveLength(0);
  });

  it('should pass validation for NRSCV with loadedGVW 1 kg', async () => {
    const permit = JSON.parse(JSON.stringify(validNrscv));

    // Set startDate to today
    permit.permitData.startDate = convertToTimezone(
      getUtcDatetime(),
      TIMEZONE_IDS.PACIFIC,
    ).format(
      PermitAppInfo.PermitDateFormat.toString(),
    );

    permit.permitData.vehicleConfiguration.loadedGVW = 1;

    const validationResult = await policy.validate(permit);
    expect(validationResult.violations).toHaveLength(0);
  });

  it('should pass validation for NRSCV with conditional licensing fee none', async () => {
    const permit = JSON.parse(JSON.stringify(validNrscv));

    // Set startDate to today
    permit.permitData.startDate = convertToTimezone(
      getUtcDatetime(),
      TIMEZONE_IDS.PACIFIC,
    ).format(
      PermitAppInfo.PermitDateFormat.toString(),
    );

    permit.permitData.conditionalLicensingFee = 'none';

    const validationResult = await policy.validate(permit);
    expect(validationResult.violations).toHaveLength(0);
  });

  it('should pass validation for NRSCV with conditional licensing fee x-plated', async () => {
    const permit = JSON.parse(JSON.stringify(validNrscv));

    // Set startDate to today
    permit.permitData.startDate = convertToTimezone(
      getUtcDatetime(),
      TIMEZONE_IDS.PACIFIC,
    ).format(
      PermitAppInfo.PermitDateFormat.toString(),
    );

    permit.permitData.conditionalLicensingFee = 'x-plated';

    const validationResult = await policy.validate(permit);
    expect(validationResult.violations).toHaveLength(0);
  });

  it('should pass validation for NRSCV with conditional licensing fee commercial-passenger', async () => {
    const permit = JSON.parse(JSON.stringify(validNrscv));

    // Set startDate to today
    permit.permitData.startDate = convertToTimezone(
      getUtcDatetime(),
      TIMEZONE_IDS.PACIFIC,
    ).format(
      PermitAppInfo.PermitDateFormat.toString(),
    );

    permit.permitData.conditionalLicensingFee = 'commercial-passenger';

    const validationResult = await policy.validate(permit);
    expect(validationResult.violations).toHaveLength(0);
  });

  it('should pass validation for NRSCV with conditional licensing fee farm-vehicle', async () => {
    const permit = JSON.parse(JSON.stringify(validNrscv));

    // Set startDate to today
    permit.permitData.startDate = convertToTimezone(
      getUtcDatetime(),
      TIMEZONE_IDS.PACIFIC,
    ).format(
      PermitAppInfo.PermitDateFormat.toString(),
    );

    permit.permitData.conditionalLicensingFee = 'farm-vehicle';
    permit.permitData.vehicleConfiguration.netWeight = 10000;

    const validationResult = await policy.validate(permit);
    expect(validationResult.violations).toHaveLength(0);
  });

  it('should pass validation for NRSCV with conditional licensing fee farm-tractor', async () => {
    const permit = JSON.parse(JSON.stringify(validNrscv));

    // Set startDate to today
    permit.permitData.startDate = convertToTimezone(
      getUtcDatetime(),
      TIMEZONE_IDS.PACIFIC,
    ).format(
      PermitAppInfo.PermitDateFormat.toString(),
    );

    permit.permitData.conditionalLicensingFee = 'farm-tractor';

    const validationResult = await policy.validate(permit);
    expect(validationResult.violations).toHaveLength(0);
  });

  it('should pass validation for NRSCV with conditional licensing fee conditional', async () => {
    const permit = JSON.parse(JSON.stringify(validNrscv));

    // Set startDate to today
    permit.permitData.startDate = convertToTimezone(
      getUtcDatetime(),
      TIMEZONE_IDS.PACIFIC,
    ).format(
      PermitAppInfo.PermitDateFormat.toString(),
    );

    permit.permitData.conditionalLicensingFee = 'conditional';

    const validationResult = await policy.validate(permit);
    expect(validationResult.violations).toHaveLength(0);
  });

  it('should fail validation for NRSCV with conditional licensing fee __invalid', async () => {
    const permit = JSON.parse(JSON.stringify(validNrscv));

    // Set startDate to today
    permit.permitData.startDate = convertToTimezone(
      getUtcDatetime(),
      TIMEZONE_IDS.PACIFIC,
    ).format(
      PermitAppInfo.PermitDateFormat.toString(),
    );

    permit.permitData.conditionalLicensingFee = '__invalid';

    const validationResult = await policy.validate(permit);
    expect(validationResult.violations).toHaveLength(1);
  });

  it('should fail validation for NRSCV with undefined conditional licensing fee', async () => {
    const permit = JSON.parse(JSON.stringify(validNrscv));

    // Set startDate to today
    permit.permitData.startDate = convertToTimezone(
      getUtcDatetime(),
      TIMEZONE_IDS.PACIFIC,
    ).format(
      PermitAppInfo.PermitDateFormat.toString(),
    );

    delete permit.permitData.conditionalLicensingFee;

    const validationResult = await policy.validate(permit);
    expect(validationResult.violations).toHaveLength(1);
  });

  it('should calculate NRSCV conditional cost correctly', async () => {
    const permit = JSON.parse(JSON.stringify(validNrscv));

    // Set startDate to today
    permit.permitData.startDate = convertToTimezone(
      getUtcDatetime(),
      TIMEZONE_IDS.PACIFIC,
    ).format(
      PermitAppInfo.PermitDateFormat.toString(),
    );

    permit.permitData.conditionalLicensingFee = 'conditional';

    const validationResult = await policy.validate(permit);
    expect(validationResult.cost).not.toHaveLength(0);

    const initialValue: number = 0;
    const cost = validationResult.cost.reduce(
      (prev: any, curr: any) => prev + curr.cost,
      initialValue,
    );

    expect(cost).toBe(12);
  });

  it('should calculate NRSCV cv (none) vehicle cost correctly for 6000kg', async () => {
    const permit = JSON.parse(JSON.stringify(validNrscv));

    // Set startDate to today
    permit.permitData.startDate = convertToTimezone(
      getUtcDatetime(),
      TIMEZONE_IDS.PACIFIC,
    ).format(
      PermitAppInfo.PermitDateFormat.toString(),
    );

    permit.permitData.conditionalLicensingFee = 'none';
    permit.permitData.vehicleConfiguration.loadedGVW = 6000;

    const validationResult = await policy.validate(permit);
    expect(validationResult.cost).not.toHaveLength(0);

    const initialValue: number = 0;
    const cost = validationResult.cost.reduce(
      (prev: any, curr: any) => prev + curr.cost,
      initialValue,
    );

    expect(cost).toBe(18);
  });

  it('should calculate NRSCV cv (none) vehicle cost correctly for 25000kg', async () => {
    const permit = JSON.parse(JSON.stringify(validNrscv));

    // Set startDate to today
    permit.permitData.startDate = convertToTimezone(
      getUtcDatetime(),
      TIMEZONE_IDS.PACIFIC,
    ).format(
      PermitAppInfo.PermitDateFormat.toString(),
    );

    permit.permitData.conditionalLicensingFee = 'none';
    permit.permitData.vehicleConfiguration.loadedGVW = 25000;

    const validationResult = await policy.validate(permit);
    expect(validationResult.cost).not.toHaveLength(0);

    const initialValue: number = 0;
    const cost = validationResult.cost.reduce(
      (prev: any, curr: any) => prev + curr.cost,
      initialValue,
    );

    expect(cost).toBe(104);
  });

  it('should calculate NRSCV x-plated cost correctly', async () => {
    const permit = JSON.parse(JSON.stringify(validNrscv));

    // Set startDate to today
    permit.permitData.startDate = convertToTimezone(
      getUtcDatetime(),
      TIMEZONE_IDS.PACIFIC,
    ).format(
      PermitAppInfo.PermitDateFormat.toString(),
    );

    permit.permitData.conditionalLicensingFee = 'x-plated';
    permit.permitData.vehicleConfiguration.loadedGVW = 6000;

    const validationResult = await policy.validate(permit);
    expect(validationResult.cost).not.toHaveLength(0);

    const initialValue: number = 0;
    const cost = validationResult.cost.reduce(
      (prev: any, curr: any) => prev + curr.cost,
      initialValue,
    );

    expect(cost).toBe(9);
  });

  it('should calculate NRSCV commercial-passenger cost correctly', async () => {
    const permit = JSON.parse(JSON.stringify(validNrscv));

    // Set startDate to today
    permit.permitData.startDate = convertToTimezone(
      getUtcDatetime(),
      TIMEZONE_IDS.PACIFIC,
    ).format(
      PermitAppInfo.PermitDateFormat.toString(),
    );

    permit.permitData.conditionalLicensingFee = 'commercial-passenger';
    permit.permitData.vehicleConfiguration.loadedGVW = 6250;

    const validationResult = await policy.validate(permit);
    expect(validationResult.cost).not.toHaveLength(0);

    const initialValue: number = 0;
    const cost = validationResult.cost.reduce(
      (prev: any, curr: any) => prev + curr.cost,
      initialValue,
    );

    expect(cost).toBe(18);
  });

  it('should calculate NRSCV farm vehicle cost correctly', async () => {
    const permit = JSON.parse(JSON.stringify(validNrscv));

    // Set startDate to today
    permit.permitData.startDate = convertToTimezone(
      getUtcDatetime(),
      TIMEZONE_IDS.PACIFIC,
    ).format(
      PermitAppInfo.PermitDateFormat.toString(),
    );

    permit.permitData.conditionalLicensingFee = 'farm-vehicle';
    delete permit.permitData.vehicleConfiguration.loadedGVW;
    permit.permitData.vehicleConfiguration.netWeight = 24400;

    const validationResult = await policy.validate(permit);
    expect(validationResult.cost).not.toHaveLength(0);

    const initialValue: number = 0;
    const cost = validationResult.cost.reduce(
      (prev: any, curr: any) => prev + curr.cost,
      initialValue,
    );

    expect(cost).toBe(109);
  });

  it('should calculate NRSCV farm tractor cost correctly', async () => {
    const permit = JSON.parse(JSON.stringify(validNrscv));

    // Set startDate to today
    permit.permitData.startDate = convertToTimezone(
      getUtcDatetime(),
      TIMEZONE_IDS.PACIFIC,
    ).format(
      PermitAppInfo.PermitDateFormat.toString(),
    );

    permit.permitData.conditionalLicensingFee = 'farm-tractor';
    permit.permitData.vehicleConfiguration.loadedGVW = 24400;

    const validationResult = await policy.validate(permit);
    expect(validationResult.cost).not.toHaveLength(0);

    const initialValue: number = 0;
    const cost = validationResult.cost.reduce(
      (prev: any, curr: any) => prev + curr.cost,
      initialValue,
    );
    
    expect(cost).toBe(33);
  });
});
