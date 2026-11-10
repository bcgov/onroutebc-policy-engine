import { TRAILERS } from '../../src/constants/trailers';
import { getIdFromName } from '../../src/helper/lists.helper';

export function getTrailerCode(name: string): string | null {
  // The weight sheet uses "Spread Tandem"; the policy definition uses "Spread Tandems".
  // TODO: Standardize the Overweight Dimension Sheet names and TRAILERS names, then remove this alias.
  switch (name) {
    case 'Semi-Trailers - Spread Tandem':
      return TRAILERS.SEMI_TRAILERS_SPREAD_TANDEMS.id;
    default:
      return getIdFromName(Object.values(TRAILERS), name);
  }
}
