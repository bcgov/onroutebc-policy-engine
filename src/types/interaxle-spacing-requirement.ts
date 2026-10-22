import { SelfIssuable } from './self-issuable';
import { InteraxleSpacingModifier } from './interaxle-spacing-modifier';

/**
 * Base interaxle spacing requirement with axle count and modifier
 * Extends SelfIssuable to include self-issuance capability
 */
export type InteraxleSpacingRequirement = SelfIssuable & {
  /**
   * Array of 2-digit numbers representing the axle unit pairs this requirement
   * applies to. The most significant digit is the previous axle unit and the
   * least significant digit is the current axle unit.
   */
  axles?: Array<number>;
  /** The minimum permittable interaxle spacing value in centimetres (optional) */
  min?: number;
  /** The maximum permittable interaxle spacing value in centimetres (optional) */
  max?: number;
  /** Modifier for selecting the applicable spacing rule (optional) */
  modifier?: InteraxleSpacingModifier;
  /** Maximum weight of the axle unit in kilograms in order for the requirement to apply (optional) */
  maxAxleUnitWeight?: number;
};
