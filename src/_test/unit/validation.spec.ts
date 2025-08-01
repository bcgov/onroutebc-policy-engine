import { Policy } from 'onroute-policy-engine';
import trosOnly from '../policy-config/tros-only.sample.json';
import trosNoAllowedVehicles from '../policy-config/tros-no-allowed-vehicles.sample.json';
import currentConfig from '../policy-config/_current-config.json';
import trosNoParamsSample from '../policy-config/tros-no-params.sample.json';
import validTros30Day from '../permit-app/valid-tros-30day.json';
import validTrow120Day from '../permit-app/valid-trow-120day.json';
import allEventTypes from '../policy-config/all-event-types.sample.json';
import specialAuth from '../policy-config/special-auth-lcv.sample.json';
import dayjs from 'dayjs';
import { PermitAppInfo } from '../../enum/permit-app-info';
import { ValidationResultCode } from '../../enum/validation-result-code';

describe('Permit Engine Constructor', () => {
  it('should construct without error with special authorizations', () => {
    expect(() => new Policy(trosOnly, specialAuth)).not.toThrow();
  });

  it('should assign policy definition correctly', () => {
    const policy: Policy = new Policy(trosOnly);
    expect(policy.policyDefinition).toBeTruthy();
  });

  it('should assign special auth correctly', () => {
    const policy: Policy = new Policy(trosOnly, specialAuth);
    expect(policy.specialAuthorizations).toBeTruthy();
  });
});

describe('Permit Engine Constructor', () => {
  it('should construct without error without special authorizations', () => {
    expect(() => new Policy(trosOnly)).not.toThrow();
  });

  it('should assign policy definition correctly', () => {
    const policy: Policy = new Policy(trosOnly);
    expect(policy.policyDefinition).toBeTruthy();
  });
});

describe('Policy Engine Validator', () => {
  const policy: Policy = new Policy(trosOnly);
  const lcvPolicy: Policy = new Policy(trosOnly, specialAuth);

  it('should validate TROS successfully', async () => {
    const permit = JSON.parse(JSON.stringify(validTros30Day));
    // Set startDate to today
    permit.permitData.startDate = dayjs().format(
      PermitAppInfo.PermitDateFormat.toString(),
    );

    const validationResult = await policy.validate(permit);
    expect(validationResult.violations).toHaveLength(0);
  });

  it('should raise violation for start date in the past', async () => {
    const permit = JSON.parse(JSON.stringify(validTros30Day));
    // Set startDate to yesterday
    permit.permitData.startDate = dayjs()
      .subtract(1, 'day')
      .format(PermitAppInfo.PermitDateFormat.toString());

    const validationResult = await policy.validate(permit);
    expect(validationResult.violations).toHaveLength(1);
  });

  it('should raise violation for start date more than 14 days in future', async () => {
    const permit = JSON.parse(JSON.stringify(validTros30Day));
    // Set startDate to more than 14 days in the future
    permit.permitData.startDate = dayjs()
      .add(15, 'day')
      .format(PermitAppInfo.PermitDateFormat.toString());

    const validationResult = await policy.validate(permit);
    expect(validationResult.violations).toHaveLength(1);
  });

  it('should validate correctly for start date exactly 14 days in future', async () => {
    const permit = JSON.parse(JSON.stringify(validTros30Day));
    // Set startDate to yesterday
    permit.permitData.startDate = dayjs()
      .add(14, 'day')
      .format(PermitAppInfo.PermitDateFormat.toString());

    const validationResult = await policy.validate(permit);
    expect(validationResult.violations).toHaveLength(0);
  });

  it('should raise violation for invalid permit type', async () => {
    const permit = JSON.parse(JSON.stringify(validTros30Day));
    // Set startDate to today
    permit.permitData.startDate = dayjs().format(
      PermitAppInfo.PermitDateFormat.toString(),
    );
    permit.permitType = '__INVALID';

    const validationResult = await policy.validate(permit);
    expect(validationResult.violations).toHaveLength(1);
  });

  it('should raise violation for invalid vehicle type', async () => {
    const permit = JSON.parse(JSON.stringify(validTros30Day));
    // Set startDate to today
    permit.permitData.startDate = dayjs().format(
      PermitAppInfo.PermitDateFormat.toString(),
    );
    // Set an invalid vehicle type
    permit.permitData.vehicleDetails.vehicleSubType = '__INVALID';

    const validationResult = await policy.validate(permit);
    expect(validationResult.violations).toHaveLength(1);
  });

  it('should raise violation for TROS lcv with no special auth', async () => {
    const permit = JSON.parse(JSON.stringify(validTros30Day));
    // Set startDate to today
    permit.permitData.startDate = dayjs().format(
      PermitAppInfo.PermitDateFormat.toString(),
    );
    // Set an lcv vehicle type
    permit.permitData.vehicleDetails.vehicleSubType = 'LCVRMDB';

    const validationResult = await policy.validate(permit);
    expect(validationResult.violations).toHaveLength(1);
  });

  it('should validate lcv for TROS with special auth', async () => {
    const permit = JSON.parse(JSON.stringify(validTros30Day));
    // Set startDate to today
    permit.permitData.startDate = dayjs().format(
      PermitAppInfo.PermitDateFormat.toString(),
    );
    // Set an lcv vehicle type
    permit.permitData.vehicleDetails.vehicleSubType = 'LCVRMDB';

    const validationResult = await lcvPolicy.validate(permit);
    expect(validationResult.violations).toHaveLength(0);
  });

  it('should validate lcv using set method instead of constructor', async () => {
    const permit = JSON.parse(JSON.stringify(validTros30Day));
    // Set startDate to today
    permit.permitData.startDate = dayjs().format(
      PermitAppInfo.PermitDateFormat.toString(),
    );
    // Set an lcv vehicle type
    permit.permitData.vehicleDetails.vehicleSubType = 'LCVRMDB';

    const validationResult = await policy.validate(permit);
    expect(validationResult.violations).toHaveLength(1);

    // Set special auth manually
    policy.setSpecialAuthorizations(specialAuth);
    const validationResult2 = await policy.validate(permit);
    expect(validationResult2.violations).toHaveLength(0);

    // Reset special auth
    policy.setSpecialAuthorizations(null);
    const validationResult3 = await policy.validate(permit);
    expect(validationResult3.violations).toHaveLength(1);
  });

  it('should raise violation if no allowed vehicles are specified', async () => {
    const policyNoVehicles: Policy = new Policy(trosNoAllowedVehicles);
    const permit = JSON.parse(JSON.stringify(validTros30Day));

    const validationResult = await policyNoVehicles.validate(permit);
    expect(validationResult.violations).toHaveLength(1);
  });

  it('should return the correct validation code', async () => {
    const permit = JSON.parse(JSON.stringify(validTros30Day));
    // Set startDate to today
    permit.permitData.startDate = dayjs().format(
      PermitAppInfo.PermitDateFormat.toString(),
    );
    // Set an invalid companyName
    permit.permitData.companyName = '';

    const validationResult = await policy.validate(permit);
    expect(validationResult.violations).toHaveLength(1);
    expect(validationResult.violations[0].code).toBe(
      ValidationResultCode.FieldValidationError.toString(),
    );
  });

  it('should return the correct field reference', async () => {
    const permit = JSON.parse(JSON.stringify(validTros30Day));
    // Set startDate to today
    permit.permitData.startDate = dayjs().format(
      PermitAppInfo.PermitDateFormat.toString(),
    );
    // Set an invalid companyName
    permit.permitData.companyName = '';

    const validationResult = await policy.validate(permit);
    expect(validationResult.violations).toHaveLength(1);
    expect(validationResult.violations[0].fieldReference).toBe(
      'permitData.companyName',
    );
  });
});

describe('Master Policy Configuration Validator', () => {
  const policy: Policy = new Policy(currentConfig);

  it('should validate TROS successfully', async () => {
    const permit = JSON.parse(JSON.stringify(validTros30Day));
    // Set startDate to today
    permit.permitData.startDate = dayjs().format(
      PermitAppInfo.PermitDateFormat.toString(),
    );

    const validationResult = await policy.validate(permit);
    expect(validationResult.violations).toHaveLength(0);
  });

  it('should validate TROW successfully', async () => {
    const permit = JSON.parse(JSON.stringify(validTrow120Day));
    // Set startDate to today
    permit.permitData.startDate = dayjs().format(
      PermitAppInfo.PermitDateFormat.toString(),
    );

    const validationResult = await policy.validate(permit);
    expect(validationResult.violations).toHaveLength(0);
  });
});

describe('Policy Configuration Missing Elements', () => {
  const policy: Policy = new Policy(trosNoParamsSample);

  it('should not fail when a validation has no params', async () => {
    const permit = JSON.parse(JSON.stringify(validTros30Day));
    // Set startDate to today
    permit.permitData.startDate = dayjs().format(
      PermitAppInfo.PermitDateFormat.toString(),
    );

    const validationResult = await policy.validate(permit);
    expect(validationResult.violations).toHaveLength(1);
    expect(validationResult.violations[0].message).not.toBeUndefined();
    expect(validationResult.violations[0].message).not.toBeNull();
  });
});

describe('Permit Engine Validation Results Aggregator', () => {
  const policy: Policy = new Policy(allEventTypes);

  it('should process all event types', async () => {
    const permit = JSON.parse(JSON.stringify(validTros30Day));

    const validationResult = await policy.validate(permit);
    // Violation 1: expected structure
    // Violation 2: unknown event type (defaults to violation)
    expect(validationResult.violations).toHaveLength(2);
    expect(validationResult.requirements).toHaveLength(1);
    expect(validationResult.warnings).toHaveLength(1);
    // Information 1: expected structure
    // Information 2: params object, but no message property
    // Information 3: no params object in the event
    expect(validationResult.information).toHaveLength(3);
  });
});
