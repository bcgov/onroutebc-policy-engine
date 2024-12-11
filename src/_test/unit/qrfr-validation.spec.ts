import { Policy } from 'onroute-policy-engine';
import currentConfig from '../policy-config/_current-config.json';
import validQrfr from '../permit-app/valid-qrfr.json';
import dayjs from 'dayjs';
import quarterOfYear from 'dayjs/plugin/quarterOfYear';
import { PermitAppInfo } from '../../enum/permit-app-info';

dayjs.extend(quarterOfYear);

describe('Quarterly ICBC Basic Insurance (FR) Validation Tests', () => {
  const policy: Policy = new Policy(currentConfig);

  it('should validate QRFR successfully', async () => {
    const permit = JSON.parse(JSON.stringify(validQrfr));
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

  it('should fail validation for QRFR with start date not end of quarter', async () => {
    const permit = JSON.parse(JSON.stringify(validQrfr));
    // Set startDate to today, end date to the end of the quarter
    const dateFrom = dayjs();
    permit.permitData.startDate = dateFrom.format(
      PermitAppInfo.PermitDateFormat.toString(),
    );
    permit.permitData.expiryDate = permit.permitData.startDate;

    const validationResult = await policy.validate(permit);
    expect(validationResult.violations).toHaveLength(1);
  });

  it('should fail validation for QRFR with invalid vehicle subtype', async () => {
    const permit = JSON.parse(JSON.stringify(validQrfr));
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

  it('should fail validation for QRFR with licensed GVW greater than 63,500', async () => {
    const permit = JSON.parse(JSON.stringify(validQrfr));
    // Set startDate to today, end date to the end of the quarter
    const dateFrom = dayjs();
    permit.permitData.startDate = dateFrom.format(
      PermitAppInfo.PermitDateFormat.toString(),
    );
    permit.permitData.expiryDate = dateFrom
      .endOf('quarter')
      .format(PermitAppInfo.PermitDateFormat.toString());

    // Set licensedGVW to 63501
    permit.permitData.vehicleDetails.licensedGVW = 63501;

    const validationResult = await policy.validate(permit);
    expect(validationResult.violations).toHaveLength(1);
  });

  it('should fail validation for QRFR with licensed GVW of zero', async () => {
    const permit = JSON.parse(JSON.stringify(validQrfr));
    // Set startDate to today, end date to the end of the quarter
    const dateFrom = dayjs();
    permit.permitData.startDate = dateFrom.format(
      PermitAppInfo.PermitDateFormat.toString(),
    );
    permit.permitData.expiryDate = dateFrom
      .endOf('quarter')
      .format(PermitAppInfo.PermitDateFormat.toString());

    // Set licensedGVW to 0
    permit.permitData.vehicleDetails.licensedGVW = 0;

    const validationResult = await policy.validate(permit);
    expect(validationResult.violations).toHaveLength(1);
  });

  it('should fail validation for QRFR with negative licensed GVW', async () => {
    const permit = JSON.parse(JSON.stringify(validQrfr));
    // Set startDate to today, end date to the end of the quarter
    const dateFrom = dayjs();
    permit.permitData.startDate = dateFrom.format(
      PermitAppInfo.PermitDateFormat.toString(),
    );
    permit.permitData.expiryDate = dateFrom
      .endOf('quarter')
      .format(PermitAppInfo.PermitDateFormat.toString());

    // Set licensedGVW to -1000
    permit.permitData.vehicleDetails.licensedGVW = -1000;

    const validationResult = await policy.validate(permit);
    expect(validationResult.violations).toHaveLength(1);
  });

  it('should pass validation for QRFR with licensed GVW exactly 63,500', async () => {
    const permit = JSON.parse(JSON.stringify(validQrfr));
    // Set startDate to today, end date to the end of the quarter
    const dateFrom = dayjs();
    permit.permitData.startDate = dateFrom.format(
      PermitAppInfo.PermitDateFormat.toString(),
    );
    permit.permitData.expiryDate = dateFrom
      .endOf('quarter')
      .format(PermitAppInfo.PermitDateFormat.toString());

    // Set licensedGVW to 63500
    permit.permitData.vehicleDetails.licensedGVW = 63500;

    const validationResult = await policy.validate(permit);
    expect(validationResult.violations).toHaveLength(0);
  });

  it('should pass validation for QRFR with licensed GVW 1 kg', async () => {
    const permit = JSON.parse(JSON.stringify(validQrfr));
    // Set startDate to today, end date to the end of the quarter
    const dateFrom = dayjs();
    permit.permitData.startDate = dateFrom.format(
      PermitAppInfo.PermitDateFormat.toString(),
    );
    permit.permitData.expiryDate = dateFrom
      .endOf('quarter')
      .format(PermitAppInfo.PermitDateFormat.toString());

    // Set licensedGVW to 1
    permit.permitData.vehicleDetails.licensedGVW = 1;

    const validationResult = await policy.validate(permit);
    expect(validationResult.violations).toHaveLength(0);
  });

  it('should pass validation for QRFR with third party liability GENERAL_GOODS', async () => {
    const permit = JSON.parse(JSON.stringify(validQrfr));
    // Set startDate to today, end date to the end of the quarter
    const dateFrom = dayjs();
    permit.permitData.startDate = dateFrom.format(
      PermitAppInfo.PermitDateFormat.toString(),
    );
    permit.permitData.expiryDate = dateFrom
      .endOf('quarter')
      .format(PermitAppInfo.PermitDateFormat.toString());

    // Set thirdPartyLiability to GENERAL_GOODS
    permit.permitData.thirdPartyLiability = 'GENERAL_GOODS';

    const validationResult = await policy.validate(permit);
    expect(validationResult.violations).toHaveLength(0);
  });

  it('should pass validation for QRFR with third party liability DANGEROUS_GOODS', async () => {
    const permit = JSON.parse(JSON.stringify(validQrfr));
    // Set startDate to today, end date to the end of the quarter
    const dateFrom = dayjs();
    permit.permitData.startDate = dateFrom.format(
      PermitAppInfo.PermitDateFormat.toString(),
    );
    permit.permitData.expiryDate = dateFrom
      .endOf('quarter')
      .format(PermitAppInfo.PermitDateFormat.toString());

    // Set thirdPartyLiability to DANGEROUS_GOODS
    permit.permitData.thirdPartyLiability = 'DANGEROUS_GOODS';

    const validationResult = await policy.validate(permit);
    expect(validationResult.violations).toHaveLength(0);
  });

  it('should fail validation for QRFR with third party liability dangerous_goods (exact match required)', async () => {
    const permit = JSON.parse(JSON.stringify(validQrfr));
    // Set startDate to today, end date to the end of the quarter
    const dateFrom = dayjs();
    permit.permitData.startDate = dateFrom.format(
      PermitAppInfo.PermitDateFormat.toString(),
    );
    permit.permitData.expiryDate = dateFrom
      .endOf('quarter')
      .format(PermitAppInfo.PermitDateFormat.toString());

    // Set thirdPartyLiability to dangerous_goods
    permit.permitData.thirdPartyLiability = 'dangerous_goods';

    const validationResult = await policy.validate(permit);
    expect(validationResult.violations).toHaveLength(1);
  });

  it('should fail validation for QRFR with undefined third party liability', async () => {
    const permit = JSON.parse(JSON.stringify(validQrfr));
    // Set startDate to today, end date to the end of the quarter
    const dateFrom = dayjs();
    permit.permitData.startDate = dateFrom.format(
      PermitAppInfo.PermitDateFormat.toString(),
    );
    permit.permitData.expiryDate = dateFrom
      .endOf('quarter')
      .format(PermitAppInfo.PermitDateFormat.toString());

    // deletee thirdPartyLiability
    delete permit.permitData.thirdPartyLiability;

    const validationResult = await policy.validate(permit);
    expect(validationResult.violations).toHaveLength(1);
  });

  it('should calculate QRFR general goods cost correctly', async () => {
    const permit = JSON.parse(JSON.stringify(validQrfr));
    // Set startDate to today, end date to the end of the quarter
    const dateFrom = dayjs();
    permit.permitData.startDate = dateFrom.format(
      PermitAppInfo.PermitDateFormat.toString(),
    );
    permit.permitData.expiryDate = dateFrom
      .endOf('quarter')
      .format(PermitAppInfo.PermitDateFormat.toString());
    // Set thirdPartyLiability to GENERAL_GOODS
    permit.permitData.thirdPartyLiability = 'GENERAL_GOODS';

    const validationResult = await policy.validate(permit);
    expect(validationResult.cost).not.toHaveLength(0);
    const initialValue: number = 0;
    const cost = validationResult.cost.reduce(
      (prev: any, curr: any) => prev + curr.cost,
      initialValue,
    );
    expect(cost).toBe(843);
  });

  it('should calculate QRFR dangerous goods cost correctly', async () => {
    const permit = JSON.parse(JSON.stringify(validQrfr));
    // Set startDate to today, end date to the end of the quarter
    const dateFrom = dayjs();
    permit.permitData.startDate = dateFrom.format(
      PermitAppInfo.PermitDateFormat.toString(),
    );
    permit.permitData.expiryDate = dateFrom
      .endOf('quarter')
      .format(PermitAppInfo.PermitDateFormat.toString());
    // Set thirdPartyLiability to DANGEROUS_GOODS
    permit.permitData.thirdPartyLiability = 'DANGEROUS_GOODS';

    const validationResult = await policy.validate(permit);
    expect(validationResult.cost).not.toHaveLength(0);
    const initialValue: number = 0;
    const cost = validationResult.cost.reduce(
      (prev: any, curr: any) => prev + curr.cost,
      initialValue,
    );
    expect(cost).toBe(899);
  });
});
