import { TRAILER_CODES } from '../../src/constants/trailer-codes';

// Workbook column D trailer names and their trailer codes.
// Add each name explicitly. Do not guess a code from a similar name.
// TODO delete this constant and make use of the new TRAILERS constant which includes both id and name
export const TRAILER_VEHICLE_CODES: Record<string, string> = {
  Boosters: TRAILER_CODES.BOOSTER,
  Dollies: TRAILER_CODES.DOLLIES,
  Jeeps: TRAILER_CODES.JEEPS,
  'Pony Trailers': TRAILER_CODES.PONY_TRAILERS,
  'Fixed Equipment - Pony Trailers':
    TRAILER_CODES.FIXED_EQUIPMENT_PONY_TRAILERS,
  'Manufactured Homes, Modular Buildings, Structures and Houseboats (> 5.0 m OAW) with Attached Axles':
    TRAILER_CODES.MANUFACTURED_HOMES_OVER_5M,
  'Steering Trailers - Manned': TRAILER_CODES.STEERING_TRAILERS_MANNED,
  'Steering Trailers - Self/Remote':
    TRAILER_CODES.STEERING_TRAILERS_SELF_REMOTE,
  'Fixed Equipment - Wheeler Semi-Trailers':
    TRAILER_CODES.FIXED_EQUIPMENT_WHEELER_SEMI_TRAILERS,
  'Semi-Trailers - Wheelers': TRAILER_CODES.SEMI_TRAILERS_WHEELERS,
  'Semi-Trailers - Wide Wheelers': TRAILER_CODES.SEMI_TRAILERS_WIDE_WHEELERS,
  'Semi-Trailers - Hiboys/Expandos': TRAILER_CODES.HIBOYS_EXPANDOS,
  'Semi-Trailers - Single Drop, Double Drop, Step Decks, Lowbed, Expandos, etc.':
    TRAILER_CODES.SEMI_TRAILERS_SINGLE_DOUBLE_DROP_STEP_DECK_LOWBED,
  'Oil and Gas - Oversize Oilfield Flat Deck Semi-Trailers':
    TRAILER_CODES.OIL_AND_GAS_OVERSIZE_OILFIELD_FLAT_DECK,
  'Platform Trailers': TRAILER_CODES.PLATFORM_TRAILERS,
  'Semi-Trailers': TRAILER_CODES.SEMI_TRAILERS,
  'Semi-Trailers - Hiboys/Flat Decks': TRAILER_CODES.HIBOYS_FLAT_DECKS,
  'Semi-Trailers - Spread Tandem': TRAILER_CODES.SEMI_TRAILERS_SPREAD_TANDEMS,
  'Semi-Trailers with Crane': TRAILER_CODES.SEMI_TRAILERS_WITH_CRANE,
  'Fixed Equipment - Conveyors': TRAILER_CODES.FIXED_EQUIPMENT_CONVEYORS,
  'Fixed Equipment - Counter Flow Asphalt Drum Mixers':
    TRAILER_CODES.FIXED_EQUIPMENT_COUNTER_FLOW_ASPHALT_DRUM_MIXERS,
  'Fixed Equipment - Portable Asphalt Baghouses':
    TRAILER_CODES.FIXED_EQUIPMENT_PORTABLE_ASPHALT_BAGHOUSES,
  'Fixed Equipment - Semi-Trailers':
    TRAILER_CODES.FIXED_EQUIPMENT_SEMI_TRAILERS,
  'Ready Mix Concrete Pump Semi-Trailers':
    TRAILER_CODES.READY_MIX_CONCRETE_PUMP_SEMI_TRAILERS,
};
