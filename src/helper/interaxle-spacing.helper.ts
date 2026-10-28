import { POWER_UNIT_AXLE_CODE_MULTIPLIER } from '../constants/power-unit-axle-code-multiplier';
import { Policy } from '../policy-engine';
import { AxleConfiguration } from '../types/axle-configuration';
import { InteraxleSpacingRequirement } from '../types/interaxle-spacing-requirement';
import { formatMeters } from './format-meters.helper';
import { getVehicleRelatives } from './dimensions.helper';
import { RelativePosition } from '../enum';

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
 * @param groupWeight Combined weight of the axle group ending at the current axle unit, in kilograms
 * @returns The minimum/maximum interaxle spacing requirement for the current axle pair, or undefined when no spacing rule applies
 */
export function getInteraxleSpacingRequirement(
  policy: Policy,
  axleConfiguration: Array<AxleConfiguration>,
  axleIndex: number,
  vehicleConfiguration: Array<string>,
  axleUnitVehicleIndexes: Array<number>,
  groupWeight?: number,
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

  const interaxleSpacingRequirements = isPowerUnit
    ? policy.getDefaultPowerUnitInteraxleSpacing(vehicleType, axles)
    : policy.getDefaultTrailerInteraxleSpacing(vehicleType, axles);

  const matchingRequirement = selectCorrectInteraxleSpacingRequirementHelper(
    policy,
    interaxleSpacingRequirements,
    vehicleConfiguration,
    axleConfiguration,
    axleIndex,
    axleUnitVehicleIndexes,
    groupWeight,
  );

  if (matchingRequirement) {
    if (axleIndex === 2) {
      console.log({ matchingRequirement });
    }
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
  groupWeight?: number,
): InteraxleSpacingRequirement | null {
  if (
    !interaxleSpacingRequirements ||
    interaxleSpacingRequirements.length === 0
  ) {
    return null;
  }

  const currentAxleUnit = axleConfiguration[axleIndex];

  const relatives = getVehicleRelatives(
    policy,
    vehicleConfiguration,
    axleIndex,
    axleUnitVehicleIndexes,
  );

  const appliesToCurrentAxleUnitWeight = (
    requirement: InteraxleSpacingRequirement,
  ): boolean => {
    const { maxAxleUnitWeight } = requirement;

    if (maxAxleUnitWeight === undefined) {
      return true;
    }

    const weight = currentAxleUnit.axleUnitWeight;

    if (!Number.isFinite(weight)) {
      return true;
    }

    return weight <= maxAxleUnitWeight;
  };

  const appliesToCurrentAxleGroupWeight = (
    requirement: InteraxleSpacingRequirement,
  ): boolean => {
    const { minAxleGroupWeight, maxAxleGroupWeight } = requirement;

    if (minAxleGroupWeight === undefined && maxAxleGroupWeight === undefined) {
      return true;
    }

    const weight = groupWeight;

    if (weight === undefined || !Number.isFinite(weight)) {
      return false;
    }

    return (
      (minAxleGroupWeight === undefined || weight >= minAxleGroupWeight) &&
      (maxAxleGroupWeight === undefined || weight <= maxAxleGroupWeight)
    );
  };

  const requirementApplies = (
    requirement: InteraxleSpacingRequirement,
  ): boolean =>
    appliesToCurrentAxleUnitWeight(requirement) &&
    appliesToCurrentAxleGroupWeight(requirement);

  for (const requirement of interaxleSpacingRequirements) {
    if (!requirementApplies(requirement)) {
      continue;
    }

    const modifier = requirement.modifier;
    if (!modifier) {
      continue;
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

    if (modifier.position === RelativePosition.Before) {
      isMatch =
        matcher == (isTypeMatch ? relatives.prevType : relatives.prevCategory);

      if (isMatch) {
        return requirement;
      }
    }

    if (modifier.position === RelativePosition.After) {
      const nextAxleUnit = axleConfiguration[axleIndex + 1];
      if (!nextAxleUnit) {
        continue;
      }

      isMatch =
        matcher == (isTypeMatch ? relatives.nextType : relatives.nextCategory);

      if (isMatch) {
        return requirement;
      }
    }
  }

  const fallbackRequirement =
    interaxleSpacingRequirements.find(
      (requirement) => !requirement.modifier && requirementApplies(requirement),
    ) ??
    interaxleSpacingRequirements.find((requirement) =>
      requirementApplies(requirement),
    ) ??
    null;

  return fallbackRequirement;
}

/**
 * Helper function for getting the default interaxle spacing value,
 * works for both power units and trailers based on the
 * value of the isPowerUnit flag.
 * @param policy The instantiated policy object with weight config
 * @param subType Power Unit or Trailer subtype
 * @param axles 2-digit number representing the two axle units to which this requirement applies. The number of with the most significant digit representing the current axle unit and the least significant digit representing the next axle unit.
 * @param isPowerUnit Whether this vehicle is a power unit
 * @returns Array of interaxle spacing specifications matching the axle pair
 */
export function getDefaultInteraxleSpacingHelper(
  policy: Policy,
  subType: string,
  axles: number,
  isPowerUnit: boolean,
): Array<InteraxleSpacingRequirement> {
  const vehicleDefinition = isPowerUnit
    ? policy.getPowerUnitDefinition(subType)
    : policy.getTrailerDefinition(subType);

  if (!vehicleDefinition) {
    throw new Error(`No definition found for vehicle type '${subType}'`);
  }

  // Prefer specific power unit / trailer subtype interaxle spacing.
  const interaxleSpacings = vehicleDefinition.interaxleSpacings?.filter(
    (vehicleRequirement) => vehicleRequirement.axles?.includes(axles),
  );
  if (interaxleSpacings && interaxleSpacings.length > 0) {
    return JSON.parse(JSON.stringify(interaxleSpacings));
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
      (categoryRequirement) => categoryRequirement.axles?.includes(axles),
    );
    if (overridesForAxle && overridesForAxle.length > 0) {
      return JSON.parse(JSON.stringify(overridesForAxle));
    }
  }

  // Least preference is global interaxle defaults.
  const globalDefaults = policy.policyDefinition.globalInteraxleSpacingDefaults;

  const vehicleDefaults = globalDefaults?.filter((defaultRequirement) =>
    defaultRequirement?.axles?.includes(axles),
  );

  if (vehicleDefaults && vehicleDefaults.length > 0) {
    return JSON.parse(JSON.stringify(vehicleDefaults));
  }
  return [];
}
