import { SelfIssuable } from './self-issuable';
import { WheelbaseRequirementModifier } from './wheelbase-requirement-modifier';

/**
 * Base wheelbase requirement with axle count
 * Extends SelfIssuable to include self-issuance capability
 */
export type WheelbaseRequirement = SelfIssuable & {
  /**
   * 2-digit number representing the axle unit pair this requirement
   * applies to. The most significant digit is the previous axle unit and the
   * least significant digit is the current axle unit, in this case the drive axle.
   */
  axles?: number;
  /** The minimum permittable wheelbase value in centimetres (optional) */
  minWheelbase?: number;
  /** The maximum permittable wheelbase value in centimetres (optional) */
  maxWheelbase?: number;
  /** Modifier for selecting the applicable wheelbase requirement (optional) */
  modifier?: WheelbaseRequirementModifier;
  /** Minimum axle spread of the drive axle unit in kilograms in order for the requirement to apply (optional) */
  minAxleSpread?: number;
  /** Maximum axle spread of the drive axle unit in kilograms in order for the requirement to apply (optional) */
  maxAxleSpread?: number;
};
