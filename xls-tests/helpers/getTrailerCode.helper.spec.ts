import { TRAILERS } from '../../src/constants/trailers';
import { getTrailerCode } from './getTrailerCode.helper';

describe('getTrailerCode', () => {
  it.each([
    ['Semi-Trailers', TRAILERS.SEMI_TRAILERS.id],
    ['Semi-Trailers - Spread Tandem', TRAILERS.SEMI_TRAILERS_SPREAD_TANDEMS.id],
    [
      'Semi-Trailers - Spread Tandems',
      TRAILERS.SEMI_TRAILERS_SPREAD_TANDEMS.id,
    ],
  ])('maps workbook name %s', (name, id) => {
    expect(getTrailerCode(name)).toBe(id);
  });

  it.each(['', 'Unknown vehicle', 'Semi-Trailer', 'Truck Tractor'])(
    'does not guess a code for %s',
    (name) => {
      expect(getTrailerCode(name)).toBeNull();
    },
  );
});
