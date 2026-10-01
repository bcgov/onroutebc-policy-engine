import { POWER_UNIT_AXLE_CODE_MULTIPLIER } from '../constants/power-unit-axle-code-multiplier';
import { Policy } from '../policy-engine';
import { AxleConfiguration } from '../types/axle-configuration';
import { InteraxleSpacingRequirement } from '../types/interaxle-spacing-requirement';
import { formatMeters } from './format-meters.helper';
import { getVehicleRelatives } from './dimensions.helper';

export function getFailedInteraxleSpacingMessage(
  requirement: InteraxleSpacingRequirement,
  previousAxleUnitNumber: number,
  currentAxleUnitNumber: number,
): string {
  if (requirement.min && requirement.max) {
    return `Interaxle Spacing between Axle Unit ${previousAxleUnitNumber} and Axle Unit ${currentAxleUnitNumber} must be between ${formatMeters(requirement.min)} m and ${formatMeters(requirement.max)} m.`;
  }

  if (requirement.min) {
    return `Interaxle Spacing between Axle Unit ${previousAxleUnitNumber} and Axle Unit ${currentAxleUnitNumber} must be at least ${formatMeters(requirement.min)} m.`;
  }
  return '';
}

/**
 * Resolves the legal interaxle spacing requirement for a given axle pair.
 * Uses the configured policy defaults for the vehicle subtype, falling back to
 * the global default for the matching axle combination when no subtype-specific
 * override exists.
 * @param policy The instantiated policy object with interaxle spacing configuration
 * @param axleConfiguration Full axle configuration for the vehicle combination
 * @param axleIndex Index of the current axle unit being evaluated
 * @param vehicleConfiguration Array of vehicle IDs in sequence for the combination
 * @param axleUnitVehicleIndexes Mapping of each axle unit to its parent vehicle
 * @returns The minimum/maximum interaxle spacing requirement for the current axle pair, or undefined when no spacing rule applies
 */
export function getInteraxleSpacingRequirement(
  policy: Policy,
  axleConfiguration: Array<AxleConfiguration>,
  axleIndex: number,
  vehicleConfiguration: Array<string>,
  axleUnitVehicleIndexes: Array<number>,
): InteraxleSpacingRequirement | undefined {
  // the first axle unit will never have an interaxle spacing value or previous axle unit to compare against
  if (axleIndex === 0) {
    return undefined;
  }

  const currentAxleUnit = axleConfiguration[axleIndex];
  const previousAxleUnit = axleConfiguration[axleIndex - 1];

  const vehicleIndex = axleUnitVehicleIndexes[axleIndex];
  const vehicleType = vehicleConfiguration[vehicleIndex];

  const isPowerUnit = vehicleIndex === 0;

  if (
    !Number.isFinite(currentAxleUnit.interaxleSpacing) ||
    !Number.isFinite(previousAxleUnit.numberOfAxles)
  ) {
    return undefined;
  }

  const axles =
    previousAxleUnit.numberOfAxles * POWER_UNIT_AXLE_CODE_MULTIPLIER +
    currentAxleUnit.numberOfAxles;

  const vehicleDefinition = policy.getVehicleDefinition(vehicleType);
  const defaultInteraxleSpacingRequirements = isPowerUnit
    ? [policy.getDefaultPowerUnitInteraxleSpacing(vehicleType, axles)]
    : [policy.getDefaultTrailerInteraxleSpacing(vehicleType, axles)];

  const matchingRequirement = selectCorrectInteraxleSpacingRequirementHelper(
    policy,
    vehicleDefinition?.interaxleSpacings ?? defaultInteraxleSpacingRequirements,
    vehicleConfiguration,
    axleConfiguration,
    axleIndex,
    axleUnitVehicleIndexes,
  );

  if (matchingRequirement) {
    return JSON.parse(JSON.stringify(matchingRequirement));
  }

  return undefined;
}

export function selectCorrectInteraxleSpacingRequirementHelper(
  policy: Policy,
  interaxleSpacingRequirements: Array<InteraxleSpacingRequirement>,
  vehicleConfiguration: Array<string>,
  axleConfiguration: Array<AxleConfiguration>,
  axleIndex: number,
  axleUnitVehicleIndexes: Array<number>,
): InteraxleSpacingRequirement | null {
  if (
    !interaxleSpacingRequirements ||
    interaxleSpacingRequirements.length === 0
  ) {
    return null;
  }

  const currentAxleUnit = axleConfiguration[axleIndex];
  const previousAxleUnit = axleConfiguration[axleIndex - 1];

  const relatives = getVehicleRelatives(
    policy,
    vehicleConfiguration,
    axleIndex,
    axleUnitVehicleIndexes,
  );

  for (const requirement of interaxleSpacingRequirements) {
    const modifier = requirement.modifier;
    if (!modifier) {
      return requirement;
    }

    let isMatch = false;
    let matcher = modifier.type;
    let isTypeMatch = true;

    if (!matcher) {
      matcher = modifier.category;
      isTypeMatch = false;
    }

    if (!matcher) {
      continue;
    }

    if (modifier.position === 'before') {
      isMatch =
        matcher ==
        (isTypeMatch ? relatives.prevType : relatives.prevCategory);

      if (isMatch && modifier.axles) {
        isMatch = modifier.axles === previousAxleUnit.numberOfAxles;
      }

      if (isMatch) {
        return requirement;
      }
    }

    if (modifier.position === 'after') {
      const nextAxleUnit = axleConfiguration[axleIndex + 1];
      if (!nextAxleUnit) {
        continue;
      }

      isMatch =
        matcher == (isTypeMatch ? relatives.nextType : relatives.nextCategory);

      if (isMatch && modifier.axles) {
        isMatch = modifier.axles === nextAxleUnit.numberOfAxles;
      }

      if (isMatch) {
        return requirement;
      }
    }
  }

  return (
    interaxleSpacingRequirements.find((requirement) => !requirement.modifier) ??
    interaxleSpacingRequirements[0]
  );
}

/**
 * Helper function for getting the default interaxle spacing value,
 * works for both power units and trailers based on the
 * value of the isPowerUnit flag.
 * @param policy The instantiated policy object with weight config
 * @param subType Power Unit or Trailer subtype
 * @param axles 2-digit numner representing the two axle units to which this requirement applies. The number of with the most significant digit representing the current axle unit and the least significant digit representing the next axle unit.
 * @param isPowerUnit Whether this vehicle is a power unit
 * @returns Array of interaxle spacing specifications
 */
export function getDefaultInteraxleSpacingHelper(
  policy: Policy,
  subType: string,
  axles: number,
  isPowerUnit: boolean,
): InteraxleSpacingRequirement {
  const vehicleDefinition = isPowerUnit
    ? policy.getPowerUnitDefinition(subType)
    : policy.getTrailerDefinition(subType);

  if (!vehicleDefinition) {
    throw new Error(`No definition found for vehicle type '${subType}'`);
  }

  // Prefer specific power unit / trailer subtype interaxle spacing.
  // The config stores these as arrays, but validation expects a single
  // requirement object for the current axle pair.
  const interaxleSpacings = vehicleDefinition.interaxleSpacings?.filter(
    (exception) => exception.axles === axles,
  );
  if (interaxleSpacings && interaxleSpacings.length > 0) {
    return JSON.parse(JSON.stringify(interaxleSpacings[0]));
  }

  // Second preference is category interaxle spacing.
  const vehicleCategories = isPowerUnit
    ? policy.policyDefinition.vehicleCategories?.powerUnitCategories
    : policy.policyDefinition.vehicleCategories?.trailerCategories;

  const vehicleCategory = vehicleCategories?.find(
    (c) => c.id === vehicleDefinition.category,
  );

  if (vehicleCategory) {
    const overridesForAxle = vehicleCategory.interaxleSpacings?.filter(
      (override) => override.axles === axles,
    );
    if (overridesForAxle && overridesForAxle.length > 0) {
      return JSON.parse(JSON.stringify(overridesForAxle[0]));
    }
  }

  // Least preference is global interaxle defaults.
  const globalDefaults = policy.policyDefinition.globalInteraxleSpacingDefaults;

  const vehicleDefaults = globalDefaults?.filter(
    (specification) => specification.axles === axles,
  );
  if (vehicleDefaults && vehicleDefaults.length > 0) {
    return JSON.parse(JSON.stringify(vehicleDefaults[0]));
  }

  return {} as InteraxleSpacingRequirement;
}
