import { VehicleType, VehicleTypes } from '../types';

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
