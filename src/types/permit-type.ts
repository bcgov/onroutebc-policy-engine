/**
 * Permit Type
 * 
 * Defines the structure for permit types including requirements, allowed vehicles,
 * commodities, rules, and conditions. Extends IdentifiedObject with permit-specific properties.
 */

import { RuleProperties } from 'json-rules-engine';
import {
  CostRule,
  IdentifiedObject,
  ConditionRequirement,
} from 'onroute-policy-engine/types';

/**
 * Complete definition of a permit type with all requirements and configurations
 */
export type PermitType = IdentifiedObject & {
  /** Whether routing information is required for this permit type */
  routingRequired: boolean;
  /** Whether weight dimension information is required for this permit type */
  weightDimensionRequired: boolean;
  /** Whether size dimension information is required for this permit type */
  sizeDimensionRequired: boolean;
  /** Whether commodity information is required for this permit type */
  commodityRequired: boolean;
  /** Array of allowed vehicle types for this permit (optional) */
  allowedVehicles?: Array<string>;
  /** Array of allowed commodities for this permit (optional) */
  allowedCommodities?: Array<string>;
  /** Array of validation rules for this permit type (optional) */
  rules?: Array<RuleProperties>;
  /** Array of cost calculation rules for this permit type (optional) */
  costRules?: Array<CostRule>;
  /** Array of conditions that must be met for this permit type (optional) */
  conditions?: Array<ConditionRequirement>;
};
