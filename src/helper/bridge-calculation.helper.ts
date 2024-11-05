import { BridgeCalculationResult, AxleConfiguration } from 'onroute-policy-engine/types';
import { Policy } from '../policy-engine';

/**
 * Runs the bridge formula against the supplied vehicle axle configuration.
 * Evaluates the weight against all possible axle group combinations and returns
 * the result of each group comparison, with an indicator of whether or not the
 * axle group failed the bridge calculation.
 * @param axleConfig Vehicle dimensions and weights per axle
 * @param policy Policy Enging object initialized with policy config
 * @returns Array of BridgeCalculationResult objects, one for each 
 * axle group in the vehicle configuration
 */
export function runBridgeFormula(axleConfig: Array<AxleConfiguration>, policy: Policy): Array<BridgeCalculationResult> {
  const BRIDGE_MULTIPLIER = policy.policyDefinition.bridgeCalculationConstants.multiplier;
  const BRIDGE_MIN_WEIGHT = policy.policyDefinition.bridgeCalculationConstants.minWeight;

  const results: Array<BridgeCalculationResult> = [];

  let index: number = 0;

  if (!axleConfig || axleConfig.length < 2) {
    throw new Error('Invalid axle configuration, bridge formula requires a minimum of two axle units');
  }

  // Loop through each axle unit in the configuration, and
  // calculate the bridge formula for each other axle unit. The
  // number of axle groups calculated will be the Nth triangular
  // number, where N = (number of axle units) - 1.
  axleConfig.forEach(axle => {
    // Do not process once we reach the last axle unit
    // in the configuration, as they have all been calculated
    // by then.
    if (index < axleConfig.length - 1) {
      // Initialize the variables for our start axle
      let firstAxle: number = index + 1;
      let nextAxle: number = firstAxle + 1;
      if (!axle.numberOfAxles || axle.numberOfAxles < 0) {
        throw new Error(`Invalid or missing number of axles for axle unit number ${firstAxle}`);
      }
      if (!axle.weight || axle.weight < 0) {
        throw new Error(`Invalid or missing weight for axle unit number ${firstAxle}`);
      }
      let totalWeight: number = axle.weight;

      // Spread may be zero or undefined if the axle unit
      // is a single axle. Spacing to next will be zero or
      // undefined for the final axle unit in the configuration.
      if (axle.numberOfAxles > 1 && (!axle.spread || axle.spread < 0)) {
        throw new Error(`Invalid or missing axle spread for axle unit number ${firstAxle}`);
      }
      if (axle.numberOfAxles == 1 && (axle.spread && axle.spread < 0)) {
        throw new Error(`Invalid axle spread for single axle unit, cannot be a negative number`);
      }
      if (!axle.spacingToNext || axle.spacingToNext < 0) {
        throw new Error(`Invalid or missing axle spacing between axle units ${firstAxle} and ${firstAxle + 1}`);
      }
      let wheelbase = (axle.spread ?? 0) + axle.spacingToNext;

      // Now loop through all of the next axles, building up a group
      // for each.
      axleConfig.slice(firstAxle).forEach(axleN => {
        if (!axleN.weight || axleN.weight < 0) {
          throw new Error(`Invalid or missing weight for axle unit number ${nextAxle}`);
        }
        totalWeight += axleN.weight;
        if (axleN.numberOfAxles > 1 && (!axleN.spread || axleN.spread < 0)) {
          throw new Error(`Invalid or missing axle spread for axle unit number ${nextAxle}`);
        }
        wheelbase += (axleN.spread ?? 0);
        // The magic is in the next line
        const maxBridge = (BRIDGE_MULTIPLIER * wheelbase) + BRIDGE_MIN_WEIGHT;

        // Push the axle group result to the results array, including
        // a convenience success indicator.
        results.push({
          startAxleUnit: firstAxle,
          endAxleUnit: nextAxle,
          maxBridge: maxBridge,
          actualWeight: totalWeight,
          success: (totalWeight <= maxBridge),
        })

        // Add the wheelbase only if this end axle unit is not the
        // final one in the configuration
        if (nextAxle < axleConfig.length) {
          if (!axleN.spacingToNext || axleN.spacingToNext < 0) {
            throw new Error(`Invalid or missing axle spacing between axle units ${nextAxle} and ${nextAxle + 1}`);
          }
          wheelbase += (axleN.spacingToNext ?? 0);
        }
        nextAxle++;
      });
    }
    index++;
  });

  return results;
}