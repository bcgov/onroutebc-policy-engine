import { PolicyCheckResult, AxleConfiguration, AxleUnitPolicyCheckResult, AxleGroupPolicyCheckResult } from "onroute-policy-engine/types";
import { Policy } from "onroute-policy-engine";
import { PolicyCheckId, PolicyCheckResultType } from "../enum";

type PolicyCheck = (policy: Policy, vehicleConfiguration: Array<string>, axleConfiguration: Array<AxleConfiguration>) => Array<PolicyCheckResult>;

export function CheckBridgeFormula(policy: Policy, _vehicleConfiguration: Array<string>, axleConfiguration: Array<AxleConfiguration>): Array<PolicyCheckResult> {
  const policyCheckResults = new Array<AxleGroupPolicyCheckResult>();
  const policyId = PolicyCheckId.BridgeFormula;
  const bridgeCalcResults = policy.calculateBridge(axleConfiguration);
  bridgeCalcResults.forEach(br => {
    const message = `Axle group ${br.startAxleUnit} to ${br.endAxleUnit} ${br.success ? 'passes' : 'does not pass'} bridge formula.`;
    policyCheckResults.push({
      id: policyId,
      message: message,
      result: br.success ? PolicyCheckResultType.Pass : PolicyCheckResultType.Fail,
      startAxleUnit: br.startAxleUnit,
      endAxleUnit: br.endAxleUnit,
    });
  });
  return policyCheckResults;
}

export function CheckNumTiresPerAxle(_policy: Policy, _vehicleConfiguration: Array<string>, axleConfiguration: Array<AxleConfiguration>): Array<PolicyCheckResult> {
  const policyCheckResults = new Array<AxleUnitPolicyCheckResult>();
  const policyId = PolicyCheckId.NumberOfWheelsPerAxle;
  let axleNum = 1;
  axleConfiguration.forEach(ac => {
    const numTires = ac.numberOfTires || 0;
    const numAxles = ac.numberOfAxles;
    // Default result to fail, set to pass explicitly if valid
    let result = PolicyCheckResultType.Fail;
    let message;
    if (!numAxles) {
      // Invalid number of axles, cannot calculate
      message = `Number of axles for axle unit ${axleNum} is not permittable.`;
    } else {
      const checkResult = [numAxles * 2, numAxles * 4, numAxles * 8].includes(numTires);
      message = `Number of wheels for axle unit ${axleNum} is ${checkResult ? '' : 'not '}permittable.`;
      if (checkResult) result = PolicyCheckResultType.Pass;
    }
    policyCheckResults.push({
      id: policyId,
      message: message,
      result: result,
      axleUnit: axleNum
    });
    axleNum++;
  });
  return policyCheckResults;
}

export const policyCheckMap = new Map<string, PolicyCheck>([
  [PolicyCheckId.BridgeFormula, CheckBridgeFormula],
  [PolicyCheckId.NumberOfWheelsPerAxle, CheckNumTiresPerAxle]
]);