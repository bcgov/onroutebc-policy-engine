import * as yup from 'yup';

export const permitFormSchema = yup.object({
  permitType: yup.string().required('Permit type is required'),

  // Company Information
  companyName: yup.string().required('Company name is required'),
  doingBusinessAs: yup.string().optional().default(''),
  clientNumber: yup.string().required('Client number is required'),

  // Contact Details
  firstName: yup.string().required('First name is required'),
  lastName: yup.string().required('Last name is required'),
  phone1: yup.string().required('Primary phone is required'),
  phone1Extension: yup.string().optional().default(''),
  phone2: yup.string().optional().default(''),
  phone2Extension: yup.string().optional().default(''),
  email: yup
    .string()
    .email('Invalid email format')
    .required('Email is required'),
  additionalEmail: yup
    .string()
    .email('Invalid email format')
    .optional()
    .default(''),
  fax: yup.string().optional().default(''),

  // Mailing Address
  addressLine1: yup.string().required('Address line 1 is required'),
  addressLine2: yup.string().optional().default(''),
  city: yup.string().required('City is required'),
  provinceCode: yup.string().required('Province is required'),
  countryCode: yup.string().required('Country is required'),
  postalCode: yup.string().required('Postal code is required'),

  // Vehicle Details
  vehicleType: yup.string().required('Vehicle type is required'),
  vehicleSubType: yup.string().required('Vehicle sub-type is required'),
  unitNumber: yup.string().optional().default(''),
  vin: yup.string().optional().default(''),
  plate: yup.string().optional().default(''),
  make: yup.string().optional().default(''),
  year: yup.string().optional().default(''),
  licensedGVW: yup.string().optional().default(''),
  vehicleCountryCode: yup.string().required('Vehicle country is required'),
  vehicleProvinceCode: yup.string().optional().default(''),
  loadedGVW: yup.string().optional().default(''),
  netWeight: yup.string().optional().default(''),

  // Trip Details
  permitDuration: yup
    .number()
    .min(1, 'Duration must be at least 1')
    .required('Permit duration is required'),
  startDate: yup.string().required('Start date is required'),
  expiryDate: yup.string().required('Expiry date is required'),
  origin: yup.string().optional().default(''),
  destination: yup.string().optional().default(''),
  description: yup.string().optional().default(''),
  applicationNotes: yup.string().optional().default(''),
  thirdPartyLiability: yup.string().optional().default(''),
  conditionalLicensingFee: yup.string().optional().default(''),

  // Permitted Route
  highwaySequence: yup.string().optional().default(''),
  routeOrigin: yup.string().optional().default(''),
  routeDestination: yup.string().optional().default(''),
  routeExitPoint: yup.string().optional().default(''),
  routeTotalDistance: yup.string().optional().default(''),

  // Vehicle Configuration
  overallLength: yup.string().optional().default(''),
  overallWidth: yup.string().optional().default(''),
  overallHeight: yup.string().optional().default(''),
  frontProjection: yup.string().optional().default(''),
  rearProjection: yup.string().optional().default(''),
  commodityType: yup.string().optional().default(''),
  loadDescription: yup.string().optional().default(''),

  // Legacy fields
  vehicleId: yup.string().optional().default(''),
  saveVehicle: yup.boolean().optional().default(false),

  // Additional fields for form submission
  selectedTrailers: yup.array().of(yup.string()).optional().default([]),
  axleConfigurations: yup
    .array()
    .of(
      yup.object({
        numberOfAxles: yup.string().optional().default(''),
        axleSpread: yup.string().optional().default(''),
        interaxleSpacing: yup.string().optional().default(''),
        axleUnitWeight: yup.string().optional().default(''),
        numberOfTires: yup.string().optional().default(''),
        tireSize: yup.string().optional().default(''),
      }),
    )
    .optional()
    .default([]),
});

export type PermitFormSchema = yup.InferType<typeof permitFormSchema>;
