import { SelfIssuable } from './self-issuable';

/**
 * Modifier for selecting the correct wheelbase requirement based on
 * the adjacent vehicle configuration.
 */
export type WheelbaseRequirementModifier = SelfIssuable & {
  /** Position relative to the current axle unit */
  position: string;
  /** Matching vehicle type / subtype for this modifier */
  type?: string;
  /** Matching vehicle category for this modifier */
  category?: string;
};
