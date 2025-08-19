import React, { useState, useEffect } from 'react'
import { ValidationResults, Policy } from 'onroute-policy-engine'
import ValidationResultsDisplay from './ValidationResults'
import CompanyInformationSection, { CompanyInformationData } from './CompanyInformationSection'
import ContactDetailsSection, { ContactDetailsData } from './ContactDetailsSection'
import MailingAddressSection, { MailingAddressData } from './MailingAddressSection'
import VehicleDetailsSection, { VehicleDetailsData } from './VehicleDetailsSection'
import TripDetailsSection, { TripDetailsData } from './TripDetailsSection'
import PermittedRouteSection, { PermittedRouteData } from './PermittedRouteSection'
import VehicleConfigurationSection, { VehicleConfigurationData, AxleConfigurationData } from './VehicleConfigurationSection'
import './PermitForm.css'

interface PermitFormData {
  permitType: string
  // Company Information
  companyName: string
  doingBusinessAs: string
  clientNumber: string
  // Contact Details
  firstName: string
  lastName: string
  phone1: string
  phone1Extension: string
  phone2: string
  phone2Extension: string
  email: string
  additionalEmail: string
  fax: string
  // Mailing Address
  addressLine1: string
  addressLine2: string
  city: string
  provinceCode: string
  countryCode: string
  postalCode: string
  // Vehicle Details
  vehicleType: string
  vehicleSubType: string
  unitNumber: string
  vin: string
  plate: string
  make: string
  year: string
  licensedGVW: string
  vehicleCountryCode: string
  vehicleProvinceCode: string
  loadedGVW: string
  netWeight: string
  // Trip Details
  permitDuration: number
  startDate: string
  expiryDate: string
  origin: string
  destination: string
  commodity: string
  description: string
  applicationNotes: string
  thirdPartyLiability: string
  conditionalLicensingFee: string
  // Permitted Route
  highwaySequence: string
  routeOrigin: string
  routeDestination: string
  routeExitPoint: string
  routeTotalDistance: string
  // Vehicle Configuration
  overallLength: string
  overallWidth: string
  overallHeight: string
  frontProjection: string
  rearProjection: string
  commodityType: string
  loadDescription: string
  // Legacy fields
  vehicleId: string
  saveVehicle: boolean
}

interface PermitFormProps {
  onSubmit: (permitData: any) => void
  validationResults?: ValidationResults | null
  policy?: Policy | null
  permitApplication?: any
}

const PermitForm: React.FC<PermitFormProps> = ({ onSubmit, validationResults, policy, permitApplication }) => {
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
  
  const [formData, setFormData] = useState<PermitFormData>({
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
    commodity: 'EMPTYXX',
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
  })

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
        if (formData.permitType) {
          const permitTypeDefinition = policy.getPermitTypeDefinition(formData.permitType)
          setShowVehicleConfig(permitTypeDefinition?.commodityRequired || false)
          setShowSizeDimensions(permitTypeDefinition?.sizeDimensionRequired || false)
          setShowWeightDimensions(permitTypeDefinition?.weightDimensionRequired || false)
          
          // Load sample data for the initial permit type
          loadSampleData(formData.permitType)
        }
      } catch (error) {
        console.error('Failed to get permit types:', error)
      }
    }
  }, [policy])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      ...formData,
      selectedTrailers: selectedTrailers.filter(trailer => trailer && trailer.trim() !== ''),
      axleConfigurations: axleConfigurations
    })
  }

  const loadSampleData = async (permitType: string) => {
    // First, reset all form fields to their default values
    const defaultFormData: PermitFormData = {
      permitType: permitType, // Keep the selected permit type
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
      commodity: 'EMPTYXX',
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

    // Reset form data to defaults first
    setFormData(defaultFormData)
    
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
      
      // Map sample data to form fields, starting from the default values
      const newFormData: PermitFormData = {
        ...defaultFormData,
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
      
      setFormData(newFormData)
      
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

  const handleChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))

    // Handle permit type change to load sample data and check requirements
    if (name === 'permitType' && policy) {
      try {
        const permitTypeDefinition = policy.getPermitTypeDefinition(value)
        setShowVehicleConfig(permitTypeDefinition?.commodityRequired || false)
        setShowSizeDimensions(permitTypeDefinition?.sizeDimensionRequired || false)
        setShowWeightDimensions(permitTypeDefinition?.weightDimensionRequired || false)
        
        // Load sample data for the selected permit type
        loadSampleData(value)
      } catch (error) {
        console.error('Failed to get permit type definition:', error)
        setShowVehicleConfig(false)
        setShowSizeDimensions(false)
        setShowWeightDimensions(false)
      }
    }

    // Handle vehicle type change to populate sub-types
    if (name === 'vehicleType' && policy) {
      try {
        let subTypes: Array<[string, string]> = []
        if (value === 'powerUnit') {
          subTypes = Array.from(policy.getPowerUnitTypes().entries())
        } else if (value === 'trailer') {
          subTypes = Array.from(policy.getTrailerTypes().entries())
        }
        setVehicleSubTypes(subTypes)
        
        // Clear the vehicle sub-type when vehicle type changes
        setFormData(prev => ({
          ...prev,
          vehicleSubType: ''
        }))
      } catch (error) {
        console.error('Failed to get vehicle sub-types:', error)
        setVehicleSubTypes([])
      }
    }

    // Handle vehicle country code change to clear province code for MX or XX
    if (name === 'vehicleCountryCode' && (value === 'MX' || value === 'XX')) {
      setFormData(prev => ({
        ...prev,
        vehicleProvinceCode: ''
      }))
    }

    // Handle mailing address country code change to clear province code for MX or XX
    if (name === 'countryCode' && (value === 'MX' || value === 'XX')) {
      setFormData(prev => ({
        ...prev,
        provinceCode: ''
      }))
    }
  }

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

  // Extract section data for components
  const companyData: CompanyInformationData = {
    companyName: formData.companyName,
    doingBusinessAs: formData.doingBusinessAs,
    clientNumber: formData.clientNumber
  }

  const contactData: ContactDetailsData = {
    firstName: formData.firstName,
    lastName: formData.lastName,
    phone1: formData.phone1,
    phone1Extension: formData.phone1Extension,
    phone2: formData.phone2,
    phone2Extension: formData.phone2Extension,
    email: formData.email,
    additionalEmail: formData.additionalEmail,
    fax: formData.fax
  }

  const mailingData: MailingAddressData = {
    addressLine1: formData.addressLine1,
    addressLine2: formData.addressLine2,
    city: formData.city,
    provinceCode: formData.provinceCode,
    countryCode: formData.countryCode,
    postalCode: formData.postalCode
  }

  const vehicleData: VehicleDetailsData = {
    vehicleType: formData.vehicleType,
    vehicleSubType: formData.vehicleSubType,
    unitNumber: formData.unitNumber,
    vin: formData.vin,
    plate: formData.plate,
    make: formData.make,
    year: formData.year,
    licensedGVW: formData.licensedGVW,
    vehicleCountryCode: formData.vehicleCountryCode,
    vehicleProvinceCode: formData.vehicleProvinceCode,
    loadedGVW: formData.loadedGVW,
    netWeight: formData.netWeight
  }

  const tripData: TripDetailsData = {
    permitDuration: formData.permitDuration,
    startDate: formData.startDate,
    expiryDate: formData.expiryDate,
    origin: formData.origin,
    destination: formData.destination,
    commodity: formData.commodity,
    description: formData.description,
    applicationNotes: formData.applicationNotes,
    thirdPartyLiability: formData.thirdPartyLiability,
    conditionalLicensingFee: formData.conditionalLicensingFee
  }

  const routeData: PermittedRouteData = {
    highwaySequence: formData.highwaySequence,
    routeOrigin: formData.routeOrigin,
    routeDestination: formData.routeDestination,
    routeExitPoint: formData.routeExitPoint,
    routeTotalDistance: formData.routeTotalDistance
  }

  const vehicleConfigData: VehicleConfigurationData = {
    overallLength: formData.overallLength,
    overallWidth: formData.overallWidth,
    overallHeight: formData.overallHeight,
    frontProjection: formData.frontProjection,
    rearProjection: formData.rearProjection,
    commodityType: formData.commodityType,
    loadDescription: formData.loadDescription
  }

  return (
    <div className="permit-form">
      <div className="left-column">
        <form onSubmit={handleSubmit}>
          <div className="form-content">
            <div className="form-group">
              <label htmlFor="permitType">Permit Type:</label>
              <select
                id="permitType"
                name="permitType"
                value={formData.permitType}
                onChange={(e) => handleChange(e.target.name, e.target.value)}
              >
                {permitTypes.length > 0 ? (
                  permitTypes.map(([id, name]) => (
                    <option key={id} value={id}>
                      {name}
                    </option>
                  ))
                ) : (
                  <>
                    <option value="STOS">Single Trip Oversize (STOS)</option>
                    <option value="TROS">Trip Oversize (TROS)</option>
                    <option value="LCV">Long Combination Vehicle (LCV)</option>
                  </>
                )}
              </select>
            </div>

            <CompanyInformationSection
              data={companyData}
              onChange={handleChange}
              isCollapsed={collapsedSections.has('company')}
              onToggleCollapse={() => toggleSection('company')}
            />

            <ContactDetailsSection
              data={contactData}
              onChange={handleChange}
              isCollapsed={collapsedSections.has('contact')}
              onToggleCollapse={() => toggleSection('contact')}
            />

            <MailingAddressSection
              data={mailingData}
              onChange={handleChange}
              isCollapsed={collapsedSections.has('mailing')}
              onToggleCollapse={() => toggleSection('mailing')}
            />

            <VehicleDetailsSection
              data={vehicleData}
              onChange={handleChange}
              isCollapsed={collapsedSections.has('vehicle')}
              onToggleCollapse={() => toggleSection('vehicle')}
              vehicleSubTypes={vehicleSubTypes}
            />

            <TripDetailsSection
              data={tripData}
              onChange={handleChange}
              isCollapsed={collapsedSections.has('trip')}
              onToggleCollapse={() => toggleSection('trip')}
            />

            <PermittedRouteSection
              data={routeData}
              onChange={handleChange}
              isCollapsed={collapsedSections.has('route')}
              onToggleCollapse={() => toggleSection('route')}
            />

            {showVehicleConfig && (
              <VehicleConfigurationSection
                data={vehicleConfigData}
                onChange={handleChange}
                isCollapsed={collapsedSections.has('vehicleConfig')}
                onToggleCollapse={() => toggleSection('vehicleConfig')}
                showSizeDimensions={showSizeDimensions}
                showWeightDimensions={showWeightDimensions}
                selectedTrailers={selectedTrailers}
                onTrailerChange={handleTrailerChange}
                onRemoveTrailer={removeTrailer}
                trailerTypes={trailerTypes}
                commodityTypes={commodityTypes}
                axleConfigurations={axleConfigurations}
                onAxleConfigurationChange={handleAxleConfigurationChange}
              />
            )}
          </div>

          <div className="form-actions">
            <button type="submit" className="submit-btn">
              Validate Permit
            </button>
          </div>
        </form>
      </div>

      <div className="right-column">
        {validationResults && (
          <ValidationResultsDisplay 
            results={validationResults} 
            permitType={formData.permitType} 
            permitApplication={permitApplication || formData}
          />
        )}
      </div>
    </div>
  )
}

export default PermitForm
export type { PermitFormData }
