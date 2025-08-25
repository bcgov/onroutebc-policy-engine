/**
 * Commodity Type
 *
 * Defines the structure for permitted commodities that can be transported.
 * Extends IdentifiedObject with vehicle dimension requirements.
 */

import {
  IdentifiedObject,
  VehicleDimensions,
} from 'onroute-policy-engine/types';

/**
 * A permitted commodity that can be transported with specific vehicle requirements
 */
export type Commodity = IdentifiedObject & {
  /** Array of power unit dimensions required for this commodity */
  powerUnits: Array<VehicleDimensions>;
};
