import { Policy } from 'onroute-policy-engine';
import currentConfig from '../policy-config/_current-config.json';

//#region AxleConfiguration constants
const axleConfig11 = [
  { numberOfAxles: 1, axleUnitWeight: 0 },
  { numberOfAxles: 1, axleUnitWeight: 0 },
];
const axleConfig12 = [
  { numberOfAxles: 1, axleUnitWeight: 0 },
  { numberOfAxles: 2, axleUnitWeight: 0 },
];
const axleConfig13 = [
  { numberOfAxles: 1, axleUnitWeight: 0 },
  { numberOfAxles: 3, axleUnitWeight: 0 },
];
const axleConfig14 = [
  { numberOfAxles: 1, axleUnitWeight: 0 },
  { numberOfAxles: 4, axleUnitWeight: 0 },
];
const axleConfig22 = [
  { numberOfAxles: 2, axleUnitWeight: 0 },
  { numberOfAxles: 2, axleUnitWeight: 0 },
];
const axleConfig23 = [
  { numberOfAxles: 2, axleUnitWeight: 0 },
  { numberOfAxles: 3, axleUnitWeight: 0 },
];
const axleConfig24 = [
  { numberOfAxles: 2, axleUnitWeight: 0 },
  { numberOfAxles: 4, axleUnitWeight: 0 },
];
const axleConfig33 = [
  { numberOfAxles: 3, axleUnitWeight: 0 },
  { numberOfAxles: 3, axleUnitWeight: 0 },
];
const axleConfig34 = [
  { numberOfAxles: 3, axleUnitWeight: 0 },
  { numberOfAxles: 4, axleUnitWeight: 0 },
];
const axleConfig44 = [
  { numberOfAxles: 4, axleUnitWeight: 0 },
  { numberOfAxles: 4, axleUnitWeight: 0 },
];
const axleConfig1 = [{ numberOfAxles: 1, axleUnitWeight: 0 }];
const axleConfig1s = [
  { numberOfAxles: 1, axleUnitWeight: 0, interaxleSpacing: 1.5 },
];
const axleConfig1l = [
  { numberOfAxles: 1, axleUnitWeight: 0, interaxleSpacing: 6 },
];
const axleConfig2 = [{ numberOfAxles: 2, axleUnitWeight: 0 }];
const axleConfig2m = [
  { numberOfAxles: 2, axleUnitWeight: 0, interaxleSpacing: 4 },
];
const axleConfig3 = [{ numberOfAxles: 3, axleUnitWeight: 0 }];
const axleConfig4 = [{ numberOfAxles: 4, axleUnitWeight: 0 }];
const axleConfig5 = [{ numberOfAxles: 5, axleUnitWeight: 0 }];
const axleConfig7 = [{ numberOfAxles: 7, axleUnitWeight: 0 }];
//#endregion

describe('Simple power unit vehicle display code tests', () => {
  const policy: Policy = new Policy(currentConfig);

  it('should generate a correct display code for a single steer, single drive power unit', async () => {
    const configuration = ['TRKTRAC'];
    const displayCode = policy.getVehicleDisplayCode(
      configuration,
      axleConfig11,
    );
    expect(displayCode).toBe('TT1S11D2');
  });

  it('should generate a correct display code for a single steer, tandem drive power unit', async () => {
    const configuration = ['TRKTRAC'];
    const displayCode = policy.getVehicleDisplayCode(
      configuration,
      axleConfig12,
    );
    expect(displayCode).toBe('TT1S12D2');
  });

  it('should generate a correct display code for a single steer, tridem drive power unit', async () => {
    const configuration = ['TRKTRAC'];
    const displayCode = policy.getVehicleDisplayCode(
      configuration,
      axleConfig13,
    );
    expect(displayCode).toBe('TT1S13D2');
  });

  it('should generate a correct display code for a single steer, quad drive power unit', async () => {
    const configuration = ['TRKTRAC'];
    const displayCode = policy.getVehicleDisplayCode(
      configuration,
      axleConfig14,
    );
    expect(displayCode).toBe('TT1S14D2');
  });

  it('should generate a correct display code for a tandem steer, tandem drive power unit', async () => {
    const configuration = ['TRKTRAC'];
    const displayCode = policy.getVehicleDisplayCode(
      configuration,
      axleConfig22,
    );
    expect(displayCode).toBe('TT2S1-2D2');
  });

  it('should generate a correct display code for a tandem steer, tridem drive power unit', async () => {
    const configuration = ['TRKTRAC'];
    const displayCode = policy.getVehicleDisplayCode(
      configuration,
      axleConfig23,
    );
    expect(displayCode).toBe('TT2S1-3D2');
  });

  it('should generate a correct display code for a tandem steer, quad drive power unit', async () => {
    const configuration = ['TRKTRAC'];
    const displayCode = policy.getVehicleDisplayCode(
      configuration,
      axleConfig24,
    );
    expect(displayCode).toBe('TT2S1-4D2');
  });

  it('should generate a correct display code for a tridem steer, tridem drive power unit', async () => {
    const configuration = ['TRKTRAC'];
    const displayCode = policy.getVehicleDisplayCode(
      configuration,
      axleConfig33,
    );
    expect(displayCode).toBe('TT3S1--3D2');
  });

  it('should generate a correct display code for a tridem steer, quad drive power unit', async () => {
    const configuration = ['TRKTRAC'];
    const displayCode = policy.getVehicleDisplayCode(
      configuration,
      axleConfig34,
    );
    expect(displayCode).toBe('TT3S1--4D2');
  });

  it('should generate a correct display code for a quad steer, quad drive power unit', async () => {
    const configuration = ['TRKTRAC'];
    const displayCode = policy.getVehicleDisplayCode(
      configuration,
      axleConfig44,
    );
    expect(displayCode).toBe('TT4S1---4D2');
  });

  it('should generate a correct display code for a single steer, tandem drive power unit with NONE trailer', async () => {
    const configuration = ['TRKTRAC', 'XXXXXXX'];
    const displayCode = policy.getVehicleDisplayCode(
      configuration,
      axleConfig12,
    );
    expect(displayCode).toBe('TT1S12D2');
  });

  it('should generate a correct display code for configuration with more than 9 axle units', async () => {
    const configuration = [
      'TRKTRAC',
      'JEEPSRG',
      'JEEPSRG',
      'JEEPSRG',
      'JEEPSRG',
      'JEEPSRG',
      'JEEPSRG',
      'JEEPSRG',
      'JEEPSRG',
      'SEMITRL',
      'BOOSTER',
    ];
    const displayCode = policy.getVehicleDisplayCode(configuration, [
      ...axleConfig12,
      ...axleConfig1,
      ...axleConfig1,
      ...axleConfig1,
      ...axleConfig1,
      ...axleConfig1,
      ...axleConfig1,
      ...axleConfig1,
      ...axleConfig1,
      ...axleConfig1,
      ...axleConfig1,
    ]);
    expect(displayCode).toBe('TT1S12D2-1J31J41J51J61J71J81J91J.101T.111B.12');
  });
});

describe('Simple multisteer power unit vehicle display code tests', () => {
  const policy: Policy = new Policy(currentConfig);

  it('should generate a correct display code for a single steer, single drive multisteer power unit', async () => {
    const configuration = ['CRANEAT'];
    const displayCode = policy.getVehicleDisplayCode(
      configuration,
      axleConfig11,
    );
    expect(displayCode).toBe('MC1S11A2');
  });

  it('should generate a correct display code for a single steer, tandem drive multisteer power unit', async () => {
    const configuration = ['CRANEAT'];
    const displayCode = policy.getVehicleDisplayCode(
      configuration,
      axleConfig12,
    );
    expect(displayCode).toBe('MC1S12A2');
  });

  it('should generate a correct display code for a single steer, tridem drive multisteer power unit', async () => {
    const configuration = ['CRANEAT'];
    const displayCode = policy.getVehicleDisplayCode(
      configuration,
      axleConfig13,
    );
    expect(displayCode).toBe('MC1S13A2');
  });

  it('should generate a correct display code for a single steer, quad drive multisteer power unit', async () => {
    const configuration = ['CRANEAT'];
    const displayCode = policy.getVehicleDisplayCode(
      configuration,
      axleConfig14,
    );
    expect(displayCode).toBe('MC1S14A2');
  });

  it('should generate a correct display code for a tandem steer, tandem drive multisteer power unit', async () => {
    const configuration = ['CRANEAT'];
    const displayCode = policy.getVehicleDisplayCode(
      configuration,
      axleConfig22,
    );
    expect(displayCode).toBe('MC2S1-2A2');
  });

  it('should generate a correct display code for a tandem steer, tridem drive multisteer power unit', async () => {
    const configuration = ['CRANEAT'];
    const displayCode = policy.getVehicleDisplayCode(
      configuration,
      axleConfig23,
    );
    expect(displayCode).toBe('MC2S1-3A2');
  });

  it('should generate a correct display code for a tandem steer, quad drive multisteer power unit', async () => {
    const configuration = ['CRANEAT'];
    const displayCode = policy.getVehicleDisplayCode(
      configuration,
      axleConfig24,
    );
    expect(displayCode).toBe('MC2S1-4A2');
  });

  it('should generate a correct display code for a tridem steer, tridem drive multisteer power unit', async () => {
    const configuration = ['CRANEAT'];
    const displayCode = policy.getVehicleDisplayCode(
      configuration,
      axleConfig33,
    );
    expect(displayCode).toBe('MC3S1--3A2');
  });

  it('should generate a correct display code for a tridem steer, quad drive multisteer power unit', async () => {
    const configuration = ['CRANEAT'];
    const displayCode = policy.getVehicleDisplayCode(
      configuration,
      axleConfig34,
    );
    expect(displayCode).toBe('MC3S1--4A2');
  });

  it('should generate a correct display code for a quad steer, quad drive multisteer power unit', async () => {
    const configuration = ['CRANEAT'];
    const displayCode = policy.getVehicleDisplayCode(
      configuration,
      axleConfig44,
    );
    expect(displayCode).toBe('MC4S1---4A2');
  });
});

describe('Power unit with trailer display code tests', () => {
  const policy: Policy = new Policy(currentConfig);

  it('should generate a correct display code for a single steer, single drive power unit and single trailer', async () => {
    const configuration = ['TRKTRAC', 'SEMITRL'];
    const displayCode = policy.getVehicleDisplayCode(configuration, [
      ...axleConfig11,
      ...axleConfig1,
    ]);
    expect(displayCode).toBe('TT1S11D21T3');
  });

  it('should generate a correct display code for a single steer, single drive power unit and tandem trailer', async () => {
    const configuration = ['TRKTRAC', 'SEMITRL'];
    const displayCode = policy.getVehicleDisplayCode(configuration, [
      ...axleConfig11,
      ...axleConfig2,
    ]);
    expect(displayCode).toBe('TT1S11D22T3');
  });

  it('should generate a correct display code for a single steer, tandem drive power unit and single trailer', async () => {
    const configuration = ['TRKTRAC', 'SEMITRL'];
    const displayCode = policy.getVehicleDisplayCode(configuration, [
      ...axleConfig12,
      ...axleConfig1,
    ]);
    expect(displayCode).toBe('TT1S12D2-1T3');
  });

  it('should generate a correct display code for a single steer, tandem drive power unit and tandem trailer', async () => {
    const configuration = ['TRKTRAC', 'SEMITRL'];
    const displayCode = policy.getVehicleDisplayCode(configuration, [
      ...axleConfig12,
      ...axleConfig2,
    ]);
    expect(displayCode).toBe('TT1S12D2-2T3');
  });

  it('should generate a correct display code for a single steer, tandem drive power unit and tridem trailer', async () => {
    const configuration = ['TRKTRAC', 'SEMITRL'];
    const displayCode = policy.getVehicleDisplayCode(configuration, [
      ...axleConfig12,
      ...axleConfig3,
    ]);
    expect(displayCode).toBe('TT1S12D2-3T3');
  });

  it('should generate a correct display code for a single steer, tandem drive power unit and quad trailer', async () => {
    const configuration = ['TRKTRAC', 'SEMITRL'];
    const displayCode = policy.getVehicleDisplayCode(configuration, [
      ...axleConfig12,
      ...axleConfig4,
    ]);
    expect(displayCode).toBe('TT1S12D2-4T3');
  });

  it('should generate a correct display code for a single steer, tridem drive power unit and single trailer', async () => {
    const configuration = ['TRKTRAC', 'SEMITRL'];
    const displayCode = policy.getVehicleDisplayCode(configuration, [
      ...axleConfig13,
      ...axleConfig1,
    ]);
    expect(displayCode).toBe('TT1S13D2--1T3');
  });

  it('should generate a correct display code for a single steer, quad drive power unit and single trailer', async () => {
    const configuration = ['TRKTRAC', 'SEMITRL'];
    const displayCode = policy.getVehicleDisplayCode(configuration, [
      ...axleConfig14,
      ...axleConfig1,
    ]);
    expect(displayCode).toBe('TT1S14D2---1T3');
  });
});

describe('Multisteer power unit with dolly display code tests', () => {
  const policy: Policy = new Policy(currentConfig);

  it('should generate a correct display code for a single steer, single drive multisteer power unit with single dolly', async () => {
    const configuration = ['CRANEAT', 'DOLLIES'];
    const displayCode = policy.getVehicleDisplayCode(configuration, [
      ...axleConfig11,
      ...axleConfig1,
    ]);
    expect(displayCode).toBe('MC1S11A21B3');
  });

  it('should generate a correct display code for a single steer, single drive multisteer power unit with tandem dolly', async () => {
    const configuration = ['CRANEAT', 'DOLLIES'];
    const displayCode = policy.getVehicleDisplayCode(configuration, [
      ...axleConfig11,
      ...axleConfig2,
    ]);
    expect(displayCode).toBe('MC1S11A22B3');
  });

  it('should generate a correct display code for a single steer, tandem drive multisteer power unit with single dolly', async () => {
    const configuration = ['CRANEAT', 'DOLLIES'];
    const displayCode = policy.getVehicleDisplayCode(configuration, [
      ...axleConfig12,
      ...axleConfig1,
    ]);
    expect(displayCode).toBe('MC1S12A2-1B3');
  });

  it('should generate a correct display code for a single steer, tandem drive multisteer power unit with tandem dolly', async () => {
    const configuration = ['CRANEAT', 'DOLLIES'];
    const displayCode = policy.getVehicleDisplayCode(configuration, [
      ...axleConfig12,
      ...axleConfig2,
    ]);
    expect(displayCode).toBe('MC1S12A2-2B3');
  });

  it('should generate a correct display code for a single steer, tandem drive multisteer power unit with tridem dolly', async () => {
    const configuration = ['CRANEAT', 'DOLLIES'];
    const displayCode = policy.getVehicleDisplayCode(configuration, [
      ...axleConfig12,
      ...axleConfig3,
    ]);
    expect(displayCode).toBe('MC1S12A2-3B3');
  });

  it('should generate a correct display code for a single steer, tandem drive multisteer power unit with quad dolly', async () => {
    const configuration = ['CRANEAT', 'DOLLIES'];
    const displayCode = policy.getVehicleDisplayCode(configuration, [
      ...axleConfig12,
      ...axleConfig4,
    ]);
    expect(displayCode).toBe('MC1S12A2-4B3');
  });

  it('should generate a correct display code for a single steer, tridem drive multisteer power unit with single dolly', async () => {
    const configuration = ['CRANEAT', 'DOLLIES'];
    const displayCode = policy.getVehicleDisplayCode(configuration, [
      ...axleConfig13,
      ...axleConfig1,
    ]);
    expect(displayCode).toBe('MC1S13A2--1B3');
  });

  it('should generate a correct display code for a single steer, quad drive multisteer power unit with single dolly', async () => {
    const configuration = ['CRANEAT', 'DOLLIES'];
    const displayCode = policy.getVehicleDisplayCode(configuration, [
      ...axleConfig14,
      ...axleConfig1,
    ]);
    expect(displayCode).toBe('MC1S14A2---1B3');
  });
});

describe('Power unit with jeep, trailer, and booster display code tests', () => {
  const policy: Policy = new Policy(currentConfig);

  it('should generate a correct display code for a single steer, single drive power unit, single jeep, single trailer, and single booster', async () => {
    const configuration = ['TRKTRAC', 'JEEPSRG', 'SEMITRL', 'BOOSTER'];
    const displayCode = policy.getVehicleDisplayCode(configuration, [
      ...axleConfig11,
      ...axleConfig1,
      ...axleConfig1,
      ...axleConfig1,
    ]);
    expect(displayCode).toBe('TT1S11D21J31T41B5');
  });

  it('should generate a correct display code for a single steer, tridem drive power unit, tandem jeep, tridem trailer, and single booster', async () => {
    const configuration = ['TRKTRAC', 'JEEPSRG', 'SEMITRL', 'BOOSTER'];
    const displayCode = policy.getVehicleDisplayCode(configuration, [
      ...axleConfig13,
      ...axleConfig2,
      ...axleConfig3,
      ...axleConfig1,
    ]);
    expect(displayCode).toBe('TT1S13D2--2J3-3T4--1B5');
  });
});

describe('Additional axle display code tests', () => {
  const policy: Policy = new Policy(currentConfig);

  it('should generate a correct display code for a single steer, single drive multisteer power unit with single additional axle', async () => {
    const configuration = ['CRANEAT', 'ATCAXLE'];
    const displayCode = policy.getVehicleDisplayCode(configuration, [
      ...axleConfig11,
      ...axleConfig1,
    ]);
    expect(displayCode).toBe('MC1S11A21A3');
  });

  it('should generate a correct display code for a tandem steer, tridem drive multisteer power unit with three tandem additional axles', async () => {
    const configuration = ['CRANEAT', 'ATCAXLE', 'ATCAXLE', 'ATCAXLE'];
    const displayCode = policy.getVehicleDisplayCode(configuration, [
      ...axleConfig23,
      ...axleConfig2,
      ...axleConfig2,
      ...axleConfig2,
    ]);
    expect(displayCode).toBe('MC2S1-3A2--2A3-2A4-2A5');
  });

  it('should generate a correct display code for a single steer, tridem drive power unit, tridem platform trailer with two additional tandem axles, and single booster', async () => {
    const configuration = [
      'TRKTRAC',
      'PLATFRM',
      'PFMAXLE',
      'PFMAXLE',
      'BOOSTER',
    ];
    const displayCode = policy.getVehicleDisplayCode(configuration, [
      ...axleConfig13,
      ...axleConfig3,
      ...axleConfig2,
      ...axleConfig2,
      ...axleConfig1,
    ]);
    expect(displayCode).toBe('TT1S13D2--3B3--2A4-2A5-1B6');
  });
});

describe('Universal display code tests', () => {
  const policy: Policy = new Policy(currentConfig);

  it('should generate a universal display code for configuration with an unknown vehicle type (single axles)', async () => {
    const configuration = ['TRKTRAC', '__INVALID'];
    const displayCode = policy.getVehicleDisplayCode(configuration, [
      ...axleConfig11,
      ...axleConfig1,
    ]);
    expect(displayCode).toBe('=1U1MU1U2MU1U3');
  });

  it('should generate a universal display code for configuration with an unknown vehicle type (multi axles)', async () => {
    const configuration = ['TRKTRAC', 'JEEPSRG', 'SEMITRL', '__INVALID'];
    const displayCode = policy.getVehicleDisplayCode(configuration, [
      ...axleConfig23,
      ...axleConfig2,
      ...axleConfig3,
      ...axleConfig2,
    ]);
    expect(displayCode).toBe('=2U1=MU3U2==MU2U3=MU3U4==MU2U5');
  });

  it('should generate a universal display code for configuration with at least one axle unit greater than 4 axles', async () => {
    const configuration = ['TRKTRAC', 'JEEPSRG', 'SEMITRL', 'BOOSTER'];
    const displayCode = policy.getVehicleDisplayCode(configuration, [
      ...axleConfig23,
      ...axleConfig2,
      ...axleConfig5,
      ...axleConfig2,
    ]);
    expect(displayCode).toBe('=2U1=MU3U2==MU2U3=MU4+U4===EUMU2U5');
  });

  it('should generate a universal display code for axle unit with 7 axles', async () => {
    const configuration = ['TRKTRAC', 'JEEPSRG', 'SEMITRL', 'BOOSTER'];
    const displayCode = policy.getVehicleDisplayCode(configuration, [
      ...axleConfig23,
      ...axleConfig2,
      ...axleConfig7,
      ...axleConfig2,
    ]);
    expect(displayCode).toBe('=2U1=MU3U2==MU2U3=MU4+U4===XUXUEUMU2U5');
  });

  it('should generate a correct universal display code for configuration with more than 9 axle units', async () => {
    const configuration = [
      'TRKTRAC',
      'JEEPSRG',
      'JEEPSRG',
      'JEEPSRG',
      'JEEPSRG',
      'JEEPSRG',
      'JEEPSRG',
      'JEEPSRG',
      'JEEPSRG',
      'SEMITRL',
      'BOOSTER',
    ];
    const displayCode = policy.getVehicleDisplayCode(configuration, [
      ...axleConfig12,
      ...axleConfig1,
      ...axleConfig1,
      ...axleConfig1,
      ...axleConfig1,
      ...axleConfig1,
      ...axleConfig1,
      ...axleConfig1,
      ...axleConfig1,
      ...axleConfig1,
      ...axleConfig5,
    ]);
    expect(displayCode).toBe(
      '=1U1MU2U2=MU1U3MU1U4MU1U5MU1U6MU1U7MU1U8MU1U9MU1U.10MU1U.11MU4+U.12===EU',
    );
  });

  it('should generate a universal display code with varying spacing widths', async () => {
    const configuration = ['TRKTRAC', 'JEEPSRG', 'SEMITRL', '__INVALID'];
    const displayCode = policy.getVehicleDisplayCode(configuration, [
      ...axleConfig1,
      ...axleConfig2m,
      ...axleConfig1s,
      ...axleConfig1l,
      ...axleConfig1s,
    ]);
    expect(displayCode).toBe('=1U1MU2U2=SU1U3LU1U4SU1U5');
  });
});
