/**
 * Vehicle Display Code Defaults Type
 *
 * Defines default values and formatting rules for generating vehicle display codes.
 * Used for creating standardized vehicle identification codes across the system.
 */

export type VehicleDisplayCodeDefaults = {
  /** Standard prefix for display codes */
  prefixStandard: string;
  /** Universal prefix for display codes */
  prefixUniversal: string;
  /** Standard padding character for display codes */
  paddingStandard: string;
  /** Universal padding character for display codes */
  paddingUniversal: string;
  /** Default spacing for universal display codes */
  spacingUniversalDefault: string;
  /** Spacing for small universal display codes */
  spacingUniversalSmall: string;
  /** Spacing for large universal display codes */
  spacingUniversalLarge: string;
  /** Maximum threshold for small universal spacing */
  spacingUniversalSmallMax: number;
  /** Minimum threshold for large universal spacing */
  spacingUniversalLargeMin: number;
  /** Code for extra axles in universal format */
  extraAxleUniversal: string;
  /** Code for end axles in universal format */
  endAxleUniversal: string;
  /** Maximum number of axles for standard format */
  maxAxlesStandard: number;
  /** Threshold number of axles for universal format */
  thresholdAxlesUniversal: number;
  /** Code for over-threshold axles in universal format */
  overAxlesCodeUniversal: string;
  /** Universal axle code format */
  universalAxleCode: string;
  /** Prefix for multi-digit axle codes */
  multiDigitPrefix: string;
};
