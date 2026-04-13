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
      0,
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
    const results = policy.runAxleCalculation(vehicleConfiguration, ac, 0);
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
    const results = policy.runAxleCalculation(vehicleConfiguration, ac, 0);
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
    const results = policy.runAxleCalculation(vehicleConfiguration, ac, 0);
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
    const results = policy.runAxleCalculation(vehicleConfiguration, ac, 0);
    const permittableWeightResults = results.results.filter(
      (r) => r.id === PolicyCheckId.CheckPermittableWeight,
    );
    expect(
      permittableWeightResults.every(
        (r) => r.result === PolicyCheckResultType.Pass,
      ),
    ).toBe(true);
  });

  it('should fail policy check for steer axle tire size too large', async () => {
    const ac = JSON.parse(
      JSON.stringify(axleConfiguration),
    ) as Array<AxleConfiguration>;
    ac[0].tireSize = 460;
    const results = policy.runAxleCalculation(vehicleConfiguration, ac, 0);
    expect(
      results.results.every((r) => r.result === PolicyCheckResultType.Pass),
    ).toBe(false);
    const maxTireResults = results.results.filter(
      (r) => r.id === PolicyCheckId.MaxTireLoad,
    );
    expect(
      maxTireResults.every((r) => r.result === PolicyCheckResultType.Pass),
    ).toBe(false);
  });

  it('should fail policy check for steer axle too heavy with 445 tires', async () => {
    const ac = JSON.parse(
      JSON.stringify(axleConfiguration),
    ) as Array<AxleConfiguration>;
    ac[0].tireSize = 445;
    ac[0].axleUnitWeight = 9200;
    const results = policy.runAxleCalculation(vehicleConfiguration, ac, 0);
    expect(
      results.results.every((r) => r.result === PolicyCheckResultType.Pass),
    ).toBe(false);
    const maxTireResults = results.results.filter(
      (r) => r.id === PolicyCheckId.MaxTireLoad,
    );
    expect(
      maxTireResults.every((r) => r.result === PolicyCheckResultType.Pass),
    ).toBe(false);
  });

  it('should fail policy check for steer axle too heavy with standard tires', async () => {
    const ac = JSON.parse(
      JSON.stringify(axleConfiguration),
    ) as Array<AxleConfiguration>;
    ac[0].tireSize = 330;
    ac[0].axleUnitWeight = 6700;
    const results = policy.runAxleCalculation(vehicleConfiguration, ac, 0);
    expect(
      results.results.every((r) => r.result === PolicyCheckResultType.Pass),
    ).toBe(false);
    const maxTireResults = results.results.filter(
      (r) => r.id === PolicyCheckId.MaxTireLoad,
    );
    expect(
      maxTireResults.every((r) => r.result === PolicyCheckResultType.Pass),
    ).toBe(false);
  });

  it('should fail policy check for missing steer axle tire size', async () => {
    const ac = JSON.parse(
      JSON.stringify(axleConfiguration),
    ) as Array<AxleConfiguration>;
    delete ac[0].tireSize;
    const results = policy.runAxleCalculation(vehicleConfiguration, ac, 0);
    expect(
      results.results.every((r) => r.result === PolicyCheckResultType.Pass),
    ).toBe(false);
    const maxTireResults = results.results.filter(
      (r) => r.id === PolicyCheckId.MaxTireLoad,
    );
    expect(
      maxTireResults.every((r) => r.result === PolicyCheckResultType.Pass),
    ).toBe(false);
  });

  it('should fail policy check for missing trailer axle tire size', async () => {
    const ac = JSON.parse(
      JSON.stringify(axleConfiguration),
    ) as Array<AxleConfiguration>;
    delete ac[2].tireSize;
    const results = policy.runAxleCalculation(vehicleConfiguration, ac, 0);
    expect(
      results.results.every((r) => r.result === PolicyCheckResultType.Pass),
    ).toBe(false);
    const maxTireResults = results.results.filter(
      (r) => r.id === PolicyCheckId.MaxTireLoad,
    );
    expect(
      maxTireResults.every((r) => r.result === PolicyCheckResultType.Pass),
    ).toBe(false);
  });

  it('should fail policy check for axle too heavy with 445 tires', async () => {
    const ac = JSON.parse(
      JSON.stringify(axleConfiguration),
    ) as Array<AxleConfiguration>;
    ac[2].tireSize = 445;
    ac[2].axleUnitWeight = 3850 * (ac[2].numberOfTires || 0) + 1;
    const results = policy.runAxleCalculation(vehicleConfiguration, ac, 0);
    expect(
      results.results.every((r) => r.result === PolicyCheckResultType.Pass),
    ).toBe(false);
    const maxTireResults = results.results.filter(
      (r) => r.id === PolicyCheckId.MaxTireLoad,
    );
    expect(
      maxTireResults.every((r) => r.result === PolicyCheckResultType.Pass),
    ).toBe(false);
  });

  it('should fail policy check for axle too heavy with standard tires > 300', async () => {
    const ac = JSON.parse(
      JSON.stringify(axleConfiguration),
    ) as Array<AxleConfiguration>;
    ac[2].tireSize = 330;
    ac[2].axleUnitWeight = 3000 * (ac[2].numberOfTires || 0) + 1;
    const results = policy.runAxleCalculation(vehicleConfiguration, ac, 0);
    expect(
      results.results.every((r) => r.result === PolicyCheckResultType.Pass),
    ).toBe(false);
    const maxTireResults = results.results.filter(
      (r) => r.id === PolicyCheckId.MaxTireLoad,
    );
    expect(
      maxTireResults.every((r) => r.result === PolicyCheckResultType.Pass),
    ).toBe(false);
  });

  it('should fail policy check for axle too heavy with standard tires < 300', async () => {
    const ac = JSON.parse(
      JSON.stringify(axleConfiguration),
    ) as Array<AxleConfiguration>;
    ac[2].tireSize = 279;
    ac[2].axleUnitWeight = 2790 * (ac[2].numberOfTires || 0) + 1;
    const results = policy.runAxleCalculation(vehicleConfiguration, ac, 0);
    expect(
      results.results.every((r) => r.result === PolicyCheckResultType.Pass),
    ).toBe(false);
    const maxTireResults = results.results.filter(
      (r) => r.id === PolicyCheckId.MaxTireLoad,
    );
    expect(
      maxTireResults.every((r) => r.result === PolicyCheckResultType.Pass),
    ).toBe(false);
  });
});
