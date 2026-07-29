import { Policy } from '../../policy-engine';
import { PolicyCheckId, PolicyCheckResultType } from '../../enum';
import {
  AxleCalcResults,
  AxleConfiguration,
  AxleGroupPolicyCheckResult,
} from '../../types';
import currentPolicyConfig from '../policy-config/_current-config.json';

describe('runAxleCalculation robustness regressions', () => {
  const policy = new Policy(currentPolicyConfig);

  const validFirstAxle: AxleConfiguration = {
    numberOfAxles: 1,
    axleUnitWeight: 5000,
    numberOfTires: 2,
    tireSize: 279,
    vehicleIndex: 0,
  };

  const validSecondAxle: AxleConfiguration = {
    ...validFirstAxle,
    interaxleSpacing: 300,
  };

  const expectBridgeInputFailure = (
    axleConfiguration: AxleConfiguration[],
    expectedMessage: string,
    expectedAxleUnit: number,
  ) => {
    let calculation: AxleCalcResults | undefined;

    expect(() => {
      calculation = policy.runAxleCalculation(
        ['CRANEAT'],
        axleConfiguration,
        100000,
      );
    }).not.toThrow();

    expect(calculation!.results).toContainEqual(
      expect.objectContaining<Partial<AxleGroupPolicyCheckResult>>({
        id: PolicyCheckId.BridgeFormula,
        result: PolicyCheckResultType.Fail,
        message: expectedMessage,
        startAxleUnit: expectedAxleUnit,
        endAxleUnit: expectedAxleUnit,
      }),
    );
  };

  it('returns a failed result for invalid interaxle spacing instead of throwing', () => {
    expectBridgeInputFailure(
      [{ ...validFirstAxle }, { ...validSecondAxle, interaxleSpacing: -1000 }],
      'Axle spacing before axle unit 2 must be a finite number greater than 0.',
      2,
    );
  });

  it('returns a failed result for invalid first-unit axle spread instead of throwing', () => {
    expectBridgeInputFailure(
      [
        {
          ...validFirstAxle,
          numberOfAxles: 2,
          numberOfTires: 4,
          axleSpread: -1000,
        },
        { ...validSecondAxle },
      ],
      'Axle spread for axle unit 1 must be a finite number greater than 0 when the unit has multiple axles.',
      1,
    );
  });

  it('returns a failed result for invalid later-unit axle spread instead of throwing', () => {
    expectBridgeInputFailure(
      [
        { ...validFirstAxle },
        {
          ...validSecondAxle,
          numberOfAxles: 2,
          numberOfTires: 4,
          axleSpread: -1000,
        },
      ],
      'Axle spread for axle unit 2 must be a finite number greater than 0 when the unit has multiple axles.',
      2,
    );
  });

  it('returns a failed result for invalid first-unit weight instead of throwing', () => {
    expectBridgeInputFailure(
      [{ ...validFirstAxle, axleUnitWeight: -100000 }, { ...validSecondAxle }],
      'Axle unit weight for axle unit 1 must be a finite number greater than 0.',
      1,
    );
  });

  it('returns a failed result for invalid later-unit weight instead of throwing', () => {
    expectBridgeInputFailure(
      [{ ...validFirstAxle }, { ...validSecondAxle, axleUnitWeight: -100000 }],
      'Axle unit weight for axle unit 2 must be a finite number greater than 0.',
      2,
    );
  });
});
