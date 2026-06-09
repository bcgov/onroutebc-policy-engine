import { Policy } from '../../policy-engine';
import currentPolicyConfig from '../policy-config/_current-config.json';
import testStow from '../permit-app/test-stow.json';
import {
  PermitAppInfo,
  PolicyCheckId,
  PolicyCheckResultType,
} from '../../enum';
import {
  AxleCalcResults,
  AxleConfiguration,
  AxleGroupPolicyCheckResult,
} from '../../types';
import {
  CheckBoosterAxleLimit,
  CheckMinDriveAxleWeight,
  CheckTruckTractorWheelbase,
} from '../../helper/policy-check.helper';
import dayjs from 'dayjs';

describe('Axle Calculation Functions', () => {
  const policy: Policy = new Policy(currentPolicyConfig);
  const permit = JSON.parse(JSON.stringify(testStow));
  const vehicleConfiguration = policy.getSimplifiedVehicleConfiguration(
    permit.permitData.vehicleDetails,
    permit.permitData.vehicleConfiguration,
  );
  const axleConfiguration =
    permit.permitData.vehicleConfiguration.axleConfiguration;

  const getTruckTractorWheelbaseAxles = (
    interaxleSpacing: number,
    axleSpread: number,
  ) => {
    const ac = JSON.parse(
      JSON.stringify(axleConfiguration),
    ) as Array<AxleConfiguration>;
    ac[0].numberOfAxles = 1;
    ac[1].numberOfAxles = 2;
    ac[1].axleSpread = axleSpread;
    ac[1].interaxleSpacing = interaxleSpacing;
    return ac;
  };

  const getTruckTractorWheelbasePermit = (
    interaxleSpacing: number,
    axleSpread: number,
  ) => {
    const p = JSON.parse(JSON.stringify(testStow));
    p.permitData.startDate = dayjs().format(
      PermitAppInfo.PermitDateFormat.toString(),
    );
    p.permitData.vehicleDetails.vehicleSubType = 'TRKTRAC';
    p.permitData.vehicleConfiguration.axleConfiguration =
      getTruckTractorWheelbaseAxles(interaxleSpacing, axleSpread);
    return p;
  };

  const getDriveAxleWeightAxles = (
    gcvw: number,
    driveAxleCount: number,
    driveAxleWeight: number,
  ): Array<AxleConfiguration> => [
    {
      numberOfAxles: 1,
      axleUnitWeight: gcvw - driveAxleWeight,
    },
    {
      numberOfAxles: driveAxleCount,
      axleUnitWeight: driveAxleWeight,
    },
  ];

  // ORV2-5374 examples and expected pass/fail states come from:
  // onRouteBCSpecification/Applying for Permits/Single Trip Overweight/ASW Tridem Drive AU 20% of Actual GCVW.feature
  describe('minimum drive axle weight policy check', () => {
    const tandemPassExamples = [
      {
        gcvw: 100000,
        driveAxleWeight: 20000,
      },
      {
        gcvw: 100000,
        driveAxleWeight: 20500,
      },
      {
        gcvw: 130000,
        driveAxleWeight: 23000,
      },
      {
        gcvw: 150000,
        driveAxleWeight: 23000,
      },
    ];

    const tandemFailExamples = [
      {
        gcvw: 100000,
        driveAxleWeight: 19999,
      },
      {
        gcvw: 130000,
        driveAxleWeight: 22999,
      },
      {
        gcvw: 150000,
        driveAxleWeight: 22999,
      },
      {
        gcvw: 90000,
        driveAxleWeight: 15000,
      },
    ];

    const tridemPassExamples = [
      {
        gcvw: 100000,
        driveAxleWeight: 20000,
      },
      {
        gcvw: 100000,
        driveAxleWeight: 20500,
      },
      {
        gcvw: 150000,
        driveAxleWeight: 28000,
      },
      {
        gcvw: 160000,
        driveAxleWeight: 28000,
      },
    ];

    const tridemFailExamples = [
      {
        gcvw: 100000,
        driveAxleWeight: 19999,
      },
      {
        gcvw: 150000,
        driveAxleWeight: 27999,
      },
      {
        gcvw: 160000,
        driveAxleWeight: 27999,
      },
      {
        gcvw: 90000,
        driveAxleWeight: 15000,
      },
    ];

    const expectMinDriveAxleWeightResult = (
      gcvw: number,
      driveAxleCount: number,
      driveAxleWeight: number,
      expectedResult: PolicyCheckResultType,
    ) => {
      const [result] = CheckMinDriveAxleWeight(
        policy,
        vehicleConfiguration,
        getDriveAxleWeightAxles(gcvw, driveAxleCount, driveAxleWeight),
      );

      expect(result).toMatchObject({
        id: PolicyCheckId.MinDriveAxleWeight,
        result: expectedResult,
      });
    };

    describe('tandem drive axle unit meets threshold', () => {
      it.each(tandemPassExamples)(
        'passes for GCVW $gcvw kg and drive axle weight $driveAxleWeight kg',
        ({ gcvw, driveAxleWeight }) => {
          expectMinDriveAxleWeightResult(
            gcvw,
            2,
            driveAxleWeight,
            PolicyCheckResultType.Pass,
          );
        },
      );
    });

    describe('tandem drive axle unit is below threshold', () => {
      it.each(tandemFailExamples)(
        'fails for GCVW $gcvw kg and drive axle weight $driveAxleWeight kg',
        ({ gcvw, driveAxleWeight }) => {
          expectMinDriveAxleWeightResult(
            gcvw,
            2,
            driveAxleWeight,
            PolicyCheckResultType.Fail,
          );
        },
      );
    });

    describe('tridem drive axle unit meets threshold', () => {
      it.each(tridemPassExamples)(
        'passes for GCVW $gcvw kg and drive axle weight $driveAxleWeight kg',
        ({ gcvw, driveAxleWeight }) => {
          expectMinDriveAxleWeightResult(
            gcvw,
            3,
            driveAxleWeight,
            PolicyCheckResultType.Pass,
          );
        },
      );
    });

    describe('tridem drive axle unit is below threshold', () => {
      it.each(tridemFailExamples)(
        'fails for GCVW $gcvw kg and drive axle weight $driveAxleWeight kg',
        ({ gcvw, driveAxleWeight }) => {
          expectMinDriveAxleWeightResult(
            gcvw,
            3,
            driveAxleWeight,
            PolicyCheckResultType.Fail,
          );
        },
      );
    });

    it('preserves the existing full axle configuration target range', () => {
      const [result] = CheckMinDriveAxleWeight(policy, vehicleConfiguration, [
        {
          numberOfAxles: 1,
          axleUnitWeight: 60000,
        },
        {
          numberOfAxles: 2,
          axleUnitWeight: 19999,
        },
        {
          numberOfAxles: 3,
          axleUnitWeight: 20001,
        },
      ]);

      expect(result).toMatchObject({
        id: PolicyCheckId.MinDriveAxleWeight,
        result: PolicyCheckResultType.Fail,
        startAxleUnit: 1,
        endAxleUnit: 3,
      });
    });
  });

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

  it('should return axle group policy check results from axle calculation', async () => {
    const ac = JSON.parse(
      JSON.stringify(axleConfiguration),
    ) as Array<AxleConfiguration>;
    ac[0].numberOfTires = 3;

    const results = policy.runAxleCalculation(vehicleConfiguration, ac, 0);
    const numTiresResult = results.results.find(
      (r) => r.id === PolicyCheckId.NumberOfWheelsPerAxle,
    );

    expect(numTiresResult).toMatchObject({
      result: PolicyCheckResultType.Fail,
      startAxleUnit: 1,
      endAxleUnit: 1,
    });
  });

  it('should fail policy check when an axle unit has zero axles', async () => {
    const ac = JSON.parse(
      JSON.stringify(axleConfiguration),
    ) as Array<AxleConfiguration>;
    ac[1].numberOfAxles = 0;

    let results: AxleCalcResults | undefined;
    expect(() => {
      results = policy.runAxleCalculation(vehicleConfiguration, ac, 0);
    }).not.toThrow();
    const numberOfAxlesResult = results?.results.find(
      (r) =>
        r.id === PolicyCheckId.NumberOfAxles &&
        r.result === PolicyCheckResultType.Fail,
    );

    expect(numberOfAxlesResult).toMatchObject({
      startAxleUnit: 2,
      endAxleUnit: 2,
      message: 'No. of Axles for Axle Unit 2 cannot be 0.',
    });
  });

  it('should fail policy check when an axle unit has negative axles', async () => {
    const ac = JSON.parse(
      JSON.stringify(axleConfiguration),
    ) as Array<AxleConfiguration>;
    ac[1].numberOfAxles = -1;

    const results = policy.runAxleCalculation(vehicleConfiguration, ac, 0);
    const numberOfAxlesResult = results.results.find(
      (r) =>
        r.id === PolicyCheckId.NumberOfAxles &&
        r.result === PolicyCheckResultType.Fail,
    );

    expect(numberOfAxlesResult).toMatchObject({
      startAxleUnit: 2,
      endAxleUnit: 2,
      message: 'No. of Axles for Axle Unit 2 cannot be 0.',
    });
  });

  it('should fail policy check when an axle unit has four axles', async () => {
    const ac = JSON.parse(
      JSON.stringify(axleConfiguration),
    ) as Array<AxleConfiguration>;
    ac[1].numberOfAxles = 4;

    const results = policy.runAxleCalculation(vehicleConfiguration, ac, 0);
    const numberOfAxlesResult = results.results.find(
      (r) =>
        r.id === PolicyCheckId.NumberOfAxles &&
        r.result === PolicyCheckResultType.Fail,
    );

    expect(numberOfAxlesResult).toMatchObject({
      startAxleUnit: 2,
      endAxleUnit: 2,
      message: 'No. of Axles for Axle Unit 2 is not permittable.',
    });
  });

  it('should fail policy check when an axle unit exceeds maximum axles', async () => {
    const ac = JSON.parse(
      JSON.stringify(axleConfiguration),
    ) as Array<AxleConfiguration>;
    ac[1].numberOfAxles = 5;

    const results = policy.runAxleCalculation(vehicleConfiguration, ac, 0);
    const numberOfAxlesResult = results.results.find(
      (r) =>
        r.id === PolicyCheckId.NumberOfAxles &&
        r.result === PolicyCheckResultType.Fail,
    );

    expect(numberOfAxlesResult).toMatchObject({
      startAxleUnit: 2,
      endAxleUnit: 2,
      message: 'No. of Axles for Axle Unit 2 is not permittable.',
    });
  });

  it('should return axle group results when an axle unit exceeds maximum axles', async () => {
    const ac = JSON.parse(
      JSON.stringify(axleConfiguration),
    ) as Array<AxleConfiguration>;
    ac[1].numberOfAxles = 5;

    const results = policy.runAxleCalculation(vehicleConfiguration, ac, 0);

    expect(results).toMatchObject({
      totalOverload: 57700,
      results: [
        {
          id: PolicyCheckId.NumberOfAxles,
          result: PolicyCheckResultType.Pass,
          message: 'No. of Axles for Axle Unit 1 is permittable.',
          startAxleUnit: 1,
          endAxleUnit: 1,
        },
        {
          id: PolicyCheckId.NumberOfAxles,
          result: PolicyCheckResultType.Fail,
          message: 'No. of Axles for Axle Unit 2 is not permittable.',
          startAxleUnit: 2,
          endAxleUnit: 2,
        },
        {
          id: PolicyCheckId.NumberOfAxles,
          result: PolicyCheckResultType.Pass,
          message: 'No. of Axles for Axle Unit 3 is permittable.',
          startAxleUnit: 3,
          endAxleUnit: 3,
        },
        {
          id: PolicyCheckId.NumberOfAxles,
          result: PolicyCheckResultType.Pass,
          message: 'No. of Axles for Axle Unit 4 is permittable.',
          startAxleUnit: 4,
          endAxleUnit: 4,
        },
        {
          id: PolicyCheckId.NumberOfAxles,
          result: PolicyCheckResultType.Pass,
          message: 'No. of Axles for Axle Unit 5 is permittable.',
          startAxleUnit: 5,
          endAxleUnit: 5,
        },
      ],
    });
  });

  it('should pass policy check when an axle unit has three axles', async () => {
    const ac = JSON.parse(
      JSON.stringify(axleConfiguration),
    ) as Array<AxleConfiguration>;
    ac[1].numberOfAxles = 3;
    ac[1].numberOfTires = 12;

    const results = policy.runAxleCalculation(vehicleConfiguration, ac, 0);
    const numberOfAxlesResult = results.results.find((r) => {
      const axleGroupResult = r as AxleGroupPolicyCheckResult;
      return (
        axleGroupResult.id === PolicyCheckId.NumberOfAxles &&
        axleGroupResult.startAxleUnit === 2 &&
        axleGroupResult.endAxleUnit === 2
      );
    });

    expect(numberOfAxlesResult).toMatchObject({
      result: PolicyCheckResultType.Pass,
      startAxleUnit: 2,
      endAxleUnit: 2,
    });
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

  it('should pass booster axle limit when booster has no more axles than trailer', async () => {
    const ac = JSON.parse(
      JSON.stringify(axleConfiguration),
    ) as Array<AxleConfiguration>;

    const results = policy.runAxleCalculation(vehicleConfiguration, ac, 0);
    const boosterAxleLimitResults = results.results.filter(
      (r) => r.id === PolicyCheckId.BoosterAxleLimit,
    );

    expect(boosterAxleLimitResults).toHaveLength(1);
    expect(boosterAxleLimitResults[0]).toMatchObject({
      result: PolicyCheckResultType.Pass,
      message: '',
      startAxleUnit: 4,
      endAxleUnit: 5,
    });
  });

  it('should fail booster axle limit through axle calculation results when booster has more axles than trailer', async () => {
    const vc = ['TRKTRAC', 'DOLLIES', 'BOOSTER'];
    const ac = [
      {
        numberOfAxles: 1,
        axleUnitWeight: 6700,
        numberOfTires: 2,
        tireSize: 355,
      },
      {
        numberOfAxles: 2,
        axleSpread: 160,
        interaxleSpacing: 350,
        axleUnitWeight: 12000,
        numberOfTires: 4,
        tireSize: 330,
      },
      {
        numberOfAxles: 1,
        interaxleSpacing: 300,
        axleUnitWeight: 9000,
        numberOfTires: 2,
        tireSize: 330,
      },
      {
        numberOfAxles: 2,
        axleSpread: 160,
        interaxleSpacing: 350,
        axleUnitWeight: 10000,
        numberOfTires: 4,
        tireSize: 330,
      },
    ];

    const results = policy.runAxleCalculation(vc, ac, 0);
    const boosterAxleLimitResult = results.results.find(
      (r) => r.id === PolicyCheckId.BoosterAxleLimit,
    );

    expect(boosterAxleLimitResult).toMatchObject({
      result: PolicyCheckResultType.Fail,
      message:
        'No. of Axles for Axle Unit 4 must be less than or equal to No. of Axles for Axle Unit 3',
      startAxleUnit: 3,
      endAxleUnit: 4,
    });
  });

  it('should fail booster axle limit when booster has more axles than trailer', async () => {
    const ac = JSON.parse(
      JSON.stringify(axleConfiguration),
    ) as Array<AxleConfiguration>;
    ac[3].numberOfAxles = 2;
    ac[4].numberOfAxles = 3;
    ac[4].numberOfTires = 12;

    const results = CheckBoosterAxleLimit(policy, vehicleConfiguration, ac);
    const boosterAxleLimitResult = results.find(
      (r) => r.id === PolicyCheckId.BoosterAxleLimit,
    );

    expect(boosterAxleLimitResult).toMatchObject({
      result: PolicyCheckResultType.Fail,
      message:
        'No. of Axles for Axle Unit 5 must be less than or equal to No. of Axles for Axle Unit 4',
      startAxleUnit: 4,
      endAxleUnit: 5,
    });
  });

  it('should not return booster axle limit results when there is no booster', async () => {
    const vc = vehicleConfiguration.slice(0, -1);
    const ac = JSON.parse(
      JSON.stringify(axleConfiguration.slice(0, -1)),
    ) as Array<AxleConfiguration>;

    const results = CheckBoosterAxleLimit(policy, vc, ac);

    expect(results.some((r) => r.id === PolicyCheckId.BoosterAxleLimit)).toBe(
      false,
    );
  });

  it('should not treat a booster without a preceding trailer as an axle limit violation', async () => {
    const results = CheckBoosterAxleLimit(
      policy,
      ['TRKTRAC', 'BOOSTER'],
      [
        { numberOfAxles: 1, axleUnitWeight: 6700 },
        { numberOfAxles: 2, axleUnitWeight: 12000 },
        { numberOfAxles: 2, axleUnitWeight: 10000 },
      ],
    );

    expect(results).toHaveLength(0);
  });

  it('should ignore booster entries that have no matching axle configuration', async () => {
    const results = CheckBoosterAxleLimit(
      policy,
      ['TRKTRAC', 'DOLLIES', 'BOOSTER'],
      [
        { numberOfAxles: 1, axleUnitWeight: 6700 },
        { numberOfAxles: 2, axleUnitWeight: 12000 },
        { numberOfAxles: 1, axleUnitWeight: 9000 },
      ],
    );

    expect(results).toHaveLength(0);
  });

  it('should compare booster axles to the real trailer before additional axle units', async () => {
    const vc = ['TRKTRAC', 'PLATFRM', 'PFMAXLE', 'PFMAXLE', 'BOOSTER'];
    const ac = [
      { numberOfAxles: 1, axleUnitWeight: 6700 },
      { numberOfAxles: 3, axleUnitWeight: 12000 },
      { numberOfAxles: 2, axleUnitWeight: 18000 },
      { numberOfAxles: 3, axleUnitWeight: 10000 },
      { numberOfAxles: 3, axleUnitWeight: 10000 },
      { numberOfAxles: 3, axleUnitWeight: 10000 },
    ];

    const results = CheckBoosterAxleLimit(policy, vc, ac);

    expect(results[0]).toMatchObject({
      result: PolicyCheckResultType.Fail,
      message:
        'No. of Axles for Axle Unit 6 must be less than or equal to No. of Axles for Axle Unit 3',
      startAxleUnit: 3,
      endAxleUnit: 6,
    });
  });

  it('should pass truck tractor wheelbase at the maximum allowed value', async () => {
    const results = CheckTruckTractorWheelbase(
      policy,
      ['TRKTRAC', 'SEMITRL'],
      [
        { numberOfAxles: 1, axleUnitWeight: 6700 },
        {
          numberOfAxles: 2,
          axleSpread: 140,
          interaxleSpacing: 650,
          axleUnitWeight: 12000,
        },
        { numberOfAxles: 3, axleUnitWeight: 10000 },
      ],
    );

    expect(results[0]).toMatchObject({
      id: PolicyCheckId.TruckTractorWheelbase,
      result: PolicyCheckResultType.Pass,
      message:
        'Wheelbase for Axle Unit 1 and Axle Unit 2 is between 6.2m and 7.2m. See CTPM 5.3.7.A.',
      startAxleUnit: 1,
      endAxleUnit: 2,
    });
  });

  it('should fail truck tractor wheelbase above the maximum allowed value', async () => {
    const results = CheckTruckTractorWheelbase(
      policy,
      ['TRKTRAC', 'SEMITRL'],
      [
        { numberOfAxles: 1, axleUnitWeight: 6700 },
        {
          numberOfAxles: 2,
          axleSpread: 140,
          interaxleSpacing: 660,
          axleUnitWeight: 12000,
        },
        { numberOfAxles: 3, axleUnitWeight: 10000 },
      ],
    );

    expect(results[0]).toMatchObject({
      id: PolicyCheckId.TruckTractorWheelbase,
      result: PolicyCheckResultType.Fail,
      message:
        'Wheelbase for Axle Unit 1 and Axle Unit 2 is greater than 7.2m.',
      startAxleUnit: 1,
      endAxleUnit: 2,
    });
  });

  it('should pass truck tractor wheelbase below the minimum restricted value', async () => {
    const results = CheckTruckTractorWheelbase(
      policy,
      ['TRKTRAC', 'JEEPSRG', 'BOOSTER'],
      [
        { numberOfAxles: 1, axleUnitWeight: 6700 },
        {
          numberOfAxles: 2,
          axleSpread: 40,
          interaxleSpacing: 580,
          axleUnitWeight: 12000,
        },
        { numberOfAxles: 2, axleUnitWeight: 10000 },
        { numberOfAxles: 2, axleUnitWeight: 10000 },
      ],
    );

    expect(results[0]).toMatchObject({
      result: PolicyCheckResultType.Pass,
      message: '',
      startAxleUnit: 1,
      endAxleUnit: 2,
    });
  });

  it('should fail truck tractor wheelbase between 6.2m and 7.2m with jeep or booster selected', async () => {
    const jeepResults = CheckTruckTractorWheelbase(
      policy,
      ['TRKTRAC', 'JEEPSRG'],
      [
        { numberOfAxles: 1, axleUnitWeight: 6700 },
        {
          numberOfAxles: 2,
          axleSpread: 140,
          interaxleSpacing: 550,
          axleUnitWeight: 12000,
        },
        { numberOfAxles: 2, axleUnitWeight: 10000 },
      ],
    );
    const boosterResults = CheckTruckTractorWheelbase(
      policy,
      ['TRKTRAC', 'SEMITRL', 'BOOSTER'],
      [
        { numberOfAxles: 1, axleUnitWeight: 6700 },
        {
          numberOfAxles: 2,
          axleSpread: 140,
          interaxleSpacing: 550,
          axleUnitWeight: 12000,
        },
        { numberOfAxles: 3, axleUnitWeight: 10000 },
        { numberOfAxles: 2, axleUnitWeight: 10000 },
      ],
    );

    expect(jeepResults[0]).toMatchObject({
      result: PolicyCheckResultType.Fail,
      message:
        'Wheelbase for Axle Unit 1 and Axle Unit 2 is between 6.2m and 7.2m. See CTPM 5.3.7.A.',
    });
    expect(boosterResults[0]).toMatchObject({
      result: PolicyCheckResultType.Fail,
      message:
        'Wheelbase for Axle Unit 1 and Axle Unit 2 is between 6.2m and 7.2m. See CTPM 5.3.7.A.',
    });
  });

  it('should include truck tractor wheelbase in axle calculation results', async () => {
    const vc = [...vehicleConfiguration];
    const ac = JSON.parse(
      JSON.stringify(axleConfiguration),
    ) as Array<AxleConfiguration>;
    ac[1].axleSpread = 140;
    ac[1].interaxleSpacing = 650;

    const results = policy.runAxleCalculation(vc, ac, 0);
    const wheelbaseResult = results.results.find(
      (r) => r.id === PolicyCheckId.TruckTractorWheelbase,
    );

    expect(wheelbaseResult).toMatchObject({
      startAxleUnit: 1,
      endAxleUnit: 2,
    });
  });

  it('should return the same truck tractor wheelbase result from runAxleCalculation as the direct policy check', async () => {
    const scenarios = [
      { interaxleSpacing: 660, axleSpread: 140 },
      { interaxleSpacing: 550, axleSpread: 140 },
      { interaxleSpacing: 580, axleSpread: 40 },
    ];

    scenarios.forEach(({ interaxleSpacing, axleSpread }) => {
      const ac = getTruckTractorWheelbaseAxles(interaxleSpacing, axleSpread);
      const directResult = CheckTruckTractorWheelbase(
        policy,
        vehicleConfiguration,
        ac,
      )[0];
      const runAxleCalculationResult = policy
        .runAxleCalculation(vehicleConfiguration, ac, 0)
        .results.find((r) => r.id === PolicyCheckId.TruckTractorWheelbase);

      expect(runAxleCalculationResult).toMatchObject(directResult);
    });
  });

  it('should include failed truck tractor wheelbase results from validate matching the direct policy check', async () => {
    const scenarios = [
      { interaxleSpacing: 660, axleSpread: 140 },
      { interaxleSpacing: 550, axleSpread: 140 },
    ];

    for (const { interaxleSpacing, axleSpread } of scenarios) {
      const permit = getTruckTractorWheelbasePermit(
        interaxleSpacing,
        axleSpread,
      );
      const directResult = CheckTruckTractorWheelbase(
        policy,
        vehicleConfiguration,
        permit.permitData.vehicleConfiguration.axleConfiguration,
      )[0];

      expect(directResult.result).toBe(PolicyCheckResultType.Fail);

      const validationResult = await policy.validate(permit);
      expect(validationResult.violations[0]).toMatchObject({
        message: 'Vehicle configuration failed axle calculation policy checks',
      });
      expect(validationResult.violations[0].details).toContain(
        directResult.message,
      );
    }
  });

  it('should not include a truck tractor wheelbase validation violation when the direct policy check passes below 6.2m', async () => {
    const permit = getTruckTractorWheelbasePermit(580, 40);
    const directResult = CheckTruckTractorWheelbase(
      policy,
      vehicleConfiguration,
      permit.permitData.vehicleConfiguration.axleConfiguration,
    )[0];

    expect(directResult).toMatchObject({
      result: PolicyCheckResultType.Pass,
      message: '',
    });

    const validationResult = await policy.validate(permit);
    const axleCalcViolation = validationResult.violations.find(
      (v) =>
        v.message ===
        'Vehicle configuration failed axle calculation policy checks',
    );

    expect(axleCalcViolation).toBeUndefined();
  });

  it('should not include a truck tractor wheelbase validation violation when the direct policy check passes below 6.2m', async () => {
    const permit = getTruckTractorWheelbasePermit(580, 40);
    const directResult = CheckTruckTractorWheelbase(
      policy,
      vehicleConfiguration,
      permit.permitData.vehicleConfiguration.axleConfiguration,
    )[0];

    expect(directResult).toMatchObject({
      result: PolicyCheckResultType.Pass,
      message: '',
    });

    const validationResult = await policy.validate(permit);
    const axleCalcViolation = validationResult.violations.find(
      (v) =>
        v.message ===
        'Vehicle configuration failed axle calculation policy checks',
    );

    expect(axleCalcViolation).toBeUndefined();
  });

  // ==========================================
  // ORV2-5472: UPDATED TIRE LOAD MAX TESTS
  // ==========================================

  it('should pass policy check for steer axle tire size >= 445mm if under 9100kg cap', async () => {
    const ac = JSON.parse(
      JSON.stringify(axleConfiguration),
    ) as Array<AxleConfiguration>;
    ac[0].tireSize = 460; // 460mm is now legal under new STOW rules
    ac[0].axleUnitWeight = 9000;
    const results = policy.runAxleCalculation(vehicleConfiguration, ac, 0);
    const maxTireResults = results.results.filter(
      (r) => r.id === PolicyCheckId.MaxTireLoad,
    );
    expect(
      maxTireResults.every((r) => r.result === PolicyCheckResultType.Pass),
    ).toBe(true);
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
    ac[0].axleUnitWeight = 6700; // 330/10 * 100 * 2 = 6600kg max. 6700 fails.
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

  it('should skip (pass) policy check for missing steer axle tire size', async () => {
    const ac = JSON.parse(
      JSON.stringify(axleConfiguration),
    ) as Array<AxleConfiguration>;
    delete ac[0].tireSize;
    const results = policy.runAxleCalculation(vehicleConfiguration, ac, 0);
    const maxTireResults = results.results.filter(
      (r) => r.id === PolicyCheckId.MaxTireLoad,
    );
    // The new logic uses `if (!tireSize || !numberOfTires) { return; }`, returning a Pass.
    expect(
      maxTireResults.every((r) => r.result === PolicyCheckResultType.Pass),
    ).toBe(true);
  });

  it('should skip (pass) policy check for missing trailer axle tire size', async () => {
    const ac = JSON.parse(
      JSON.stringify(axleConfiguration),
    ) as Array<AxleConfiguration>;
    delete ac[2].tireSize;
    const results = policy.runAxleCalculation(vehicleConfiguration, ac, 0);
    const maxTireResults = results.results.filter(
      (r) => r.id === PolicyCheckId.MaxTireLoad,
    );
    expect(
      maxTireResults.every((r) => r.result === PolicyCheckResultType.Pass),
    ).toBe(true);
  });

  it('should fail policy check for axle too heavy with 445 tires based on new 4550kg limit', async () => {
    const ac = JSON.parse(
      JSON.stringify(axleConfiguration),
    ) as Array<AxleConfiguration>;
    ac[2].tireSize = 445;
    // Updated to reflect the new 4,550 kg/tire cap
    ac[2].axleUnitWeight = 4550 * (ac[2].numberOfTires || 0) + 1;
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
