import { PermittableAxleSpread } from '../types/weight-dimension';

/**
 * Check the `permittableAxleSpread` part of a trailer weight entry, in cm.
 * Example in commodities[].powerUnits[].trailers[].weightDimensions[]
 * (also supported in trailer subtype/category defaultWeightDimensions[]):
 * {
 *   "axles": 3,
 *   "legal": 24000,
 *   "permittable": 29000,
 *   "permittableAxleSpread": { "min": 301, "max": 370 }
 * }
 * The caller passes that nested object as `range`: 300 fails, 301 passes.
 * Both bounds are inclusive. No rounding is applied.
 */
export function matchesPermittableAxleSpread(
  spread: number | undefined,
  range: PermittableAxleSpread,
): boolean {
  if (
    !Number.isFinite(range.min) ||
    !Number.isFinite(range.max) ||
    range.min > range.max
  ) {
    throw new Error(
      'Invalid permittableAxleSpread: use finite min and max with min <= max',
    );
  }
  return spread !== undefined && spread >= range.min && spread <= range.max;
}
