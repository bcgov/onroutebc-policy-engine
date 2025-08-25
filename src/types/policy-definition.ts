/**
 * Policy Definition Type
 *
 * Defines the complete structure for policy definitions including geographic regions,
 * permit types, rules, defaults, and configurations. This is the main configuration
 * type for the policy engine.
 */

import {
  GeographicRegion,
  PermitType,
  DefaultWeightDimensions,
  VehicleTypes,
  Commodity,
  SizeDimension,
  VehicleCategories,
  RangeMatrix,
  BridgeCalculationConstants,
  PermitConditionDefinition,
  StandardTireSize,
  VehicleDisplayCodeDefaults,
} from 'onroute-policy-engine/types';
import { RuleProperties } from 'json-rules-engine';

/**
 * Complete policy definition containing all configuration data for the policy engine
 */
export type PolicyDefinition = {
  /** Minimum required policy engine version for compatibility */
  minPEVersion: string;
  /** Array of geographic regions having specific policy rules */
  geographicRegions: Array<GeographicRegion>;
  /** Array of permit types available in this policy */
  permitTypes: Array<PermitType>;
  /** Array of common rules that apply to all permits */
  commonRules: Array<RuleProperties>;
  /** Global default weight dimensions for vehicles */
  globalWeightDefaults: DefaultWeightDimensions;
  /** Global default size dimensions for vehicles */
  globalSizeDefaults: SizeDimension;
  /** Vehicle categories configuration */
  vehicleCategories: VehicleCategories;
  /** Vehicle types configuration */
  vehicleTypes: VehicleTypes;
  /** Array of commodities that can be transported */
  commodities: Array<Commodity>;
  /** Array of range matrices for cost calculations (optional) */
  rangeMatrices?: Array<RangeMatrix>;
  /** Constants for bridge formula calculations */
  bridgeCalculationConstants: BridgeCalculationConstants;
  /** Array of permit conditions (optional) */
  conditions?: Array<PermitConditionDefinition>;
  /** Array of standard tire sizes (optional) */
  standardTireSizes?: Array<StandardTireSize>;
  /** Default configuration for vehicle display codes (optional) */
  vehicleDisplayCodeDefaults?: VehicleDisplayCodeDefaults;
};
