import { POWER_UNIT_CODES } from '../../constants/power-unit-codes';
import { TRAILER_CODES } from '../../constants/trailer-codes';
import { getAxleUnitVehicleIndexLookup } from '../../helper/dimensions.helper';
import { Policy } from '../../policy-engine';
import { AxleConfiguration } from '../../types';
import minimalPolicyDef from '../policy-config/mimimal.sample.json';

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
  POWER_UNIT_CODES.TRUCK_TRACTORS,
  TRAILER_CODES.SEMI_TRAILERS,
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

describe('ASW Tandem Drive Single Axle Jeep Exception', () => {
  const policy: Policy = new Policy(minimalPolicyDef);

  it('should allow exception for tandem drive + single axle jeep', async () => {
    const vehicleConfig = [
      POWER_UNIT_CODES.TRUCK_TRACTORS,
      TRAILER_CODES.JEEPS,
    ];

    const tandemDriveSingleAxleJepConfig = [
      {
        numberOfAxles: 1,
        axleUnitWeight: 14000,
        numberOfTires: 2,
        tireSize: 279,
      },
      {
        numberOfAxles: 2,
        axleSpread: 250,
        interaxleSpacing: 250,
        axleUnitWeight: 14000,
        numberOfTires: 4,
        tireSize: 279,
      },
      {
        numberOfAxles: 1,
        interaxleSpacing: 200,
        axleUnitWeight: 5000,
        numberOfTires: 2,
        tireSize: 279,
      },
    ];

    let axleUnitVehicleIndexes = getAxleUnitVehicleIndexLookup(
      policy,
      vehicleConfiguration,
      tandemDriveSingleAxleJepConfig,
    );

    expect(() =>
      policy.calculateBridge(
        tandemDriveSingleAxleJepConfig,
        vehicleConfig,
        axleUnitVehicleIndexes,
      ),
    ).not.toThrow();
  });
});

// Source: ASW Permittable Interaxle Spacing - Boosters.feature @orv2-6030-3
describe('Single Axle Booster Exception', () => {
  const policy: Policy = new Policy(minimalPolicyDef);

  // TOASK do we skip bridge formula for the entire axle configuration or only when the booster is actively being checked against?
  it('should pass bridge formula successfully for a booster behind a semi trailer', async () => {
    const vehicleConfiguration = ['TRKTRAC', 'SEMITRL', 'BOOSTER'];

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
        interaxleSpacing: 300,
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

    expect(() =>
      policy.calculateBridge(
        axleConfiguration,
        vehicleConfiguration,
        axleUnitVehicleIndexes,
      ),
    ).not.toThrow();
  });
});
