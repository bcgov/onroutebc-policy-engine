import {
  BridgeCalculationResult,
  AxleConfiguration,
} from 'onroute-policy-engine/types';
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
export function runBridgeFormula(
  axleConfig: Array<AxleConfiguration>,
  policy: Policy,
): Array<BridgeCalculationResult> {
  const BRIDGE_MULTIPLIER =
    policy.policyDefinition.bridgeCalculationConstants.multiplier;
  const BRIDGE_MIN_WEIGHT =
    policy.policyDefinition.bridgeCalculationConstants.minWeight;

  const results: Array<BridgeCalculationResult> = [];

  let index: number = 0;

  if (!axleConfig || axleConfig.length < 2) {
    throw new Error(
      'Invalid axle configuration, bridge formula requires a minimum of two axle units',
    );
  }

  // Loop through each axle unit in the configuration, and
  // calculate the bridge formula for each other axle unit. The
  // number of axle groups calculated will be the Nth triangular
  // number, where N = (number of axle units) - 1.
  axleConfig.forEach((axle) => {
    // Do not process once we reach the last axle unit
    // in the configuration, as they have all been calculated
    // by then.
    if (index <= axleConfig.length) {
      // Initialize the variables for our start axle
      const firstAxle: number = index + 1;
      let nextAxle: number = firstAxle + 1;
      if (!axle.numberOfAxles || axle.numberOfAxles < 0) {
        throw new Error(
          `Invalid or missing number of axles for axle unit number ${firstAxle}`,
        );
      }
      if (!axle.axleUnitWeight || axle.axleUnitWeight < 0) {
        throw new Error(
          `Invalid or missing weight for axle unit number ${firstAxle}`,
        );
      }
      let totalWeight: number = axle.axleUnitWeight;

      // Spread may be zero or undefined if the axle unit
      // is a single axle. Spacing to next will be zero or
      // undefined for the final axle unit in the configuration.
      if (axle.numberOfAxles > 1 && (!axle.axleSpread || axle.axleSpread < 0)) {
        throw new Error(
          `Invalid or missing axle spread for axle unit number ${firstAxle}`,
        );
      }
      if (axle.numberOfAxles == 1 && axle.axleSpread && axle.axleSpread < 0) {
        throw new Error(
          `Invalid axle spread for single axle unit, cannot be a negative number`,
        );
      }
      let wheelbase = axle.axleSpread ?? 0;

      // Now loop through all of the next axles, building up a group
      // for each.
      axleConfig.slice(firstAxle).forEach((axleN) => {
        if (!axleN.axleUnitWeight || axleN.axleUnitWeight < 0) {
          throw new Error(
            `Invalid or missing weight for axle unit number ${nextAxle}`,
          );
        }
        totalWeight += axleN.axleUnitWeight;
        if (
          axleN.numberOfAxles > 1 &&
          (!axleN.axleSpread || axleN.axleSpread < 0)
        ) {
          throw new Error(
            `Invalid or missing axle spread for axle unit number ${nextAxle}`,
          );
        }
        if (!axleN.interaxleSpacing || axleN.interaxleSpacing < 0) {
          throw new Error(
            `Invalid or missing axle spacing between axle units ${firstAxle} and ${nextAxle}`,
          );
        }
        wheelbase += (axleN.axleSpread ?? 0) + axleN.interaxleSpacing;
        // The magic is in the next line
        const maxBridge = BRIDGE_MULTIPLIER * wheelbase + BRIDGE_MIN_WEIGHT;

        // Push the axle group result to the results array, including
        // a convenience success indicator.
        results.push({
          startAxleUnit: firstAxle,
          endAxleUnit: nextAxle,
          maxBridge: maxBridge,
          actualWeight: totalWeight,
          success: totalWeight <= maxBridge,
        });

        nextAxle++;
      });
    }
    index++;
  });

  return results;
}
