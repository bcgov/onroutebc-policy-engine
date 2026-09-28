import { DimensionModifier } from './dimension-modifier';
import { SelfIssuable } from './self-issuable';

/**
 * Base interaxle spacing requirement with axle count and modifier
 * Extends SelfIssuable to include self-issuance capability
 */
export type InteraxleSpacingRequirement = SelfIssuable & {
  /** Number of axles applicable to this requirement */
  axles: number;
  /** The minimum interaxle spacing value (optional) */
  min?: number;
  /** The maximum interaxle spacing value (optional) */
  max?: number;
  /** Dimension modifier for special configurations (optional) */
  modifier?: DimensionModifier;
};
