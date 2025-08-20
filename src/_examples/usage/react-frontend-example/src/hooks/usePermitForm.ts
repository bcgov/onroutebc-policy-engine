import { useForm, useWatch } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useState, useEffect } from 'react'
import { Policy } from 'onroute-policy-engine'
import { permitFormSchema, PermitFormSchema } from '../validation/permitFormSchema'
import { AxleConfigurationData } from '../components/AxleGroup'

interface UsePermitFormProps {
  policy?: Policy | null
  onSubmit: (permitData: any) => void
}

export const usePermitForm = ({ policy, onSubmit }: UsePermitFormProps) => {
  const [permitTypes, setPermitTypes] = useState<Array<[string, string]>>([])
  const [vehicleSubTypes, setVehicleSubTypes] = useState<Array<[string, string]>>([])
  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(new Set(['company', 'contact', 'mailing', 'trip', 'vehicle', 'route', 'vehicleConfig']))
  const [showVehicleConfig, setShowVehicleConfig] = useState(false)
  const [showSizeDimensions, setShowSizeDimensions] = useState(false)
  const [showWeightDimensions, setShowWeightDimensions] = useState(false)
  const [trailerTypes, setTrailerTypes] = useState<Array<[string, string]>>([])
  const [commodityTypes, setCommodityTypes] = useState<Array<[string, string]>>([])
  const [selectedTrailers, setSelectedTrailers] = useState<string[]>([])
  const [axleConfigurations, setAxleConfigurations] = useState<AxleConfigurationData[]>([
    { numberOfAxles: '', axleSpread: '', interaxleSpacing: '', axleUnitWeight: '', numberOfTires: '', tireSize: '' },
    { numberOfAxles: '', axleSpread: '', interaxleSpacing: '', axleUnitWeight: '', numberOfTires: '', tireSize: '' }
  ])

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
      saveVehicle: false
    }
  })

  // Watch for changes in specific fields
  const watchedPermitType = useWatch({
    control: form.control,
    name: 'permitType'
  })

  const watchedVehicleType = useWatch({
    control: form.control,
    name: 'vehicleType'
  })

  const watchedVehicleCountryCode = useWatch({
    control: form.control,
    name: 'vehicleCountryCode'
  })

  const watchedCountryCode = useWatch({
    control: form.control,
    name: 'countryCode'
  })

  // Initialize policy data
  useEffect(() => {
    if (policy) {
      try {
        const types = policy.getPermitTypes()
        setPermitTypes(Array.from(types.entries()))
        
        // Get trailer types for vehicle configuration
        const trailerTypesList = policy.getTrailerTypes(true)
        setTrailerTypes(Array.from(trailerTypesList.entries()))
        
        // Get commodity types for vehicle configuration
        const commodityTypesList = policy.getCommodities()
        setCommodityTypes(Array.from(commodityTypesList.entries()))
        
        // Check initial permit type's commodityRequired property and load sample data
        if (watchedPermitType) {
          const permitTypeDefinition = policy.getPermitTypeDefinition(watchedPermitType)
          setShowVehicleConfig(permitTypeDefinition?.commodityRequired || false)
          setShowSizeDimensions(permitTypeDefinition?.sizeDimensionRequired || false)
          setShowWeightDimensions(permitTypeDefinition?.weightDimensionRequired || false)
          
          // Load sample data for the initial permit type
          loadSampleData(watchedPermitType)
        }
      } catch (error) {
        console.error('Failed to get permit types:', error)
      }
    }
  }, [policy])

  // Handle permit type changes
  useEffect(() => {
    if (watchedPermitType && policy) {
      try {
        const permitTypeDefinition = policy.getPermitTypeDefinition(watchedPermitType)
        setShowVehicleConfig(permitTypeDefinition?.commodityRequired || false)
        setShowSizeDimensions(permitTypeDefinition?.sizeDimensionRequired || false)
        setShowWeightDimensions(permitTypeDefinition?.weightDimensionRequired || false)
        
        // Load sample data for the selected permit type
        loadSampleData(watchedPermitType)
      } catch (error) {
        console.error('Failed to get permit type definition:', error)
        setShowVehicleConfig(false)
        setShowSizeDimensions(false)
        setShowWeightDimensions(false)
      }
    }
  }, [watchedPermitType, policy])

  // Handle vehicle type changes
  useEffect(() => {
    if (watchedVehicleType && policy) {
      try {
        let subTypes: Array<[string, string]> = []
        if (watchedVehicleType === 'powerUnit') {
          subTypes = Array.from(policy.getPowerUnitTypes().entries())
        } else if (watchedVehicleType === 'trailer') {
          subTypes = Array.from(policy.getTrailerTypes().entries())
        }
        setVehicleSubTypes(subTypes)
        
        // Only clear the vehicle sub-type if it's not a valid option for the new vehicle type
        const currentSubType = form.getValues('vehicleSubType')
        const validSubTypes = subTypes.map(([id]) => id)
        if (currentSubType && !validSubTypes.includes(currentSubType)) {
          form.setValue('vehicleSubType', '')
        }
      } catch (error) {
        console.error('Failed to get vehicle sub-types:', error)
        setVehicleSubTypes([])
      }
    }
  }, [watchedVehicleType, policy, form])

  // Handle vehicle country code changes
  useEffect(() => {
    if (watchedVehicleCountryCode === 'MX' || watchedVehicleCountryCode === 'XX') {
      form.setValue('vehicleProvinceCode', '')
    }
  }, [watchedVehicleCountryCode, form])

  // Handle mailing address country code changes
  useEffect(() => {
    if (watchedCountryCode === 'MX' || watchedCountryCode === 'XX') {
      form.setValue('provinceCode', '')
    }
  }, [watchedCountryCode, form])

  const loadSampleData = async (permitType: string) => {
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
    setSelectedTrailers([])
    setAxleConfigurations([
      { numberOfAxles: '', axleSpread: '', interaxleSpacing: '', axleUnitWeight: '', numberOfTires: '', tireSize: '' },
      { numberOfAxles: '', axleSpread: '', interaxleSpacing: '', axleUnitWeight: '', numberOfTires: '', tireSize: '' }
    ])
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
        loadedGVW: permitData.vehicleDetails?.loadedGVW?.toString() || '',
        netWeight: permitData.vehicleDetails?.netWeight?.toString() || '',
        
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
          let subTypes: Array<[string, string]> = []
          if (permitData.vehicleDetails.vehicleType === 'powerUnit') {
            subTypes = Array.from(policy.getPowerUnitTypes().entries())
          } else if (permitData.vehicleDetails.vehicleType === 'trailer') {
            subTypes = Array.from(policy.getTrailerTypes().entries())
          }
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
      
      // Update trailers if present
      if (permitData.vehicleConfiguration?.trailers) {
        const trailers = permitData.vehicleConfiguration.trailers.map((trailer: any) => trailer.vehicleSubType)
        setSelectedTrailers([...trailers, '']) // Add empty dropdown at the end
        
        // Update axle configurations based on trailer count
        const trailerCount = trailers.length
        const requiredAxleGroups = trailerCount + 2 // 2 default + 1 per trailer
        
        const newAxleConfigs: AxleConfigurationData[] = []
        for (let i = 0; i < requiredAxleGroups; i++) {
          newAxleConfigs.push({
            numberOfAxles: '',
            axleSpread: '',
            interaxleSpacing: '',
            axleUnitWeight: '',
            numberOfTires: '',
            tireSize: ''
          })
        }
        setAxleConfigurations(newAxleConfigs)
      }
      
      // Update axle configurations if present
      if (permitData.vehicleConfiguration?.axleConfiguration) {
        const axleConfigs = permitData.vehicleConfiguration.axleConfiguration.map((axle: any) => ({
          numberOfAxles: axle.numberOfAxles?.toString() || '',
          axleSpread: axle.axleSpread?.toString() || '',
          interaxleSpacing: axle.interaxleSpacing?.toString() || '',
          axleUnitWeight: axle.axleUnitWeight?.toString() || '',
          numberOfTires: axle.numberOfTires?.toString() || '',
          tireSize: axle.tireSize?.toString() || ''
        }))
        setAxleConfigurations(axleConfigs)
      }
      
    } catch (error) {
      console.error('Failed to load sample data:', error)
    }
  }

  const handleSubmit = form.handleSubmit((data) => {
    onSubmit({
      ...data,
      selectedTrailers: selectedTrailers.filter(trailer => trailer && trailer.trim() !== ''),
      axleConfigurations: axleConfigurations
    })
  })

  const toggleSection = (sectionName: string) => {
    setCollapsedSections(prev => {
      const newSet = new Set(prev)
      if (newSet.has(sectionName)) {
        newSet.delete(sectionName)
      } else {
        newSet.add(sectionName)
      }
      return newSet
    })
  }

  const handleTrailerChange = (index: number, value: string) => {
    setSelectedTrailers(prev => {
      const newTrailers = [...prev]
      newTrailers[index] = value
      
      // If a trailer is selected, add a new empty dropdown at the end
      if (value && value.trim() !== '') {
        // Remove any trailing empty selections first
        while (newTrailers.length > 0 && newTrailers[newTrailers.length - 1] === '') {
          newTrailers.pop()
        }
        // Add a new empty dropdown
        newTrailers.push('')
      } else {
        // If value is empty, remove trailing empty selections
        while (newTrailers.length > 0 && newTrailers[newTrailers.length - 1] === '') {
          newTrailers.pop()
        }
      }
      
      return newTrailers
    })

    // Calculate the new trailer count and update axle configurations
    const currentTrailers = selectedTrailers.filter(trailer => trailer && trailer.trim() !== '')
    const newTrailerCount = value && value.trim() !== '' ? currentTrailers.length + 1 : currentTrailers.length
    const requiredAxleGroups = newTrailerCount + 2 // 2 default + 1 per trailer
    
    setAxleConfigurations(prev => {
      const newConfigs = [...prev]
      
      // Add more axle groups if needed
      while (newConfigs.length < requiredAxleGroups) {
        newConfigs.push({
          numberOfAxles: '',
          axleSpread: '',
          interaxleSpacing: '',
          axleUnitWeight: '',
          numberOfTires: '',
          tireSize: ''
        })
      }
      
      // Remove excess axle groups if needed
      while (newConfigs.length > requiredAxleGroups) {
        newConfigs.pop()
      }
      
      return newConfigs
    })
  }

  const removeTrailer = (index: number) => {
    setSelectedTrailers(prev => {
      const newTrailers = [...prev]
      newTrailers.splice(index, 1)
      
      // Remove trailing empty selections, but keep at least one empty dropdown
      while (newTrailers.length > 1 && newTrailers[newTrailers.length - 1] === '') {
        newTrailers.pop()
      }
      
      // Always ensure we have at least one empty dropdown at the end
      if (newTrailers.length === 0 || newTrailers[newTrailers.length - 1] !== '') {
        newTrailers.push('')
      }
      
      return newTrailers
    })

    // Calculate the new trailer count and update axle configurations
    const currentTrailers = selectedTrailers.filter(trailer => trailer && trailer.trim() !== '')
    const newTrailerCount = currentTrailers.length - 1 // Remove one trailer
    const requiredAxleGroups = newTrailerCount + 2 // 2 default + 1 per trailer
    
    setAxleConfigurations(prev => {
      const newConfigs = [...prev]
      
      // Add more axle groups if needed
      while (newConfigs.length < requiredAxleGroups) {
        newConfigs.push({
          numberOfAxles: '',
          axleSpread: '',
          interaxleSpacing: '',
          axleUnitWeight: '',
          numberOfTires: '',
          tireSize: ''
        })
      }
      
      // Remove excess axle groups if needed
      while (newConfigs.length > requiredAxleGroups) {
        newConfigs.pop()
      }
      
      return newConfigs
    })
  }

  const handleAxleConfigurationChange = (axleIndex: number, field: string, value: string) => {
    setAxleConfigurations(prev => {
      const newConfigs = [...prev]
      newConfigs[axleIndex] = {
        ...newConfigs[axleIndex],
        [field]: value
      }
      return newConfigs
    })
  }

  return {
    form,
    handleSubmit,
    permitTypes,
    vehicleSubTypes,
    collapsedSections,
    showVehicleConfig,
    showSizeDimensions,
    showWeightDimensions,
    trailerTypes,
    commodityTypes,
    selectedTrailers,
    axleConfigurations,
    toggleSection,
    handleTrailerChange,
    removeTrailer,
    handleAxleConfigurationChange,
    loadSampleData
  }
}
