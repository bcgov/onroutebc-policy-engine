import { POWER_UNIT_AXLE_CODE_MULTIPLIER } from '../constants/power-unit-axle-code-multiplier';
import { Policy } from '../policy-engine';
import { AxleConfiguration } from '../types/axle-configuration';
import { InteraxleSpacingRequirement } from '../types/interaxle-spacing-requirement';
import { formatMeters } from './format-meters.helper';
import { getVehicleRelatives } from './dimensions.helper';
import { RelativePosition } from '../enum';
import { CheckAxleGroupMaximumLegalWeightThreshold } from './policy-check.helper';

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
  );

  if (matchingRequirement) {
    if (axleIndex === 2) {
      console.log({ matchingRequirement });
    }
    return matchingRequirement;
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

    const axleUnitWeight = currentAxleUnit.axleUnitWeight;

    if (!Number.isFinite(axleUnitWeight)) {
      return true;
    }

    return axleUnitWeight <= maxAxleUnitWeight;
  };

  const appliesToCurrentAxleGroupWeight = (
    requirement: InteraxleSpacingRequirement,
  ): boolean => {
    const axleGroupWeight = currentAxleUnit.axleGroupWeight;
    const { minAxleGroupWeight, maxAxleGroupWeight } = requirement;

    if (minAxleGroupWeight === undefined && maxAxleGroupWeight === undefined) {
      return true;
    }

    if (axleGroupWeight === undefined || !Number.isFinite(axleGroupWeight)) {
      return false;
    }

    return (
      (minAxleGroupWeight === undefined ||
        axleGroupWeight >= minAxleGroupWeight) &&
      (maxAxleGroupWeight === undefined ||
        axleGroupWeight <= maxAxleGroupWeight)
    );
  };

  const appliesToCurrentGroupSpacing = (
    requirement: InteraxleSpacingRequirement,
  ): boolean => {
    const axleGroupSpacing = currentAxleUnit.axleGroupSpacing;
    const { minAxleGroupSpacing, maxAxleGroupSpacing } = requirement;

    if (
      minAxleGroupSpacing === undefined &&
      maxAxleGroupSpacing === undefined
    ) {
      return true;
    }

    if (axleGroupSpacing === undefined || !Number.isFinite(axleGroupSpacing)) {
      return false;
    }

    return (
      (minAxleGroupSpacing === undefined ||
        axleGroupSpacing >= minAxleGroupSpacing) &&
      (maxAxleGroupSpacing === undefined ||
        axleGroupSpacing <= maxAxleGroupSpacing)
    );
  };

  const requirementApplies = (
    requirement: InteraxleSpacingRequirement,
  ): boolean =>
    appliesToCurrentAxleUnitWeight(requirement) &&
    appliesToCurrentAxleGroupWeight(requirement) &&
    appliesToCurrentGroupSpacing(requirement);

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
 * @param axles 2-digit number representing the two axle units to which this requirement applies. The number of with the most significant digit representing the current axle unit and the least significant digit representing the next axle unit.
 * @param isPowerUnit Whether this vehicle is a power unit
 * @returns Array of interaxle spacing specifications matching the axle pair
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

export function getAxleGroupSpacings(
  axleConfiguration: Array<AxleConfiguration>,
) {
  return axleConfiguration.map((axleUnit, axleIndex) => {
    if (axleIndex === 0) {
      return axleUnit;
    }

    const currentAxleUnitNumber = axleIndex + 1;

    const prevAxleSpread = axleConfiguration[axleIndex - 1].axleSpread ?? 0;
    const interaxleSpacing = axleUnit.interaxleSpacing ?? 0;
    const currentAxleSpread = axleUnit.axleSpread ?? 0;

    const axleGroupSpacing =
      prevAxleSpread + interaxleSpacing + currentAxleSpread;

    if (axleGroupSpacing) {
      console.log(
        `axleGroupSpacing: ${axleGroupSpacing} found for axleUnit number ${currentAxleUnitNumber}: ${JSON.stringify(axleConfiguration[axleIndex])}`,
      );
    } else {
      console.log(
        `axleGroupSpacing not found for axleUnit number ${currentAxleUnitNumber}: ${JSON.stringify(axleConfiguration[axleIndex])}`,
      );
    }

    return { ...axleUnit, axleGroupSpacing };
  });
}

export function getAxleGroupWeights(
  policy: Policy,
  vehicleConfiguration: Array<string>,
  axleConfiguration: Array<AxleConfiguration>,
) {
  // TODO consider refactoring checkAxleGroupMaximumLegalWeightThresholdResults to use an abstracted helper function that we can call both here and within the checkAxleGroupMaximumLegalWeightThreshold function, rather than calling the complete checkAxleGroupMaximumLegalWeightThresholdResults evaluation here
  const checkAxleGroupMaximumLegalWeightThresholdResults =
    CheckAxleGroupMaximumLegalWeightThreshold(
      policy,
      vehicleConfiguration,
      axleConfiguration,
    );

  return axleConfiguration.map((axleUnit, axleIndex) => {
    const currentAxleUnitNumber = axleIndex + 1;
    const previousAxleUnitNumber = axleIndex;
    const axleGroupWeight =
      checkAxleGroupMaximumLegalWeightThresholdResults.find(
        (result) =>
          result.startAxleUnit === previousAxleUnitNumber &&
          result.endAxleUnit === currentAxleUnitNumber,
      )?.actualWeight;

    if (axleGroupWeight) {
      console.log(
        `axleGroupWeight: ${axleGroupWeight} found for axleUnit number ${currentAxleUnitNumber}: ${JSON.stringify(axleConfiguration[axleIndex])}`,
      );
    } else {
      console.log(
        `axleGroupWeight not found for axleUnit number ${currentAxleUnitNumber}: ${JSON.stringify(axleConfiguration[axleIndex])}`,
      );
    }

    return { ...axleUnit, axleGroupWeight };
  });
}
