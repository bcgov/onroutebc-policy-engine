import {
  PolicyCheckResult,
  AxleConfiguration,
  AxleUnitPolicyCheckResult,
  AxleGroupPolicyCheckResult,
  WeightDimension,
  SingleAxleDimension,
} from 'onroute-policy-engine/types';
import { Policy } from 'onroute-policy-engine';
import { getAxleUnitVehicleIndexes } from './dimensions.helper';
import {
  AccessoryVehicleType,
  PolicyCheckId,
  VehicleCategory,
  PolicyCheckResultType,
} from '../enum';

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
 * Validates the number of axles in each axle unit.
 *
 * Axle unit counts must be whole numbers from 1 to 3. This check runs before
 * the other axle policy checks because bridge and weight calculations assume a
 * valid axle count.
 *
 * @param _policy - The policy instance (unused in this check, but required by PolicyCheck type)
 * @param _vehicleConfiguration - Vehicle configuration (unused in this check, but required by PolicyCheck type)
 * @param axleConfiguration - Array of axle configurations containing axle count information
 * @returns Array of AxleGroupPolicyCheckResult objects, one for each axle unit tested
 */
export function CheckNumberOfAxles(
  _policy: Policy,
  _vehicleConfiguration: Array<string>,
  axleConfiguration: Array<AxleConfiguration>,
): Array<AxleGroupPolicyCheckResult> {
  const policyCheckResults = new Array<AxleGroupPolicyCheckResult>();
  const policyId = PolicyCheckId.NumberOfAxles;

  axleConfiguration.forEach((ac, i) => {
    const axleUnit = i + 1;
    const numberOfAxles = ac.numberOfAxles;
    const validNumber =
      Number.isFinite(numberOfAxles) && Number.isInteger(numberOfAxles);

    let result = PolicyCheckResultType.Pass;
    let message = `No. of Axles for Axle Unit ${axleUnit} is permittable.`;

    if (!validNumber || numberOfAxles < 1) {
      result = PolicyCheckResultType.Fail;
      message = `No. of Axles for Axle Unit ${axleUnit} cannot be 0.`;
    } else if (numberOfAxles > 3) {
      result = PolicyCheckResultType.Fail;
      message = `No. of Axles for Axle Unit ${axleUnit} is not permittable.`;
    }

    policyCheckResults.push({
      id: policyId,
      message,
      result,
      startAxleUnit: axleUnit,
      endAxleUnit: axleUnit,
    });
  });

  return policyCheckResults;
}

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
  const policyCheckResults = new Array<AxleGroupPolicyCheckResult>();
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
      message = checkResult
        ? `No. of Wheels for Axle Unit ${axleNum} is permittable.`
        : `No. of Wheels for Axle Unit ${axleNum} is not permittable.`;
      if (checkResult) result = PolicyCheckResultType.Pass;
    }
    policyCheckResults.push({
      id: policyId,
      message,
      result,
      startAxleUnit: axleNum,
      endAxleUnit: axleNum,
    } as AxleGroupPolicyCheckResult);
    axleNum++;
  });
  return policyCheckResults;
}

/**
 * Validates that each axle unit's weight does not exceed the permittable weight limits.
 *
 * This function performs weight validation for each axle unit in a vehicle configuration.
 * It maps axle units to their owning vehicles, retrieves the default weight dimensions for
 * those vehicles based on vehicle type and axle count, then compares actual axle unit
 * weights against the permittable weight limits. Additional axle units require explicit
 * vehicleIndex values on the axle configuration so ownership is not inferred.
 *
 * @param policy - The policy instance containing weight dimension configurations and validation rules
 * @param vehicleConfiguration - Array of vehicle type identifiers representing the vehicle configuration.
 *                              The first element should be a power unit type, followed by trailer types.
 * @param axleConfiguration - Array of axle configurations containing weight and axle count information.
 *                           For power units, this includes steer, drive, and any configured additional
 *                           axle units.
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
 * @example
 * // For a configured power unit with an additional axle unit
 * const results = CheckPermittableWeight(
 *   policy,
 *   ['CONCRET'],
 *   [
 *     { numberOfAxles: 1, axleUnitWeight: 5000, vehicleIndex: 0 },
 *     { numberOfAxles: 1, axleUnitWeight: 5000, vehicleIndex: 0 },
 *     { numberOfAxles: 1, axleUnitWeight: 5000, vehicleIndex: 0 }
 *   ]
 * );
 * // Returns results for all configured power-unit axle units.
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
  const hasVehicleIndexes = axleConfiguration.some(
    (axleUnit) => axleUnit.vehicleIndex !== undefined,
  );

  // Legacy John Fletcher implementation, restored from:
  // git show e4a9d6badd025dec844df43379f776a4995ad75b^:src/helper/policy-check.helper.ts
  if (!hasVehicleIndexes) {
    const singleAxleDimensions: Array<SingleAxleDimension> = [];

    vehicleConfiguration.forEach((vc, i) => {
      let weight: Array<WeightDimension>;
      if (i === 0) {
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
      } else if (i + 1 < axleConfiguration.length) {
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
        result: result
          ? PolicyCheckResultType.Pass
          : PolicyCheckResultType.Fail,
        axleUnit: axleUnit,
        actualWeight: actualWeight,
        thresholdWeight: permittableWeight,
      });
    });

    return policyCheckResults;
  }

  // Explicit multi-axle ownership path supplied by the consuming application.
  // This is the new way, using { vehicleIndex: num }
  const axleUnitVehicleIndexes = getAxleUnitVehicleIndexes(
    policy,
    vehicleConfiguration,
    axleConfiguration,
  );

  axleConfiguration.forEach((ac, i) => {
    const vehicleIndex = axleUnitVehicleIndexes[i];
    const vehicleType = vehicleConfiguration[vehicleIndex];
    const weight =
      vehicleIndex === 0
        ? policy.getDefaultPowerUnitWeight(
            vehicleType,
            axleConfiguration[0].numberOfAxles * 10 +
              axleConfiguration[1].numberOfAxles,
          )
        : policy.getDefaultTrailerWeight(vehicleType, ac.numberOfAxles);
    const axleDimension =
      policy.selectCorrectWeightDimension(
        weight,
        vehicleConfiguration,
        axleConfiguration,
        i,
      ) || {};
    const actualWeight = ac.axleUnitWeight;
    const permittableWeight = axleDimension.permittable || 0;
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
 * Gross Combined Vehicle Weight (GCVW). For tandem drive axles, the minimum is 20% of GCVW
 * or 23,000 kg (whichever is smaller). For tridem drive axles, the minimum is 20% of GCVW
 * or 28,000 kg (whichever is smaller).
 *
 * @param _policy - The policy instance (unused in this check, but required by PolicyCheck type)
 * @param _vehicleConfiguration - Vehicle configuration (unused in this check, but required by PolicyCheck type)
 * @param axleConfiguration - Array of axle configurations containing weight and axle count information
 * @returns Array of AxleGroupPolicyCheckResult objects with validation results
 *
 * @example
 * // For a tandem drive configuration with GCVW of 120,000 kg
 * const results = CheckMinDriveAxleWeight(policy, ['TRKTRAC'], [
 *   { numberOfAxles: 1, axleUnitWeight: 12000 },  // Steer axle
 *   { numberOfAxles: 2, axleUnitWeight: 24000 }   // Tandem drive axle
 * ]);
 * // Returns pass if drive axle weight >= min(20% of GCVW, 23,000 kg)
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
  _vehicleConfiguration: string[],
  axleConfiguration: AxleConfiguration[],
): PolicyCheckResult[] {
  const policyCheckResults = new Array<PolicyCheckResult>();
  const policyId = PolicyCheckId.MaxTireLoad;

  const powerUnitType = _vehicleConfiguration[0];

  const isRubberTiredLoader = powerUnitType === 'RBTRLDR';
  const isAllTerrainCrane = powerUnitType === 'CRANEAT';
  const isMobileCrane = powerUnitType === 'CRANEMB';

  const addFailResult = (axleUnit: number) => {
    policyCheckResults.push({
      id: policyId,
      result: PolicyCheckResultType.Fail,
      message: `Tire Size for Axle Unit ${axleUnit} exceeds its load capacity.`,
      axleUnit,
    } as AxleUnitPolicyCheckResult);
  };

  /**
   * Both the kg/cm rate and the explicit axle cap apply for all axle types.
   * The lower of the two is the binding limit:
   *   maxAllowedWeight = min((tireSize / 10) * rateKgPerCm * numberOfTires, capWeight)
   *
   * When capWeight is omitted, only the rate applies.
   */
  const exceedsRateOrCapLimit = (
    axleWeight: number,
    tireSize: number,
    numberOfTires: number,
    rateKgPerCm: number,
    capWeight?: number,
  ): boolean => {
    const rateLimitWeight = (tireSize / 10) * rateKgPerCm * numberOfTires;
    const maxAllowedWeight =
      capWeight !== undefined
        ? Math.min(rateLimitWeight, capWeight)
        : rateLimitWeight;
    return axleWeight > maxAllowedWeight;
  };

  axleConfiguration.forEach((ac, index) => {
    const axleUnit = index + 1;

    const tireSize = ac.tireSize;
    const numberOfTires = ac.numberOfTires ?? 0;
    const axleWeight = ac.axleUnitWeight ?? 0;

    if (!tireSize || !numberOfTires) {
      return;
    }

    const isSteeringAxle = index === 0;

    /**
     * Rubber Tired Loader
     *
     * All axle units — rate 110 kg/cm; lower of rate or cap is binding:
     *   >=600 mm => min(110 kg/cm rate, 12,000 kg/axle)
     *   >=520 mm => min(110 kg/cm rate, 11,000 kg/axle)
     *
     * For RTL the 110 kg/cm rate always yields more than the cap at these
     * tire sizes (e.g. 520mm * 110 * 2 = 11,440 > 11,000), so the cap
     * will always be the binding constraint in practice.
     */
    if (isRubberTiredLoader) {
      if (tireSize >= 600) {
        if (
          exceedsRateOrCapLimit(axleWeight, tireSize, numberOfTires, 110, 12000)
        ) {
          addFailResult(axleUnit);
        }
      } else if (tireSize >= 520) {
        if (
          exceedsRateOrCapLimit(axleWeight, tireSize, numberOfTires, 110, 11000)
        ) {
          addFailResult(axleUnit);
        }
      }

      return;
    }

    /**
     * Crane - All Terrain
     *
     * All axle units — rate 100 kg/cm; lower of rate or cap is binding:
     *   >=520 mm => min(100 kg/cm rate, 11,000 kg/axle)
     *
     * For tires where the rate yields less than the cap
     * (e.g. 520mm * 100 * 2 = 10,400 < 11,000), the rate is binding.
     * For tires where the rate yields more than the cap
     * (e.g. 609mm * 100 * 2 = 12,180 > 11,000), the cap is binding.
     */
    if (isAllTerrainCrane) {
      if (tireSize >= 520) {
        if (
          exceedsRateOrCapLimit(axleWeight, tireSize, numberOfTires, 100, 11000)
        ) {
          addFailResult(axleUnit);
        }
      }

      return;
    }

    /**
     * Mobile Crane
     *
     * Non-steering axle units only — rate 100 kg/cm; lower of rate or cap is binding:
     *   >=520 mm => min(100 kg/cm rate, 11,000 kg/axle)
     *
     * Same rate/cap interaction as Crane - All Terrain above.
     * Steering axle falls through to the standard steer axle rules below.
     */
    if (isMobileCrane && !isSteeringAxle) {
      if (tireSize >= 520) {
        if (
          exceedsRateOrCapLimit(axleWeight, tireSize, numberOfTires, 100, 11000)
        ) {
          addFailResult(axleUnit);
        }
      }

      return;
    }

    /**
     * Steer axle — all vehicles except Crane - All Terrain, Mobile Crane
     * (steering), Rubber Tired Loader
     *
     * Rate 100 kg/cm; lower of rate or cap is binding:
     *   <445 mm  => rate only (no cap)
     *   >=445 mm => min(100 kg/cm rate, 9,100 kg/axle)
     *
     * e.g. 445mm * 2 tires => min(8,900, 9,100) = 8,900 kg  <- rate binding
     * e.g. 457mm * 2 tires => min(9,140, 9,100) = 9,100 kg  <- cap  binding
     */
    if (isSteeringAxle) {
      const capWeight = tireSize >= 445 ? 9100 : undefined;

      if (
        exceedsRateOrCapLimit(
          axleWeight,
          tireSize,
          numberOfTires,
          100,
          capWeight,
        )
      ) {
        addFailResult(axleUnit);
      }

      return;
    }

    /**
     * Standard non-steering axle — all vehicles except Crane - All Terrain,
     * Mobile Crane (non-steering), Rubber Tired Loader
     *
     * Rate 100 kg/cm; lower of rate or per-tire cap is binding:
     *   >=445 mm => min(100 kg/cm rate, 4,550 kg/tire * numberOfTires)
     *   <=444 mm => min(100 kg/cm rate, 3,000 kg/tire * numberOfTires)
     */
    const perTireCap = tireSize >= 445 ? 4550 : 3000;
    const axleCap = perTireCap * numberOfTires;

    if (
      exceedsRateOrCapLimit(axleWeight, tireSize, numberOfTires, 100, axleCap)
    ) {
      addFailResult(axleUnit);
    }
  });

  if (policyCheckResults.length === 0) {
    policyCheckResults.push({
      id: policyId,
      result: PolicyCheckResultType.Pass,
      message: 'Max tire load check passed for all axle units',
      startAxleUnit: 1,
      endAxleUnit: axleConfiguration.length,
    } as AxleGroupPolicyCheckResult);
  }
  return policyCheckResults;
}

/**
 * Validates that each booster has no more axles than the trailer it follows.
 *
 * Vehicle configuration has one power unit entry, while axle configuration has
 * separate steer and drive entries for the power unit. For vehicle entries after
 * the power unit, the matching axle unit index is therefore vehicle index + 1.
 *
 * @param _policy - The policy instance (unused in this check, but required by PolicyCheck type)
 * @param vehicleConfiguration - Array of vehicle type identifiers representing the vehicle configuration
 * @param axleConfiguration - Array of axle configurations containing axle count information
 * @returns Array of AxleGroupPolicyCheckResult objects, one for each booster tested
 */
export function CheckBoosterAxleLimit(
  _policy: Policy,
  vehicleConfiguration: Array<string>,
  axleConfiguration: Array<AxleConfiguration>,
): Array<PolicyCheckResult> {
  const policyCheckResults = new Array<AxleGroupPolicyCheckResult>();
  const policyId = PolicyCheckId.BoosterAxleLimit;
  let trailerAxleConfigIndex: number | undefined;

  vehicleConfiguration.forEach((vehicleSubType, vehicleIndex) => {
    if (vehicleIndex === 0) {
      return;
    }

    const axleConfigIndex = vehicleIndex + 1;
    if (axleConfigIndex >= axleConfiguration.length) {
      return;
    }

    if (vehicleSubType === AccessoryVehicleType.Booster) {
      if (trailerAxleConfigIndex === undefined) {
        return;
      }

      const boosterAxleUnit = axleConfigIndex + 1;
      const trailerAxleUnit = trailerAxleConfigIndex + 1;
      const result =
        axleConfiguration[axleConfigIndex].numberOfAxles <=
        axleConfiguration[trailerAxleConfigIndex].numberOfAxles;

      policyCheckResults.push({
        id: policyId,
        result: result
          ? PolicyCheckResultType.Pass
          : PolicyCheckResultType.Fail,
        message: result
          ? ''
          : `No. of Axles for Axle Unit ${boosterAxleUnit} must be less than or equal to No. of Axles for Axle Unit ${trailerAxleUnit}`,
        startAxleUnit: trailerAxleUnit,
        endAxleUnit: boosterAxleUnit,
      });
      return;
    }

    const vehicleDefinition = _policy.getTrailerDefinition(vehicleSubType);
    // Trailer definitions mark additionalAxleSubType entries as category "pseudo"
    // (for example PFMAXLE), so keep comparing boosters to the last real trailer.
    // Basically, skip pseudo axle units when deciding which trailer the booster follows.
    if (
      vehicleSubType !== AccessoryVehicleType.Jeep &&
      vehicleDefinition?.category !== VehicleCategory.Pseudo
    ) {
      trailerAxleConfigIndex = axleConfigIndex;
    }
  });

  return policyCheckResults;
}

/**
 * Validates derived wheelbase for single steer, tandem drive truck tractors.
 *
 * Wheelbase is derived from the spacing between axle units 1 and 2 plus half
 * of axle unit 2 spread. Axle dimensions are stored in centimetres.
 */
export function CheckTruckTractorWheelbase(
  policy: Policy,
  vehicleConfiguration: Array<string>,
  axleConfiguration: Array<AxleConfiguration>,
): Array<PolicyCheckResult> {
  const policyId = PolicyCheckId.TruckTractorWheelbase;
  const powerUnitSubtype = vehicleConfiguration[0];
  const steerAxle = axleConfiguration[0];
  const driveAxle = axleConfiguration[1];

  if (
    powerUnitSubtype !== 'TRKTRAC' ||
    !steerAxle ||
    !driveAxle ||
    steerAxle.numberOfAxles !== 1 ||
    driveAxle.numberOfAxles !== 2 ||
    driveAxle.interaxleSpacing === undefined ||
    driveAxle.axleSpread === undefined
  ) {
    return [];
  }

  const wheelbase = driveAxle.interaxleSpacing + driveAxle.axleSpread / 2;
  const resultBase = {
    id: policyId,
    startAxleUnit: 1,
    endAxleUnit: 2,
  };

  if (wheelbase > 720) {
    return [
      {
        ...resultBase,
        result: PolicyCheckResultType.Fail,
        message:
          'Wheelbase for Axle Unit 1 and Axle Unit 2 is greater than 7.2m.',
      },
    ];
  }

  if (wheelbase >= 620) {
    const hasDisallowedTrailer = vehicleConfiguration.slice(1).some((v) => {
      if (
        v === AccessoryVehicleType.Jeep ||
        v === AccessoryVehicleType.Booster
      ) {
        return true;
      }

      const trailer = policy.getTrailerDefinition(v);
      return trailer?.category !== 'semi';
    });

    return [
      {
        ...resultBase,
        result: hasDisallowedTrailer
          ? PolicyCheckResultType.Fail
          : PolicyCheckResultType.Pass,
        message:
          'Wheelbase for Axle Unit 1 and Axle Unit 2 is between 6.2m and 7.2m. See CTPM 5.3.7.A.',
      },
    ];
  }

  return [
    {
      ...resultBase,
      result: PolicyCheckResultType.Pass,
      message: '',
    },
  ];
}

/**
 * Validates that the drive axle unit and first jeep axle unit are load equalized
 * within 1000 kg when they have the same number of axles.
 *
 * Vehicle configuration has one power unit entry, while axle configuration has
 * separate steer and drive entries for the power unit. For vehicle entries after
 * the power unit, the matching axle unit index is therefore vehicle index + 1.
 *
 * @param _policy - The policy instance (unused in this check, but required by PolicyCheck type)
 * @param vehicleConfiguration - Array of vehicle type identifiers representing the vehicle configuration
 * @param axleConfiguration - Array of axle configurations containing axle count and weight information
 * @returns Array of AxleGroupPolicyCheckResult objects for the applicable drive/jeep pair
 */
export function CheckDriveJeepLoadEqualization(
  _policy: Policy,
  vehicleConfiguration: Array<string>,
  axleConfiguration: Array<AxleConfiguration>,
): Array<PolicyCheckResult> {
  const policyCheckResults = new Array<AxleGroupPolicyCheckResult>();
  const policyId = PolicyCheckId.DriveJeepLoadEqualization;
  const maxWeightDifferenceKg = 1000;
  const driveAxleConfigIndex = 1;
  const jeepVehicleIndex = vehicleConfiguration.findIndex(
    (vehicleSubType) => vehicleSubType === AccessoryVehicleType.Jeep,
  );

  if (jeepVehicleIndex < 1) {
    return policyCheckResults;
  }

  const jeepAxleConfigIndex = jeepVehicleIndex + 1;
  const driveAxle = axleConfiguration[driveAxleConfigIndex];
  const jeepAxle = axleConfiguration[jeepAxleConfigIndex];

  if (
    !driveAxle ||
    !jeepAxle ||
    driveAxle.numberOfAxles !== jeepAxle.numberOfAxles ||
    !Number.isFinite(driveAxle.axleUnitWeight) ||
    !Number.isFinite(jeepAxle.axleUnitWeight)
  ) {
    return policyCheckResults;
  }

  const driveAxleUnit = driveAxleConfigIndex + 1;
  const jeepAxleUnit = jeepAxleConfigIndex + 1;
  const result =
    Math.abs(driveAxle.axleUnitWeight - jeepAxle.axleUnitWeight) <=
    maxWeightDifferenceKg;

  policyCheckResults.push({
    id: policyId,
    result: result ? PolicyCheckResultType.Pass : PolicyCheckResultType.Fail,
    message: result
      ? ''
      : `Axle Unit ${driveAxleUnit} and Axle Unit ${jeepAxleUnit} must be load equalized within ${maxWeightDifferenceKg} kg.`,
    startAxleUnit: driveAxleUnit,
    endAxleUnit: jeepAxleUnit,
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
 * - CheckPermittableWeight: Validates total vehicle weight against permit limits
 * - MaxTireLoad: Validates tire load capacity for each axle unit
 * - MinDriveAxleWeight: Validates minimum weight requirements for drive axles
 * - MinSteerAxleWeight: Validates minimum weight requirements for steer axles
 * - NumberOfAxles: Validates axle count per axle unit
 * - NumberOfWheelsPerAxle: Validates tire count per axle unit
 * - BoosterAxleLimit: Validates booster axle count against the preceding trailer
 * - TruckTractorWheelbase: Validates derived wheelbase for single steer, tandem drive truck tractors
 * - DriveJeepLoadEqualization: Validates drive and jeep axle unit load equalization
 *
 * @see PolicyCheck
 * @see PolicyCheckId
 * @see runAxleCalculation
 */
export const policyCheckMap = new Map<string, PolicyCheck>([
  [PolicyCheckId.NumberOfAxles, CheckNumberOfAxles],
  [PolicyCheckId.BridgeFormula, CheckBridgeFormula],
  [PolicyCheckId.CheckPermittableWeight, CheckPermittableWeight],
  [PolicyCheckId.MaxTireLoad, CheckMaxTireLoad],
  [PolicyCheckId.MinDriveAxleWeight, CheckMinDriveAxleWeight],
  [PolicyCheckId.MinSteerAxleWeight, CheckMinSteerAxleWeight],
  [PolicyCheckId.NumberOfWheelsPerAxle, CheckNumTiresPerAxle],
  [PolicyCheckId.BoosterAxleLimit, CheckBoosterAxleLimit],
  [PolicyCheckId.TruckTractorWheelbase, CheckTruckTractorWheelbase],
  [PolicyCheckId.DriveJeepLoadEqualization, CheckDriveJeepLoadEqualization],
]);
