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
  CheckNumTiresPerAxle,
  CheckMinDriveAxleWeight,
  CheckMinSteerAxleWeight,
  CheckMinTandemSteerAxleWeight,
  CheckPickerTruckTractorWeightRestrictions,
  CheckWheelbaseLegalLimits,
  CheckDriveJeepLoadEqualization,
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

  describe('number of wheels per axle unit policy check', () => {
    type WheelCountCase = [number, number, number];

    const getWheelCountAxles = (
      axleUnit: number,
      numberOfAxles: number,
      numberOfTires: number,
    ): Array<AxleConfiguration> =>
      Array.from({ length: axleUnit }, (_, i) => ({
        numberOfAxles: i + 1 === axleUnit ? numberOfAxles : 1,
        axleUnitWeight: 5000,
        numberOfTires: i + 1 === axleUnit ? numberOfTires : 2,
        tireSize: 279,
      }));

    const expectWheelCountResult = (
      axleUnit: number,
      numberOfAxles: number,
      numberOfTires: number,
      expectedResult: PolicyCheckResultType,
    ) => {
      const results = CheckNumTiresPerAxle(
        policy,
        vehicleConfiguration,
        getWheelCountAxles(axleUnit, numberOfAxles, numberOfTires),
      );
      const isPermittable =
        expectedResult === PolicyCheckResultType.Pass
          ? 'permittable'
          : 'not permittable';

      expect(results[axleUnit - 1]).toMatchObject({
        id: PolicyCheckId.NumberOfWheelsPerAxle,
        result: expectedResult,
        message: `No. of Wheels for Axle Unit ${axleUnit} is ${isPermittable}.`,
        startAxleUnit: axleUnit,
        endAxleUnit: axleUnit,
      });
    };

    // These are the explicit examples from:
    // https://github.com/bcgov/onRouteBCSpecification/blob/main/Applying%20for%20Permits/Single%20Trip%20Overweight/ASW%20No.%20of%20Wheels%20per%20Axle.feature
    // The struck example row `single | axleUnit 2 | wheels 6` is intentionally
    // omitted because BA confirmed it was a table glitch.
    const specPassExamples: Array<WheelCountCase> = [
      [3, 1, 2],
      [3, 1, 4],
      [3, 1, 8],
      [3, 2, 4],
      [3, 2, 8],
      [3, 2, 16],
      [3, 3, 6],
      [3, 3, 12],
      [3, 3, 24],
    ];

    const specFailExamples: Array<WheelCountCase> = [
      [1, 1, 4],
      [2, 1, 8],
      [3, 2, 10],
      [4, 3, 8],
    ];

    it.each(specPassExamples)(
      'passes explicit spec example for axle unit %i with %i axles and %i wheels',
      (axleUnit, numberOfAxles, numberOfTires) => {
        expectWheelCountResult(
          axleUnit,
          numberOfAxles,
          numberOfTires,
          PolicyCheckResultType.Pass,
        );
      },
    );

    it.each(specFailExamples)(
      'fails explicit spec example for axle unit %i with %i axles and %i wheels',
      (axleUnit, numberOfAxles, numberOfTires) => {
        expectWheelCountResult(
          axleUnit,
          numberOfAxles,
          numberOfTires,
          PolicyCheckResultType.Fail,
        );
      },
    );

    // These cases are inferred from the rules rather than copied from example rows.
    // They complete the steer/drive matrix:
    // - steer unit 1 allows numberOfAxles * 2
    // - drive unit 2 allows numberOfAxles * 2 or * 4
    const ruleDerivedPassExamples: Array<WheelCountCase> = [
      [1, 1, 2],
      [1, 2, 4],
      [1, 3, 6],
      [2, 1, 2],
      [2, 1, 4],
      [2, 2, 4],
      [2, 2, 8],
      [2, 3, 6],
      [2, 3, 12],
    ];

    const ruleDerivedFailExamples: Array<WheelCountCase> = [
      [1, 2, 8],
      [1, 3, 12],
      [2, 2, 16],
      [2, 3, 24],
    ];

    it.each(ruleDerivedPassExamples)(
      'passes derived rule case for axle unit %i with %i axles and %i wheels',
      (axleUnit, numberOfAxles, numberOfTires) => {
        expectWheelCountResult(
          axleUnit,
          numberOfAxles,
          numberOfTires,
          PolicyCheckResultType.Pass,
        );
      },
    );

    it.each(ruleDerivedFailExamples)(
      'fails derived rule case for axle unit %i with %i axles and %i wheels',
      (axleUnit, numberOfAxles, numberOfTires) => {
        expectWheelCountResult(
          axleUnit,
          numberOfAxles,
          numberOfTires,
          PolicyCheckResultType.Fail,
        );
      },
    );
  });

  const getSteerDriveAxleWeightAxles = (
    steerAxleCount: number,
    driveAxleCount: number,
    steerAxleWeight: number,
    driveAxleWeight: number,
  ): Array<AxleConfiguration> => [
    {
      numberOfAxles: steerAxleCount,
      axleUnitWeight: steerAxleWeight,
    },
    {
      numberOfAxles: driveAxleCount,
      axleUnitWeight: driveAxleWeight,
    },
  ];

  // ORV2-5366 is only for single steer axle units with tridem drive axle units.
  describe('minimum single steer axle weight policy check', () => {
    const passExamples = [
      {
        tridemDriveAxleWeight: 20000,
        steerAxleWeight: 5400,
      },
      {
        tridemDriveAxleWeight: 20000,
        steerAxleWeight: 6000,
      },
      {
        tridemDriveAxleWeight: 18000,
        steerAxleWeight: 4860,
      },
    ];

    const failExamples = [
      {
        tridemDriveAxleWeight: 20000,
        steerAxleWeight: 5399,
      },
      {
        tridemDriveAxleWeight: 18000,
        steerAxleWeight: 4859,
      },
      {
        tridemDriveAxleWeight: 15000,
        steerAxleWeight: 4000,
      },
    ];

    const expectMinSingleSteerAxleWeightResult = (
      tridemDriveAxleWeight: number,
      steerAxleWeight: number,
      expectedResult: PolicyCheckResultType,
    ) => {
      const [result] = CheckMinSteerAxleWeight(
        policy,
        vehicleConfiguration,
        getSteerDriveAxleWeightAxles(
          1,
          3,
          steerAxleWeight,
          tridemDriveAxleWeight,
        ),
      );

      expect(result).toMatchObject({
        id: PolicyCheckId.MinSteerAxleWeight,
        result: expectedResult,
        startAxleUnit: 1,
        endAxleUnit: 2,
      });
    };

    it.each(passExamples)(
      'passes for tridem drive axle weight $tridemDriveAxleWeight kg and single steer axle weight $steerAxleWeight kg',
      ({ tridemDriveAxleWeight, steerAxleWeight }) => {
        expectMinSingleSteerAxleWeightResult(
          tridemDriveAxleWeight,
          steerAxleWeight,
          PolicyCheckResultType.Pass,
        );
      },
    );

    it.each(failExamples)(
      'fails for tridem drive axle weight $tridemDriveAxleWeight kg and single steer axle weight $steerAxleWeight kg',
      ({ tridemDriveAxleWeight, steerAxleWeight }) => {
        expectMinSingleSteerAxleWeightResult(
          tridemDriveAxleWeight,
          steerAxleWeight,
          PolicyCheckResultType.Fail,
        );
      },
    );

    it('does not apply to tandem steer axle units', () => {
      const [result] = CheckMinSteerAxleWeight(
        policy,
        vehicleConfiguration,
        getSteerDriveAxleWeightAxles(2, 3, 4000, 20000),
      );

      expect(result).toMatchObject({
        id: PolicyCheckId.MinSteerAxleWeight,
        result: PolicyCheckResultType.Pass,
        message: 'Policy check does not apply to this configuration',
      });
    });
  });

  // ORV2-5506 is only for tandem steer axle units with tandem or tridem drive axle units.
  describe('minimum tandem steer axle weight policy check', () => {
    const tandemDrivePassExamples = [
      {
        driveAxleWeight: 17000,
        steerAxleWeight: 6800,
      },
      {
        driveAxleWeight: 17000,
        steerAxleWeight: 7000,
      },
      {
        driveAxleWeight: 15000,
        steerAxleWeight: 6000,
      },
    ];

    const tandemDriveFailExamples = [
      {
        driveAxleWeight: 17000,
        steerAxleWeight: 6799,
      },
      {
        driveAxleWeight: 15000,
        steerAxleWeight: 5999,
      },
      {
        driveAxleWeight: 17000,
        steerAxleWeight: 5000,
      },
    ];

    const tridemDrivePassExamples = [
      {
        driveAxleWeight: 20000,
        steerAxleWeight: 8000,
      },
      {
        driveAxleWeight: 20000,
        steerAxleWeight: 8500,
      },
      {
        driveAxleWeight: 18000,
        steerAxleWeight: 7200,
      },
    ];

    const tridemDriveFailExamples = [
      {
        driveAxleWeight: 20000,
        steerAxleWeight: 7999,
      },
      {
        driveAxleWeight: 18000,
        steerAxleWeight: 7199,
      },
      {
        driveAxleWeight: 15000,
        steerAxleWeight: 5000,
      },
    ];

    const expectMinTandemSteerAxleWeightResult = (
      driveAxleCount: number,
      driveAxleWeight: number,
      steerAxleWeight: number,
      expectedResult: PolicyCheckResultType,
    ) => {
      const [result] = CheckMinTandemSteerAxleWeight(
        policy,
        vehicleConfiguration,
        getSteerDriveAxleWeightAxles(
          2,
          driveAxleCount,
          steerAxleWeight,
          driveAxleWeight,
        ),
      );

      expect(result).toMatchObject({
        id: PolicyCheckId.MinTandemSteerAxleWeight,
        result: expectedResult,
        startAxleUnit: 1,
        endAxleUnit: 2,
      });
    };

    it.each(tandemDrivePassExamples)(
      'passes for tandem drive axle weight $driveAxleWeight kg and tandem steer axle weight $steerAxleWeight kg',
      ({ driveAxleWeight, steerAxleWeight }) => {
        expectMinTandemSteerAxleWeightResult(
          2,
          driveAxleWeight,
          steerAxleWeight,
          PolicyCheckResultType.Pass,
        );
      },
    );

    it.each(tandemDriveFailExamples)(
      'fails for tandem drive axle weight $driveAxleWeight kg and tandem steer axle weight $steerAxleWeight kg',
      ({ driveAxleWeight, steerAxleWeight }) => {
        expectMinTandemSteerAxleWeightResult(
          2,
          driveAxleWeight,
          steerAxleWeight,
          PolicyCheckResultType.Fail,
        );
      },
    );

    it.each(tridemDrivePassExamples)(
      'passes for tridem drive axle weight $driveAxleWeight kg and tandem steer axle weight $steerAxleWeight kg',
      ({ driveAxleWeight, steerAxleWeight }) => {
        expectMinTandemSteerAxleWeightResult(
          3,
          driveAxleWeight,
          steerAxleWeight,
          PolicyCheckResultType.Pass,
        );
      },
    );

    it.each(tridemDriveFailExamples)(
      'fails for tridem drive axle weight $driveAxleWeight kg and tandem steer axle weight $steerAxleWeight kg',
      ({ driveAxleWeight, steerAxleWeight }) => {
        expectMinTandemSteerAxleWeightResult(
          3,
          driveAxleWeight,
          steerAxleWeight,
          PolicyCheckResultType.Fail,
        );
      },
    );

    it('does not apply to single steer axle units', () => {
      const [result] = CheckMinTandemSteerAxleWeight(
        policy,
        vehicleConfiguration,
        getSteerDriveAxleWeightAxles(1, 3, 5000, 20000),
      );

      expect(result).toMatchObject({
        id: PolicyCheckId.MinTandemSteerAxleWeight,
        result: PolicyCheckResultType.Pass,
        message: 'Policy check does not apply to this configuration',
      });
    });
  });

  describe('picker truck tractor weight restrictions policy check', () => {
    const ratioMessage =
      'Axle Unit 1 must carry a minimum 50% of Axle Unit 2 axle unit weight.';
    const trailerMessage =
      'Cannot tow a trailer if Axle Unit 1 and Axle Unit 2 are exceeding legal axle weights.';
    const getPickerTruckTractorAxles = (
      steerAxleWeight: number,
      driveAxleWeight: number,
      steerAxleSpread = 100,
      driveAxleSpread = 240,
      interaxleSpacing = 485,
    ): Array<AxleConfiguration> => [
      {
        numberOfAxles: 2,
        numberOfTires: 4,
        tireSize: 330,
        axleSpread: steerAxleSpread,
        axleUnitWeight: steerAxleWeight,
        vehicleIndex: 0,
      },
      {
        numberOfAxles: 3,
        numberOfTires: 12,
        tireSize: 330,
        axleSpread: driveAxleSpread,
        interaxleSpacing,
        axleUnitWeight: driveAxleWeight,
        vehicleIndex: 0,
      },
    ];
    const getResults = (
      steerAxleWeight: number,
      driveAxleWeight: number,
      vehicleTypes = ['PICKRTT'],
      steerAxleSpread = 100,
      driveAxleSpread = 240,
      interaxleSpacing = 485,
    ) =>
      CheckPickerTruckTractorWeightRestrictions(
        policy,
        vehicleTypes,
        getPickerTruckTractorAxles(
          steerAxleWeight,
          driveAxleWeight,
          steerAxleSpread,
          driveAxleSpread,
          interaxleSpacing,
        ),
      );

    it.each([
      { steerAxleWeight: 10000, driveAxleWeight: 20000 },
      { steerAxleWeight: 14000, driveAxleWeight: 28000 },
    ])(
      'passes the 50% rule for $steerAxleWeight kg steer and $driveAxleWeight kg drive',
      ({ steerAxleWeight, driveAxleWeight }) => {
        const [ratioResult] = getResults(steerAxleWeight, driveAxleWeight);

        expect(ratioResult).toMatchObject({
          id: PolicyCheckId.PickerTruckTractorWeightRestrictions,
          result: PolicyCheckResultType.Pass,
          message: '',
          startAxleUnit: 1,
          endAxleUnit: 2,
        });
      },
    );

    it('fails the feature example below the 50% requirement', () => {
      const [ratioResult] = getResults(9000, 20000);

      expect(ratioResult).toMatchObject({
        id: PolicyCheckId.PickerTruckTractorWeightRestrictions,
        result: PolicyCheckResultType.Fail,
        message: ratioMessage,
      });
    });

    it.each([
      {
        description: 'wheelbase below 6.6m',
        steerAxleSpread: 100,
        driveAxleSpread: 240,
        interaxleSpacing: 485,
      },
      {
        description: 'steer spread below 1.0m',
        steerAxleSpread: 99,
        driveAxleSpread: 240,
        interaxleSpacing: 491,
      },
      {
        description: 'drive spread below 2.4m',
        steerAxleSpread: 100,
        driveAxleSpread: 239,
        interaxleSpacing: 491,
      },
    ])(
      'applies when $description',
      ({ steerAxleSpread, driveAxleSpread, interaxleSpacing }) => {
        const [ratioResult] = getResults(
          9000,
          20000,
          ['PICKRTT'],
          steerAxleSpread,
          driveAxleSpread,
          interaxleSpacing,
        );

        expect(ratioResult).toMatchObject({
          result: PolicyCheckResultType.Fail,
          message: ratioMessage,
        });
      },
    );

    it('does not apply when all dimensional thresholds are met', () => {
      const [result] = getResults(9000, 20000, ['PICKRTT'], 100, 240, 490);

      expect(result).toMatchObject({
        result: PolicyCheckResultType.Pass,
        message: 'Policy check does not apply to this configuration',
      });
    });

    it.each([
      {
        description: 'another power unit subtype',
        vehicleTypes: ['TRKTRAC'],
        steerAxleCount: 2,
        driveAxleCount: 3,
      },
      {
        description: 'single steer',
        vehicleTypes: ['PICKRTT'],
        steerAxleCount: 1,
        driveAxleCount: 3,
      },
      {
        description: 'tandem drive',
        vehicleTypes: ['PICKRTT'],
        steerAxleCount: 2,
        driveAxleCount: 2,
      },
    ])(
      'does not apply to $description',
      ({ vehicleTypes, steerAxleCount, driveAxleCount }) => {
        const axles = getPickerTruckTractorAxles(9000, 20000);
        axles[0].numberOfAxles = steerAxleCount;
        axles[1].numberOfAxles = driveAxleCount;

        const [result] = CheckPickerTruckTractorWeightRestrictions(
          policy,
          vehicleTypes,
          axles,
        );

        expect(result).toMatchObject({
          result: PolicyCheckResultType.Pass,
          message: 'Policy check does not apply to this configuration',
        });
      },
    );

    it.each([
      { steerAxleWeight: 15201, driveAxleWeight: 20000 },
      { steerAxleWeight: 14000, driveAxleWeight: 28001 },
    ])(
      'defers weights above configured permit limits to the permittable weight check',
      ({ steerAxleWeight, driveAxleWeight }) => {
        const [result] = getResults(steerAxleWeight, driveAxleWeight);

        expect(result).toMatchObject({
          result: PolicyCheckResultType.Pass,
          message:
            'Policy check does not apply outside configured permittable axle weights',
        });
      },
    );

    it('allows a trailer while both axle units remain at legal maximums', () => {
      const trailerResult = getResults(12000, 24000, ['PICKRTT', 'SEMITRL'])[1];

      expect(trailerResult).toMatchObject({
        result: PolicyCheckResultType.Pass,
        message: '',
      });
    });

    it.each([
      { steerAxleWeight: 13601, driveAxleWeight: 24000 },
      { steerAxleWeight: 14000, driveAxleWeight: 24001 },
    ])(
      'rejects a trailer when an axle unit exceeds its legal maximum',
      ({ steerAxleWeight, driveAxleWeight }) => {
        const trailerResult = getResults(steerAxleWeight, driveAxleWeight, [
          'PICKRTT',
          'SEMITRL',
        ])[1];

        expect(trailerResult).toMatchObject({
          result: PolicyCheckResultType.Fail,
          message: trailerMessage,
        });
      },
    );

    it('does not treat the None pseudo trailer as towing', () => {
      const trailerResult = getResults(14000, 24001, ['PICKRTT', 'XXXXXXX'])[1];

      expect(trailerResult).toMatchObject({
        result: PolicyCheckResultType.Pass,
        message: '',
      });
    });

    it('returns both failures when the ratio and trailer rules fail', () => {
      const results = getResults(13000, 28000, ['PICKRTT', 'SEMITRL']);

      expect(results).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            result: PolicyCheckResultType.Fail,
            message: ratioMessage,
          }),
          expect.objectContaining({
            result: PolicyCheckResultType.Fail,
            message: trailerMessage,
          }),
        ]),
      );
    });
  });

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

  it('should include failed minimum single steer axle weight results from axle calculation', async () => {
    const ac = JSON.parse(
      JSON.stringify(axleConfiguration),
    ) as Array<AxleConfiguration>;
    ac[0].numberOfAxles = 1;
    ac[0].axleUnitWeight = 5399;
    ac[1].numberOfAxles = 3;
    ac[1].numberOfTires = 12;
    ac[1].axleUnitWeight = 20000;

    const results = policy.runAxleCalculation(vehicleConfiguration, ac, 0);
    const minSteerResult = results.results.find(
      (r) => r.id === PolicyCheckId.MinSteerAxleWeight,
    );

    expect(minSteerResult).toMatchObject({
      result: PolicyCheckResultType.Fail,
      message:
        'Single steer axle must be a minimum of 27% of tridem drive axle weight',
      startAxleUnit: 1,
      endAxleUnit: 2,
    });
  });

  it('should include failed minimum tandem steer axle weight results from axle calculation', async () => {
    const ac = JSON.parse(
      JSON.stringify(axleConfiguration),
    ) as Array<AxleConfiguration>;
    ac[0].numberOfAxles = 2;
    ac[0].numberOfTires = 4;
    ac[0].axleSpread = 160;
    ac[0].axleUnitWeight = 7999;
    ac[1].numberOfAxles = 3;
    ac[1].numberOfTires = 12;
    ac[1].axleUnitWeight = 20000;

    const results = policy.runAxleCalculation(vehicleConfiguration, ac, 0);
    const minTandemSteerResult = results.results.find(
      (r) => r.id === PolicyCheckId.MinTandemSteerAxleWeight,
    );

    expect(minTandemSteerResult).toMatchObject({
      result: PolicyCheckResultType.Fail,
      message:
        'Tandem steer axle must be a minimum of 40% of drive axle weight',
      startAxleUnit: 1,
      endAxleUnit: 2,
    });
  });

  it('should include picker truck tractor weight restriction results from axle calculation', () => {
    const ac: Array<AxleConfiguration> = [
      {
        numberOfAxles: 2,
        numberOfTires: 4,
        tireSize: 330,
        axleSpread: 100,
        axleUnitWeight: 9000,
      },
      {
        numberOfAxles: 3,
        numberOfTires: 12,
        tireSize: 330,
        axleSpread: 240,
        interaxleSpacing: 485,
        axleUnitWeight: 20000,
      },
    ];

    const results = policy.runAxleCalculation(['PICKRTT'], ac, 0);
    const pickerTruckResult = results.results.find(
      (result) =>
        result.id === PolicyCheckId.PickerTruckTractorWeightRestrictions &&
        result.result === PolicyCheckResultType.Fail,
    );

    expect(pickerTruckResult).toMatchObject({
      message:
        'Axle Unit 1 must carry a minimum 50% of Axle Unit 2 axle unit weight.',
      startAxleUnit: 1,
      endAxleUnit: 2,
    });
  });

  it('should preserve both the 40% and 50% picker truck tractor checks', () => {
    const ac: Array<AxleConfiguration> = [
      {
        numberOfAxles: 2,
        numberOfTires: 4,
        tireSize: 330,
        axleSpread: 100,
        axleUnitWeight: 10000,
      },
      {
        numberOfAxles: 3,
        numberOfTires: 12,
        tireSize: 330,
        axleSpread: 240,
        interaxleSpacing: 485,
        axleUnitWeight: 28000,
      },
    ];

    const results = policy.runAxleCalculation(['PICKRTT'], ac, 0);

    expect(results.results).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: PolicyCheckId.MinTandemSteerAxleWeight,
          result: PolicyCheckResultType.Fail,
        }),
        expect.objectContaining({
          id: PolicyCheckId.PickerTruckTractorWeightRestrictions,
          result: PolicyCheckResultType.Fail,
        }),
      ]),
    );
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

  it('should fail axle calculation when steer axle unit has a drive-only wheel count', async () => {
    const ac = JSON.parse(
      JSON.stringify(axleConfiguration),
    ) as Array<AxleConfiguration>;
    ac[0].numberOfAxles = 1;
    ac[0].numberOfTires = 4;

    const results = policy.runAxleCalculation(vehicleConfiguration, ac, 0);
    const numTiresResult = results.results.find(
      (r) => r.id === PolicyCheckId.NumberOfWheelsPerAxle,
    );

    expect(numTiresResult).toMatchObject({
      result: PolicyCheckResultType.Fail,
      message: 'No. of Wheels for Axle Unit 1 is not permittable.',
      startAxleUnit: 1,
      endAxleUnit: 1,
    });
  });

  it('should fail axle calculation when drive axle unit has a trailer-only wheel count', async () => {
    const ac = JSON.parse(
      JSON.stringify(axleConfiguration),
    ) as Array<AxleConfiguration>;
    ac[1].numberOfAxles = 1;
    ac[1].numberOfTires = 8;

    const results = policy.runAxleCalculation(vehicleConfiguration, ac, 0);
    const numTiresResult = results.results.find(
      (r) =>
        r.id === PolicyCheckId.NumberOfWheelsPerAxle && r.startAxleUnit === 2,
    );

    expect(numTiresResult).toMatchObject({
      result: PolicyCheckResultType.Fail,
      message: 'No. of Wheels for Axle Unit 2 is not permittable.',
      startAxleUnit: 2,
      endAxleUnit: 2,
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
      overload: 57700,
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
      startAxleUnit: 5,
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
      startAxleUnit: 4,
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
      startAxleUnit: 5,
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
      startAxleUnit: 6,
      endAxleUnit: 6,
    });
  });

  it('should fail single steer wheelbase below 6.6m for trucks', async () => {
    const results = CheckWheelbaseLegalLimits(
      policy,
      ['REGTRCK'],
      [
        { numberOfAxles: 1, axleUnitWeight: 6700, axleSpread: 200 },
        {
          numberOfAxles: 3,
          axleSpread: 200,
          interaxleSpacing: 540,
          axleUnitWeight: 12000,
        },
      ],
    );

    expect(results[0]).toMatchObject({
      id: PolicyCheckId.WheelbaseLegalLimits,
      result: PolicyCheckResultType.Fail,
      message: 'Wheelbase for Axle Unit 1 is less than 6.6 m.',
    });
  });

  it('should fail single steer wheelbase above 6.8m for truck tractors', async () => {
    const results = CheckWheelbaseLegalLimits(
      policy,
      ['TRKTRAC'],
      [
        { numberOfAxles: 1, axleUnitWeight: 6700, axleSpread: 200 },
        {
          numberOfAxles: 3,
          axleSpread: 200,
          interaxleSpacing: 590,
          axleUnitWeight: 12000,
        },
      ],
    );

    expect(results[0]).toMatchObject({
      id: PolicyCheckId.WheelbaseLegalLimits,
      result: PolicyCheckResultType.Fail,
      message: 'Wheelbase for Axle Unit 1 is greater than 6.8 m.',
    });
  });

  it('should fail tandem steer tridem drive wheelbase below 7.7m for supported subtypes', async () => {
    const results = CheckWheelbaseLegalLimits(
      policy,
      ['REGTRCK'],
      [
        { numberOfAxles: 2, axleUnitWeight: 6700, axleSpread: 200 },
        {
          numberOfAxles: 3,
          axleSpread: 240,
          interaxleSpacing: 320,
          axleUnitWeight: 12000,
        },
      ],
    );

    expect(results[0]).toMatchObject({
      id: PolicyCheckId.WheelbaseLegalLimits,
      result: PolicyCheckResultType.Fail,
      message: 'Wheelbase for Axle Unit 1 is less than 7.7 m.',
    });
  });

  it('should fail oilfield bed truck wheelbase below 7.8m for 2.8m to less than 3.0m axle spread', async () => {
    const results = CheckWheelbaseLegalLimits(
      policy,
      ['OGBEDTK'],
      [
        { numberOfAxles: 2, axleUnitWeight: 6700, axleSpread: 200 },
        {
          numberOfAxles: 3,
          axleSpread: 280,
          interaxleSpacing: 350,
          axleUnitWeight: 12000,
        },
      ],
    );

    expect(results[0]).toMatchObject({
      id: PolicyCheckId.WheelbaseLegalLimits,
      result: PolicyCheckResultType.Fail,
      message: 'Wheelbase for Axle Unit 1 is less than 7.8 m.',
    });
  });

  it('should fail oilfield bed truck wheelbase below 7.9m for 3.0m to 3.1m axle spread', async () => {
    const results = CheckWheelbaseLegalLimits(
      policy,
      ['OGBEDTK'],
      [
        { numberOfAxles: 2, axleUnitWeight: 6700, axleSpread: 200 },
        {
          numberOfAxles: 3,
          axleSpread: 300,
          interaxleSpacing: 350,
          axleUnitWeight: 12000,
        },
      ],
    );

    expect(results[0]).toMatchObject({
      id: PolicyCheckId.WheelbaseLegalLimits,
      result: PolicyCheckResultType.Fail,
      message: 'Wheelbase for Axle Unit 1 is less than 7.9 m.',
    });
  });

  it('should fail oilfield bed truck wheelbase above 10.0m', async () => {
    const results = CheckWheelbaseLegalLimits(
      policy,
      ['OGBEDTK'],
      [
        { numberOfAxles: 2, axleUnitWeight: 6700, axleSpread: 200 },
        {
          numberOfAxles: 3,
          axleSpread: 300,
          interaxleSpacing: 760,
          axleUnitWeight: 12000,
        },
      ],
    );

    expect(results[0]).toMatchObject({
      id: PolicyCheckId.WheelbaseLegalLimits,
      result: PolicyCheckResultType.Fail,
      message: 'Wheelbase for Axle Unit 1 is greater than 10.0 m.',
    });
  });

  it('should warn truck tractor wheelbase at the maximum allowed value with semi-trailer', async () => {
    const results = CheckWheelbaseLegalLimits(
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
        { numberOfAxles: 2, axleUnitWeight: 10000 },
      ],
    );

    expect(results[0]).toMatchObject({
      id: PolicyCheckId.WheelbaseLegalLimits,
      result: PolicyCheckResultType.Warning,
      message:
        'Wheelbase for Axle Unit X and Axle Unit Y is between 6.2m and 7.2m. Semi-Trailer wheelbase must be within dimensions table found in CTPM 5.3.7.A.',
      startAxleUnit: 1,
      endAxleUnit: 2,
    });
  });

  it('should fail truck tractor wheelbase above the maximum allowed value', async () => {
    const results = CheckWheelbaseLegalLimits(
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
      id: PolicyCheckId.WheelbaseLegalLimits,
      result: PolicyCheckResultType.Fail,
      message:
        'Wheelbase for Axle Unit 1 and Axle Unit 2 is greater than 7.2m.',
      startAxleUnit: 1,
      endAxleUnit: 2,
    });
  });

  it('should pass truck tractor wheelbase below the minimum restricted value', async () => {
    const results = CheckWheelbaseLegalLimits(
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

  it('should fail truck tractor wheelbase between 6.2m and 7.2m when trailer type is not semi-trailer', async () => {
    const jeepResults = CheckWheelbaseLegalLimits(
      policy,
      ['TRKTRAC', 'JEEPSRG'],
      [
        { numberOfAxles: 1, axleUnitWeight: 5000 },
        {
          numberOfAxles: 2,
          axleSpread: 141,
          interaxleSpacing: 550,
          axleUnitWeight: 5000,
        },
        {
          numberOfAxles: 2,
          interaxleSpacing: 200,
          axleUnitWeight: 5000,
        },
      ],
    );
    const boosterResults = CheckWheelbaseLegalLimits(
      policy,
      ['TRKTRAC', 'SEMITRL', 'BOOSTER'],
      [
        { numberOfAxles: 1, axleUnitWeight: 5000 },
        {
          numberOfAxles: 2,
          axleSpread: 141,
          interaxleSpacing: 550,
          axleUnitWeight: 5000,
        },
        {
          numberOfAxles: 2,
          interaxleSpacing: 200,
          axleUnitWeight: 5000,
        },
        {
          numberOfAxles: 2,
          interaxleSpacing: 200,
          axleUnitWeight: 5000,
        },
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
      (r) => r.id === PolicyCheckId.WheelbaseLegalLimits,
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
      const directResult = CheckWheelbaseLegalLimits(
        policy,
        vehicleConfiguration,
        ac,
      )[0];
      const runAxleCalculationResult = policy
        .runAxleCalculation(vehicleConfiguration, ac, 0)
        .results.find((r) => r.id === PolicyCheckId.WheelbaseLegalLimits);

      expect(runAxleCalculationResult).toMatchObject(directResult);
    });
  });

  it('should not include a truck tractor wheelbase validation violation when the direct policy check passes below 6.2m', async () => {
    const permit = getTruckTractorWheelbasePermit(580, 40);
    const directResult = CheckWheelbaseLegalLimits(
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

  describe('drive and jeep load equalization', () => {
    const loadEqualizationMessage =
      'Axle Unit 2 and Axle Unit 3 must be load equalized within 1000 kg.';
    const vc = ['TRKTRAC', 'JEEPSRG', 'SEMITRL'];
    const getAxleConfig = (
      axleUnit2Weight: number,
      axleUnit3Weight: number,
    ): Array<AxleConfiguration> => [
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
        axleUnitWeight: axleUnit2Weight,
        numberOfTires: 4,
        tireSize: 330,
      },
      {
        numberOfAxles: 2,
        axleSpread: 160,
        interaxleSpacing: 300,
        axleUnitWeight: axleUnit3Weight,
        numberOfTires: 4,
        tireSize: 330,
      },
      {
        numberOfAxles: 3,
        axleSpread: 220,
        interaxleSpacing: 700,
        axleUnitWeight: 18000,
        numberOfTires: 12,
        tireSize: 330,
      },
    ];

    it.each([
      [12000, 10999],
      [13500, 12499],
      [15000, 13900],
    ])(
      'should fail when drive and jeep axle unit weights differ by more than 1000 kg',
      (axleUnit2Weight, axleUnit3Weight) => {
        const results = CheckDriveJeepLoadEqualization(
          policy,
          vc,
          getAxleConfig(axleUnit2Weight, axleUnit3Weight),
        );

        expect(results).toHaveLength(1);
        expect(results[0]).toMatchObject({
          id: PolicyCheckId.DriveJeepLoadEqualization,
          result: PolicyCheckResultType.Fail,
          message: loadEqualizationMessage,
          startAxleUnit: 2,
          endAxleUnit: 3,
        });
      },
    );

    it.each([
      [12000, 11000],
      [13500, 12501],
      [15000, 15000],
    ])(
      'should pass when drive and jeep axle unit weights differ by 1000 kg or less',
      (axleUnit2Weight, axleUnit3Weight) => {
        const results = CheckDriveJeepLoadEqualization(
          policy,
          vc,
          getAxleConfig(axleUnit2Weight, axleUnit3Weight),
        );

        expect(results).toHaveLength(1);
        expect(results[0]).toMatchObject({
          id: PolicyCheckId.DriveJeepLoadEqualization,
          result: PolicyCheckResultType.Pass,
          message: '',
          startAxleUnit: 2,
          endAxleUnit: 3,
        });
      },
    );

    it('should return no result when drive and jeep axle units have different axle counts', () => {
      const ac = getAxleConfig(12000, 10999);
      ac[2].numberOfAxles = 3;

      const results = CheckDriveJeepLoadEqualization(policy, vc, ac);

      expect(results).toHaveLength(0);
    });

    it('should return no result when there is no jeep', () => {
      const results = CheckDriveJeepLoadEqualization(
        policy,
        ['TRKTRAC', 'SEMITRL'],
        getAxleConfig(12000, 10999),
      );

      expect(results).toHaveLength(0);
    });

    it('should include drive and jeep load equalization in axle calculation results', () => {
      const ac = JSON.parse(
        JSON.stringify(axleConfiguration),
      ) as Array<AxleConfiguration>;
      ac[1].axleUnitWeight = 12000;
      ac[2].axleUnitWeight = 10999;

      const results = policy.runAxleCalculation(vehicleConfiguration, ac, 0);
      const loadEqualizationResult = results.results.find(
        (r) => r.id === PolicyCheckId.DriveJeepLoadEqualization,
      );

      expect(loadEqualizationResult).toMatchObject({
        result: PolicyCheckResultType.Fail,
        message: loadEqualizationMessage,
        startAxleUnit: 2,
        endAxleUnit: 3,
      });
    });
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
