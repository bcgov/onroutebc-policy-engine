/**
 * Permit Application Types
 *
 * Defines the complete structure for permit applications including contact details,
 * vehicle information, routing, and configuration data.
 */

import { AxleConfiguration } from 'onroute-policy-engine/types';

/**
 * Mailing address for permit correspondence
 */
export type PermitMailingAddress = {
  /** Primary address line */
  addressLine1: string;
  /** Secondary address line (optional) */
  addressLine2?: string | null;
  /** City name */
  city: string;
  /** Province/state code (e.g., 'BC', 'AB') */
  provinceCode: string;
  /** Country code (e.g., 'CA', 'US') */
  countryCode: string;
  /** Postal/zip code */
  postalCode: string;
};

/**
 * Contact information for the permit applicant
 */
export type PermitContactDetails = {
  /** Contact's first name */
  firstName: string;
  /** Contact's last name */
  lastName: string;
  /** Primary phone number */
  phone1: string;
  /** Primary phone extension (optional) */
  phone1Extension?: string | null;
  /** Secondary phone number (optional) */
  phone2?: string | null;
  /** Secondary phone extension (optional) */
  phone2Extension?: string | null;
  /** Primary email address */
  email: string;
  /** Additional email address (optional) */
  additionalEmail?: string | null;
  /** Fax number (optional) */
  fax?: string | null;
};

/**
 * Detailed information about the vehicle in the permit application
 */
export type PermitVehicleDetails = {
  /** Internal vehicle identifier (optional) */
  vehicleId?: string | null;
  /** Unit number for fleet vehicles (optional) */
  unitNumber?: string | null;
  /** Vehicle Identification Number */
  vin: string;
  /** License plate number */
  plate: string;
  /** Vehicle make (optional) */
  make?: string | null;
  /** Vehicle model year (optional) */
  year?: number | null;
  /** Country code where vehicle is registered */
  countryCode: string;
  /** Province/state code where vehicle is registered */
  provinceCode: string;
  /** Type of vehicle (e.g., 'powerUnit', 'trailer') */
  vehicleType: string;
  /** Subtype of vehicle (e.g., 'TRKTRAC', 'SEMITRL') */
  vehicleSubType: string;
  /** Licensed Gross Vehicle Weight in kilograms (optional) */
  licensedGVW?: number | null;
  /** Whether to save this vehicle to the inventory (optional) */
  saveVehicle?: boolean | null;
};

/**
 * Commodity information for the permit application
 */
export type PermitCommodity = {
  /** Description of the commodity being transported */
  description: string;
  /** Special conditions for the commodity */
  condition: string;
  /** Link to detailed commodity conditions */
  conditionLink: string;
  /** Whether this commodity is selected */
  checked: boolean;
  /** Whether this commodity option is disabled */
  disabled: boolean;
};

/**
 * Complete permit data including all application details
 */
export type PermitData = {
  /** Company name applying for the permit */
  companyName: string;
  /** Doing Business As name (optional) */
  doingBusinessAs?: string;
  /** Client number for the company */
  clientNumber: string;
  /** Duration of the permit in days */
  permitDuration: number;
  /** Array of commodities being transported */
  commodities: Array<PermitCommodity>;
  /** Contact details for the applicant */
  contactDetails: PermitContactDetails;
  /** Mailing address for correspondence */
  mailingAddress: PermitMailingAddress;
  /** Detailed vehicle information */
  vehicleDetails: PermitVehicleDetails;
  /** Fee summary information (optional) */
  feeSummary?: string | null;
  /** Permit start date (YYYY-MM-DD format) */
  startDate: string;
  /** Permit expiry date (YYYY-MM-DD format, optional) */
  expiryDate?: string | null;
  /** Selected permitted commodity (optional) */
  permittedCommodity?: PermittedCommodity | null;
  /** Vehicle configuration details (optional) */
  vehicleConfiguration?: VehicleConfiguration | null;
  /** Permitted route information (optional) */
  permittedRoute?: PermittedRoute | null;
  /** Additional application notes (optional) */
  applicationNotes?: string | null;
  /** Third party liability information (optional) */
  thirdPartyLiability?: string | null;
  /** Conditional licensing fee information (optional) */
  conditionalLicensingFee?: string | null;
};

/**
 * Selected commodity for the permit with load description
 */
export type PermittedCommodity = {
  /** Type of commodity being transported */
  commodityType: string;
  /** Description of the load being transported */
  loadDescription: string;
};

/**
 * Vehicle configuration within the permit application
 */
export type VehicleInConfiguration = {
  /** Subtype of the vehicle */
  vehicleSubType: string;
};

/**
 * Complete vehicle configuration including dimensions and axles
 */
export type VehicleConfiguration = {
  /** Overall length in meters (optional) */
  overallLength?: number;
  /** Overall width in meters (optional) */
  overallWidth?: number;
  /** Overall height in meters (optional) */
  overallHeight?: number;
  /** Front projection in meters (optional) */
  frontProjection?: number;
  /** Rear projection in meters (optional) */
  rearProjection?: number;
  /** Array of trailers in the configuration (optional) */
  trailers?: Array<VehicleInConfiguration> | null;
  /** Loaded Gross Vehicle Weight in kilograms (optional) */
  loadedGVW?: number;
  /** Net weight in kilograms (optional) */
  netWeight?: number;
  /** Axle configuration details (optional) */
  axleConfiguration?: Array<AxleConfiguration>;
};

/**
 * Route information for the permit
 */
export type PermittedRoute = {
  /** Manual route details (optional) */
  manualRoute?: ManualRoute | null;
  /** Additional route details (optional) */
  routeDetails?: string | null;
};

/**
 * Manual route configuration with highway sequence
 */
export type ManualRoute = {
  /** Sequence of highways for the route */
  highwaySequence: Array<string>;
  /** Origin point of the route */
  origin: string;
  /** Destination point of the route */
  destination: string;
  /** Exit point from the route (optional) */
  exitPoint?: string;
  /** Total distance in kilometers (optional) */
  totalDistance?: number;
};

/**
 * Complete permit application structure
 */
export type PermitApplication = {
  /** All permit data and details */
  permitData: PermitData;
  /** Type of permit being applied for */
  permitType: string;
};
