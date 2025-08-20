import { useCallback } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { PermitFormSchema } from '../validation/permitFormSchema'

interface UseSampleDataProps {
  form: UseFormReturn<PermitFormSchema>
  policy: any
  getVehicleSubTypes: (vehicleType: string) => Array<[string, string]>
  setVehicleSubTypes: (types: Array<[string, string]>) => void
  setTrailersFromData: (trailers: any[]) => void
  setAxleConfigurationsFromData: (axleConfigs: any[]) => void
  resetVehicleConfiguration: () => void
}

export const useSampleData = ({
  form,
  policy,
  getVehicleSubTypes,
  setVehicleSubTypes,
  setTrailersFromData,
  setAxleConfigurationsFromData,
  resetVehicleConfiguration
}: UseSampleDataProps) => {
  const loadSampleData = useCallback(async (permitType: string) => {
    // Reset form to default values first
    form.reset({
      permitType: permitType,
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
      vehicleId: '',
      unitNumber: '',
      vin: '',
      plate: '',
      make: '',
      year: '',
      vehicleType: '',
      vehicleSubType: '',
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
      saveVehicle: false
    })
    
    // Reset other state variables
    setVehicleSubTypes([])

    try {
      const response = await fetch(`/sample-applications/${permitType}.json`)
      if (!response.ok) {
        console.warn(`No sample data found for permit type: ${permitType}`)
        return
      }
      
      const sampleData = await response.json()
      const permitData = sampleData.permitData
      
      // Map sample data to form fields
      const newFormData: Partial<PermitFormSchema> = {
        permitType: permitType,
        // Company Information
        companyName: permitData.companyName || '',
        doingBusinessAs: permitData.doingBusinessAs || '',
        clientNumber: permitData.clientNumber || '',
        permitDuration: permitData.permitDuration || 1,
        
        // Contact Details
        firstName: permitData.contactDetails?.firstName || '',
        lastName: permitData.contactDetails?.lastName || '',
        phone1: permitData.contactDetails?.phone1 || '',
        phone1Extension: permitData.contactDetails?.phone1Extension || '',
        phone2: permitData.contactDetails?.phone2 || '',
        phone2Extension: permitData.contactDetails?.phone2Extension || '',
        email: permitData.contactDetails?.email || '',
        additionalEmail: permitData.contactDetails?.additionalEmail || '',
        fax: permitData.contactDetails?.fax || '',
        
        // Mailing Address
        addressLine1: permitData.mailingAddress?.addressLine1 || '',
        addressLine2: permitData.mailingAddress?.addressLine2 || '',
        city: permitData.mailingAddress?.city || '',
        provinceCode: permitData.mailingAddress?.provinceCode || '',
        countryCode: permitData.mailingAddress?.countryCode || '',
        postalCode: permitData.mailingAddress?.postalCode || '',
        
        // Vehicle Details
        vehicleId: permitData.vehicleDetails?.vehicleId || '',
        unitNumber: permitData.vehicleDetails?.unitNumber || '',
        vin: permitData.vehicleDetails?.vin || '',
        plate: permitData.vehicleDetails?.plate || '',
        make: permitData.vehicleDetails?.make || '',
        year: permitData.vehicleDetails?.year?.toString() || '',
        vehicleType: permitData.vehicleDetails?.vehicleType || '',
        vehicleSubType: permitData.vehicleDetails?.vehicleSubType || '',
        licensedGVW: permitData.vehicleDetails?.licensedGVW?.toString() || '',
        vehicleCountryCode: permitData.vehicleDetails?.countryCode || 'CA',
        vehicleProvinceCode: permitData.vehicleDetails?.provinceCode || '',
        loadedGVW: permitData.vehicleConfiguration?.loadedGVW?.toString() || '',
        netWeight: permitData.vehicleConfiguration?.netWeight?.toString() || '',
        
        // Dates
        startDate: permitData.startDate ? new Date().toISOString().split('T')[0] : '',
        expiryDate: permitData.expiryDate || '',
        
        // Additional fields
        applicationNotes: permitData.applicationNotes || '',
        thirdPartyLiability: permitData.thirdPartyLiability || '',
        conditionalLicensingFee: permitData.conditionalLicensingFee || '',
        
        // Permitted Route
        highwaySequence: permitData.permittedRoute?.manualRoute?.highwaySequence?.join(', ') || '',
        routeOrigin: permitData.permittedRoute?.manualRoute?.origin || '',
        routeDestination: permitData.permittedRoute?.manualRoute?.destination || '',
        routeExitPoint: permitData.permittedRoute?.manualRoute?.exitPoint || '',
        routeTotalDistance: permitData.permittedRoute?.manualRoute?.totalDistance?.toString() || '',
        
        // Vehicle Configuration
        overallLength: permitData.vehicleConfiguration?.overallLength?.toString() || '',
        overallWidth: permitData.vehicleConfiguration?.overallWidth?.toString() || '',
        overallHeight: permitData.vehicleConfiguration?.overallHeight?.toString() || '',
        frontProjection: permitData.vehicleConfiguration?.frontProjection?.toString() || '',
        rearProjection: permitData.vehicleConfiguration?.rearProjection?.toString() || '',
        commodityType: permitData.permittedCommodity?.commodityType || '',
        loadDescription: permitData.permittedCommodity?.loadDescription || ''
      }
      
      form.reset(newFormData)
      
      // Update vehicle sub-types if vehicle type is set
      if (permitData.vehicleDetails?.vehicleType && policy) {
        try {
          const subTypes = getVehicleSubTypes(permitData.vehicleDetails.vehicleType)
          setVehicleSubTypes(subTypes)
          
          // Ensure the vehicle sub-type is set after the vehicle type
          if (permitData.vehicleDetails.vehicleSubType) {
            // Use setTimeout to ensure this happens after the form reset
            setTimeout(() => {
              form.setValue('vehicleSubType', permitData.vehicleDetails.vehicleSubType)
            }, 0)
          }
        } catch (error) {
          console.error('Failed to get vehicle sub-types:', error)
          setVehicleSubTypes([])
        }
      }
      
      // Always reset vehicle configuration first
      resetVehicleConfiguration()
      
      // Update trailers if present
      if (permitData.vehicleConfiguration?.trailers) {
        setTrailersFromData(permitData.vehicleConfiguration.trailers)
      }
      
      // Update axle configurations if present
      if (permitData.vehicleConfiguration?.axleConfiguration) {
        setAxleConfigurationsFromData(permitData.vehicleConfiguration.axleConfiguration)
      }
      
    } catch (error) {
      console.error('Failed to load sample data:', error)
    }
  }, [form, policy, getVehicleSubTypes, setVehicleSubTypes, setTrailersFromData, setAxleConfigurationsFromData, resetVehicleConfiguration])

  return {
    loadSampleData
  }
}
