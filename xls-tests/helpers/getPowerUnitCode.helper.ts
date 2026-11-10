import { POWER_UNITS } from '../../src/constants/power-units';
import { getIdFromName } from '../../src/helper/lists.helper';

export function getPowerUnitCode(name: string): string | null {
  // Workbook labels differ from the policy names and can differ between sheets.
  // For example, the weight sheet uses "Crane - All Terrain", while the
  // commodity sheet uses "Cranes - All Terrain". Keep these explicit aliases.
  switch (name) {
    case 'Crane - All Terrain':
      return POWER_UNITS.CRANES_ALL_TERRAIN.id;
    case 'Rubber-Tired Loaders':
      return POWER_UNITS.RUBBER_TIRED_LOADERS.id;
    case 'Truck Tractors with PME':
      return POWER_UNITS.TRUCK_TRACTOR_WITH_PME.id;
    case 'Trucks with PME':
      return POWER_UNITS.TRUCK_WITH_PME.id;
    default:
      return getIdFromName(Object.values(POWER_UNITS), name);
  }
}
