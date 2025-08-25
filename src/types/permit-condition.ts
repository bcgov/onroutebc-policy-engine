/**
 * Permit Condition Types
 *
 * Defines the structure for permit conditions and requirements that must be met
 * for permit approval and compliance.
 */

export type PermitConditionDefinition = {
  /** Human-readable description of the condition */
  description: string;
  /** Specific condition text that must be met */
  condition: string;
  /** Link to detailed condition information */
  conditionLink: string;
};

/**
 * Requirement for a permit condition including mandatory status
 */
export type ConditionRequirement = {
  /** The condition text that must be satisfied */
  condition: string;
  /** Whether this condition is mandatory for permit approval */
  mandatory?: boolean;
};

/**
 * Complete permit condition combining definition and requirement
 * Extends PermitConditionDefinition with requirement details
 */
export type ConditionForPermit = PermitConditionDefinition &
  ConditionRequirement;
