/**
 * Vehicle Category Types
 *
 * Defines the structure for vehicle categories including power units and trailers.
 * Extends IdentifiedObject with size and weight dimension defaults.
 */

import {
  IdentifiedObject,
  SizeDimension,
  PowerUnitWeightDimension,
  TrailerWeightDimension,
  WeightDimension,
} from 'onroute-policy-engine/types';

/**
 * Base vehicle category with identification and default dimensions
 * Extends IdentifiedObject with dimension defaults
 */
export type VehicleCategory = IdentifiedObject & {
  /** Default size dimensions for this vehicle category (optional) */
  defaultSizeDimensions?: SizeDimension;
  /** Default weight dimensions for this vehicle category (optional) */
  defaultWeightDimensions?: Array<WeightDimension>;
};

/**
 * Power unit category with power unit specific weight dimensions
 * Extends VehicleCategory with power unit weight defaults
 */
export type PowerUnitCategory = VehicleCategory & {
  /** Default weight dimensions specific to power units (optional) */
  defaultWeightDimensions?: Array<PowerUnitWeightDimension>;
};

/**
 * Trailer category with trailer specific weight dimensions
 * Extends VehicleCategory with trailer weight defaults
 */
export type TrailerCategory = VehicleCategory & {
  /** Default weight dimensions specific to trailers (optional) */
  defaultWeightDimensions?: Array<TrailerWeightDimension>;
};

/**
 * Complete vehicle categories configuration
 */
export type VehicleCategories = {
  /** Array of power unit categories */
  powerUnitCategories: Array<PowerUnitCategory>;
  /** Array of trailer categories */
  trailerCategories: Array<TrailerCategory>;
};
