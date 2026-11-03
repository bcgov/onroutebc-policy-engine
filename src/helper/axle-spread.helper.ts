import { Policy } from '../policy-engine';
import { AxleConfiguration } from '../types';
import { AxleSpreadRequirement } from '../types/axle-spread-requirement';
import { formatMeters } from './format-meters.helper';

export function getFailedAxleSpreadMessage(
  requirement: AxleSpreadRequirement,
  axleUnitNumber: number,
): string {
  if (requirement.minAxleSpread && requirement.maxAxleSpread) {
    return `Axle Spread for Axle Unit ${axleUnitNumber} must be between ${formatMeters(
      requirement.minAxleSpread,
    )} m and ${formatMeters(requirement.maxAxleSpread)} m.`;
  }
  return '';
}

/**
 * Resolves the axle spread requirement for a given axle.
 * Uses the configured policy defaults for the vehicle subtype, falling back to the global default for the matching axle combination when no subtype-specific override exists.
 * @param policy The instantiated policy object
 * @param axleConfiguration Full axle configuration for the vehicle combination
 * @param axleIndex Index of the current axle unit being evaluated
 * @param vehicleConfiguration Array of vehicle IDs in sequence for the combination
 * @param axleUnitVehicleIndexes Mapping of each axle unit to its parent vehicle
 * @returns The minimum/maximum axle spread requirement for the current axle unit, or undefined when no spacing rule applies
 */
export function getAxleSpreadRequirement(
  policy: Policy,
  axleConfiguration: Array<AxleConfiguration>,
  axleIndex: number,
  vehicleConfiguration: Array<string>,
  axleUnitVehicleIndexes: Array<number>,
): AxleSpreadRequirement | undefined {
  // the first axle unit will never have an interaxle spacing value or previous axle unit to compare against
  if (axleIndex === 0) {
    return undefined;
  }

  const axleUnit = axleConfiguration[axleIndex];

  const vehicleIndex = axleUnitVehicleIndexes[axleIndex];
  const vehicleType = vehicleConfiguration[vehicleIndex];

  const isPowerUnit = vehicleIndex === 0;

  if (!Number.isFinite(axleUnit.axleSpread)) {
    return undefined;
  }

  const axles = axleUnit.numberOfAxles;

  const axleSpreadRequirements = isPowerUnit
    ? policy.getDefaultPowerUnitAxleSpread(vehicleType, axles)
    : policy.getDefaultTrailerAxleSpread(vehicleType, axles);

  console.log({ axleSpreadRequirements });

  // Since there are currently no modifiers for axle spreads, there is no need for a selectCorrectAxleSpreadRequirementHelper as we see with other evaluations (e.g. selectCorrectInteraxleSpacingRequirementHelper). This may change in future, but for now we can return the first item in the array since the array will only ever contain one item.
  const matchingRequirement = axleSpreadRequirements[0];

  if (matchingRequirement) {
    return JSON.parse(JSON.stringify(matchingRequirement));
  }

  return undefined;
}

/**
 * Helper function for getting the default axle spread value,
 * works for both power units and trailers based on the
 * value of the isPowerUnit flag.
 * @param policy The instantiated policy object
 * @param subType Power Unit or Trailer subtype
 * @param axles Single digit number representing the number of axles in the axle unit
 * @param isPowerUnit Whether this vehicle is a power unit
 * @returns Array of axle spread requirements matching the provided number of axles
 */
export function getDefaultAxleSpreadHelper(
  policy: Policy,
  subType: string,
  axles: number,
  isPowerUnit: boolean,
): Array<AxleSpreadRequirement> {
  const vehicleDefinition = isPowerUnit
    ? policy.getPowerUnitDefinition(subType)
    : policy.getTrailerDefinition(subType);

  if (!vehicleDefinition) {
    throw new Error(`No definition found for vehicle type '${subType}'`);
  }

  // Prefer specific power unit / trailer subtype axle spreads.
  const axleSpreads = vehicleDefinition.axleSpreads?.filter(
    (vehicleRequirement) => vehicleRequirement.axles === axles,
  );

  if (axleSpreads && axleSpreads.length > 0) {
    return JSON.parse(JSON.stringify(axleSpreads));
  }

  // Second preference is category axle spreads.
  const vehicleCategories = isPowerUnit
    ? policy.policyDefinition.vehicleCategories?.powerUnitCategories
    : policy.policyDefinition.vehicleCategories?.trailerCategories;

  const vehicleCategory = vehicleCategories?.find(
    (c) => c.id === vehicleDefinition.category,
  );

  if (vehicleCategory) {
    const categorySpreads = vehicleCategory.axleSpreads?.filter(
      (categoryRequirement) => categoryRequirement.axles === axles,
    );
    if (categorySpreads && categorySpreads.length > 0) {
      return JSON.parse(JSON.stringify(categorySpreads));
    }
  }

  // Least preference is global axle spread defaults.
  const globalDefaults = policy.policyDefinition.globalAxleSpreadDefaults;

  const vehicleDefaults = globalDefaults?.filter(
    (defaultRequirement) => defaultRequirement?.axles === axles,
  );

  if (vehicleDefaults && vehicleDefaults.length > 0) {
    return JSON.parse(JSON.stringify(vehicleDefaults));
  }
  return [];
}
