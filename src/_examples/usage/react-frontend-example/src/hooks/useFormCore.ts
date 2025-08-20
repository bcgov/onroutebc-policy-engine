import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useCallback } from 'react';
import {
  permitFormSchema,
  PermitFormSchema,
} from '../validation/permitFormSchema';

interface UseFormCoreProps {
  onSubmit: (permitData: any) => void;
  selectedTrailers: string[];
  axleConfigurations: any[];
}

export const useFormCore = ({
  onSubmit,
  selectedTrailers,
  axleConfigurations,
}: UseFormCoreProps) => {
  const form = useForm<PermitFormSchema>({
    resolver: yupResolver(permitFormSchema),
    defaultValues: {
      permitType: 'TROS',
      // Company Information
      companyName: '',
      doingBusinessAs: '',
      clientNumber: '',
      // Contact Details
      firstName: '',
      lastName: '',
      phone1: '',
      phone1Extension: '',
      phone2: '',
      phone2Extension: '',
      email: '',
      additionalEmail: '',
      fax: '',
      // Mailing Address
      addressLine1: '',
      addressLine2: '',
      city: '',
      provinceCode: '',
      countryCode: '',
      postalCode: '',
      // Vehicle Details
      vehicleType: '',
      vehicleSubType: '',
      unitNumber: '',
      vin: '',
      plate: '',
      make: '',
      year: '',
      licensedGVW: '',
      vehicleCountryCode: 'CA',
      vehicleProvinceCode: '',
      loadedGVW: '',
      netWeight: '',
      // Trip Details
      permitDuration: 1,
      startDate: '',
      expiryDate: '',
      origin: '',
      destination: '',
      description: '',
      applicationNotes: '',
      thirdPartyLiability: '',
      conditionalLicensingFee: '',
      // Permitted Route
      highwaySequence: '',
      routeOrigin: '',
      routeDestination: '',
      routeExitPoint: '',
      routeTotalDistance: '',
      // Vehicle Configuration
      overallLength: '',
      overallWidth: '',
      overallHeight: '',
      frontProjection: '',
      rearProjection: '',
      commodityType: '',
      loadDescription: '',
      // Legacy fields
      vehicleId: '',
      saveVehicle: false,
    },
  });

  const expandSectionsWithErrors = useCallback(
    (
      errors: any,
      setCollapsedSections: (
        updater: (prev: Set<string>) => Set<string>,
      ) => void,
    ) => {
      const sectionsToExpand = new Set<string>();

      // Map field names to their corresponding sections
      const fieldToSectionMap: Record<string, string> = {
        // Company Information
        companyName: 'company',
        doingBusinessAs: 'company',
        clientNumber: 'company',

        // Contact Details
        firstName: 'contact',
        lastName: 'contact',
        phone1: 'contact',
        phone1Extension: 'contact',
        phone2: 'contact',
        phone2Extension: 'contact',
        email: 'contact',
        additionalEmail: 'contact',
        fax: 'contact',

        // Mailing Address
        addressLine1: 'mailing',
        addressLine2: 'mailing',
        city: 'mailing',
        provinceCode: 'mailing',
        countryCode: 'mailing',
        postalCode: 'mailing',

        // Vehicle Details
        vehicleType: 'vehicle',
        vehicleSubType: 'vehicle',
        unitNumber: 'vehicle',
        vin: 'vehicle',
        plate: 'vehicle',
        make: 'vehicle',
        year: 'vehicle',
        licensedGVW: 'vehicle',
        vehicleCountryCode: 'vehicle',
        vehicleProvinceCode: 'vehicle',
        loadedGVW: 'vehicle',
        netWeight: 'vehicle',

        // Trip Details
        permitDuration: 'trip',
        startDate: 'trip',
        expiryDate: 'trip',
        origin: 'trip',
        destination: 'trip',
        description: 'trip',
        applicationNotes: 'trip',
        thirdPartyLiability: 'trip',
        conditionalLicensingFee: 'trip',

        // Permitted Route
        highwaySequence: 'route',
        routeOrigin: 'route',
        routeDestination: 'route',
        routeExitPoint: 'route',
        routeTotalDistance: 'route',

        // Vehicle Configuration
        overallLength: 'vehicleConfig',
        overallWidth: 'vehicleConfig',
        overallHeight: 'vehicleConfig',
        frontProjection: 'vehicleConfig',
        rearProjection: 'vehicleConfig',
        commodityType: 'vehicleConfig',
        loadDescription: 'vehicleConfig',
      };

      // Check which sections have errors
      Object.keys(errors).forEach((fieldName) => {
        const section = fieldToSectionMap[fieldName];
        if (section) {
          sectionsToExpand.add(section);
        }
      });

      // Expand sections that have errors
      if (sectionsToExpand.size > 0) {
        setCollapsedSections((prev) => {
          const newSet = new Set(prev);
          sectionsToExpand.forEach((section) => {
            newSet.delete(section); // Remove from collapsed (expand the section)
          });
          return newSet;
        });
      }
    },
    [],
  );

  const handleSubmit = form.handleSubmit(
    // Success callback
    (data) => {
      onSubmit({
        ...data,
        selectedTrailers: selectedTrailers.filter(
          (trailer) => trailer && trailer.trim() !== '',
        ),
        axleConfigurations: axleConfigurations,
      });
    },
    // Error callback
    (errors) => {
      console.log('Form validation errors:', errors);
      // Note: setCollapsedSections will be passed from the parent hook
    },
  );

  return {
    form,
    handleSubmit,
    expandSectionsWithErrors,
  };
};
