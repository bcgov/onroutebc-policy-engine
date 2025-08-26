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
    const result = actualWeight <= permittableWeight;
    const axleUnit = i + 1;
    const message = `Weight for axle unit ${axleUnit} ${result ? 'is permittable' : `must not exceed ${permittableWeight} kgs`}`;
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

/**
 * Validates minimum steer axle weight requirements for single steer, tridem drive power units.
 *
 * This function checks that the steer axle meets minimum weight requirements when the vehicle
 * configuration consists of a single steer axle followed by a tridem drive axle. The steer axle
 * must carry at least 27% of the tridem drive axle weight.
 *
 * @param _policy - The policy instance (unused in this check, but required by PolicyCheck type)
 * @param _vehicleConfiguration - Vehicle configuration (unused in this check, but required by PolicyCheck type)
 * @param axleConfiguration - Array of axle configurations containing weight and axle count information
 * @returns Array of AxleGroupPolicyCheckResult objects with validation results
 *
 * @example
 * // For a single steer, tridem drive configuration
 * const results = CheckMinSteerAxleWeight(policy, ['TRKTRAC'], [
 *   { numberOfAxles: 1, axleUnitWeight: 8000 },  // Steer axle
 *   { numberOfAxles: 3, axleUnitWeight: 30000 }  // Tridem drive axle
 * ]);
 * // Returns pass if steer axle weight >= 27% of drive axle weight (8100 kgs)
 *
 * @see PolicyCheck
 * @see AxleGroupPolicyCheckResult
 */
export function CheckMinSteerAxleWeight(
  _policy: Policy,
  _vehicleConfiguration: Array<string>,
  axleConfiguration: Array<AxleConfiguration>,
): Array<PolicyCheckResult> {
  const policyCheckResults = new Array<AxleGroupPolicyCheckResult>();
  const policyId = PolicyCheckId.MinSteerAxleWeight;

  let message, result;
  if (
    axleConfiguration[0].numberOfAxles === 1 &&
    axleConfiguration[1].numberOfAxles === 3
  ) {
    // Check minimum load on steer axle
    if (
      axleConfiguration[0].axleUnitWeight >=
      axleConfiguration[1].axleUnitWeight * 0.27
    ) {
      message = 'Steer axle meets minimum weight requirements';
      result = PolicyCheckResultType.Pass;
    } else {
      message =
        'Steer axle must be a minimum of 27% of tridem drive axle weight';
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
    endAxleUnit: 2,
  });

  return policyCheckResults;
}

/**
 * Validates minimum drive axle weight requirements for tandem and tridem drive power units.
 *
 * This function checks that the drive axle meets minimum weight requirements based on the
 * Gross Vehicle Combination Weight (GVCW). For tandem drive axles, the minimum is 20% of GVCW
 * or 23,000 lbs (whichever is smaller). For tridem drive axles, the minimum is 20% of GVCW
 * or 28,000 lbs (whichever is smaller).
 *
 * @param _policy - The policy instance (unused in this check, but required by PolicyCheck type)
 * @param _vehicleConfiguration - Vehicle configuration (unused in this check, but required by PolicyCheck type)
 * @param axleConfiguration - Array of axle configurations containing weight and axle count information
 * @returns Array of AxleGroupPolicyCheckResult objects with validation results
 *
 * @example
 * // For a tandem drive configuration with GVCW of 120,000 kgs
 * const results = CheckMinDriveAxleWeight(policy, ['TRKTRAC'], [
 *   { numberOfAxles: 1, axleUnitWeight: 12000 },  // Steer axle
 *   { numberOfAxles: 2, axleUnitWeight: 24000 }   // Tandem drive axle
 * ]);
 * // Returns pass if drive axle weight >= min(20% of GVCW, 23,000 kgs)
 *
 * @see PolicyCheck
 * @see AxleGroupPolicyCheckResult
 */
export function CheckMinDriveAxleWeight(
  _policy: Policy,
  _vehicleConfiguration: Array<string>,
  axleConfiguration: Array<AxleConfiguration>,
): Array<PolicyCheckResult> {
  const policyCheckResults = new Array<AxleGroupPolicyCheckResult>();
  const policyId = PolicyCheckId.MinDriveAxleWeight;

  const gvcw = axleConfiguration.reduce(
    (w, curr) => w + curr.axleUnitWeight,
    0,
  );

  let message, result;
  if (
    axleConfiguration[1].numberOfAxles === 2 ||
    axleConfiguration[1].numberOfAxles === 3
  ) {
    let targetMinWeight = gvcw * 0.2;
    if (axleConfiguration[1].numberOfAxles === 2) {
      targetMinWeight = Math.min(targetMinWeight, 23000);
    } else if (axleConfiguration[1].numberOfAxles === 3) {
      targetMinWeight = Math.min(targetMinWeight, 28000);
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
 * Validates maximum tire load capacity for each axle unit based on tire size and count.
 *
 * This function performs tire load validation for all axle units in a vehicle configuration.
 * It checks that the weight on each axle unit does not exceed the maximum load capacity
 * of the tires based on their size and quantity. The validation uses different rules for
 * steer axles versus non-steer axles.
 *
 * For steer axles:
 * - Tire size must not exceed 455mm
 * - For tires ≥445mm: Maximum weight is 9,100kg
 * - For tires <445mm: Maximum weight is calculated as (number of tires × tire size × 10)
 *
 * For non-steer axles:
 * - For tires ≥445mm: Maximum weight is (number of tires × 3,850kg)
 * - For tires >300mm and <445mm: Maximum weight is (number of tires × 3,000kg)
 * - For tires ≤300mm: Maximum weight is (number of tires × tire size × 10)
 *
 * @param _policy - The policy instance (unused in this check, but required by PolicyCheck type)
 * @param _vehicleConfiguration - Vehicle configuration (unused in this check, but required by PolicyCheck type)
 * @param axleConfiguration - Array of axle configurations containing tire size, tire count, and weight information
 * @returns Array of PolicyCheckResult objects, with individual axle unit results for failures
 *          or a single group result for successful validation
 *
 * @example
 * // For a vehicle with valid tire loads
 * const results = CheckMaxTireLoad(policy, ['TRKTRAC'], [
 *   { tireSize: 445, numberOfTires: 2, axleUnitWeight: 8000 },  // Steer axle: 8000kg ≤ 9100kg (pass)
 *   { tireSize: 445, numberOfTires: 8, axleUnitWeight: 30000 }  // Drive axle: 30000kg ≤ 30800kg (pass)
 * ]);
 * // Returns single pass result for all axle units
 *
 * @example
 * // For a vehicle with invalid tire loads
 * const results = CheckMaxTireLoad(policy, ['TRKTRAC'], [
 *   { tireSize: 460, numberOfTires: 2, axleUnitWeight: 8000 },  // Steer axle: tire size > 455mm (fail)
 *   { tireSize: 445, numberOfTires: 8, axleUnitWeight: 32000 }  // Drive axle: 32000kg > 30800kg (fail)
 * ]);
 * // Returns individual fail results for each axle unit
 *
 * @see PolicyCheck
 * @see AxleUnitPolicyCheckResult
 * @see AxleGroupPolicyCheckResult
 * @see AxleConfiguration
 */
export function CheckMaxTireLoad(
  _policy: Policy,
  _vehicleConfiguration: Array<string>,
  axleConfiguration: Array<AxleConfiguration>,
): Array<PolicyCheckResult> {
  const policyCheckResults = new Array<PolicyCheckResult>();
  const policyId = PolicyCheckId.MaxTireLoad;
  
  // Steer axle tire load check
  const steerTireSize = axleConfiguration[0].tireSize;
  if (!steerTireSize) {
    policyCheckResults.push({
      id: policyId,
      result: PolicyCheckResultType.Fail,
      message: `Steer axle tire size is invalid`,
      axleUnit: 1,
    } as AxleUnitPolicyCheckResult);
  } else if (steerTireSize > 455) {
    policyCheckResults.push({
      id: policyId,
      result: PolicyCheckResultType.Fail,
      message: `Steer axle tire size must not exceed 455mm`,
      axleUnit: 1,
    } as AxleUnitPolicyCheckResult);
  } else if (steerTireSize >= 445) {
    if (axleConfiguration[0].axleUnitWeight > 9100) {
      policyCheckResults.push({
        id: policyId,
        result: PolicyCheckResultType.Fail,
        message: `Steer axle weight exceeds maximum of 9100kg for ${steerTireSize}mm tire size`,
        axleUnit: 1,
      } as AxleUnitPolicyCheckResult);
    }
  } else {
    const maxWeightOnSteerAxle = (axleConfiguration[0].numberOfTires || 0) * (steerTireSize * 10);
    if (axleConfiguration[0].axleUnitWeight > maxWeightOnSteerAxle) {
      policyCheckResults.push({
        id: policyId,
        result: PolicyCheckResultType.Fail,
        message: `Steer axle weight exceeds maximum of ${maxWeightOnSteerAxle}kg for ${steerTireSize}mm tire size`,
        axleUnit: 1,
      } as AxleUnitPolicyCheckResult);
    }
  }

  // Non-steer axle tire load checks
  axleConfiguration.slice(1).forEach((a, i) => {
    const tireSize = a.tireSize;
    const numberOfTires = a.numberOfTires;
    let maxWeight = 0;
    if (!tireSize) {
      policyCheckResults.push({
        id: policyId,
        result: PolicyCheckResultType.Fail,
        message: `Axle unit ${i + 1} tire size is invalid`,
        axleUnit: i + 1,
      } as AxleUnitPolicyCheckResult);
    } else if (!numberOfTires) {
      policyCheckResults.push({
        id: policyId,
        result: PolicyCheckResultType.Fail,
        message: `Axle unit ${i + 1} number of wheels is invalid`,
        axleUnit: i + 1,
      } as AxleUnitPolicyCheckResult);
    } else {
      if (tireSize >= 445) {
        maxWeight = numberOfTires * 3850;
      } else if (tireSize > 300) {
        maxWeight = numberOfTires * 3000;
      } else {
        maxWeight = numberOfTires * tireSize * 10;
      }
      if (a.axleUnitWeight > maxWeight) {
        policyCheckResults.push({
          id: policyId,
          result: PolicyCheckResultType.Fail,
          message: `Axle unit ${i + 1} weight exceeds maximum of ${maxWeight}kg for ${numberOfTires} ${steerTireSize}mm tires`,
          axleUnit: 1,
        } as AxleUnitPolicyCheckResult);
      }
    }
  });

  if (policyCheckResults.length === 0) {
    policyCheckResults.push({
      id: policyId,
      result: PolicyCheckResultType.Pass,
      message: 'Max tire load check passed for all axle units',
      startAxleUnit: 1,
      endAxleUnit: axleConfiguration.length,
    } as AxleGroupPolicyCheckResult)
  }
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
 * - CheckPermittableWeight: Validates total vehicle weight against permit limits
 * - MaxTireLoad: Validates tire load capacity for each axle unit
 * - MinDriveAxleWeight: Validates minimum weight requirements for drive axles
 * - MinSteerAxleWeight: Validates minimum weight requirements for steer axles
 * - NumberOfWheelsPerAxle: Validates tire count per axle unit
 *
 * @see PolicyCheck
 * @see PolicyCheckId
 * @see runAxleCalculation
 */
export const policyCheckMap = new Map<string, PolicyCheck>([
  [PolicyCheckId.BridgeFormula, CheckBridgeFormula],
  [PolicyCheckId.CheckPermittableWeight, CheckPermittableWeight],
  [PolicyCheckId.MaxTireLoad, CheckMaxTireLoad],
  [PolicyCheckId.MinDriveAxleWeight, CheckMinDriveAxleWeight],
  [PolicyCheckId.MinSteerAxleWeight, CheckMinSteerAxleWeight],
  [PolicyCheckId.NumberOfWheelsPerAxle, CheckNumTiresPerAxle],
]);
