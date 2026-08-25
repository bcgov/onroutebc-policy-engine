export const SEMI_TRAILER_TYPES = new Set([
  // Expando Semi-Trailers
  'EXPANDO',
  // Fixed Equipment - Conveyors
  'FECVYRX',
  // Fixed Equipment - Counter Flow Asphalt Drum Mixers
  'FEDRMMX',
  // Fixed Equipment - Portable Asphalt Baghouses
  'FEBGHSE',
  // Fixed Equipment - Semi-Trailers
  'FESEMTR',
  // Fixed Equipment - Wheeler Semi-Trailers
  'FEWHELR',
  // Semi-Trailers - Hiboys/Expandos
  'HIBOEXP',
  // Semi-Trailers - Hiboys/Flat Decks
  'HIBOFLT',
  // Oil and Gas - Oversize Oilfield Flat Deck Semi-Trailers
  'OGOSFDT',
  // Platform Trailer
  'PLATFRM',
  // Platform Trailers - Wheelers
  'PLATWHE',
  // Pole Trailers
  'POLETRL',
  // Ready Mix Concrete Pump Semi-Trailers
  'REDIMIX',
  // Semi-Trailers
  'SEMITRL',
  // Semi-Trailers - Single Drop, Double Drop, Step Decks, Lowbed, Expandos, etc.
  'STSDBDK',
  // Semi-Trailers with Crane
  'STCRANE',
  // Semi-Trailers - Spread Tandem
  'STWDTAN',
  // Semi-Trailers - Wheelers
  'STWHELR',
  // Semi-Trailers - Wide Wheelers
  'STWIDWH',
]);

export function isSemiTrailerType(vehicleType: string): boolean {
  return SEMI_TRAILER_TYPES.has(vehicleType);
}
