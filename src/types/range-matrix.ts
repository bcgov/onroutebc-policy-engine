/**
 * Range Matrix Types
 *
 * Defines structures for range-based calculations and lookups used in cost
 * calculations and other policy determinations.
 */

import { IdentifiedObject } from 'onroute-policy-engine/types';

/**
 * A range matrix containing multiple matrix entries for lookups
 * Extends IdentifiedObject with matrix data
 */
export type RangeMatrix = IdentifiedObject & {
  /** Array of matrix entries for range-based lookups */
  matrix: Matrix[];
};

/**
 * Individual matrix entry with range and value
 */
export type Matrix = {
  /** Minimum value for the range (optional) */
  min?: number;
  /** Maximum value for the range (optional) */
  max?: number;
  /** Value associated with this range */
  value: number;
};
