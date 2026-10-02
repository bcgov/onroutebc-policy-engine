import { SelfIssuable } from './self-issuable';
import { InteraxleSpacingModifier } from './interaxle-spacing-modifier';

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
  /** Modifier for selecting the applicable spacing rule (optional) */
  modifier?: InteraxleSpacingModifier;
};
