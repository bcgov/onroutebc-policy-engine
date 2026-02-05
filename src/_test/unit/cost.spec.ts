import { Policy } from 'onroute-policy-engine';
import currentConfig from '../policy-config/_current-config.json';
import multipleCostRules from '../policy-config/tros-multiple-cost-rules.sample.json';
import validTros30Day from '../permit-app/valid-tros-30day.json';
import validTrow120Day from '../permit-app/valid-trow-120day.json';
import testStos from '../permit-app/test-stos.json';
import invalidStos from '../permit-app/invalid-stos.json';
import dayjs from 'dayjs';
import specialAuthNoFee from '../policy-config/special-auth-nofee.sample.json';
import specialAuthLcv from '../policy-config/special-auth-lcv.sample.json';
import { PermitAppInfo } from '../../enum/permit-app-info';
import { ValidationResultCode } from '../../enum';

describe('Policy Engine Cost Calculator', () => {
  const policy: Policy = new Policy(currentConfig);
  const multipleCostRulesPolicy = new Policy(multipleCostRules);

  it('should calculate 30 day TROS cost correctly', async () => {
    const permit = JSON.parse(JSON.stringify(validTros30Day));
    // Set startDate to today
    permit.permitData.startDate = dayjs().format(
      PermitAppInfo.PermitDateFormat.toString(),
    );

    const validationResult = await policy.validate(permit);
    expect(validationResult.cost).toHaveLength(1);
    expect(validationResult.cost[0].cost).toBe(30);
  });

  it('should respect the no fee flag', async () => {
    const noFeePolicy = new Policy(currentConfig, specialAuthNoFee);
    const permit = JSON.parse(JSON.stringify(validTros30Day));
    // Set startDate to today
    permit.permitData.startDate = dayjs().format(
      PermitAppInfo.PermitDateFormat.toString(),
    );

    const validationResult = await noFeePolicy.validate(permit);
    expect(validationResult.cost).toHaveLength(1);
    expect(validationResult.cost[0].cost).toBe(0);
    expect(validationResult.information).toHaveLength(1);
    expect(validationResult.information[0].code).toBe(
      ValidationResultCode.NoFeeClient,
    );
  });

  it('should calculate 31 day TROS cost as 2 months', async () => {
    const permit = JSON.parse(JSON.stringify(validTros30Day));
    // Set startDate to today
    permit.permitData.startDate = dayjs().format(
      PermitAppInfo.PermitDateFormat.toString(),
    );
    // Set duration to 31
    permit.permitData.permitDuration = 31;

    const validationResult = await policy.validate(permit);
    expect(validationResult.cost).toHaveLength(1);
    expect(validationResult.cost[0].cost).toBe(60);
  });

  it('should calculate 1 year TROS cost correctly', async () => {
    const permit = JSON.parse(JSON.stringify(validTros30Day));
    const today = dayjs();
    // Set startDate to today
    permit.permitData.startDate = today.format(
      PermitAppInfo.PermitDateFormat.toString(),
    );
    // Set duration to full year (365 or 366 depending on leap year)
    const oneYearDuration: number = today.add(1, 'year').diff(today, 'day');
    permit.permitData.permitDuration = oneYearDuration;

    const validationResult = await policy.validate(permit);
    expect(validationResult.cost).toHaveLength(1);
    expect(validationResult.cost[0].cost).toBe(360);
  });

  it('should calculate 120 day TROW cost correctly', async () => {
    const permit = JSON.parse(JSON.stringify(validTrow120Day));
    // Set startDate to today
    permit.permitData.startDate = dayjs().format(
      PermitAppInfo.PermitDateFormat.toString(),
    );

    const validationResult = await policy.validate(permit);
    expect(validationResult.cost).toHaveLength(1);
    expect(validationResult.cost[0].cost).toBe(400);
  });

  it('should calculate STOS cost correctly', async () => {
    const permit = JSON.parse(JSON.stringify(testStos));
    // Set startDate to today
    permit.permitData.startDate = dayjs().format(
      PermitAppInfo.PermitDateFormat.toString(),
    );

    const validationResult = await policy.validate(permit);
    expect(validationResult.cost).toHaveLength(2);
    expect(validationResult.cost[0].cost).toBe(15);
    expect(validationResult.cost[1].cost).toBe(0);

    const cost = validationResult.cost.reduce(
      (prev, curr) => prev + (curr.cost ?? 0),
      0,
    );

    // STOS cost should be the fixed cost of $15 for normal circumstances
    expect(cost).toBe(15);
  });

  it('should calculate STOS cost correctly for return trip', async () => {
    const permit = JSON.parse(JSON.stringify(testStos));
    // Set startDate to today
    permit.permitData.startDate = dayjs().format(
      PermitAppInfo.PermitDateFormat.toString(),
    );

    // Set return trip flag to true
    permit.permitData.permittedRoute.manualRoute.isReturnTrip = true;

    const validationResult = await policy.validate(permit);
    expect(validationResult.cost).toHaveLength(2);
    expect(validationResult.cost[0].cost).toBe(15);
    expect(validationResult.cost[1].cost).toBe(15);

    const cost = validationResult.cost.reduce(
      (prev, curr) => prev + (curr.cost ?? 0),
      0,
    );

    expect(cost).toBe(30);
  });

  it('should not throw error when validating STOS', async () => {
    const permit = JSON.parse(JSON.stringify(invalidStos));
    // Set startDate to today
    permit.permitData.startDate = dayjs().format(
      PermitAppInfo.PermitDateFormat.toString(),
    );
    const validationResult = await policy.validate(permit);
    expect(validationResult.cost).toHaveLength(2);
    expect(validationResult.cost[0].cost).toBe(15);
  });

  it('should not throw error when validating STOS (with LCV auth)', async () => {
    const lcvPolicy = new Policy(currentConfig, specialAuthLcv);
    const permit = JSON.parse(JSON.stringify(invalidStos));
    // Set startDate to today
    permit.permitData.startDate = dayjs().format(
      PermitAppInfo.PermitDateFormat.toString(),
    );
    const validationResult = await lcvPolicy.validate(permit);
    expect(validationResult.cost).toHaveLength(2);
    expect(validationResult.cost[0].cost).toBe(15);
  });

  it('should calculate valid TROS with multiple cost rules correctly', async () => {
    const permit = JSON.parse(JSON.stringify(validTros30Day));
    // Set startDate to today
    permit.permitData.startDate = dayjs().format(
      PermitAppInfo.PermitDateFormat.toString(),
    );

    const validationResult = await multipleCostRulesPolicy.validate(permit);
    expect(validationResult.cost).toHaveLength(2);
    const cost1: number = validationResult.cost[0]?.cost ?? 0;
    const cost2: number = validationResult.cost[1]?.cost ?? 0;
    expect(cost1 + cost2).toBe(45);
  });

  it('should calculate 31 day TROS with multiple cost rules correctly', async () => {
    const permit = JSON.parse(JSON.stringify(validTros30Day));
    // Set startDate to today
    permit.permitData.startDate = dayjs().format(
      PermitAppInfo.PermitDateFormat.toString(),
    );
    // Set duration to 31
    permit.permitData.permitDuration = 31;

    const validationResult = await multipleCostRulesPolicy.validate(permit);
    expect(validationResult.cost).toHaveLength(2);
    const cost1: number = validationResult.cost[0]?.cost ?? 0;
    const cost2: number = validationResult.cost[1]?.cost ?? 0;
    expect(cost1 + cost2).toBe(75);
  });
});
