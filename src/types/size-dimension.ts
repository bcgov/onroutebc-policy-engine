/**
 * Size Dimension Type
 *
 * Defines the structure for vehicle size dimensions including length, width, height,
 * projections, and regional overrides. Extends SelfIssuable for self-issuance capability.
 */

import {
  DimensionModifier,
  RegionSizeOverride,
  SelfIssuable,
} from 'onroute-policy-engine/types';

/**
 * Complete size dimension configuration for vehicles
 * Extends SelfIssuable to include self-issuance capability
 */
export type SizeDimension = SelfIssuable & {
  /** Front projection in meters (optional) */
  fp?: number;
  /** Rear projection in meters (optional) */
  rp?: number;
  /** Width in meters (optional) */
  w?: number;
  /** Height in meters (optional) */
  h?: number;
  /** Length in meters (optional) */
  l?: number;
  /** Array of dimension modifiers for special configurations (optional) */
  modifiers?: Array<DimensionModifier>;
  /** Array of regional size overrides (optional) */
  regions?: Array<RegionSizeOverride>;
};
