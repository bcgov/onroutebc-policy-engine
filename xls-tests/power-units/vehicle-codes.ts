import { POWER_UNIT_CODES } from '../../src/constants/power-unit-codes';

// Workbook column B vehicle names and their power unit codes.
// Add each name explicitly. Do not guess a code from a similar name.
// TODO delete this constant and make use of the new POWER_UNITS constant which includes both id and name
export const POWER_UNIT_VEHICLE_CODES: Record<string, string> = {
  'Concrete Pumper Trucks': POWER_UNIT_CODES.CONCRETE_PUMPER_TRUCKS,
  'Crane - All Terrain': POWER_UNIT_CODES.CRANES_ALL_TERRAIN,
  'Cranes - Mobile': POWER_UNIT_CODES.CRANES_MOBILE,
  'Municipal Fire Trucks': POWER_UNIT_CODES.MUNICIPAL_FIRE_TRUCKS,
  'Fixed Equipment - Trucks/Graders etc.':
    POWER_UNIT_CODES.FIXED_EQUIPMENT_TRUCKS_GRADERS,
  'Long Combination Vehicles (LCV) - Rocky Mountain Doubles':
    POWER_UNIT_CODES.LCV_ROCKY_MOUNTAIN_DOUBLES,
  'Long Combination Vehicles (LCV) - Turnpike Doubles':
    POWER_UNIT_CODES.LCV_TURNPIKE_DOUBLES,
  'Telescopic Conveyor Trucks': POWER_UNIT_CODES.TELESCOPIC_CONVEYOR_TRUCKS,
  'Oil and Gas - Oilfield Sows': POWER_UNIT_CODES.OIL_AND_GAS_OILFIELD_SOWS,
  'Oil and Gas - Service Rigs': POWER_UNIT_CODES.OIL_AND_GAS_SERVICE_RIGS,
  'Oil and Gas - Bed Trucks': POWER_UNIT_CODES.OIL_AND_GAS_BED_TRUCKS,
  'Oil and Gas - Service Rigs and Rathole Augers Only Equipped with Heavy Front Projected Crane (must exceed 14,000 kg tare weight)':
    POWER_UNIT_CODES.OIL_AND_GAS_SERVICE_RIGS_HEAVY_FRONT_CRANE,
  'Picker Truck Tractors': POWER_UNIT_CODES.PICKER_TRUCK_TRACTORS,
  'Picker Trucks': POWER_UNIT_CODES.PICKER_TRUCKS,
  'Rubber-Tired Loaders': POWER_UNIT_CODES.RUBBER_TIRED_LOADERS,
  'Tow Vehicles': POWER_UNIT_CODES.TOW_VEHICLES,
  'Truck Tractors': POWER_UNIT_CODES.TRUCK_TRACTORS,
  'Truck Tractors with PME': POWER_UNIT_CODES.TRUCK_TRACTOR_WITH_PME,
  Trucks: POWER_UNIT_CODES.TRUCKS,
  Scrapers: POWER_UNIT_CODES.SCRAPERS,
  'Trucks with PME': POWER_UNIT_CODES.TRUCK_WITH_PME,
};
