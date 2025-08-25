import {
  PolicyCheckResult,
  AxleConfiguration,
  AxleUnitPolicyCheckResult,
  AxleGroupPolicyCheckResult,
  WeightDimension,
  SingleAxleDimension,
} from 'onroute-policy-engine/types';
import { Policy } from 'onroute-policy-engine';
import { PolicyCheckId, PolicyCheckResultType } from '../enum';

/**
 * Type definition for policy check functions.
 *
 * Each policy check function takes a policy instance, vehicle configuration,
 * and axle configuration, then returns an array of policy check results.
 * These functions are used by the runAxleCalculation method to perform
 * various validation checks on vehicle configurations.
 *
 * @param policy - The policy instance containing configuration and validation rules
 * @param vehicleConfiguration - Array of vehicle type identifiers representing the vehicle configuration
 * @param axleConfiguration - Array of axle configurations corresponding to each vehicle
 * @returns Array of PolicyCheckResult objects representing the outcomes of the policy check
 */
type PolicyCheck = (
  policy: Policy,
  vehicleConfiguration: Array<string>,
  axleConfiguration: Array<AxleConfiguration>,
) => Array<PolicyCheckResult>;

/**
 * Performs bridge formula calculations on axle groups and returns policy check results.
 *
 * This function calculates the bridge formula for each axle group in the vehicle configuration
 * and determines whether each group passes or fails the bridge formula requirements. The bridge
 * formula is a provincial regulation that limits the weight that can be carried on a group of axles
 * based on the distance between the first and last axles in the group.
 *
 * @param policy - The policy instance containing bridge calculation configuration
 * @param _vehicleConfiguration - Vehicle configuration (unused in this check, but required by PolicyCheck type)
 * @param axleConfiguration - Array of axle configurations containing spacing and weight information
 * @returns Array of AxleGroupPolicyCheckResult objects, one for each axle group tested
 *
 * @example
 * // For a vehicle with 3 axle groups
 * const results = CheckBridgeFormula(policy, ['TRKTRAC', 'SEMITRL'], [
 *   { numberOfAxles: 2, axleSpread: 1.8, weight: 12000 },
 *   { numberOfAxles: 3, axleSpread: 4.2, weight: 34000 },
 *   { numberOfAxles: 3, axleSpread: 3.0, weight: 34000 }
 * ]);
 * // Returns results for each axle group (e.g., axles 1-2, 1-3, 2-3)
 *
 * @see PolicyCheck
 * @see AxleGroupPolicyCheckResult
 * @see BridgeCalculationResult
 */
export function CheckBridgeFormula(
  policy: Policy,
  _vehicleConfiguration: Array<string>,
  axleConfiguration: Array<AxleConfiguration>,
): Array<PolicyCheckResult> {
  const policyCheckResults = new Array<AxleGroupPolicyCheckResult>();
  const policyId = PolicyCheckId.BridgeFormula;
  const bridgeCalcResults = policy.calculateBridge(axleConfiguration);
  bridgeCalcResults.forEach((br) => {
    const message = `Axle group ${br.startAxleUnit} to ${br.endAxleUnit} ${br.success ? 'passes' : 'does not pass'} bridge formula.`;
    policyCheckResults.push({
      id: policyId,
      message: message,
      result: br.success
        ? PolicyCheckResultType.Pass
        : PolicyCheckResultType.Fail,
      startAxleUnit: br.startAxleUnit,
      endAxleUnit: br.endAxleUnit,
    });
  });
  return policyCheckResults;
}

/**
 * Validates the number of tires per axle unit against regulatory requirements.
 *
 * This function checks that each axle unit has a valid number of tires based on
 * the number of axles in that unit. The validation allows for 2, 4, or 8 tires
 * per axle (2, 4, or 8 * number of axles). This ensures compliance with tire
 * count regulations for commercial vehicles.
 *
 * @param _policy - The policy instance (unused in this check, but required by PolicyCheck type)
 * @param _vehicleConfiguration - Vehicle configuration (unused in this check, but required by PolicyCheck type)
 * @param axleConfiguration - Array of axle configurations containing tire count and axle count information
 * @returns Array of AxleUnitPolicyCheckResult objects, one for each axle unit tested
 *
 * @example
 * // For a vehicle with 2 axle units
 * const results = CheckNumTiresPerAxle(policy, ['TRKTRAC'], [
 *   { numberOfAxles: 2, numberOfTires: 4 },  // 2 axles × 2 tires = 4 (valid)
 *   { numberOfAxles: 3, numberOfTires: 12 }  // 3 axles × 4 tires = 12 (valid)
 * ]);
 * // Returns pass results for both axle units
 *
 * @example
 * // Invalid tire count example
 * const results = CheckNumTiresPerAxle(policy, ['TRKTRAC'], [
 *   { numberOfAxles: 2, numberOfTires: 6 }  // 2 axles × 3 tires = 6 (invalid - not 2, 4, or 8 per axle)
 * ]);
 * // Returns fail result for the axle unit
 *
 * @see PolicyCheck
 * @see AxleUnitPolicyCheckResult
 * @see AxleConfiguration
 */
export function CheckNumTiresPerAxle(
  _policy: Policy,
  _vehicleConfiguration: Array<string>,
  axleConfiguration: Array<AxleConfiguration>,
): Array<PolicyCheckResult> {
  const policyCheckResults = new Array<AxleUnitPolicyCheckResult>();
  const policyId = PolicyCheckId.NumberOfWheelsPerAxle;
  let axleNum = 1;
  axleConfiguration.forEach((ac) => {
    const numTires = ac.numberOfTires || 0;
    const numAxles = ac.numberOfAxles;
    // Default result to fail, set to pass explicitly if valid
    let result = PolicyCheckResultType.Fail;
    let message;
    if (!numAxles) {
      // Invalid number of axles, cannot calculate
      message = `Number of axles for axle unit ${axleNum} is not permittable.`;
    } else {
      const checkResult = [numAxles * 2, numAxles * 4, numAxles * 8].includes(
        numTires,
      );
      message = `Number of wheels for axle unit ${axleNum} is ${checkResult ? '' : 'not '}permittable.`;
      if (checkResult) result = PolicyCheckResultType.Pass;
    }
    policyCheckResults.push({
      id: policyId,
      message: message,
      result: result,
      axleUnit: axleNum,
    });
    axleNum++;
  });
  return policyCheckResults;
}

/**
 * Validates that each axle unit's weight does not exceed the permittable weight limits.
 *
 * This function performs weight validation for each axle unit in a vehicle configuration.
 * It retrieves the default weight dimensions for power units and trailers based on their
 * vehicle types and axle counts, then compares the actual axle unit weights against the
 * permittable weight limits. The function handles both power units (with steer and drive
 * axles) and trailers, ensuring compliance with weight regulations.
 *
 * @param policy - The policy instance containing weight dimension configurations and validation rules
 * @param vehicleConfiguration - Array of vehicle type identifiers representing the vehicle configuration.
 *                              The first element should be a power unit type, followed by trailer types.
 * @param axleConfiguration - Array of axle configurations containing weight and axle count information.
 *                           For power units, this includes both steer and drive axle configurations.
 * @returns Array of AxleUnitPolicyCheckResult objects, one for each axle unit tested.
 *          Each result indicates whether the axle unit's weight is within permittable limits.
 *
 * @example
 * // For a truck-tractor with 2-axle steer, 3-axle drive, and a 3-axle semi-trailer
 * const results = CheckPermittableWeight(policy, ['TRKTRAC', 'SEMITRL'], [
 *   { numberOfAxles: 2, axleUnitWeight: 12000 },  // Steer axle unit
 *   { numberOfAxles: 3, axleUnitWeight: 34000 },  // Drive axle unit
 *   { numberOfAxles: 3, axleUnitWeight: 34000 }   // Trailer axle unit
 * ]);
 * // Returns results for each axle unit indicating pass/fail status
 *
 * @example
 * // For a single power unit with no trailers
 * const results = CheckPermittableWeight(policy, ['TRKTRAC'], [
 *   { numberOfAxles: 2, axleUnitWeight: 12000 },  // Steer axle unit
 *   { numberOfAxles: 3, axleUnitWeight: 34000 }   // Drive axle unit
 * ]);
 * // Returns results for steer and drive axle units only
 *
 * @see PolicyCheck
 * @see AxleUnitPolicyCheckResult
 * @see WeightDimension
 * @see SingleAxleDimension
 */
export function CheckPermittableWeight(
  policy: Policy,
  vehicleConfiguration: Array<string>,
  axleConfiguration: Array<AxleConfiguration>,
): Array<PolicyCheckResult> {
  const policyCheckResults = new Array<AxleUnitPolicyCheckResult>();
  const policyId = PolicyCheckId.CheckPermittableWeight;

  const singleAxleDimensions: Array<SingleAxleDimension> = [];

  vehicleConfiguration.forEach((vc, i) => {
    let weight: Array<WeightDimension>;
    if (i === 0) {
      // This is a power unit, concatenate the steer and drive axle numbers
      const powerUnitAxles =
        axleConfiguration[0].numberOfAxles * 10 +
        axleConfiguration[1].numberOfAxles;

      weight = policy.getDefaultPowerUnitWeight(vc, powerUnitAxles);
      const steerAxleDimension =
        policy.selectCorrectWeightDimension(
          weight,
          vehicleConfiguration,
          axleConfiguration,
          0,
        ) || {};
      singleAxleDimensions.push(steerAxleDimension);
      const driveAxleDimension =
        policy.selectCorrectWeightDimension(
          weight,
          vehicleConfiguration,
          axleConfiguration,
          1,
        ) || {};
      singleAxleDimensions.push(driveAxleDimension);
    } else {
      if (i + 1 < axleConfiguration.length) {
        // We need this guard because the last trailer in a configuration may represent
        // the pseudo-trailer 'None'; in this case the axleConfiguration length will
        // be one fewer than normal because the 'None' trailer does not get an axleConfig entry
        weight = policy.getDefaultTrailerWeight(
          vc,
          axleConfiguration[i + 1].numberOfAxles,
        );
        const trailerDimension =
          policy.selectCorrectWeightDimension(
            weight,
            vehicleConfiguration,
            axleConfiguration,
            i + 1,
          ) || {};
        singleAxleDimensions.push(trailerDimension);
      }
    }
  });

  axleConfiguration.forEach((ac, i) => {
    const actualWeight = ac.axleUnitWeight;
    const permittableWeight = singleAxleDimensions[i].permittable || 0;
    let result = actualWeight <= permittableWeight;
    let axleUnit = i + 1;
    let message = `Weight for axle unit ${axleUnit} ${result ? 'is permittable' : `must not exceed ${permittableWeight} kgs`}`;
    policyCheckResults.push({
      id: policyId,
      message: message,
      result: result ? PolicyCheckResultType.Pass : PolicyCheckResultType.Fail,
      axleUnit: axleUnit,
      actualWeight: actualWeight,
      thresholdWeight: permittableWeight,
    });
  });

  return policyCheckResults;
}

export function CheckMinSteerAxleWeight(
  _policy: Policy,
  _vehicleConfiguration: Array<string>,
  axleConfiguration: Array<AxleConfiguration>,
): Array<PolicyCheckResult> {
  const policyCheckResults = new Array<AxleGroupPolicyCheckResult>();
  const policyId = PolicyCheckId.MinSteerAxleWeight;
  
  let message, result;
  if (axleConfiguration[0].numberOfAxles === 1 &&
    axleConfiguration[1].numberOfAxles === 3) {
    // Check minimum load on steer axle
    if (axleConfiguration[0].axleUnitWeight >= axleConfiguration[1].axleUnitWeight * 0.27) {
      message = 'Steer axle meets minimum weight requirements';
      result = PolicyCheckResultType.Pass;
    } else {
      message = 'Steer axle must be a minimum of 27% of tridem drive axle weight';
      result = PolicyCheckResultType.Fail;
    }
  } else {
    // This policy check is only for single steer, tridem drive power units
    message = 'Policy check does not apply to this configuration';
    result = PolicyCheckResultType.Pass;
  }
  policyCheckResults.push({
    id: policyId,
    message: message,
    result: result,
    startAxleUnit: 1,
    endAxleUnit: 2
  });

  return policyCheckResults;
}

export function CheckMinDriveAxleWeight(
  _policy: Policy,
  _vehicleConfiguration: Array<string>,
  axleConfiguration: Array<AxleConfiguration>,
): Array<PolicyCheckResult> {
  const policyCheckResults = new Array<AxleGroupPolicyCheckResult>();
  const policyId = PolicyCheckId.MinDriveAxleWeight;

  const gvcw = axleConfiguration.reduce((w, curr) => w + curr.axleUnitWeight, 0);

  let message, result;
  if (axleConfiguration[1].numberOfAxles === 2 ||
    axleConfiguration[1].numberOfAxles === 3) {
    let targetMinWeight = gvcw * 0.2;
    if (axleConfiguration[1].numberOfAxles === 2 && gvcw > 23000) {
      targetMinWeight = 23000;
    } else if (axleConfiguration[1].numberOfAxles === 3 && gvcw > 28000) {
      targetMinWeight = 28000;
    }
    if (axleConfiguration[1].axleUnitWeight >= targetMinWeight) {
      message = 'Drive axle meets minimum weight requirements';
      result = PolicyCheckResultType.Pass;
    } else {
      message = 'Drive axle must be a minimum 20% of the GVCW';
      result = PolicyCheckResultType.Fail;
    }
  } else {
    // This policy check is only for tandem or tridem drive power units
    message = 'Policy check does not apply to this configuration';
    result = PolicyCheckResultType.Pass;
  }
  policyCheckResults.push({
    id: policyId,
    message: message,
    result: result,
    startAxleUnit: 1,
    endAxleUnit: axleConfiguration.length,
  });

  return policyCheckResults;
}

/**
 * Map of policy check functions keyed by their corresponding PolicyCheckId.
 *
 * This map contains all the registered policy check functions that are executed
 * by the runAxleCalculation method. Each entry maps a PolicyCheckId to its
 * corresponding validation function. New policy checks can be added by extending
 * this map with additional entries.
 *
 * Currently includes:
 * - BridgeFormula: Validates axle groups against bridge formula requirements
 * - NumberOfWheelsPerAxle: Validates tire count per axle unit
 *
 * @see PolicyCheck
 * @see PolicyCheckId
 * @see runAxleCalculation
 */
export const policyCheckMap = new Map<string, PolicyCheck>([
  [PolicyCheckId.BridgeFormula, CheckBridgeFormula],
  [PolicyCheckId.CheckPermittableWeight, CheckPermittableWeight],
  [PolicyCheckId.MinDriveAxleWeight, CheckMinDriveAxleWeight],
  [PolicyCheckId.MinSteerAxleWeight, CheckMinSteerAxleWeight],
  [PolicyCheckId.NumberOfWheelsPerAxle, CheckNumTiresPerAxle],
]);
