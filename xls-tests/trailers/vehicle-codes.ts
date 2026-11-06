import { TRAILERS } from '../../src/constants/trailers';
import { getIdFromName } from '../../src/helper/lists.helper';

export function getTrailerCode(name: string): string | null {
  // These workbook names differ from the names in TRAILERS.
  switch (name) {
    case 'Semi-Trailers - Spread Tandem':
      return TRAILERS.SEMI_TRAILERS_SPREAD_TANDEMS.id;
    default:
      return getIdFromName(Object.values(TRAILERS), name);
  }
}
