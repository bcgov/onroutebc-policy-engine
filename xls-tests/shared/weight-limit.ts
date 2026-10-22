/** Returns the axle unit weight limit (kg) from a workbook cell, or throws. */
export function getWeightLimit(
  limits: Record<string, unknown>,
  column: string,
  rowNumber: number,
): number {
  const limit = limits[column];
  if (typeof limit !== 'number' || !Number.isFinite(limit) || limit <= 0) {
    throw new Error(
      `Invalid numeric limit at ${column}${rowNumber}: ${JSON.stringify(limit)}`,
    );
  }
  return limit;
}
