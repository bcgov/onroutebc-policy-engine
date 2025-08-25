/**
 * Region Size Override Type
 *
 * Defines size dimension overrides for specific geographic regions.
 * Used to apply region-specific size limits and requirements.
 */

export type RegionSizeOverride = {
  /** Geographic region identifier */
  region: string;
  /** Width override in meters (optional) */
  w?: number;
  /** Height override in meters (optional) */
  h?: number;
  /** Length override in meters (optional) */
  l?: number;
};
