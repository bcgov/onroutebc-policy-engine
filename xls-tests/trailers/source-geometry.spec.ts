import { getSourceGeometryCases } from './source-geometry';

describe('worksheet geometry endpoints', () => {
  const columns = ['M', 'N', 'O', 'P'] as const;
  it('covers both spread and spacing endpoints in centimetres', () => {
    expect(
      getSourceGeometryCases({ M: 2.4, N: 3.7, O: 3, P: 4.19 }, 6, columns),
    ).toEqual([
      { spreadCm: 240, spacingCm: 300, error: undefined },
      { spreadCm: 240, spacingCm: 419, error: undefined },
      { spreadCm: 370, spacingCm: 300, error: undefined },
      { spreadCm: 370, spacingCm: 419, error: undefined },
    ]);
  });

  it('uses a supplied maximum without inventing a minimum', () => {
    expect(
      getSourceGeometryCases(
        { M: null, N: null, O: null, P: 2.99 },
        5,
        columns,
      ),
    ).toEqual([{ spreadCm: undefined, spacingCm: 299, error: undefined }]);
  });

  it.each(['NA', 'N/A'])('treats %s as no requirement for that cell', (na) => {
    expect(
      getSourceGeometryCases({ M: na, N: na, O: 4.2, P: na }, 59, columns),
    ).toEqual([{ spreadCm: undefined, spacingCm: 420, error: undefined }]);
    expect(
      getSourceGeometryCases({ M: na, N: 3.1, O: na, P: na }, 59, columns),
    ).toEqual([{ spreadCm: 310, spacingCm: undefined, error: undefined }]);
  });

  it('preserves missing geometry and deduplicates equal endpoints', () => {
    expect(
      getSourceGeometryCases(
        { M: null, N: null, O: null, P: null },
        51,
        columns,
      ),
    ).toEqual([
      { spreadCm: undefined, spacingCm: undefined, error: undefined },
    ]);
    expect(
      getSourceGeometryCases({ M: 1, N: 1, O: 0, P: 0 }, 1, columns),
    ).toEqual([{ spreadCm: 100, spacingCm: 0, error: undefined }]);
  });

  it.each([
    [
      { M: 2.4, N: 1.85, O: null, P: null },
      'Reversed geometry range at M43/N43',
    ],
    [{ M: -1, N: null, O: null, P: null }, 'Invalid geometry at M43: -1'],
    [{ M: null, N: null, O: '3', P: null }, 'Invalid geometry at O43: "3"'],
  ])(
    'retains invalid source geometry as a row-level error',
    (geometry, error) => {
      expect(getSourceGeometryCases(geometry, 43, columns)).toEqual([
        { spreadCm: undefined, spacingCm: undefined, error },
      ]);
    },
  );

  it('reads the moved spread and spacing columns in the latest workbook', () => {
    expect(
      getSourceGeometryCases({ L: 2.4, M: 3.7, N: 3, O: null }, 6, [
        'L',
        'M',
        'N',
        'O',
      ]),
    ).toEqual([
      { spreadCm: 240, spacingCm: 300, error: undefined },
      { spreadCm: 370, spacingCm: 300, error: undefined },
    ]);
  });

  it('reports errors at the actual source columns after a column move', () => {
    expect(
      getSourceGeometryCases({ L: 2.4, M: 1.85, N: null, O: null }, 45, [
        'L',
        'M',
        'N',
        'O',
      ]),
    ).toEqual([
      {
        spreadCm: undefined,
        spacingCm: undefined,
        error: 'Reversed geometry range at L45/M45',
      },
    ]);
  });
});
