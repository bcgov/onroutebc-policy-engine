import {
  BridgeCalculationResult,
  AxleConfiguration,
} from 'onroute-policy-engine/types';
import { Policy } from 'onroute-policy-engine';
import { TRAILER_CODES } from '../constants/trailer-codes';
import { getAxleUnitType } from '../types/axle-unit-type';
import { getAxleUnitVehicleIndexLookup } from './dimensions.helper';

/**
 * Runs the bridge formula against the supplied vehicle axle configuration.
 * Evaluates the weight against all possible axle group combinations and returns
 * the result of each group comparison, with an indicator of whether or not the
 * axle group failed the bridge calculation.
 * @param axleConfiguration Vehicle dimensions and weights per axle
 * @param policy Policy Enging object initialized with policy config
 * @returns Array of BridgeCalculationResult objects, one for each
 * axle group in the vehicle configuration
 */
export function runBridgeFormula(
  policy: Policy,
  axleConfiguration: Array<AxleConfiguration>,
  vehicleConfiguration: Array<string>,
): Array<BridgeCalculationResult> {
  const BRIDGE_MULTIPLIER =
    policy.policyDefinition.bridgeCalculationConstants.multiplier;
  const BRIDGE_MIN_WEIGHT =
    policy.policyDefinition.bridgeCalculationConstants.minWeight;

  const results: Array<BridgeCalculationResult> = [];

  let index: number = 0;

  if (!axleConfiguration || axleConfiguration.length < 2) {
    throw new Error(
      'Invalid axle configuration, bridge formula requires a minimum of two axle units',
    );
  }

  const axleUnitVehicleIndexes = getAxleUnitVehicleIndexLookup(
    policy,
    vehicleConfiguration,
    axleConfiguration,
  );

  // Loop through each axle unit in the configuration, and
  // calculate the bridge formula for each other axle unit. The
  // number of axle groups calculated will be the Nth triangular
  // number, where N = (number of axle units) - 1.
  axleConfiguration.forEach((axle) => {
    // Do not process once we reach the last axle unit
    // in the configuration, as they have all been calculated
    // by then.
    if (index <= axleConfiguration.length) {
      // Initialize the variables for our start axle
      const currentAxleIdex: number = index + 1;
      let nextAxleIndex: number = currentAxleIdex + 1;
      if (!axle.numberOfAxles || axle.numberOfAxles < 0) {
        throw new Error(
          `Invalid or missing number of axles for axle unit number ${currentAxleIdex}`,
        );
      }
      if (!axle.axleUnitWeight || axle.axleUnitWeight < 0) {
        throw new Error(
          `Invalid or missing weight for axle unit number ${currentAxleIdex}`,
        );
      }
      let totalWeight: number = axle.axleUnitWeight;

      // Spread may be zero or undefined if the axle unit
      // is a single axle. Interaxle spacing will be zero or
      // undefined for the first axle unit in the configuration
      // since it describes the spacing from the previous axle
      // unit in the configuration.
      if (axle.numberOfAxles > 1 && (!axle.axleSpread || axle.axleSpread < 0)) {
        throw new Error(
          `Invalid or missing axle spread for axle unit number ${currentAxleIdex}`,
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
      axleConfiguration.slice(currentAxleIdex).forEach((axleN) => {
        if (!axleN.axleUnitWeight || axleN.axleUnitWeight < 0) {
          throw new Error(
            `Invalid or missing weight for axle unit number ${nextAxleIndex}`,
          );
        }
        totalWeight += axleN.axleUnitWeight;
        if (
          axleN.numberOfAxles > 1 &&
          (!axleN.axleSpread || axleN.axleSpread < 0)
        ) {
          throw new Error(
            `Invalid or missing axle spread for axle unit number ${nextAxleIndex}`,
          );
        }
        if (!axleN.interaxleSpacing || axleN.interaxleSpacing < 0) {
          throw new Error(
            `Invalid or missing axle spacing between axle units ${currentAxleIdex} and ${nextAxleIndex}`,
          );
        }
        wheelbase += (axleN.axleSpread ?? 0) + axleN.interaxleSpacing;

        // Tandem Drive with Single Axle Jeep Bridge Formula Exception
        const hasSingleAxleJeep =
          vehicleConfiguration[1] === TRAILER_CODES.JEEPS &&
          getAxleUnitType(axleConfiguration[2]?.numberOfAxles) === 'SINGLE';
        const hasTandemDrive =
          getAxleUnitType(axleConfiguration[1]?.numberOfAxles) === 'TANDEM';

        const driveAxleSpread = axleConfiguration[1]?.axleSpread ?? 0;
        const isDriveAxle = currentAxleIdex === 1;
        const isJeepAxle = hasSingleAxleJeep && currentAxleIdex === 2;
        const firstTrailerInteraxleSpacing =
          axleConfiguration[2]?.interaxleSpacing ?? 0;

        const isTandemDriveSingleAxleJeepException =
          (isDriveAxle || isJeepAxle) && hasTandemDrive && hasSingleAxleJeep;

        const isLowerTandemDriveSingleAxleJeepException =
          isTandemDriveSingleAxleJeepException &&
          driveAxleSpread >= 240 &&
          driveAxleSpread <= 300 &&
          firstTrailerInteraxleSpacing >= 120 &&
          firstTrailerInteraxleSpacing <= 300;

        const isUpperTandemDriveSingleAxleJeepException =
          isTandemDriveSingleAxleJeepException &&
          driveAxleSpread > 300 &&
          driveAxleSpread <= 370 &&
          firstTrailerInteraxleSpacing > 300 &&
          firstTrailerInteraxleSpacing <= 350;

        // Calculate standard bridge formula result
        const formulaMaxBridge =
          BRIDGE_MULTIPLIER * wheelbase + BRIDGE_MIN_WEIGHT;

        // Apply the Tandem Drive + Single Axle Jeep policy exception only when
        // it increases the permitted weight (i.e. it's an allowance override).
        let maxBridge = formulaMaxBridge;
        if (isLowerTandemDriveSingleAxleJeepException) {
          maxBridge = Math.max(formulaMaxBridge, 28000);
        } else if (isUpperTandemDriveSingleAxleJeepException) {
          maxBridge = Math.max(formulaMaxBridge, 29000);
        }

        // Push the axle group result to the results array, including
        // a convenience success indicator.
        results.push({
          startAxleUnit: currentAxleIdex,
          endAxleUnit: nextAxleIndex,
          maxBridge: maxBridge,
          actualWeight: totalWeight,
          success: totalWeight <= maxBridge,
        });

        nextAxleIndex++;
      });
    }
    index++;
  });

  return results;
}
