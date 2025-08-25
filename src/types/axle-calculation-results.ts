/**
 * Axle Calculation Results Types
 *
 * These types define the structure for axle calculation results and policy check outcomes.
 * Used for validating vehicle configurations against weight and axle requirements.
 */

import { PolicyCheckResultType } from 'onroute-policy-engine/enum';

/**
 * Complete results from axle calculations including all policy checks and total overload
 */
export type AxleCalcResults = {
  /** Array of individual policy check results */
  results: Array<PolicyCheckResult>;
  /** Total weight overload across all axles in kilograms */
  totalOverload: number;
};

/**
 * Individual policy check result for a specific validation rule
 */
export type PolicyCheckResult = {
  /** Actual weight measured/calculated in kilograms */
  actualWeight?: number;
  /** Maximum allowed weight threshold in kilograms */
  thresholdWeight?: number;
  /** Unique identifier for the policy check */
  id: string;
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
