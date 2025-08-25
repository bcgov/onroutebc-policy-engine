/**
 * Permit Facts Type
 * 
 * Defines the structure for permit application facts used in policy validation.
 * Contains essential information about the permit application and vehicle.
 */

export type PermitFacts = {
  /** Company name applying for the permit */
  companyName?: string;
  /** Duration of the permit in days */
  duration?: number;
  /** Type of permit being applied for */
  permitType?: string;
  /** Start date of the permit (YYYY-MM-DD format) */
  startDate?: string;
  /** Vehicle Identification Number */
  vehicleIdentificationNumber?: string;
  /** Vehicle license plate number */
  vehiclePlate?: string;
  /** Type of vehicle permitted (primary vehicle) (e.g., 'TRKTRAC') */
  vehicleType?: string;
  /** Additional application data as a generic object */
  app?: object;
};
