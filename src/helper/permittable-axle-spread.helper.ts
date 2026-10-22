import { PermittableAxleSpread } from '../types/weight-dimension';

/**
 * Check the `permittableAxleSpread` part of a trailer weight entry, in cm.
 * Example in commodities[].powerUnits[].trailers[].weightDimensions[]
 * (also supported in trailer subtype/category defaultWeightDimensions[]):
 * {
 *   "axles": 3,
 *   "legal": 24000,
 *   "permittable": 29000,
 *   "permittableAxleSpread": { "minExclusive": 300, "max": 370 }
 * }
 * The caller passes that nested object as `range`: 300 fails, 300.5 passes.
 * Use "min": 240 instead for an inclusive lower bound. No rounding is applied.
 */
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
