import { SelfIssuable } from './self-issuable';
import { InteraxleSpacingModifier } from './interaxle-spacing-modifier';

/**
 * Base interaxle spacing requirement with axle count and modifier
 * Extends SelfIssuable to include self-issuance capability
 */
export type InteraxleSpacingRequirement = SelfIssuable & {
  /** Number of axles applicable to this requirement */
  axles?: number;
  /** The minimum permittable interaxle spacing value in centimetres (optional) */
  min?: number;
  /** The maximum permittable interaxle spacing value in centimetres (optional) */
  max?: number;
  /** Modifier for selecting the applicable spacing rule (optional) */
  modifier?: InteraxleSpacingModifier;
  /** Maximum weight of the axle unit in kilograms in order for the requirement to apply (optional) */
  maxAxleUnitWeight?: number;
};
