/**
 * Standard Tire Size Type
 *
 * Defines the structure for standard tire sizes used in vehicle configurations
 * and axle calculations.
 */

export type StandardTireSize = {
  /** Name of the tire size (e.g., '11R22.5') */
  name: string;
  /** Tire size in inches (e.g., 22.5 for 11R22.5) */
  size: number;
};
