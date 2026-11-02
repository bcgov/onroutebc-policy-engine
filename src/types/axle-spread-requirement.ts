import { SelfIssuable } from './self-issuable';

/**
 * Base axle spread requirement with axle count
 * Extends SelfIssuable to include self-issuance capability
 */
export type AxleSpreadRequirement = SelfIssuable & {
  /** Number of axles in the axle unit affected by this modifier */
  axles?: number;
  /** The minimum permittable axle spread value in centimetres (optional) */
  minAxleSpread?: number;
  /** The maximum permittable axle spread value in centimetres (optional) */
  maxAxleSpread?: number;
};
