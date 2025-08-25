import { VehicleCategory } from 'onroute-policy-engine/enum';
import {
  PermitVehicleDetails,
  VehicleConfiguration,
  VehicleInConfiguration,
  VehicleType,
  VehicleTypes,
} from 'onroute-policy-engine/types';

/**
 * Filters out all LCV vehicles from a supplied list of vehicle IDs.
 * @param vehicleList List of vehicle IDs to filter
 * @param vehicleTypes Configured vehicle types from policy configuration
 * @returns
 */
export function filterOutLcv(
  vehicleList: Array<string>,
  vehicleTypes: VehicleTypes,
): Array<string> {
  const allVehicleTypes: Array<VehicleType> =
    vehicleTypes.powerUnitTypes.concat(vehicleTypes.trailerTypes);
  const filteredList = vehicleList.filter((v) => {
    const vType = allVehicleTypes.find((vt) => vt.id === v);
    if (vType) {
      if (vType.isLcv) {
        return false;
      } else {
        return true;
      }
    } else {
      console.log(`No configured vehicle type matching '${v}'`);
      return false;
    }
  });

  return filteredList;
}

/**
 * Filters a list of vehicles to include only those matching the supplied
 * vehicle type - either powerUnit or trailer.
 * @param vehicleList List of vehicle IDs to filter
 * @param vehicleTypes Configured vehicle types from policy configuration
 * @param type Type of vehicle to filter, either powerUnit or trailer
 */
export function filterVehiclesByType(
  vehicleList: Array<string>,
  vehicleTypes: VehicleTypes,
  type: string,
): Array<string> {
  if (
    type !== VehicleCategory.PowerUnit.toString() &&
    type !== VehicleCategory.Trailer.toString()
  ) {
    throw new Error(`Cannot filter based on invalid type '${type}'`);
  }

  let targetVehicleTypes;
  if (type === VehicleCategory.PowerUnit) {
    targetVehicleTypes = vehicleTypes.powerUnitTypes;
  } else {
    targetVehicleTypes = vehicleTypes.trailerTypes;
  }

  if (!targetVehicleTypes) {
    return new Array<string>();
  }

  const filteredVehicles = vehicleList.filter((vid) => {
    const vehicleDef = targetVehicleTypes.find((vt) => vt.id === vid);
    return vehicleDef;
  });

  return filteredVehicles;
}

/**
 * Converts detailed vehicle information into a simplified vehicle configuration array.
 *
 * This helper function takes the vehicle details (which contain the power unit information) and
 * the vehicle configuration (which contains trailer information) and combines them into
 * a single array of vehicle type identifiers. The resulting array represents the complete
 * vehicle configuration in the order: [powerUnit, trailer1, trailer2, ...].
 *
 * @param vehicleDetails - The vehicle details containing power unit information including
 *                        the vehicle subtype (e.g., 'TRKTRAC' for truck-tractor)
 * @param vehicleConfiguration - The vehicle configuration containing trailer information
 *                              and other vehicle configuration details
 * @returns An array of vehicle type identifiers representing the complete vehicle configuration.
 *          The first element is always the power unit type, followed by any attached trailer types.
 *          Returns an empty array if no power unit type is found in vehicle details.
 *
 * @example
 * // For a truck-tractor with a semi-trailer
 * const config = getSimplifiedVehicleConfigurationHelper(
 *   { vehicleSubType: 'TRKTRAC', ... },
 *   { trailers: [{ vehicleSubType: 'SEMITRL' }] }
 * );
 * // Returns: ['TRKTRAC', 'SEMITRL']
 *
 * @example
 * // For a single power unit with no trailers
 * const config = getSimplifiedVehicleConfigurationHelper(
 *   { vehicleSubType: 'TRKTRAC', ... },
 *   { trailers: [] }
 * );
 * // Returns: ['TRKTRAC']
 *
 * @example
 * // For a power unit with multiple trailers
 * const config = getSimplifiedVehicleConfigurationHelper(
 *   { vehicleSubType: 'TRKTRAC', ... },
 *   { trailers: [
 *     { vehicleSubType: 'SEMITRL' },
 *     { vehicleSubType: 'BOOSTER' }
 *   ]}
 * );
 * // Returns: ['TRKTRAC', 'SEMITRL', 'BOOSTER']
 */
export function getSimplifiedVehicleConfigurationHelper(
  vehicleDetails: PermitVehicleDetails,
  vehicleConfiguration: VehicleConfiguration,
) {
  // Retrieve the power unit type from vehicle details
  const powerUnitType: string = vehicleDetails.vehicleSubType;
  // Retrieve the list of trailers from configuration
  const trailerList: Array<VehicleInConfiguration> =
    vehicleConfiguration.trailers || [];
  // If no power unit type is found, return empty array
  if (!powerUnitType) {
    return [];
  }
  // Start with the power unit type as the base configuration
  const fullVehicleConfiguration = [powerUnitType];
  // Add any attached trailers to the configuration
  if (trailerList) {
    fullVehicleConfiguration.push(...trailerList.map((t) => t.vehicleSubType));
  }
  return fullVehicleConfiguration;
}
