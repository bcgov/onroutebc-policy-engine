/**
 * Weight Dimension Types
 *
 * Defines the structure for weight dimensions including single axles, power units,
 * and trailers. Extends SelfIssuable for self-issuance capability.
 */

import { DimensionModifier, SelfIssuable } from 'onroute-policy-engine/types';

/**
 * Weight limits for a single axle unit
 */
export type SingleAxleDimension = {
  /** Legal weight limit in kilograms (optional) */
  legal?: number;
  /** Permittable weight limit in kilograms (optional) */
  permittable?: number;
};

/**
 * Base weight dimension with axle count and modifier
 * Extends SelfIssuable to include self-issuance capability
 */
export type WeightDimension = SelfIssuable & {
  /** Number of axles applicable to this weight dimension */
  axles: number;
  /** Dimension modifier for special configurations (optional) */
  modifier?: DimensionModifier;
};

/**
 * Weight dimension specific to power units with steer and drive axle limits
 * Extends WeightDimension with power unit specific weight limits
 */
export type PowerUnitWeightDimension = WeightDimension & {
  /** Single axle legal weight limit in kilograms (optional) */
  saLegal?: number;
  /** Single axle permittable weight limit in kilograms (optional) */
  saPermittable?: number;
  /** Drive axle legal weight limit in kilograms (optional) */
  daLegal?: number;
  /** Drive axle permittable weight limit in kilograms (optional) */
  daPermittable?: number;
};

/**
 * Weight dimension specific to trailers
 * Extends WeightDimension with single axle dimension limits
 */
export type TrailerWeightDimension = WeightDimension & SingleAxleDimension;

/**
 * Default weight dimensions for all vehicle types
 */
export type DefaultWeightDimensions = {
  /** Array of power unit weight dimensions */
  powerUnits: Array<PowerUnitWeightDimension>;
  /** Array of trailer weight dimensions */
  trailers: Array<TrailerWeightDimension>;
};
