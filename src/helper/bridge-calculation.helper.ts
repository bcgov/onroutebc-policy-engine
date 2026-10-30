import {
  BridgeCalculationResult,
  AxleConfiguration,
} from 'onroute-policy-engine/types';
import { Policy } from 'onroute-policy-engine';
import { getAxleUnitType } from '../types/axle-unit-type';
import { TRAILERS } from '../constants/trailers';
import { getAxleGroupSpacings } from './interaxle-spacing.helper';
import { isSemiTrailerType } from '../constants/semi-trailer-codes';

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
  axleUnitVehicleIndexes: Array<number>,
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

  axleConfiguration = getAxleGroupSpacings(axleConfiguration);

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
      const startAxleIndex: number = index + 1;
      let endAxleIndex: number = startAxleIndex + 1;
      if (!axle.numberOfAxles || axle.numberOfAxles < 0) {
        throw new Error(
          `Invalid or missing number of axles for axle unit number ${startAxleIndex}`,
        );
      }
      if (!axle.axleUnitWeight || axle.axleUnitWeight < 0) {
        throw new Error(
          `Invalid or missing weight for axle unit number ${startAxleIndex}`,
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
          `Invalid or missing axle spread for axle unit number ${startAxleIndex}`,
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
      axleConfiguration.slice(startAxleIndex).forEach((axleN) => {
        if (!axleN.axleUnitWeight || axleN.axleUnitWeight < 0) {
          throw new Error(
            `Invalid or missing weight for axle unit number ${endAxleIndex}`,
          );
        }
        totalWeight += axleN.axleUnitWeight;
        if (
          axleN.numberOfAxles > 1 &&
          (!axleN.axleSpread || axleN.axleSpread < 0)
        ) {
          throw new Error(
            `Invalid or missing axle spread for axle unit number ${endAxleIndex}`,
          );
        }
        if (!axleN.interaxleSpacing || axleN.interaxleSpacing < 0) {
          throw new Error(
            `Invalid or missing axle spacing between axle units ${startAxleIndex} and ${endAxleIndex}`,
          );
        }
        wheelbase += (axleN.axleSpread ?? 0) + axleN.interaxleSpacing;

        // Calculate standard bridge formula result
        const maxBridge = BRIDGE_MULTIPLIER * wheelbase + BRIDGE_MIN_WEIGHT;

        const exception =
          isTandemDriveSingleAxleJeepException(
            axleConfiguration,
            vehicleConfiguration,
            startAxleIndex,
          ) ||
          isSemiTrailerBoosterException(
            vehicleConfiguration,
            axleUnitVehicleIndexes,
            startAxleIndex,
            endAxleIndex,
          );

        // Push the axle group result to the results array, including
        // a convenience success indicator.
        results.push({
          startAxleUnit: startAxleIndex,
          endAxleUnit: endAxleIndex,
          maxBridge: maxBridge,
          actualWeight: totalWeight,
          success: exception ? true : totalWeight <= maxBridge,
        });

        endAxleIndex++;
      });
    }
    index++;
  });

  return results;
}

/* Source: ASW Tandem Drive Single Axle Jeep Exception.feature
 * @orv2-5905-2
 */
const isTandemDriveSingleAxleJeepException = (
  axleConfiguration: Array<AxleConfiguration>,
  vehicleConfiguration: Array<string>,
  startAxleIndex: number,
) => {
  const hasSingleAxleJeep =
    vehicleConfiguration[1] === TRAILERS.JEEPS.id &&
    getAxleUnitType(axleConfiguration[2]?.numberOfAxles) === 'SINGLE';
  const hasTandemDrive =
    getAxleUnitType(axleConfiguration[1]?.numberOfAxles) === 'TANDEM';

  const trailerGroupSpacing = axleConfiguration[2]?.axleGroupSpacing ?? 0;
  const isDriveAxle = startAxleIndex === 1;
  const isJeepAxle = hasSingleAxleJeep && startAxleIndex === 2;
  const firstTrailerInteraxleSpacing =
    axleConfiguration[2]?.interaxleSpacing ?? 0;

  const result =
    (isDriveAxle || isJeepAxle) &&
    hasTandemDrive &&
    hasSingleAxleJeep &&
    trailerGroupSpacing >= 240 &&
    trailerGroupSpacing <= 370 &&
    firstTrailerInteraxleSpacing >= 120 &&
    firstTrailerInteraxleSpacing <= 350;

  return result;
};

/* Source: ASW Permittable Interaxle Spacing - Boosters.feature
 * @orv2-6030-3
 */
const isSemiTrailerBoosterException = (
  vehicleConfiguration: Array<string>,
  axleUnitVehicleIndexes: Array<number>,
  startAxleIndex: number,
  endAxleIndex: number,
) => {
  const startAxleVehicleIndex = axleUnitVehicleIndexes[startAxleIndex - 1];
  const endAxleVehicleIndex = axleUnitVehicleIndexes[endAxleIndex - 1];

  const startAxleVehicleType = vehicleConfiguration[startAxleVehicleIndex];

  const endAxleVehicleType = vehicleConfiguration[endAxleVehicleIndex];

  const isStartAxleVehicleTypeSemiTrailer =
    isSemiTrailerType(startAxleVehicleType);

  const isEndAxleVehicleTypeBooster =
    endAxleVehicleType === TRAILERS.BOOSTER.id;

  const result =
    isStartAxleVehicleTypeSemiTrailer && isEndAxleVehicleTypeBooster;

  return result;
};
