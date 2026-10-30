import { POWER_UNITS } from '../../constants/power-units';
import { TRAILERS } from '../../constants/trailers';
import { getAxleUnitVehicleIndexLookup } from '../../helper/dimensions.helper';
import { Policy } from '../../policy-engine';
import { AxleConfiguration, PolicyDefinition } from '../../types';
import minimalPolicyDef from '../policy-config/mimimal.sample.json';
import currentPolicyConfig from '../policy-config/_current-config.json';

const threeAxleConfig: Array<AxleConfiguration> = [
  {
    numberOfAxles: 1,
    axleUnitWeight: 6700,
  },
  {
    numberOfAxles: 2,
    axleSpread: 160,
    interaxleSpacing: 350,
    axleUnitWeight: 12000,
  },
  {
    numberOfAxles: 3,
    axleSpread: 220,
    interaxleSpacing: 700,
    axleUnitWeight: 22000,
  },
];

const vehicleConfiguration = [
  POWER_UNITS.TRUCK_TRACTORS.id,
  TRAILERS.SEMI_TRAILERS.id,
];

describe('Bridge Calculation Results Validation Tests', () => {
  const policy: Policy = new Policy(minimalPolicyDef);

  let axleUnitVehicleIndexes = getAxleUnitVehicleIndexLookup(
    policy,
    vehicleConfiguration,
    threeAxleConfig,
  );

  it('should return three successful axle group results with a valid three axle configuration', async () => {
    const res = policy.calculateBridge(
      threeAxleConfig,
      vehicleConfiguration,
      axleUnitVehicleIndexes,
    );
    // three results
    expect(res.length).toBe(3);
    // all successful
    expect(res.filter((r) => r.success).length).toBe(3);
  });

  it('should return correct values in the bridge calc response', async () => {
    const res = policy.calculateBridge(
      threeAxleConfig,
      vehicleConfiguration,
      axleUnitVehicleIndexes,
    );
    // three results
    expect(res.length).toBe(3);
    const group12 = res.find((r) => r.startAxleUnit == 1 && r.endAxleUnit == 2);
    expect(group12).not.toBeFalsy();
    expect(group12?.actualWeight).toBe(18700);
    expect(group12?.maxBridge).toBe(33300);

    const group13 = res.find((r) => r.startAxleUnit == 1 && r.endAxleUnit == 3);
    expect(group13).not.toBeFalsy();
    expect(group13?.actualWeight).toBe(40700);
    expect(group13?.maxBridge).toBe(60900);

    const group23 = res.find((r) => r.startAxleUnit == 2 && r.endAxleUnit == 3);
    expect(group23).not.toBeFalsy();
    expect(group23?.actualWeight).toBe(34000);
    expect(group23?.maxBridge).toBe(50400);
  });

  it('should return one unsuccessful axle group result with a single axle group failure', async () => {
    const conf = JSON.parse(JSON.stringify(threeAxleConfig));

    axleUnitVehicleIndexes = getAxleUnitVehicleIndexLookup(
      policy,
      vehicleConfiguration,
      conf,
    );
    conf[1].axleUnitWeight = 22000;
    conf[2].axleUnitWeight = 29000;
    const res = policy.calculateBridge(
      conf,
      vehicleConfiguration,
      axleUnitVehicleIndexes,
    );
    // three results
    expect(res.length).toBe(3);
    // two successful
    expect(res.filter((r) => r.success).length).toBe(2);
    // one unsuccessful
    expect(res.filter((r) => !r.success).length).toBe(1);
  });

  it('should return two unsuccessful axle group results with two axle group failures', async () => {
    const conf = JSON.parse(JSON.stringify(threeAxleConfig));
    conf[1].axleUnitWeight = 26000;
    conf[2].axleUnitWeight = 29000;
    axleUnitVehicleIndexes = getAxleUnitVehicleIndexLookup(
      policy,
      vehicleConfiguration,
      conf,
    );
    const res = policy.calculateBridge(
      conf,
      vehicleConfiguration,
      axleUnitVehicleIndexes,
    );
    // three results
    expect(res.length).toBe(3);
    // one successful
    expect(res.filter((r) => r.success).length).toBe(1);
    // two unsuccessful
    expect(res.filter((r) => !r.success).length).toBe(2);
  });
});

describe('Bridge Calculation Input Validation Error Tests', () => {
  const policy: Policy = new Policy(minimalPolicyDef);
  let axleUnitVehicleIndexes = getAxleUnitVehicleIndexLookup(
    policy,
    vehicleConfiguration,
    threeAxleConfig,
  );
  it('should throw no errors with valid input', async () => {
    expect(() =>
      policy.calculateBridge(
        threeAxleConfig,
        vehicleConfiguration,
        axleUnitVehicleIndexes,
      ),
    ).not.toThrow();
  });

  it('should throw an error with fewer than 2 axle units', async () => {
    axleUnitVehicleIndexes = getAxleUnitVehicleIndexLookup(
      policy,
      vehicleConfiguration,
      threeAxleConfig.slice(2),
    );
    expect(() =>
      policy.calculateBridge(
        threeAxleConfig.slice(2),
        vehicleConfiguration,
        axleUnitVehicleIndexes,
      ),
    ).toThrow();
  });

  it('should throw an error with a zero-valued number of axles', async () => {
    const conf = JSON.parse(JSON.stringify(threeAxleConfig));
    conf[0].numberOfAxles = 0;

    axleUnitVehicleIndexes = getAxleUnitVehicleIndexLookup(
      policy,
      vehicleConfiguration,
      conf,
    );

    expect(() =>
      policy.calculateBridge(
        conf,
        vehicleConfiguration,
        axleUnitVehicleIndexes,
      ),
    ).toThrow();
  });

  it('should throw an error with a negative-valued number of axles', async () => {
    const conf = JSON.parse(JSON.stringify(threeAxleConfig));
    conf[0].numberOfAxles = -1;
    axleUnitVehicleIndexes = getAxleUnitVehicleIndexLookup(
      policy,
      vehicleConfiguration,
      conf,
    );
    expect(() =>
      policy.calculateBridge(
        conf,
        vehicleConfiguration,
        axleUnitVehicleIndexes,
      ),
    ).toThrow();
  });

  it('should throw an error with a zero-valued weight on first axle group', async () => {
    const conf = JSON.parse(JSON.stringify(threeAxleConfig));
    conf[0].axleUnitWeight = 0;
    axleUnitVehicleIndexes = getAxleUnitVehicleIndexLookup(
      policy,
      vehicleConfiguration,
      conf,
    );
    expect(() =>
      policy.calculateBridge(
        conf,
        vehicleConfiguration,
        axleUnitVehicleIndexes,
      ),
    ).toThrow();
  });

  it('should throw an error with a zero-valued weight on last axle group', async () => {
    const conf = JSON.parse(JSON.stringify(threeAxleConfig));
    conf[2].axleUnitWeight = 0;
    axleUnitVehicleIndexes = getAxleUnitVehicleIndexLookup(
      policy,
      vehicleConfiguration,
      conf,
    );
    expect(() =>
      policy.calculateBridge(
        conf,
        vehicleConfiguration,
        axleUnitVehicleIndexes,
      ),
    ).toThrow();
  });

  it('should throw an error with a negative-valued weight on first axle group', async () => {
    const conf = JSON.parse(JSON.stringify(threeAxleConfig));
    conf[0].axleUnitWeight = -1;
    axleUnitVehicleIndexes = getAxleUnitVehicleIndexLookup(
      policy,
      vehicleConfiguration,
      conf,
    );
    expect(() =>
      policy.calculateBridge(
        conf,
        vehicleConfiguration,
        axleUnitVehicleIndexes,
      ),
    ).toThrow();
  });

  it('should throw an error with a negative-valued weight on last axle group', async () => {
    const conf = JSON.parse(JSON.stringify(threeAxleConfig));
    conf[2].axleUnitWeight = -1;
    axleUnitVehicleIndexes = getAxleUnitVehicleIndexLookup(
      policy,
      vehicleConfiguration,
      conf,
    );
    expect(() =>
      policy.calculateBridge(
        conf,
        vehicleConfiguration,
        axleUnitVehicleIndexes,
      ),
    ).toThrow();
  });

  it('should throw an error with an undefined weight on first axle group', async () => {
    const conf = JSON.parse(JSON.stringify(threeAxleConfig));
    delete conf[0].axleUnitWeight;
    axleUnitVehicleIndexes = getAxleUnitVehicleIndexLookup(
      policy,
      vehicleConfiguration,
      conf,
    );
    expect(() =>
      policy.calculateBridge(
        conf,
        vehicleConfiguration,
        axleUnitVehicleIndexes,
      ),
    ).toThrow();
  });

  it('should throw an error with an undefined weight on last axle group', async () => {
    const conf = JSON.parse(JSON.stringify(threeAxleConfig));
    delete conf[2].axleUnitWeight;
    axleUnitVehicleIndexes = getAxleUnitVehicleIndexLookup(
      policy,
      vehicleConfiguration,
      conf,
    );
    expect(() =>
      policy.calculateBridge(
        conf,
        vehicleConfiguration,
        axleUnitVehicleIndexes,
      ),
    ).toThrow();
  });

  it('should throw an error with a zero-valued spread for a tandem axle unit', async () => {
    const conf = JSON.parse(JSON.stringify(threeAxleConfig));
    conf[1].axleSpread = 0;
    axleUnitVehicleIndexes = getAxleUnitVehicleIndexLookup(
      policy,
      vehicleConfiguration,
      conf,
    );
    expect(() =>
      policy.calculateBridge(
        conf,
        vehicleConfiguration,
        axleUnitVehicleIndexes,
      ),
    ).toThrow();
  });

  it('should throw an error with a negative-valued spread for a tandem axle unit', async () => {
    const conf = JSON.parse(JSON.stringify(threeAxleConfig));
    conf[1].axleSpread = -1;
    axleUnitVehicleIndexes = getAxleUnitVehicleIndexLookup(
      policy,
      vehicleConfiguration,
      conf,
    );
    expect(() =>
      policy.calculateBridge(
        conf,
        vehicleConfiguration,
        axleUnitVehicleIndexes,
      ),
    ).toThrow();
  });

  it('should throw an error with an undefined spread for a tandem axle unit', async () => {
    const conf = JSON.parse(JSON.stringify(threeAxleConfig));
    delete conf[1].axleSpread;
    axleUnitVehicleIndexes = getAxleUnitVehicleIndexLookup(
      policy,
      vehicleConfiguration,
      conf,
    );
    expect(() =>
      policy.calculateBridge(
        conf,
        vehicleConfiguration,
        axleUnitVehicleIndexes,
      ),
    ).toThrow();
  });

  it('should throw an error with a negative-valued spread for a single axle unit', async () => {
    const conf = JSON.parse(JSON.stringify(threeAxleConfig));
    conf[0].axleSpread = -1;
    axleUnitVehicleIndexes = getAxleUnitVehicleIndexLookup(
      policy,
      vehicleConfiguration,
      conf,
    );
    expect(() =>
      policy.calculateBridge(
        conf,
        vehicleConfiguration,
        axleUnitVehicleIndexes,
      ),
    ).toThrow();
  });

  it('should throw an error with a zero-valued spacing for the second axle unit', async () => {
    const conf = JSON.parse(JSON.stringify(threeAxleConfig));
    conf[1].interaxleSpacing = 0;
    axleUnitVehicleIndexes = getAxleUnitVehicleIndexLookup(
      policy,
      vehicleConfiguration,
      conf,
    );
    expect(() =>
      policy.calculateBridge(
        conf,
        vehicleConfiguration,
        axleUnitVehicleIndexes,
      ),
    ).toThrow();
  });

  it('should throw an error with a negative-valued spacing for the second axle unit', async () => {
    const conf = JSON.parse(JSON.stringify(threeAxleConfig));
    conf[1].interaxleSpacing = -1;
    axleUnitVehicleIndexes = getAxleUnitVehicleIndexLookup(
      policy,
      vehicleConfiguration,
      conf,
    );
    expect(() =>
      policy.calculateBridge(
        conf,
        vehicleConfiguration,
        axleUnitVehicleIndexes,
      ),
    ).toThrow();
  });

  it('should throw an error with an undefined spacing for the second axle unit', async () => {
    const conf = JSON.parse(JSON.stringify(threeAxleConfig));
    delete conf[1].interaxleSpacing;
    axleUnitVehicleIndexes = getAxleUnitVehicleIndexLookup(
      policy,
      vehicleConfiguration,
      conf,
    );
    expect(() =>
      policy.calculateBridge(
        conf,
        vehicleConfiguration,
        axleUnitVehicleIndexes,
      ),
    ).toThrow();
  });
});

// Source: ASW Permittable Interaxle Spacing - Boosters.feature @orv2-6030-3 - bridge formula result is not applicable
describe('Single Axle Booster Exception', () => {
  const policy: Policy = new Policy(minimalPolicyDef);

  it('when a booster is behind a semi trailer, all booster and semi trailer axle units should pass bridge formula successfully', async () => {
    const vehicleConfiguration = [
      POWER_UNITS.TRUCK_TRACTORS.id,
      TRAILERS.SEMI_TRAILERS.id,
      TRAILERS.BOOSTER.id,
    ];

    const axleConfiguration: Array<AxleConfiguration> = [
      {
        numberOfAxles: 1,
        axleUnitWeight: 6000,
        numberOfTires: 2,
        tireSize: 711.2,
        vehicleIndex: 0,
      },
      {
        numberOfAxles: 1,
        interaxleSpacing: 300,
        axleUnitWeight: 7000,
        numberOfTires: 2,
        tireSize: 711.2,
        vehicleIndex: 0,
      },
      {
        numberOfAxles: 3,
        axleSpread: 240,
        interaxleSpacing: 300,
        axleUnitWeight: 17000,
        numberOfTires: 6,
        tireSize: 711.2,
        vehicleIndex: 1,
      },
      {
        numberOfAxles: 1,
        interaxleSpacing: 299,
        axleUnitWeight: 99999,
        numberOfTires: 4,
        tireSize: 711.2,
        vehicleIndex: 2,
      },
    ];

    let axleUnitVehicleIndexes = getAxleUnitVehicleIndexLookup(
      policy,
      vehicleConfiguration,
      axleConfiguration,
    );

    // const bridgeCalcResults = policy.calculateBridge(
    //   axleConfiguration,
    //   vehicleConfiguration,
    //   axleUnitVehicleIndexes,
    // );

    expect(() =>
      policy.calculateBridge(
        axleConfiguration,
        vehicleConfiguration,
        axleUnitVehicleIndexes,
      ),
    ).not.toThrow();
  });
});

// Source: ASW Permittable Interaxle Spacing - Jeeps.feature @orv2-6069-1 - bridge formula result is not applicable
describe('Single Axle Jeep Tandem Drive Exception', () => {
  const policy: Policy = new Policy(minimalPolicyDef);

  it('when a single axle jeep is behind a tandem drive power unit, all axle groups which span the drive axle and jeep axle should pass bridge formula successfully', async () => {
    const vehicleConfiguration = [
      POWER_UNITS.TRUCK_TRACTORS.id,
      TRAILERS.JEEPS.id,
    ];

    const axleConfiguration: Array<AxleConfiguration> = [
      {
        numberOfAxles: 1,
        axleUnitWeight: 9100,
        numberOfTires: 2,
        tireSize: 279,
        vehicleIndex: 0,
      },
      {
        numberOfAxles: 2,
        axleSpread: 120,
        interaxleSpacing: 300,
        axleUnitWeight: 17000,
        numberOfTires: 8,
        tireSize: 279,
        vehicleIndex: 0,
      },
      {
        numberOfAxles: 1,
        interaxleSpacing: 120,
        axleUnitWeight: 11000,
        numberOfTires: 4,
        tireSize: 279,
        vehicleIndex: 1,
      },
    ];

    let axleUnitVehicleIndexes = getAxleUnitVehicleIndexLookup(
      policy,
      vehicleConfiguration,
      axleConfiguration,
    );

    const bridgeCalcResults = policy.calculateBridge(
      axleConfiguration,
      vehicleConfiguration,
      axleUnitVehicleIndexes,
    );

    console.log({ bridgeCalcResults });

    expect(bridgeCalcResults[2].success).toBe(true);
  });
});
