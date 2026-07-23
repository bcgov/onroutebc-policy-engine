import { Policy } from '../../policy-engine';
import { PolicyCheckId, PolicyCheckResultType } from '../../enum/policy-check';
import { AxleConfiguration } from '../../types';
import currentPolicyConfig from '../policy-config/_current-config.json';

describe('ORV2-5706 legal weight maximums', () => {
  const policy = new Policy(currentPolicyConfig);

  const getLegalResult = (
    powerUnitType: string,
    steerAxleCount: number,
    driveAxleCount: number,
    axleUnit: 1 | 2,
    actualWeight: number,
  ) => {
    const axleConfiguration: Array<AxleConfiguration> = [
      {
        numberOfAxles: steerAxleCount,
        axleSpread: steerAxleCount > 1 ? 160 : undefined,
        axleUnitWeight: axleUnit === 1 ? actualWeight : 6000,
        numberOfTires: steerAxleCount * 2,
        tireSize: 455,
        vehicleIndex: 0,
      },
      {
        numberOfAxles: driveAxleCount,
        axleSpread: driveAxleCount > 1 ? 160 : undefined,
        interaxleSpacing: 500,
        axleUnitWeight: axleUnit === 2 ? actualWeight : 12000,
        numberOfTires: driveAxleCount * 4,
        tireSize: 455,
        vehicleIndex: 0,
      },
    ];

    return policy
      .runAxleCalculation([powerUnitType], axleConfiguration, 100000)
      .results.find(
        (result) =>
          result.id === PolicyCheckId.CheckLegalWeight &&
          result.startAxleUnit === axleUnit,
      )!;
  };

  const expectLegalResult = (
    result: ReturnType<typeof getLegalResult>,
    thresholdWeight: number,
    expectedResult: PolicyCheckResultType,
  ) => {
    expect(result).toMatchObject({
      thresholdWeight,
      result: expectedResult,
      actualWeight: result.actualWeight,
    });
  };

  // Source: ASW Legal Weight Maximums.feature @orv2-5706-1.
  describe('steering maximums from configuration inputs', () => {
    it.each([
      ['REGTRCK', 1, 2, 9100],
      ['TRKTRAC', 1, 2, 6000],
      ['TRUCKPME', 1, 3, 9100],
      ['TRKTRAC', 2, 2, 17000],
      ['TRACPME', 2, 3, 15200],
    ])(
      'uses the feature threshold for %s with %i steer and %i drive axles (%i kg)',
      (powerUnitType, steerAxleCount, driveAxleCount, thresholdWeight) => {
        expectLegalResult(
          getLegalResult(
            powerUnitType as string,
            steerAxleCount as number,
            driveAxleCount as number,
            1,
            thresholdWeight as number,
          ),
          thresholdWeight as number,
          PolicyCheckResultType.Pass,
        );
      },
    );
  });

  // Source: ASW Legal Weight Maximums.feature @orv2-5706-2.
  describe('single steer with single or tandem drive', () => {
    it.each([
      ['REGTRCK', 1, 9100, 9100, PolicyCheckResultType.Pass],
      ['TRKTRAC', 2, 6001, 6000, PolicyCheckResultType.Fail],
      ['TRACPME', 2, 9100, 9100, PolicyCheckResultType.Pass],
    ])(
      'evaluates %s with %i drive axles at %i kg',
      (
        powerUnitType,
        driveAxleCount,
        actualWeight,
        thresholdWeight,
        expectedResult,
      ) => {
        expectLegalResult(
          getLegalResult(
            powerUnitType as string,
            1,
            driveAxleCount as number,
            1,
            actualWeight as number,
          ),
          thresholdWeight as number,
          expectedResult as PolicyCheckResultType,
        );
      },
    );
  });

  // Source: ASW Legal Weight Maximums.feature @orv2-5706-3.
  describe('single steer with tridem drive', () => {
    it.each([
      ['TRKTRAC', 7300, 7300, PolicyCheckResultType.Pass],
      ['REGTRCK', 7301, 7300, PolicyCheckResultType.Fail],
      ['TRUCKPME', 9100, 9100, PolicyCheckResultType.Pass],
    ])(
      'evaluates %s at %i kg',
      (powerUnitType, actualWeight, thresholdWeight, expectedResult) => {
        expectLegalResult(
          getLegalResult(
            powerUnitType as string,
            1,
            3,
            1,
            actualWeight as number,
          ),
          thresholdWeight as number,
          expectedResult as PolicyCheckResultType,
        );
      },
    );
  });

  // Source: ASW Legal Weight Maximums.feature @orv2-5706-4.
  describe('tandem steer with tandem drive', () => {
    it.each([
      ['TRKTRAC', 17000, PolicyCheckResultType.Pass],
      ['TRUCKPME', 17001, PolicyCheckResultType.Fail],
    ])(
      'evaluates %s at %i kg',
      (powerUnitType, actualWeight, expectedResult) => {
        expectLegalResult(
          getLegalResult(
            powerUnitType as string,
            2,
            2,
            1,
            actualWeight as number,
          ),
          17000,
          expectedResult as PolicyCheckResultType,
        );
      },
    );
  });

  // Source: ASW Legal Weight Maximums.feature @orv2-5706-5.
  describe('tandem steer with tridem drive', () => {
    it.each([
      ['TRKTRAC', 13600, 13600, PolicyCheckResultType.Pass],
      ['REGTRCK', 13601, 13600, PolicyCheckResultType.Fail],
      ['TRACPME', 15200, 15200, PolicyCheckResultType.Pass],
    ])(
      'evaluates %s at %i kg',
      (powerUnitType, actualWeight, thresholdWeight, expectedResult) => {
        expectLegalResult(
          getLegalResult(
            powerUnitType as string,
            2,
            3,
            1,
            actualWeight as number,
          ),
          thresholdWeight as number,
          expectedResult as PolicyCheckResultType,
        );
      },
    );
  });

  // Source: ASW Legal Weight Maximums.feature @orv2-5706-7.
  describe('drive maximums from configuration inputs', () => {
    it.each([
      ['REGTRCK', 1, 9100],
      ['TRACPME', 2, 17000],
      ['REGTRCK', 3, 24000],
      ['TRKTRAC', 3, 24000],
    ])(
      'uses the feature threshold for %s with %i drive axles (%i kg)',
      (powerUnitType, driveAxleCount, thresholdWeight) => {
        expectLegalResult(
          getLegalResult(
            powerUnitType as string,
            1,
            driveAxleCount as number,
            2,
            thresholdWeight as number,
          ),
          thresholdWeight as number,
          PolicyCheckResultType.Pass,
        );
      },
    );
  });

  // Source: ASW Legal Weight Maximums.feature @orv2-5706-8.
  describe('single drive boundary', () => {
    it.each([
      [9100, PolicyCheckResultType.Pass],
      [9101, PolicyCheckResultType.Fail],
    ])('evaluates %i kg', (actualWeight, expectedResult) => {
      expectLegalResult(
        getLegalResult('REGTRCK', 1, 1, 2, actualWeight),
        9100,
        expectedResult,
      );
    });
  });

  // Source: ASW Legal Weight Maximums.feature @orv2-5706-9.
  describe('tandem drive boundary', () => {
    it.each([
      [17000, PolicyCheckResultType.Pass],
      [17001, PolicyCheckResultType.Fail],
    ])('evaluates %i kg', (actualWeight, expectedResult) => {
      expectLegalResult(
        getLegalResult('TRKTRAC', 1, 2, 2, actualWeight),
        17000,
        expectedResult,
      );
    });
  });

  // Source: ASW Legal Weight Maximums.feature @orv2-5706-10.
  describe('fixed-load tridem drive boundary', () => {
    it.each([
      [24000, PolicyCheckResultType.Pass],
      [24001, PolicyCheckResultType.Fail],
    ])('evaluates %i kg', (actualWeight, expectedResult) => {
      expectLegalResult(
        getLegalResult('REGTRCK', 1, 3, 2, actualWeight),
        24000,
        expectedResult,
      );
    });
  });

  // Source: ASW Legal Weight Maximums.feature @orv2-5706-11.
  describe('truck-tractor tridem drive boundary', () => {
    it.each([
      [24000, PolicyCheckResultType.Pass],
      [24001, PolicyCheckResultType.Fail],
    ])('evaluates %i kg', (actualWeight, expectedResult) => {
      expectLegalResult(
        getLegalResult('TRKTRAC', 1, 3, 2, actualWeight),
        24000,
        expectedResult,
      );
    });
  });

  it('returns one structured result for every axle unit', () => {
    const axleConfiguration: Array<AxleConfiguration> = [
      {
        numberOfAxles: 1,
        axleUnitWeight: 9100,
        vehicleIndex: 0,
      },
      {
        numberOfAxles: 2,
        axleSpread: 160,
        interaxleSpacing: 500,
        axleUnitWeight: 17000,
        vehicleIndex: 0,
      },
      {
        numberOfAxles: 1,
        interaxleSpacing: 500,
        axleUnitWeight: 9100,
        vehicleIndex: 1,
      },
    ];
    const results = policy
      .runAxleCalculation(['TRUCKPME', 'SEMITRL'], axleConfiguration, 100000)
      .results.filter((result) => result.id === PolicyCheckId.CheckLegalWeight);

    expect(results).toHaveLength(axleConfiguration.length);
    expect(results).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          startAxleUnit: 1,
          endAxleUnit: 1,
          actualWeight: 9100,
          thresholdWeight: 9100,
        }),
        expect.objectContaining({
          startAxleUnit: 3,
          endAxleUnit: 3,
          actualWeight: 9100,
          thresholdWeight: 9100,
        }),
      ]),
    );
  });

  it('retains configured legal lookup for unrelated power units and trailers', () => {
    const axleConfiguration: Array<AxleConfiguration> = [
      {
        numberOfAxles: 1,
        axleUnitWeight: 6000,
        vehicleIndex: 0,
      },
      {
        numberOfAxles: 2,
        axleSpread: 160,
        interaxleSpacing: 500,
        axleUnitWeight: 17000,
        vehicleIndex: 0,
      },
      {
        numberOfAxles: 2,
        axleSpread: 160,
        interaxleSpacing: 500,
        axleUnitWeight: 17000,
        vehicleIndex: 1,
      },
    ];
    const results = policy
      .runAxleCalculation(['CONCRET', 'SEMITRL'], axleConfiguration, 100000)
      .results.filter((result) => result.id === PolicyCheckId.CheckLegalWeight);

    expect(results.map(({ thresholdWeight }) => thresholdWeight)).toEqual([
      9100, 17000, 17000,
    ]);
  });
});
