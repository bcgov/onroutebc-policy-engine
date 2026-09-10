import { INTERAXLE_SPACING_LEGAL_MINIMUMS } from '../constants/interaxle-spacing-legal-minimums';
import { TRAILER_CODES } from '../constants/trailer-codes';
import { AxleConfiguration } from '../types/axle-configuration';
import { getAxleUnitType } from '../types/axle-unit-type';
import { InteraxleSpacingRequirement } from '../types/interaxle-spacing-requirement';
import { formatMeters } from './format-meters.helper';

export function getFailedInteraxleSpacingMessage(
  requirement: InteraxleSpacingRequirement,
  previousAxleUnitNumber: number,
  currentAxleUnitNumber: number,
): string {
  if (requirement.groupLabel) {
    if (requirement.min && requirement.max) {
      return `Interaxle Spacing for ${requirement.groupLabel} must be between ${formatMeters(requirement.min)} m and ${formatMeters(requirement.max)} m.`;
    }

    if (requirement.min) {
      return `Interaxle Spacing for ${requirement.groupLabel} must be at least ${formatMeters(requirement.min)} m.`;
    }
  }

  if (requirement.min && requirement.max) {
    return `Interaxle Spacing between Axle Unit ${previousAxleUnitNumber} and Axle Unit ${currentAxleUnitNumber} must be between ${formatMeters(requirement.min)} m and ${formatMeters(requirement.max)} m.`;
  }

  if (requirement.min) {
    return `Interaxle Spacing between Axle Unit ${previousAxleUnitNumber} and Axle Unit ${currentAxleUnitNumber} must be at least ${formatMeters(requirement.min)} m.`;
  }
  return '';
}

export function getInteraxleSpacingRequirement(
  axleConfiguration: Array<AxleConfiguration>,
  axleIndex: number,
  vehicleConfiguration: Array<string>,
  axleUnitVehicleIndexes: Array<number>,
): InteraxleSpacingRequirement | undefined {
  // the first axle unit will never have an interaxle spacing value or previous axle unit to compare against
  if (axleIndex === 0) {
    return undefined;
  }

  const axleUnit = axleConfiguration[axleIndex];
  const previousAxleUnit = axleConfiguration[axleIndex - 1];

  if (
    !Number.isFinite(axleUnit.interaxleSpacing) ||
    !Number.isFinite(previousAxleUnit.numberOfAxles)
  ) {
    return undefined;
  }

  const previousAxleUnitType = getAxleUnitType(previousAxleUnit.numberOfAxles);
  const currentAxleUnitType = getAxleUnitType(axleUnit.numberOfAxles);

  // TODO check if it matters where the jeep appears in the vehicle configuration, e.g. is the jeep always the vehicle immediately following the power unit in the configuration? Is it possible that the power unit has more than two axles?
  const vehicleIndex = axleUnitVehicleIndexes[axleIndex];
  const vehicleType = vehicleConfiguration[vehicleIndex];
  const isSingleAxleJeep =
    vehicleType === TRAILER_CODES.JEEPS &&
    getAxleUnitType(axleConfiguration[2].numberOfAxles) === 'SINGLE';
  const isTandemDrive =
    getAxleUnitType(axleConfiguration[1].numberOfAxles) === 'TANDEM';

  // Tandem Drive with Single Axle Jeep Bridge Formula Exception
  if (isSingleAxleJeep && isTandemDrive) {
    return {
      min: 120,
      max: 350,
    };
  }

  return {
    min: INTERAXLE_SPACING_LEGAL_MINIMUMS[previousAxleUnitType][
      currentAxleUnitType
    ],
  };
}
