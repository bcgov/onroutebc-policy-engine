import { PolicyCheckResultType } from 'onroute-policy-engine/enum';

export type AxleCalcResults = {
  results: Array<PolicyCheckResult>;
  totalOverload: number;
};

export type PolicyCheckResult = {
  actualWeight?: number;
  thresholdWeight?: number;
  id: string;
  result: PolicyCheckResultType;
  message: string;
};

export type AxleUnitPolicyCheckResult = PolicyCheckResult & {
  axleUnit: number;
};

export type AxleGroupPolicyCheckResult = PolicyCheckResult & {
  startAxleUnit: number;
  endAxleUnit: number;
};
