/**
 * Cost Rule Type
 * 
 * Defines the structure for cost calculation rules used in permit pricing.
 * Maps facts to parameters for dynamic cost calculations.
 */

export type CostRule = {
  /** The fact identifier used in the cost calculation */
  fact: string;
  /** Parameters passed to the cost calculation function */
  params: Record<string, any>;
};
