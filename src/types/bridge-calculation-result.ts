/**
 * Bridge Calculation Result Type
 * 
 * Defines the result structure for bridge formula calculations.
 * Used to determine if a vehicle configuration meets bridge weight requirements.
 */
export type BridgeCalculationResult = {
  /** Starting axle unit number in the calculation */
  startAxleUnit: number;
  /** Ending axle unit number in the calculation */
  endAxleUnit: number;
  /** Maximum allowable weight according to bridge formula in kilograms */
  maxBridge: number;
  /** Actual weight being carried in kilograms */
  actualWeight: number;
  /** Whether the configuration passes bridge formula requirements */
  success: boolean;
};
