import { AxleConfiguration } from 'onroute-policy-engine/types';

export type PermitMailingAddress = {
  addressLine1: string;
  addressLine2?: string | null;
  city: string;
  provinceCode: string;
  countryCode: string;
  postalCode: string;
};

export type PermitContactDetails = {
  firstName: string;
  lastName: string;
  phone1: string;
  phone1Extension?: string | null;
  phone2?: string | null;
  phone2Extension?: string | null;
  email: string;
  additionalEmail?: string | null;
  fax?: string | null;
};

export type PermitVehicleDetails = {
  vehicleId?: string | null;
  unitNumber?: string | null;
  vin: string;
  plate: string;
  make?: string | null;
  year?: number | null;
  countryCode: string;
  provinceCode: string;
  vehicleType: string;
  vehicleSubType: string;
  licensedGVW?: number | null;
  saveVehicle?: boolean | null;
};

export type PermitCommodity = {
  description: string;
  condition: string;
  conditionLink: string;
  checked: boolean;
  disabled: boolean;
};

export type PermitData = {
  companyName: string;
  doingBusinessAs?: string;
  clientNumber: string;
  permitDuration: number;
  commodities: Array<PermitCommodity>;
  contactDetails: PermitContactDetails;
  mailingAddress: PermitMailingAddress;
  vehicleDetails: PermitVehicleDetails;
  feeSummary?: string | null;
  startDate: string;
  expiryDate?: string | null;
  permittedCommodity?: PermittedCommodity | null;
  vehicleConfiguration?: VehicleConfiguration | null;
  permittedRoute?: PermittedRoute | null;
  applicationNotes?: string | null;
  thirdPartyLiability?: string | null;
  conditionalLicensingFee?: string | null;
};

export type PermittedCommodity = {
  commodityType: string;
  loadDescription: string;
};

export type VehicleInConfiguration = {
  vehicleSubType: string;
};

export type VehicleConfiguration = {
  overallLength?: number;
  overallWidth?: number;
  overallHeight?: number;
  frontProjection?: number;
  rearProjection?: number;
  trailers?: Array<VehicleInConfiguration> | null;
  loadedGVW?: number;
  netWeight?: number;
  axleConfiguration?: Array<AxleConfiguration>;
};

export type PermittedRoute = {
  manualRoute?: ManualRoute | null;
  routeDetails?: string | null;
};

export type ManualRoute = {
  highwaySequence: Array<string>;
  origin: string;
  destination: string;
  exitPoint?: string;
  totalDistance?: number;
};

export type PermitApplication = {
  permitData: PermitData;
  permitType: string;
};
