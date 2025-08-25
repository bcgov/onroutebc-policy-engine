/**
 * Dimension Modifier Types
 * 
 * Defines structures for modifying vehicle dimensions based on configuration
 * and relationships between vehicle components.
 */

import { SelfIssuable } from 'onroute-policy-engine/types';

/**
 * Modifier for adjusting vehicle dimensions based on configuration
 * Extends SelfIssuable to include self-issuance capability
 */
export type DimensionModifier = SelfIssuable & {
  /** Position identifier for the modifier (e.g., 'first', 'last', 'next') */
  position: string;
  /** Type of vehicle component being modified */
  type?: string;
  /** Category of vehicle component being modified */
  category?: string;
  /** Number of axles in the axle unit affected by this modifier */
  axles?: number;
  /** Minimum interaxle spacing in millimeters */
  minInterAxleSpacing?: number;
  /** Maximum interaxle spacing in millimeters */
  maxInterAxleSpacing?: number;
};

/**
 * Defines relationships between vehicle components for dimension calculations
 */
export type VehicleRelatives = {
  /** First vehicle type in the configuration */
  firstType: string;
  /** Last vehicle type in the configuration */
  lastType?: string;
  /** Next vehicle type in sequence */
  nextType?: string | null;
  /** Previous vehicle type in sequence */
  prevType?: string | null;
  /** First vehicle category in the configuration */
  firstCategory?: string | null;
  /** Last vehicle category in the configuration */
  lastCategory?: string | null;
  /** Next vehicle category in sequence */
  nextCategory?: string | null;
  /** Previous vehicle category in sequence */
  prevCategory?: string | null;
};
