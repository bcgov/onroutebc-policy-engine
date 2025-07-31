import { VehicleCategory } from 'onroute-policy-engine/enum';
import { VehicleType, VehicleTypes } from 'onroute-policy-engine/types';

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
