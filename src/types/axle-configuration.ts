/**
 * Axle Configuration Type
 *
 * Defines the structure for individual axle configurations within a vehicle.
 * Used for weight calculations, spacing requirements, and compliance validation.
 */

export type AxleConfiguration = {
  /** Number of axles in this configuration (1 for single, 2+ for groups) */
  numberOfAxles: number;
  /** Total spread between first and last axle in centimeters */
  axleSpread?: number;
  /** Spacing from the previous axle unit in centimeters */
  interaxleSpacing?: number;
  /** Weight carried by this axle unit in kilograms */
  axleUnitWeight: number;
  /** Number of tires on this axle unit */
  numberOfTires?: number;
  /** Tire size in inches */
  tireSize?: number;
};
