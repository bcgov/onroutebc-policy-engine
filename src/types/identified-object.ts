/**
 * Identified Object Type
 *
 * Base type for objects that require unique identification and naming.
 * Used as a foundation for many other types in the system.
 */

export type IdentifiedObject = {
  /** Unique identifier for the object */
  id: string;
  /** Human-readable name for the object */
  name: string;
};
