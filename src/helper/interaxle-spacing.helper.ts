import { INTERAXLE_SPACING_LEGAL_MINIMUMS } from '../constants/interaxle-spacing-legal-minimums';
import { AxleConfiguration } from '../types/axle-configuration';
import { InteraxleSpacingRequirement } from '../types/interaxle-spacing-requirement';
import { formatMeters } from './format-meters.helper';

export function getAxleUnitType(
  numberOfAxles: number,
): keyof typeof INTERAXLE_SPACING_LEGAL_MINIMUMS {
  if (numberOfAxles === 1) {
    return 'SINGLE';
  }

  if (numberOfAxles === 2) {
    return 'TANDEM';
  }

  return 'TRIDEM';
}

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

  return {
    min: INTERAXLE_SPACING_LEGAL_MINIMUMS[previousAxleUnitType][
      currentAxleUnitType
    ],
  };
}
