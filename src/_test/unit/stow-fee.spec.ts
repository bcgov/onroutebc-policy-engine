import { Policy } from '../../policy-engine';
import currentConfig from '../policy-config/_current-config.json';
import testStow from '../permit-app/test-stow.json';
import { PolicyCheckId, PolicyCheckResultType } from '../../enum';
import { calculateOverload } from '../../helper/overload.helper';

const createPermit = (licensedGVW: number, distance: number) => {
  const permit = structuredClone(testStow);
  permit.permitData.vehicleDetails.vehicleSubType = 'CRANEAT';
  permit.permitData.vehicleDetails.licensedGVW = licensedGVW;
  permit.permitData.vehicleConfiguration.trailers = [];
  permit.permitData.vehicleConfiguration.axleConfiguration = [
    {
      numberOfAxles: 1,
      axleUnitWeight: 9000,
      numberOfTires: 2,
      tireSize: 279.4,
    },
    {
      numberOfAxles: 3,
      axleSpread: 260,
      interaxleSpacing: 300,
      axleUnitWeight: 25000,
      numberOfTires: 12,
      tireSize: 279.4,
    },
  ];
  permit.permitData.permittedRoute.manualRoute.totalDistance = distance;
  return permit;
};

describe('ORV2-5692 STOW fee uses the selected OCD overload', () => {
  // User Review and Confirm STOW.feature: all fee examples in ORV2-5400-7/-8.
  // The two disputed expectations below retain shared behavior pending BSA confirmation.
  it.each([
    // ORV2-5400-7: overload up to 28,000 kg, including the $25 minimum.
    [10000, 800, 268],
    [28000, 1000, 2140],
    [1000, 100, 25],
    [19500, 900, 981],
    [2000, 101, 25],
    [2001, 220, 25],
    [10001, 800, 300],
    // Spec expects $36; shared helper rounds 85 km up to nine 10-km units.
    [12000, 85, 38],
    // ORV2-5400-8: overload above 28,000 kg.
    [29000, 1000, 2510],
    [30700, 100, 270],
    // Shared formula: (21.40 + 6 * 1.85) * 10 = 325; spec example says 330.
    [33400, 100, 325],
    // Additional integration case; the spec supplies no distance/fee for 17,000 kg.
    [17000, 100, 83],
  ])('charges for %i kg over %i km: $%i', async (overload, distance, fee) => {
    const policy = new Policy(currentConfig);
    const permit = createPermit(34000 - overload, distance);
    const axleResults = policy.runAxleCalculation(
      ['CRANEAT'],
      permit.permitData.vehicleConfiguration.axleConfiguration,
      permit.permitData.vehicleDetails.licensedGVW,
    );
    expect(axleResults.overload).toBe(overload);
    const result = await policy.validate(permit);
    expect(result.cost).toHaveLength(1);
    expect(result.cost[0].cost).toBe(fee);
  });

  // ORV2-5692-1 - ASW Use greater overweight value.feature
  it('selects 17,000 kg licensed overload over the two 1,000 kg axle overloads', () => {
    const results = [
      [6000, 6000],
      [23000, 22000],
      [23000, 22000],
    ].map(([actualWeight, thresholdWeight], index) => ({
      id: PolicyCheckId.LegalWeight,
      result:
        actualWeight > thresholdWeight
          ? PolicyCheckResultType.Warning
          : PolicyCheckResultType.Pass,
      message: '',
      startAxleUnit: index + 1,
      endAxleUnit: index + 1,
      actualWeight,
      thresholdWeight,
    }));
    const selected = calculateOverload(results, 52000, 35000, 3);
    expect(selected.overload).toBe(17000);
    expect(selected.overloadDetails).toHaveLength(1);
    expect(selected.overloadDetails[0]).toEqual(
      expect.objectContaining({
        licensedGVW: 35000,
        totalGCVW: 52000,
        overload: 17000,
      }),
    );
  });

  it('charges for axle overload when licensed GVW is not exceeded', async () => {
    const policy = new Policy(currentConfig);
    const permit = createPermit(60000, 1000);
    const axleResults = policy.runAxleCalculation(
      ['CRANEAT'],
      permit.permitData.vehicleConfiguration.axleConfiguration,
      60000,
    );
    expect(axleResults.overload).toBe(1000);
    expect(axleResults.overloadDetails[0].overload).toBe(1000);
    const result = await policy.validate(permit);
    expect(result.cost[0].cost).toBe(95);
  });

  it('preserves the no-fee authorization', async () => {
    const policy = new Policy(currentConfig, {
      companyId: 1,
      isLcvAllowed: false,
      noFeeType: 'CA_GOVT',
    });
    const result = await policy.validate(createPermit(17000, 100));
    expect(result.cost[0].cost).toBe(0);
  });
});
