import { Policy } from '../../policy-engine';
import currentPolicyConfig from '../policy-config/_current-config.json';
import testStow from '../permit-app/test-stow.json';
import { PolicyCheckId, PolicyCheckResultType } from '../../enum';
import { AxleConfiguration } from '../../types';

describe('Axle Calculation Functions', () => {
  const policy: Policy = new Policy(currentPolicyConfig);
  const permit = JSON.parse(JSON.stringify(testStow));
  const vehicleConfiguration = policy.getSimplifiedVehicleConfiguration(
    permit.permitData.vehicleDetails,
    permit.permitData.vehicleConfiguration,
  );
  const axleConfiguration =
    permit.permitData.vehicleConfiguration.axleConfiguration;

  it('should return no failing policy checks for valid STOW', async () => {
    const results = policy.runAxleCalculation(
      vehicleConfiguration,
      axleConfiguration,
    );
    expect(
      results.results.every((r) => r.result === PolicyCheckResultType.Pass),
    ).toBe(true);
  });

  it('should fail policy check for invalid number of tires', async () => {
    const ac = JSON.parse(
      JSON.stringify(axleConfiguration),
    ) as Array<AxleConfiguration>;
    ac[0].numberOfTires = 3;
    const results = policy.runAxleCalculation(vehicleConfiguration, ac);
    expect(
      results.results.every((r) => r.result === PolicyCheckResultType.Pass),
    ).toBe(false);
    const numTiresResults = results.results.filter(
      (r) => r.id === PolicyCheckId.NumberOfWheelsPerAxle,
    );
    expect(
      numTiresResults.every((r) => r.result === PolicyCheckResultType.Pass),
    ).toBe(false);
  });

  it('should fail policy check for failed bridge calculation', async () => {
    const ac = JSON.parse(
      JSON.stringify(axleConfiguration),
    ) as Array<AxleConfiguration>;
    ac[0].axleUnitWeight = 40000;
    const results = policy.runAxleCalculation(vehicleConfiguration, ac);
    expect(
      results.results.every((r) => r.result === PolicyCheckResultType.Pass),
    ).toBe(false);
    const bridgeResults = results.results.filter(
      (r) => r.id === PolicyCheckId.BridgeFormula,
    );
    expect(
      bridgeResults.every((r) => r.result === PolicyCheckResultType.Pass),
    ).toBe(false);
  });

  it('should fail policy check for axle unit over permittable weight', async () => {
    const ac = JSON.parse(
      JSON.stringify(axleConfiguration),
    ) as Array<AxleConfiguration>;
    ac[ac.length - 1].axleUnitWeight = 40000;
    const results = policy.runAxleCalculation(vehicleConfiguration, ac);
    expect(
      results.results.every((r) => r.result === PolicyCheckResultType.Pass),
    ).toBe(false);
    const permittableWeightResults = results.results.filter(
      (r) => r.id === PolicyCheckId.CheckPermittableWeight,
    );
    expect(
      permittableWeightResults.every(
        (r) => r.result === PolicyCheckResultType.Pass,
      ),
    ).toBe(false);
  });

  it('should pass policy check for axle unit exactly at permittable weight', async () => {
    const ac = JSON.parse(
      JSON.stringify(axleConfiguration),
    ) as Array<AxleConfiguration>;
    // The final vehicle in this configuration is a tandem booster which uses
    // default weight dimensions
    ac[ac.length - 1].axleUnitWeight = 23000;
    const results = policy.runAxleCalculation(vehicleConfiguration, ac);
    const permittableWeightResults = results.results.filter(
      (r) => r.id === PolicyCheckId.CheckPermittableWeight,
    );
    expect(
      permittableWeightResults.every(
        (r) => r.result === PolicyCheckResultType.Pass,
      ),
    ).toBe(true);
  });
});
