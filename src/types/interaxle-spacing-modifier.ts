import { SelfIssuable } from './self-issuable';

/**
 * Modifier for selecting the correct interaxle spacing requirement based on
 * the adjacent vehicle configuration.
 *
 * This is intentionally narrower than DimensionModifier because interaxle
 * spacing rules only care about the matching context (vehicle type/category,
 * axle count, and position), while the numeric threshold itself lives on the
 * enclosing requirement object as min/max.
 */
export type InteraxleSpacingModifier = SelfIssuable & {
  /** Position relative to the current axle unit */
  position: string;
  /** Matching vehicle type / subtype for this modifier */
  type?: string;
  /** Matching vehicle category for this modifier */
  category?: string;
  /** Number of axles in the adjacent axle unit for this modifier */
  axles?: number;
};
