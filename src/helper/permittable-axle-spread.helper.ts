import { PermittableAxleSpread } from '../types/weight-dimension';

/** Check an own-spread condition without rounding fractional centimetres. */
export function matchesPermittableAxleSpread(
  spread: number | undefined,
  range: PermittableAxleSpread,
): boolean {
  const minimum = range.min ?? range.minExclusive;
  if (
    (range.min !== undefined) === (range.minExclusive !== undefined) ||
    !Number.isFinite(minimum) ||
    !Number.isFinite(range.max) ||
    minimum > range.max ||
    (range.minExclusive !== undefined && minimum === range.max)
  ) {
    throw new Error(
      'Invalid permittableAxleSpread: use min or minExclusive and an inclusive max',
    );
  }
  if (spread === undefined || spread > range.max) return false;
  return range.min !== undefined
    ? spread >= range.min
    : spread > range.minExclusive;
}
