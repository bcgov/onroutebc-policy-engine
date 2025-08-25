/**
 * Vehicle Types
 *
 * Defines the structure for vehicles including power units and trailers.
 * Extends SelfIssuable for self-issuance capability and includes dimension configurations.
 */

import {
  SelfIssuable,
  SizeDimension,
  PowerUnitWeightDimension,
  TrailerWeightDimension,
} from 'onroute-policy-engine/types';

/**
 * Base vehicle with type identification and self-issuance capability
 * Extends SelfIssuable to include self-issuance capability
 */
export type Vehicle = SelfIssuable & {
  /** Type identifier for this vehicle */
  type: string;
};

/**
 * Power unit with trailer configuration and weight dimensions
 * Extends Vehicle with trailer and weight dimension arrays
 */
export type VehicleDimensions = Vehicle & {
  /** Array of trailers attached to this power unit */
  trailers: Array<TrailerDimensions>;
  /** Array of weight dimensions for this power unit (optional) */
  weightDimensions?: Array<PowerUnitWeightDimension>;
};

/**
 * Trailer with booster/jeep configuration and dimension capabilities
 * Extends Vehicle with trailer-specific properties
 */
export type TrailerDimensions = Vehicle & {
  /** Whether this trailer is allowed a booster */
  booster: boolean;
  /** Whether this trailer is allowed a jeep */
  jeep: boolean;
  /** Array of size dimensions for this trailer (optional) */
  sizeDimensions?: Array<SizeDimension>;
  /** Whether size is permittable for this trailer (optional) */
  sizePermittable?: boolean;
  /** Array of weight dimensions for this trailer (optional) */
  weightDimensions?: Array<TrailerWeightDimension>;
  /** Whether weight is permittable for this trailer (optional) */
  weightPermittable?: boolean;
};
