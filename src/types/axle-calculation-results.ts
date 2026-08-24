/**
 * Axle Calculation Results Types
 *
 * These types define the structure for axle calculation results and policy check outcomes.
 * Used for validating vehicle configurations against weight and axle requirements.
 */

import {
  PolicyCheckId,
  PolicyCheckResultType,
} from 'onroute-policy-engine/enum';

/**
 * Complete results from axle calculations including all policy checks and total overload
 */
export type AxleCalcResults = {
  /** Array of individual axle group policy check results */
  results: Array<AxleGroupPolicyCheckResult>;
  /** Total weight overload across all axles in kilograms */
  overload: number;
  /** Details for only the selected overload calculation */
  overloadDetails: Array<OverloadCalculationDetail>;
  /** Total Gross Combined Vehicle Weight across all axles in kilograms */
  totalGCVW: number;
};

/** Licensed-GVW overload selected across the complete axle configuration. */
export type LicensedGvwOverloadCalculationDetail = {
  kind: 'licensed-gvw';
  startAxleUnit: number;
  endAxleUnit: number;
  licensedGVW: number;
  totalGCVW: number;
  overload: number;
};

/** Legal-weight overload selected for an axle unit or axle-unit group. */
export type AxleWeightOverloadCalculationDetail = {
  kind: 'axle-weight';
  startAxleUnit: number;
  endAxleUnit: number;
  actualWeight: number;
  legalMaxWeight: number;
  overload: number;
};

export type OverloadCalculationDetail =
  | LicensedGvwOverloadCalculationDetail
  | AxleWeightOverloadCalculationDetail;

/**
 * Individual policy check result for a specific validation rule
 */
export type PolicyCheckResult = {
  /** Actual weight measured/calculated in kilograms */
  actualWeight?: number;
  /** Maximum allowed weight threshold in kilograms */
  thresholdWeight?: number;
  /** Unique identifier for the policy check */
  // id: string;
  id: PolicyCheckId;
  /** Result of the policy check (pass/fail) */
  result: PolicyCheckResultType;
  /** Human-readable message describing the check result */
  message: string;
};

/**
 * Policy check result for a single axle unit
 * Extends PolicyCheckResult with axle unit identification
 */
export type AxleUnitPolicyCheckResult = PolicyCheckResult & {
  /** The axle unit number being checked */
  axleUnit: number;
};

/**
 * Policy check result for a group of axles
 * Extends PolicyCheckResult with axle group range
 */
export type AxleGroupPolicyCheckResult = PolicyCheckResult & {
  /** Starting axle unit number in the group */
  startAxleUnit: number;
  /** Ending axle unit number in the group */
  endAxleUnit: number;
};
