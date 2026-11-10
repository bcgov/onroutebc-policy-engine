import { POWER_UNIT_AXLE_CODE_MULTIPLIER } from '../constants/power-unit-axle-code-multiplier';
import { RelativePosition } from '../enum';
import { Policy } from '../policy-engine';
import { AxleConfiguration } from '../types';
import { WheelbaseRequirement } from '../types/wheelbase-requirement';
import { WheelbaseRequirementFailure } from '../types/wheelbase-requirement-failure';
import { getVehicleRelatives } from './dimensions.helper';
import { formatMeters } from './format-meters.helper';

/**
 * Resolves the wheelbase requirement for a pair of axle units.
 * Uses the configured policy defaults for the vehicle subtype.
 * @param policy The instantiated policy object
 * @param axleConfiguration Full axle configuration for the vehicle combination
 * @param axleIndex Index of the current axle unit being evaluated
 * @param vehicleConfiguration Array of vehicle IDs in sequence for the combination
 * @param axleUnitVehicleIndexes Mapping of each axle unit to its parent vehicle
 * @returns The minimum/maximum wheelbase requirement for the current pair of axle units, or undefined when no wheelbase requirement applies
 */
export function getWheelbaseRequirement(
  policy: Policy,
  axleConfiguration: Array<AxleConfiguration>,
  vehicleConfiguration: Array<string>,
  axleUnitVehicleIndexes: Array<number>,
): WheelbaseRequirement | undefined {
  const steerAxle = axleConfiguration[0];
  const driveAxle = axleConfiguration[1];
  const vehicleType = vehicleConfiguration[0];

  const axles =
    steerAxle.numberOfAxles * POWER_UNIT_AXLE_CODE_MULTIPLIER +
    driveAxle.numberOfAxles;

  const wheelbaseRequirements = policy.getDefaultPowerUnitWheelbase(
    vehicleType,
    axles,
  );

  const matchingRequirement = selectCorrectWheelbaseRequirementHelper(
    policy,
    wheelbaseRequirements,
    vehicleConfiguration,
    axleConfiguration,
    axleUnitVehicleIndexes,
  );

  if (matchingRequirement) {
    return JSON.parse(JSON.stringify(matchingRequirement));
  }

  return undefined;
}

/**
 * Helper function for getting the default wheelbase limits
 * @param policy The instantiated policy object
 * @param subType Power Unit subtype
 * @param axles 2-digit number representing the axle unit pair this requirement
 * applies to. The most significant digit is the previous axle unit and the
 * least significant digit is the current axle unit, in this case the drive axle.
 * @returns Array of wheelbase requirements matching the provided number of axles
 */
export function getDefaultWheelbaseHelper(
  policy: Policy,
  subType: string,
  axles: number,
): Array<WheelbaseRequirement> {
  const vehicleDefinition = policy.getPowerUnitDefinition(subType);

  if (!vehicleDefinition) {
    throw new Error(`No definition found for vehicle type '${subType}'`);
  }

  // Prefer specific power unit subtype wheelbase requirements.
  const wheelbaseLimits = vehicleDefinition.wheelbaseLimits?.filter(
    (vehicleRequirement) => vehicleRequirement?.axles?.includes(axles),
  );

  if (wheelbaseLimits && wheelbaseLimits.length > 0) {
    return JSON.parse(JSON.stringify(wheelbaseLimits));
  }

  return [];
}

export function selectCorrectWheelbaseRequirementHelper(
  policy: Policy,
  wheelbaseRequirements: Array<WheelbaseRequirement>,
  vehicleConfiguration: Array<string>,
  axleConfiguration: Array<AxleConfiguration>,
  axleUnitVehicleIndexes: Array<number>,
): WheelbaseRequirement | null {
  if (!wheelbaseRequirements || wheelbaseRequirements.length === 0) {
    return null;
  }
  const driveAxleIndex = 1;
  const driveAxle = axleConfiguration[driveAxleIndex];

  const relatives = getVehicleRelatives(
    policy,
    vehicleConfiguration,
    driveAxleIndex,
    axleUnitVehicleIndexes,
  );

  const appliesToDriveAxleSpread = (
    requirement: WheelbaseRequirement,
  ): boolean => {
    const axleSpread = driveAxle.axleSpread;
    const { minAxleSpread, maxAxleSpread } = requirement;

    // Requirements without axle spread constraints always match.
    if (minAxleSpread === undefined && maxAxleSpread === undefined) {
      return true;
    }

    // Constrained requirements cannot match without a valid axle spread.
    if (axleSpread === undefined || !Number.isFinite(axleSpread)) {
      return false;
    }

    return (
      (minAxleSpread === undefined || axleSpread >= minAxleSpread) &&
      (maxAxleSpread === undefined || axleSpread <= maxAxleSpread)
    );
  };

  for (const requirement of wheelbaseRequirements) {
    if (!appliesToDriveAxleSpread(requirement)) {
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

    if (modifier.position === RelativePosition.After) {
      const firstTrailerAxleUnit = axleConfiguration[driveAxleIndex + 1];
      if (!firstTrailerAxleUnit) {
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
    wheelbaseRequirements.find(
      (requirement) =>
        (requirement.minAxleSpread !== undefined ||
          requirement.maxAxleSpread !== undefined) &&
        appliesToDriveAxleSpread(requirement) &&
        !requirement.modifier,
    ) ??
    wheelbaseRequirements.find(
      (requirement) =>
        !requirement.modifier && appliesToDriveAxleSpread(requirement),
    ) ??
    null;

  return fallbackRequirement;
}

export function getFailedWheelbaseMessage(
  requirement: WheelbaseRequirement,
  failureType: WheelbaseRequirementFailure,
): string {
  if (
    failureType === WheelbaseRequirementFailure.MinWheelbase &&
    requirement.minWheelbase
  ) {
    return `Wheelbase for Axle Unit 1 and Axle Unit 2 is less than ${formatMeters(
      requirement.minWheelbase,
    )} m.`;
  }
  if (
    failureType === WheelbaseRequirementFailure.MaxWheelbase &&
    requirement.maxWheelbase
  ) {
    return `Wheelbase for Axle Unit 1 and Axle Unit 2 is greater than ${formatMeters(
      requirement.maxWheelbase,
    )} m.`;
  }
  return '';
}
