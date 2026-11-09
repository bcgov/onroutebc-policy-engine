import { TRAILERS } from '../../src/constants/trailers';
import { getIdFromName } from '../../src/helper/lists.helper';

export function getTrailerCode(name: string): string | null {
  // The weight sheet uses "Spread Tandem"; the policy definition uses "Spread Tandems".
  // Keep this workbook alias until the source names are standardized.
  switch (name) {
    case 'Semi-Trailers - Spread Tandem':
      return TRAILERS.SEMI_TRAILERS_SPREAD_TANDEMS.id;
    default:
      return getIdFromName(Object.values(TRAILERS), name);
  }
}
