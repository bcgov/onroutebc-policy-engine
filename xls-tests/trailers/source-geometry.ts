// Turns the workbook geometry columns into test values.
// The workbook gives metres. The policy engine uses centimetres.

export type SourceGeometryCase = {
  spreadCm: number | undefined;
  spacingCm: number | undefined;
  // A message when the workbook geometry is not valid. The test for the row then fails.
  error: string | undefined;
};

/**
 * Returns one test case for each combination of spread endpoint and spacing endpoint.
 * An endpoint is a min or max value that the workbook gives.
 * When the workbook gives no value, the case has undefined. We do not invent values.
 *
 * `columns` are the column letters, in this order:
 * spread min, spread max, spacing min, spacing max.
 */
export function getSourceGeometryCases(
  geometry: Record<string, unknown>,
  row: number,
  columns: readonly [string, string, string, string],
): SourceGeometryCase[] {
  const [spreadMin, spreadMax, spacingMin, spacingMax] = columns;
  try {
    const spreads = getEndpointsCm(geometry, row, spreadMin, spreadMax);
    const spacings = getEndpointsCm(geometry, row, spacingMin, spacingMax);

    const cases: SourceGeometryCase[] = [];
    for (const spreadCm of spreads) {
      for (const spacingCm of spacings) {
        cases.push({ spreadCm, spacingCm, error: undefined });
      }
    }
    return cases;
  } catch (error) {
    // Keep the bad row as one failing case.
    // Do not stop the other rows from making their tests.
    return [
      {
        spreadCm: undefined,
        spacingCm: undefined,
        error: error instanceof Error ? error.message : String(error),
      },
    ];
  }
}

/**
 * Returns the min and max values of one range, in centimetres, without duplicates.
 * Returns [undefined] when the workbook gives no value for the range.
 */
function getEndpointsCm(
  geometry: Record<string, unknown>,
  row: number,
  minColumn: string,
  maxColumn: string,
): Array<number | undefined> {
  const min = readMetres(geometry, row, minColumn);
  const max = readMetres(geometry, row, maxColumn);
  if (min !== null && max !== null && min > max) {
    throw new Error(
      `Reversed geometry range at ${minColumn}${row}/${maxColumn}${row}`,
    );
  }

  const endpointsCm: number[] = [];
  for (const metres of [min, max]) {
    if (metres !== null) {
      endpointsCm.push(Math.round(metres * 100));
    }
  }
  if (endpointsCm.length === 0) {
    return [undefined];
  }
  // Min and max can be the same value.
  return [...new Set(endpointsCm)];
}

/**
 * Returns the cell value in metres.
 * Returns null when the cell is empty, or "NA" or "N/A".
 * The BSA says NA and N/A mean that the cell gives no geometry requirement.
 */
function readMetres(
  geometry: Record<string, unknown>,
  row: number,
  column: string,
): number | null {
  const value = geometry[column];
  if (value === null || value === 'NA' || value === 'N/A') {
    return null;
  }
  if (typeof value !== 'number' || !Number.isFinite(value) || value < 0) {
    throw new Error(
      `Invalid geometry at ${column}${row}: ${JSON.stringify(value)}`,
    );
  }
  return value;
}
