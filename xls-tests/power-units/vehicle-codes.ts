import { POWER_UNITS } from '../../src/constants/power-units';
import { getIdFromName } from '../../src/helper/lists.helper';

export function getPowerUnitCode(name: string): string | null {
  // These workbook names differ from the names in POWER_UNITS.
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
