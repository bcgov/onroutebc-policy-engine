import { POWER_UNITS } from '../../src/constants/power-units';
import { getPowerUnitCode } from './vehicle-codes';

describe('getPowerUnitCode', () => {
  it.each([
    ['Concrete Pumper Trucks', POWER_UNITS.CONCRETE_PUMPER_TRUCKS.id],
    ['Crane - All Terrain', POWER_UNITS.CRANES_ALL_TERRAIN.id],
    ['Rubber-Tired Loaders', POWER_UNITS.RUBBER_TIRED_LOADERS.id],
    ['Truck Tractors with PME', POWER_UNITS.TRUCK_TRACTOR_WITH_PME.id],
    ['Trucks with PME', POWER_UNITS.TRUCK_WITH_PME.id],
  ])('maps workbook name %s', (name, id) => {
    expect(getPowerUnitCode(name)).toBe(id);
  });

  it.each(['', 'Unknown vehicle', 'Semi-Trailer', 'Truck Tractor'])(
    'does not guess a code for %s',
    (name) => {
      expect(getPowerUnitCode(name)).toBeNull();
    },
  );
});
