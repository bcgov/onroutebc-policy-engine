/**
 * Geographic Region Type
 * 
 * Defines the structure for geographic regions used in permit routing and validation.
 * Extends IdentifiedObject with optional description for enhanced identification.
 */

import { IdentifiedObject } from 'onroute-policy-engine/types';

/**
 * A geographic region with identification and optional description
 */
export type GeographicRegion = IdentifiedObject & {
  /** Optional description of the geographic region */
  description?: string;
};
