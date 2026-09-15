import { Policy } from '../../policy-engine';
import { PolicyCheckId, PolicyCheckResultType } from '../../enum';
import {
  AxleCalcResults,
  AxleConfiguration,
} from '../../types';
import currentPolicyConfig from '../policy-config/_current-config.json';
import { POWER_UNIT_CODES } from '../../constants/power-unit-codes';

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

  const expectBridgeCalculationSkipped = (
    axleConfiguration: AxleConfiguration[],
  ) => {
    let calculation: AxleCalcResults | undefined;

    expect(() => {
      calculation = policy.runAxleCalculation(
        [POWER_UNIT_CODES.CRANES_ALL_TERRAIN],
        axleConfiguration,
        100000,
      );
    }).not.toThrow();

    expect(calculation!.results).not.toContainEqual(
      expect.objectContaining({ id: PolicyCheckId.BridgeFormula }),
    );
  };

  it('skips bridge formula for invalid interaxle spacing instead of throwing', () => {
    expectBridgeCalculationSkipped(
      [{ ...validFirstAxle }, { ...validSecondAxle, interaxleSpacing: -1000 }],
    );
  });

  it('skips bridge formula for invalid first-unit axle spread instead of throwing', () => {
    expectBridgeCalculationSkipped(
      [
        {
          ...validFirstAxle,
          numberOfAxles: 2,
          numberOfTires: 4,
          axleSpread: -1000,
        },
        { ...validSecondAxle },
      ],
    );
  });

  it('skips bridge formula for invalid later-unit axle spread instead of throwing', () => {
    expectBridgeCalculationSkipped(
      [
        { ...validFirstAxle },
        {
          ...validSecondAxle,
          numberOfAxles: 2,
          numberOfTires: 4,
          axleSpread: -1000,
        },
      ],
    );
  });

  it('skips bridge formula for invalid first-unit weight instead of throwing', () => {
    expectBridgeCalculationSkipped(
      [{ ...validFirstAxle, axleUnitWeight: -100000 }, { ...validSecondAxle }],
    );
  });

  it('skips bridge formula for invalid later-unit weight instead of throwing', () => {
    expectBridgeCalculationSkipped(
      [{ ...validFirstAxle }, { ...validSecondAxle, axleUnitWeight: -100000 }],
    );
  });

  it('returns the legal axle spread violation for a zero tandem drive spread', () => {
    let calculation: AxleCalcResults | undefined;

    expect(() => {
      calculation = policy.runAxleCalculation(
        [POWER_UNIT_CODES.TRUCK_TRACTORS],
        [
          { ...validFirstAxle, axleUnitWeight: 6700 },
          {
            ...validSecondAxle,
            numberOfAxles: 2,
            axleUnitWeight: 12000,
            numberOfTires: 4,
            axleSpread: 0,
          },
        ],
        100000,
      );
    }).not.toThrow();

    expect(calculation!.results).toContainEqual(
      expect.objectContaining({
        id: PolicyCheckId.LegalAxleSpread,
        result: PolicyCheckResultType.Fail,
        message:
          'Axle Spread for Axle Unit 2 must be between 1.0 m and 1.85 m.',
        startAxleUnit: 2,
        endAxleUnit: 2,
      }),
    );
    expect(calculation!.results).not.toContainEqual(
      expect.objectContaining({ id: PolicyCheckId.BridgeFormula }),
    );
  });
});
