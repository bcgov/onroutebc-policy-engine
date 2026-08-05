import { Policy } from 'onroute-policy-engine';
import dayjs from 'dayjs';

import { PermitAppInfo } from '../../enum/permit-app-info';
import currentConfig from '../policy-config/_current-config.json';
import validSTWSE from '../permit-app/valid-stwse.json';

describe('Empty - Single Trip Over Length 27.5m (STWSE) Validation Tests', () => {
  const policy: Policy = new Policy(currentConfig);

  const getPermit = () => {
    const permit = JSON.parse(JSON.stringify(validSTWSE));

    const today = dayjs();
    permit.permitData.startDate = today
      .format(PermitAppInfo.PermitDateFormat);

    permit.permitData.permitDuration = 7;
    
    permit.permitData.expiryDate = today
      .add(6, "day")
      .format(PermitAppInfo.PermitDateFormat);
    
    return permit;
  };

  it('should validate STWSE successfully', async () => {
    const permit = getPermit();
    const validationResult = await policy.validate(permit);
    expect(validationResult.violations).toHaveLength(0);
    expect(validationResult.warnings).toHaveLength(0);
  });

  it('should fail validation when Overall Width is not provided', async () => {
    const permit = getPermit();
    permit.permitData.vehicleConfiguration.overallWidth = null;
    const validationResult = await policy.validate(permit);
    expect(validationResult.violations).toHaveLength(1);
    expect(validationResult.warnings).toHaveLength(0);
  });

  it('should fail validation when Overall Height is not provided', async () => {
    const permit = getPermit();
    permit.permitData.vehicleConfiguration.overallHeight = null;
    const validationResult = await policy.validate(permit);
    expect(validationResult.violations).toHaveLength(1);
    expect(validationResult.warnings).toHaveLength(0);
  });

  it('should fail validation when Overall Length is not provided', async () => {
    const permit = getPermit();
    permit.permitData.vehicleConfiguration.overallLength = null;
    const validationResult = await policy.validate(permit);
    expect(validationResult.violations).toHaveLength(1);
    expect(validationResult.warnings).toHaveLength(0);
  });

  it('should fail validation when Front Projection is not provided', async () => {
    const permit = getPermit();
    permit.permitData.vehicleConfiguration.frontProjection = null;
    const validationResult = await policy.validate(permit);
    expect(validationResult.violations).toHaveLength(1);
    expect(validationResult.warnings).toHaveLength(0);
  });

  it('should fail validation when Rear Projection is not provided', async () => {
    const permit = getPermit();
    permit.permitData.vehicleConfiguration.rearProjection = null;
    const validationResult = await policy.validate(permit);
    expect(validationResult.violations).toHaveLength(1);
    expect(validationResult.warnings).toHaveLength(0);
  });

  it('should fail validation when Weight over 27.5m is not provided', async () => {
    const permit = getPermit();
    permit.permitData.vehicleConfiguration.overloadWeight = null;
    const validationResult = await policy.validate(permit);
    expect(validationResult.violations).toHaveLength(1);
    expect(validationResult.warnings).toHaveLength(0);
  });

  it('should fail validation when Overall Width is not greater than 0', async () => {
    const permit = getPermit();
    permit.permitData.vehicleConfiguration.overallWidth = 0;
    const validationResult = await policy.validate(permit);
    expect(validationResult.violations).toHaveLength(1);
    expect(validationResult.warnings).toHaveLength(0);
  });

  it('should fail validation when Overall Height is not greater than 0', async () => {
    const permit = getPermit();
    permit.permitData.vehicleConfiguration.overallHeight = 0;
    const validationResult = await policy.validate(permit);
    expect(validationResult.violations).toHaveLength(1);
    expect(validationResult.warnings).toHaveLength(0);
  });

  it('should fail validation when Overall Length is not greater than 27.5m', async () => {
    const permit = getPermit();
    permit.permitData.vehicleConfiguration.overallLength = 25;
    const validationResult = await policy.validate(permit);
    expect(validationResult.violations).toHaveLength(1);
    expect(validationResult.warnings).toHaveLength(0);
  });

  it('should fail validation when Front Projection is not greater than 0', async () => {
    const permit = getPermit();
    permit.permitData.vehicleConfiguration.frontProjection = 0;
    const validationResult = await policy.validate(permit);
    expect(validationResult.violations).toHaveLength(1);
    expect(validationResult.warnings).toHaveLength(0);
  });

  it('should fail validation when Rear Projection is not greater than 0', async () => {
    const permit = getPermit();
    permit.permitData.vehicleConfiguration.rearProjection = 0;
    const validationResult = await policy.validate(permit);
    expect(validationResult.violations).toHaveLength(1);
    expect(validationResult.warnings).toHaveLength(0);
  });

  it('should fail validation when Weight over 27.5m is not greater than 0', async () => {
    const permit = getPermit();
    permit.permitData.vehicleConfiguration.overloadWeight = 0;
    const validationResult = await policy.validate(permit);
    expect(validationResult.violations).toHaveLength(1);
    expect(validationResult.warnings).toHaveLength(0);
  });

  it('should fail validation when Total Distance is not provided', async () => {
    const permit = getPermit();
    permit.permitData.permittedRoute.manualRoute.totalDistance = null;
    const validationResult = await policy.validate(permit);
    expect(validationResult.violations).toHaveLength(1);
    expect(validationResult.warnings).toHaveLength(0);
  });

  it('should fail validation when Total Distance is not greater than 0', async () => {
    const permit = getPermit();
    permit.permitData.permittedRoute.manualRoute.totalDistance = 0;
    const validationResult = await policy.validate(permit);
    expect(validationResult.violations).toHaveLength(1);
    expect(validationResult.warnings).toHaveLength(0);
  });

  it('should fail validation when Vehicle subtype is not part of allowable vehicles', async () => {
    const permit = getPermit();
    permit.permitData.vehicleDetails.vehicleSubType = "BUSCRUM";
    const validationResult = await policy.validate(permit);
    expect(validationResult.violations).toHaveLength(1);
    expect(validationResult.warnings).toHaveLength(0);
  });

  it('should pass when Vehicle subtype is part of allowable vehicles', async () => {
    const permit = getPermit();
    permit.permitData.vehicleDetails.vehicleSubType = "LWBTRCT";
    const validationResult = await policy.validate(permit);
    expect(validationResult.violations).toHaveLength(0);
    expect(validationResult.warnings).toHaveLength(0);
  });

  it('should fail validation when Vehicle subtype is a Trailer', async () => {
    const permit = getPermit();
    permit.permitData.vehicleDetails.vehicleType = "trailer";
    permit.permitData.vehicleDetails.vehicleSubType = "FULLLTL";
    const validationResult = await policy.validate(permit);
    expect(validationResult.violations).toHaveLength(1);
    expect(validationResult.warnings).toHaveLength(0);
  });

  it('should return only mandatory CVSE-1000 and CVSE-1070 for STWSE conditions', () => {
    const permit = getPermit();

    const conditions = policy.getConditionsForPermit(permit);
    expect(conditions).toHaveLength(2);
    expect(conditions.filter(
      condition => condition.condition === 'CVSE-1000' && condition.mandatory === true
    )).toHaveLength(1);

    expect(conditions.filter(
      condition => condition.condition === 'CVSE-1070' && condition.mandatory === true
    )).toHaveLength(1);
  });

  it('should calculate STWSE cost as a flat $15 oversize rate plus overload rate', async () => {
    const permit = getPermit();

    const validationResult = await policy.validate(permit);
    expect(validationResult.cost.length).toBe(2);
    expect(validationResult.cost[0].cost).toBe(15.00);
    expect(validationResult.cost[1].cost).toBe(268.00);
    expect(validationResult.cost[0].message).toBe("Oversize");
    expect(validationResult.cost[1].message).toBe("Overload");
  });

  it('should calculate STWSE cost as a flat $15 oversize rate plus minimum of $25 overload fee', async () => {
    const permit = getPermit();
    permit.permitData.vehicleConfiguration.overloadWeight = 1000;
    permit.permitData.permittedRoute.manualRoute.totalDistance = 100;
    const validationResult = await policy.validate(permit);
    expect(validationResult.cost.length).toBe(2);
    expect(validationResult.cost[0].cost).toBe(15.00);
    expect(validationResult.cost[1].cost).toBe(25.00);
  });

  it('should calculate STWSE cost as a flat $15 oversize rate plus overload fee above 28000kg', async () => {
    const permit = getPermit();
    permit.permitData.vehicleConfiguration.overloadWeight = 30700;
    permit.permitData.permittedRoute.manualRoute.totalDistance = 100;
    const validationResult = await policy.validate(permit);
    expect(validationResult.cost.length).toBe(2);
    expect(validationResult.cost[0].cost).toBe(15.00);
    expect(validationResult.cost[1].cost).toBe(270.00);
  });

  it('should calculate STWSE costs to be $0 for oversize and overload if no-fee flag is set', async () => {
    const permit = getPermit();
    const noFeePolicy = new Policy(
      currentConfig,
      {
        companyId: 1,
        isLcvAllowed: false,
        noFeeType: "CA_GOVT",
      },
    );

    const validationResult = await noFeePolicy.validate(permit);
    expect(validationResult.cost.length).toBe(2);
    expect(validationResult.cost[0].cost).toBe(0);
    expect(validationResult.cost[1].cost).toBe(0);
    expect(validationResult.cost[0].message).toBe("Oversize");
    expect(validationResult.cost[1].message).toBe("Overload");
  });

  it('should show warning when overall width is greater than 3.2m', async () => {
    const permit = getPermit();
    permit.permitData.vehicleConfiguration.overallWidth = 3.3;
    const validationResult = await policy.validate(permit);
    expect(validationResult.violations).toHaveLength(0);
    expect(validationResult.warnings).toHaveLength(1);
  });

  it('should show warning when overall length is greater than 31m', async () => {
    const permit = getPermit();
    permit.permitData.vehicleConfiguration.overallLength = 31.1;
    const validationResult = await policy.validate(permit);
    expect(validationResult.violations).toHaveLength(0);
    expect(validationResult.warnings).toHaveLength(1);
  });

  it('should show warning when overall height is greater than 4.3m', async () => {
    const permit = getPermit();
    permit.permitData.vehicleConfiguration.overallHeight = 4.4;
    const validationResult = await policy.validate(permit);
    expect(validationResult.violations).toHaveLength(0);
    expect(validationResult.warnings).toHaveLength(1);
  });

  it('should show multiple warnings and violations when there are multiple oversized dimensions', async () => {
    const permit = getPermit();
    permit.permitData.vehicleConfiguration.overallHeight = 5;
    permit.permitData.vehicleConfiguration.overallWidth = 4;
    permit.permitData.vehicleConfiguration.overallLength = 25;
    const validationResult = await policy.validate(permit);
    expect(validationResult.violations).toHaveLength(1);
    expect(validationResult.warnings).toHaveLength(2);
  });
});
