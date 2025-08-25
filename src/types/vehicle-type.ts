/**
 * Vehicle Type Types
 *
 * Defines the structure for vehicle types including power units and trailers.
 * Extends IdentifiedObject with category, dimensions, and special configurations.
 */

import {
  ConditionRequirement,
  IdentifiedObject,
  SizeDimension,
  PowerUnitWeightDimension,
  TrailerWeightDimension,
} from 'onroute-policy-engine/types';

/**
 * Base vehicle type with identification and configuration options
 * Extends IdentifiedObject with vehicle-specific properties
 */
export type VehicleType = IdentifiedObject & {
  /** Category identifier for this vehicle type */
  category: string;
  /** Default size dimensions for this vehicle type (optional) */
  defaultSizeDimensions?: SizeDimension;
  /** Whether to ignore this vehicle type for size dimension calculations (optional) */
  ignoreForSizeDimensions?: boolean;
  /** Whether to ignore this vehicle type for axle calculations (optional) */
  ignoreForAxleCalculation?: boolean;
  /** Whether this vehicle type is an LCV (Long Combination Vehicle) (optional) */
  isLcv?: boolean;
  /** Array of conditions required for this vehicle type (optional) */
  conditions?: Array<ConditionRequirement>;
  /** Additional axle subtype identifier (optional) */
  additionalAxleSubType?: string;
};

/**
 * Power unit type with power unit specific configurations
 * Extends VehicleType with power unit specific properties
 */
export type PowerUnitType = VehicleType & {
  /** Default weight dimensions specific to power units (optional) */
  defaultWeightDimensions?: Array<PowerUnitWeightDimension>;
  /** Display code prefix for this power unit type (optional) */
  displayCodePrefix?: string;
  /** Display code for steer axle (optional) */
  displayCodeSteerAxle?: string;
  /** Display code for drive axle (optional) */
  displayCodeDriveAxle?: string;
};

/**
 * Trailer type with trailer specific configurations
 * Extends VehicleType with trailer specific properties
 */
export type TrailerType = VehicleType & {
  /** Default weight dimensions specific to trailers (optional) */
  defaultWeightDimensions?: Array<TrailerWeightDimension>;
  /** Display code for this trailer type (optional) */
  displayCode?: string;
};

/**
 * Complete vehicle types configuration
 */
export type VehicleTypes = {
  /** Array of power unit types */
  powerUnitTypes: Array<PowerUnitType>;
  /** Array of trailer types */
  trailerTypes: Array<TrailerType>;
};
