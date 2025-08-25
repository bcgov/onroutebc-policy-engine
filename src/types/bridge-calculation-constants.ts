/**
 * Bridge Calculation Constants Type
 * 
 * Defines constants used in bridge formula calculations for determining
 * maximum allowable weights based on axle spacing and configuration.
 */
export type BridgeCalculationConstants = {
  /** Multiplier factor for bridge formula calculations */
  multiplier: number;
  /** Minimum weight threshold in kilograms */
  minWeight: number;
};
