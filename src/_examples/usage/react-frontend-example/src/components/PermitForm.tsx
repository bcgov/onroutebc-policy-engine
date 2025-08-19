import React, { useState, useEffect } from 'react'
import { ValidationResults, Policy } from 'onroute-policy-engine'
import ValidationResultsDisplay from './ValidationResults'
import './PermitForm.css'

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
  const [axleConfigurations, setAxleConfigurations] = useState<Array<{
    numberOfAxles: string;
    axleSpread: string;
    interaxleSpacing: string;
    axleUnitWeight: string;
    numberOfTires: string;
    tireSize: string;
  }>>([
    { numberOfAxles: '', axleSpread: '', interaxleSpacing: '', axleUnitWeight: '', numberOfTires: '', tireSize: '' },
    { numberOfAxles: '', axleSpread: '', interaxleSpacing: '', axleUnitWeight: '', numberOfTires: '', tireSize: '' }
  ])
  
  const [formData, setFormData] = useState({
    permitType: 'TROS',
    companyName: '',
    doingBusinessAs: '',
    clientNumber: '',
    permitDuration: 1,
    startDate: '',
    expiryDate: '',
    applicationNotes: '',
    thirdPartyLiability: '',
    conditionalLicensingFee: '',
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
    saveVehicle: false,
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
      loadedGVW: '',
      netWeight: '',
      commodityType: '',
      loadDescription: '',
    // Legacy fields (keeping for backward compatibility)
    origin: '',
    destination: '',
    commodity: 'EMPTYXX',
    powerUnitType: 'TRKTRAC',
    trailerType: 'PLATFRM',
    description: ''
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
    try {
      const response = await fetch(`/sample-applications/${permitType}.json`)
      if (!response.ok) {
        console.warn(`No sample data found for permit type: ${permitType}`)
        return
      }
      
      const sampleData = await response.json()
      const permitData = sampleData.permitData
      
             // Map sample data to form fields
       const newFormData = {
         ...formData,
         permitType: permitType, // Keep the selected permit type, don't override with sample data
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
        loadedGVW: permitData.vehicleConfiguration?.loadedGVW?.toString() || '',
        netWeight: permitData.vehicleConfiguration?.netWeight?.toString() || '',
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
        
        const newAxleConfigs = []
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
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
              onChange={handleChange}
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

          {/* Company Information Section */}
          <div className="form-section">
            <h3 
              className={`section-header clickable ${!collapsedSections.has('company') ? 'expanded' : ''}`}
              onClick={() => toggleSection('company')}
            >
              Company Information
              <span className={`section-arrow ${collapsedSections.has('company') ? 'collapsed' : 'expanded'}`}>
                ▼
              </span>
            </h3>
            {!collapsedSections.has('company') && (
              <>
                <div className="form-group">
                  <label htmlFor="companyName">Company Name:</label>
                  <input
                    type="text"
                    id="companyName"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    placeholder="Enter company name"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="doingBusinessAs">Doing Business As:</label>
                  <input
                    type="text"
                    id="doingBusinessAs"
                    name="doingBusinessAs"
                    value={formData.doingBusinessAs}
                    onChange={handleChange}
                    placeholder="Enter DBA name (optional)"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="clientNumber">Client Number:</label>
                  <input
                    type="text"
                    id="clientNumber"
                    name="clientNumber"
                    value={formData.clientNumber}
                    onChange={handleChange}
                    placeholder="Enter client number"
                  />
                </div>
              </>
            )}
          </div>

          {/* Contact Details Section */}
          <div className="form-section">
            <h3 
              className={`section-header clickable ${!collapsedSections.has('contact') ? 'expanded' : ''}`}
              onClick={() => toggleSection('contact')}
            >
              Contact Details
              <span className={`section-arrow ${collapsedSections.has('contact') ? 'collapsed' : 'expanded'}`}>
                ▼
              </span>
            </h3>
            {!collapsedSections.has('contact') && (
              <>
                <div className="form-group">
                  <label htmlFor="firstName">First Name:</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="Enter first name"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="lastName">Last Name:</label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Enter last name"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="phone1">Phone 1:</label>
                  <input
                    type="tel"
                    id="phone1"
                    name="phone1"
                    value={formData.phone1}
                    onChange={handleChange}
                    placeholder="Enter primary phone number"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="phone1Extension">Phone 1 Extension:</label>
                  <input
                    type="text"
                    id="phone1Extension"
                    name="phone1Extension"
                    value={formData.phone1Extension}
                    onChange={handleChange}
                    placeholder="Enter extension (optional)"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="phone2">Phone 2:</label>
                  <input
                    type="tel"
                    id="phone2"
                    name="phone2"
                    value={formData.phone2}
                    onChange={handleChange}
                    placeholder="Enter secondary phone number (optional)"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="phone2Extension">Phone 2 Extension:</label>
                  <input
                    type="text"
                    id="phone2Extension"
                    name="phone2Extension"
                    value={formData.phone2Extension}
                    onChange={handleChange}
                    placeholder="Enter extension (optional)"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email:</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter email address"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="additionalEmail">Additional Email:</label>
                  <input
                    type="email"
                    id="additionalEmail"
                    name="additionalEmail"
                    value={formData.additionalEmail}
                    onChange={handleChange}
                    placeholder="Enter additional email (optional)"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="fax">Fax:</label>
                  <input
                    type="tel"
                    id="fax"
                    name="fax"
                    value={formData.fax}
                    onChange={handleChange}
                    placeholder="Enter fax number (optional)"
                  />
                </div>
              </>
            )}
          </div>

          {/* Mailing Address Section */}
          <div className="form-section">
            <h3 
              className={`section-header clickable ${!collapsedSections.has('mailing') ? 'expanded' : ''}`}
              onClick={() => toggleSection('mailing')}
            >
              Mailing Address
              <span className={`section-arrow ${collapsedSections.has('mailing') ? 'collapsed' : 'expanded'}`}>
                ▼
              </span>
            </h3>
            {!collapsedSections.has('mailing') && (
              <>
                <div className="form-group">
                  <label htmlFor="addressLine1">Address Line 1:</label>
                  <input
                    type="text"
                    id="addressLine1"
                    name="addressLine1"
                    value={formData.addressLine1}
                    onChange={handleChange}
                    placeholder="Enter address line 1"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="addressLine2">Address Line 2:</label>
                  <input
                    type="text"
                    id="addressLine2"
                    name="addressLine2"
                    value={formData.addressLine2}
                    onChange={handleChange}
                    placeholder="Enter address line 2 (optional)"
                  />
                </div>

                                 <div className="form-group">
                   <label htmlFor="city">City:</label>
                   <input
                     type="text"
                     id="city"
                     name="city"
                     value={formData.city}
                     onChange={handleChange}
                     placeholder="Enter city"
                   />
                 </div>

                                   <div className="form-group">
                    <label htmlFor="countryCode">Country:</label>
                    <select
                      id="countryCode"
                      name="countryCode"
                      value={formData.countryCode}
                      onChange={handleChange}
                    >
                      <option value="">Select a country...</option>
                      <option value="CA">Canada</option>
                      <option value="US">United States</option>
                      <option value="MX">Mexico</option>
                      <option value="XX">Other</option>
                    </select>
                  </div>

                                   {formData.countryCode !== 'MX' && formData.countryCode !== 'XX' && (
                    <div className="form-group">
                      <label htmlFor="provinceCode">Province or State:</label>
                      <input
                        type="text"
                        id="provinceCode"
                        name="provinceCode"
                        value={formData.provinceCode}
                        onChange={handleChange}
                        placeholder="Enter province or state"
                      />
                    </div>
                  )}

                <div className="form-group">
                  <label htmlFor="postalCode">Postal Code:</label>
                  <input
                    type="text"
                    id="postalCode"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleChange}
                    placeholder="Enter postal code"
                  />
                </div>
              </>
            )}
          </div>

          {/* Trip Details Section */}
          <div className="form-section">
            <h3 
              className={`section-header clickable ${!collapsedSections.has('trip') ? 'expanded' : ''}`}
              onClick={() => toggleSection('trip')}
            >
              Trip Details
              <span className={`section-arrow ${collapsedSections.has('trip') ? 'collapsed' : 'expanded'}`}>
                ▼
              </span>
            </h3>
            {!collapsedSections.has('trip') && (
              <>
                <div className="form-group">
                  <label htmlFor="permitDuration">Permit Duration (days):</label>
                  <input
                    type="number"
                    id="permitDuration"
                    name="permitDuration"
                    value={formData.permitDuration}
                    onChange={handleChange}
                    min="1"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="startDate">Start Date:</label>
                  <input
                    type="date"
                    id="startDate"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="expiryDate">Expiry Date:</label>
                  <input
                    type="date"
                    id="expiryDate"
                    name="expiryDate"
                    value={formData.expiryDate}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="origin">Origin:</label>
                  <input
                    type="text"
                    id="origin"
                    name="origin"
                    value={formData.origin}
                    onChange={handleChange}
                    placeholder="Enter origin location"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="destination">Destination:</label>
                  <input
                    type="text"
                    id="destination"
                    name="destination"
                    value={formData.destination}
                    onChange={handleChange}
                    placeholder="Enter destination location"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="commodity">Commodity:</label>
                  <select
                    id="commodity"
                    name="commodity"
                    value={formData.commodity}
                    onChange={handleChange}
                  >
                    <option value="EMPTYXX">Empty</option>
                    <option value="GENERAL">General Freight</option>
                    <option value="HEAVY">Heavy Equipment</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="description">Description:</label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Describe the load being transported"
                    rows={3}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="applicationNotes">Application Notes:</label>
                  <textarea
                    id="applicationNotes"
                    name="applicationNotes"
                    value={formData.applicationNotes}
                    onChange={handleChange}
                    placeholder="Enter application notes"
                    rows={3}
                  />
                </div>

                                 <div className="form-group">
                   <label htmlFor="thirdPartyLiability">Third Party Liability:</label>
                   <select
                     id="thirdPartyLiability"
                     name="thirdPartyLiability"
                     value={formData.thirdPartyLiability}
                     onChange={handleChange}
                   >
                     <option value="">Select a third party liability option...</option>
                     <option value="GENERAL_GOODS">General Goods</option>
                     <option value="DANGEROUS_GOODS">Dangerous Goods</option>
                   </select>
                 </div>

                <div className="form-group">
                  <label htmlFor="conditionalLicensingFee">Conditional Licensing Fee:</label>
                  <input
                    type="text"
                    id="conditionalLicensingFee"
                    name="conditionalLicensingFee"
                    value={formData.conditionalLicensingFee}
                    onChange={handleChange}
                    placeholder="Enter conditional licensing fee"
                  />
                </div>
              </>
            )}
          </div>

          {/* Vehicle Details Section */}
          <div className="form-section">
            <h3 
              className={`section-header clickable ${!collapsedSections.has('vehicle') ? 'expanded' : ''}`}
              onClick={() => toggleSection('vehicle')}
            >
              Vehicle Details
              <span className={`section-arrow ${collapsedSections.has('vehicle') ? 'collapsed' : 'expanded'}`}>
                ▼
              </span>
            </h3>
            {!collapsedSections.has('vehicle') && (
              <>
                <div className="form-group">
                  <label htmlFor="vehicleType">Vehicle Type:</label>
                  <select
                    id="vehicleType"
                    name="vehicleType"
                    value={formData.vehicleType}
                    onChange={handleChange}
                  >
                    <option value="">Select a vehicle type...</option>
                    <option value="powerUnit">Power Unit</option>
                    <option value="trailer">Trailer</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="vehicleSubType">Vehicle Sub-Type:</label>
                  <select
                    id="vehicleSubType"
                    name="vehicleSubType"
                    value={formData.vehicleSubType}
                    onChange={handleChange}
                  >
                    <option value="">Select a vehicle sub-type...</option>
                    {vehicleSubTypes.map(([id, name]) => (
                      <option key={id} value={id}>
                        {name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="unitNumber">Unit Number:</label>
                  <input
                    type="text"
                    id="unitNumber"
                    name="unitNumber"
                    value={formData.unitNumber}
                    onChange={handleChange}
                    placeholder="Enter unit number (optional)"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="vin">VIN:</label>
                  <input
                    type="text"
                    id="vin"
                    name="vin"
                    value={formData.vin}
                    onChange={handleChange}
                    placeholder="Enter VIN"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="plate">License Plate:</label>
                  <input
                    type="text"
                    id="plate"
                    name="plate"
                    value={formData.plate}
                    onChange={handleChange}
                    placeholder="Enter license plate"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="make">Make:</label>
                  <input
                    type="text"
                    id="make"
                    name="make"
                    value={formData.make}
                    onChange={handleChange}
                    placeholder="Enter vehicle make (optional)"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="year">Year:</label>
                  <input
                    type="number"
                    id="year"
                    name="year"
                    value={formData.year}
                    onChange={handleChange}
                    placeholder="Enter vehicle year (optional)"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="licensedGVW">Licensed GVW:</label>
                  <input
                    type="number"
                    id="licensedGVW"
                    name="licensedGVW"
                    value={formData.licensedGVW}
                    onChange={handleChange}
                    placeholder="Enter licensed GVW (optional)"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="vehicleCountryCode">Country of Registration:</label>
                  <select
                    id="vehicleCountryCode"
                    name="vehicleCountryCode"
                    value={formData.vehicleCountryCode}
                    onChange={handleChange}
                  >
                    <option value="CA">Canada</option>
                    <option value="US">United States</option>
                    <option value="MX">Mexico</option>
                    <option value="XX">Other</option>
                  </select>
                </div>

                {formData.vehicleCountryCode !== 'MX' && formData.vehicleCountryCode !== 'XX' && (
                  <div className="form-group">
                    <label htmlFor="vehicleProvinceCode">Province / State of Registration:</label>
                    <input
                      type="text"
                      id="vehicleProvinceCode"
                      name="vehicleProvinceCode"
                      value={formData.vehicleProvinceCode}
                      onChange={handleChange}
                      placeholder="Enter province or state"
                    />
                  </div>
                )}
              </>
            )}
          </div>

          {/* Permitted Route Section */}
          <div className="form-section">
            <h3 
              className={`section-header clickable ${!collapsedSections.has('route') ? 'expanded' : ''}`}
              onClick={() => toggleSection('route')}
            >
              Permitted Route
              <span className={`section-arrow ${collapsedSections.has('route') ? 'collapsed' : 'expanded'}`}>
                ▼
              </span>
            </h3>
            {!collapsedSections.has('route') && (
              <>
                <div className="form-group">
                  <label htmlFor="highwaySequence">Highway Sequence:</label>
                  <input
                    type="text"
                    id="highwaySequence"
                    name="highwaySequence"
                    value={formData.highwaySequence}
                    onChange={handleChange}
                    placeholder="Enter highway sequence (comma-separated)"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="routeOrigin">Origin:</label>
                  <input
                    type="text"
                    id="routeOrigin"
                    name="routeOrigin"
                    value={formData.routeOrigin}
                    onChange={handleChange}
                    placeholder="Enter route origin"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="routeDestination">Destination:</label>
                  <input
                    type="text"
                    id="routeDestination"
                    name="routeDestination"
                    value={formData.routeDestination}
                    onChange={handleChange}
                    placeholder="Enter route destination"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="routeExitPoint">Exit Point:</label>
                  <input
                    type="text"
                    id="routeExitPoint"
                    name="routeExitPoint"
                    value={formData.routeExitPoint}
                    onChange={handleChange}
                    placeholder="Enter exit point (optional)"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="routeTotalDistance">Total Distance (km):</label>
                  <input
                    type="number"
                    id="routeTotalDistance"
                    name="routeTotalDistance"
                    value={formData.routeTotalDistance}
                    onChange={handleChange}
                    placeholder="Enter total distance in kilometers"
                    min="0"
                    step="0.1"
                  />
                </div>
              </>
            )}
          </div>

          {/* Vehicle Configuration Section */}
          {showVehicleConfig && (
            <div className="form-section">
              <h3 
                className={`section-header clickable ${!collapsedSections.has('vehicleConfig') ? 'expanded' : ''}`}
                onClick={() => toggleSection('vehicleConfig')}
              >
                Vehicle Configuration
                <span className={`section-arrow ${collapsedSections.has('vehicleConfig') ? 'collapsed' : 'expanded'}`}>
                  ▼
                </span>
              </h3>
                                                           {!collapsedSections.has('vehicleConfig') && (
                  <>
                                        {/* Commodity Sub-section */}
                     <div style={{ marginBottom: '1rem', padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '4px', border: '1px solid #e9ecef' }}>
                       <h4 style={{ margin: '0 0 1rem 0', fontSize: '14px', fontWeight: '600', color: '#495057' }}>Commodity</h4>
                       <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                         <div className="form-group">
                           <label htmlFor="commodityType">Commodity Type:</label>
                           <select
                             id="commodityType"
                             name="commodityType"
                             value={formData.commodityType}
                             onChange={handleChange}
                           >
                             <option value="">Select a commodity type...</option>
                             {commodityTypes.map(([id, name]) => (
                               <option key={id} value={id}>
                                 {name}
                               </option>
                             ))}
                           </select>
                         </div>
                         <div className="form-group">
                           <label htmlFor="loadDescription">Load Description:</label>
                           <input
                             type="text"
                             id="loadDescription"
                             name="loadDescription"
                             value={formData.loadDescription}
                             onChange={handleChange}
                             placeholder="Enter load description"
                           />
                         </div>
                       </div>
                     </div>

                                        {/* Trailers Sub-section */}
                     <div style={{ marginBottom: '1rem', padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '4px', border: '1px solid #e9ecef' }}>
                      <h4 style={{ margin: '0 0 1rem 0', fontSize: '14px', fontWeight: '600', color: '#495057' }}>Trailers</h4>
                      {selectedTrailers.map((trailer, index) => (
                        <div key={index} className="form-group" style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                          <div style={{ flex: 1 }}>
                            <label htmlFor={`trailer-${index}`}>Trailer {index + 1}:</label>
                            <select
                              id={`trailer-${index}`}
                              value={trailer}
                              onChange={(e) => handleTrailerChange(index, e.target.value)}
                            >
                              <option value="">Select a trailer...</option>
                              {trailerTypes.map(([id, name]) => (
                                <option key={id} value={id}>
                                  {name}
                                </option>
                              ))}
                            </select>
                          </div>
                          {trailer && trailer.trim() !== '' && (
                            <button
                              type="button"
                              className="remove-trailer-btn"
                              onClick={() => removeTrailer(index)}
                              title="Remove trailer"
                              style={{ marginTop: '1.5rem' }}
                            >
                              ×
                            </button>
                          )}
                        </div>
                      ))}
                      
                      {/* Always show at least one trailer dropdown */}
                      {selectedTrailers.length === 0 && (
                        <div className="form-group" style={{ marginBottom: '0.5rem' }}>
                          <label htmlFor="trailer-0">Trailer 1:</label>
                          <select
                            id="trailer-0"
                            value=""
                            onChange={(e) => handleTrailerChange(0, e.target.value)}
                          >
                            <option value="">Select a trailer...</option>
                            {trailerTypes.map(([id, name]) => (
                              <option key={id} value={id}>
                                {name}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}
                    </div>

                   {/* Vehicle Configuration form elements will be added here */}
                   {showSizeDimensions && (
                     <>
                       <div className="form-group">
                         <label htmlFor="overallLength">Overall Length (m):</label>
                         <input
                           type="number"
                           id="overallLength"
                           name="overallLength"
                           value={formData.overallLength}
                           onChange={handleChange}
                           placeholder="Enter overall length in meters"
                           min="0"
                           step="0.01"
                         />
                       </div>

                       <div className="form-group">
                         <label htmlFor="overallWidth">Overall Width (m):</label>
                         <input
                           type="number"
                           id="overallWidth"
                           name="overallWidth"
                           value={formData.overallWidth}
                           onChange={handleChange}
                           placeholder="Enter overall width in meters"
                           min="0"
                           step="0.01"
                         />
                       </div>

                       <div className="form-group">
                         <label htmlFor="overallHeight">Overall Height (m):</label>
                         <input
                           type="number"
                           id="overallHeight"
                           name="overallHeight"
                           value={formData.overallHeight}
                           onChange={handleChange}
                           placeholder="Enter overall height in meters"
                           min="0"
                           step="0.01"
                         />
                       </div>

                       <div className="form-group">
                         <label htmlFor="frontProjection">Front Projection (m):</label>
                         <input
                           type="number"
                           id="frontProjection"
                           name="frontProjection"
                           value={formData.frontProjection}
                           onChange={handleChange}
                           placeholder="Enter front projection in meters"
                           min="0"
                           step="0.01"
                         />
                       </div>

                                               <div className="form-group">
                          <label htmlFor="rearProjection">Rear Projection (m):</label>
                          <input
                            type="number"
                            id="rearProjection"
                            name="rearProjection"
                            value={formData.rearProjection}
                            onChange={handleChange}
                            placeholder="Enter rear projection in meters"
                            min="0"
                            step="0.01"
                          />
                        </div>
                      </>
                    )}

                                         {/* Weight Dimensions */}
                     {showWeightDimensions && (
                       <>
                         <div className="form-group">
                           <label htmlFor="loadedGVW">Loaded GVW (kg):</label>
                           <input
                             type="number"
                             id="loadedGVW"
                             name="loadedGVW"
                             value={formData.loadedGVW}
                             onChange={handleChange}
                             placeholder="Enter loaded GVW in kilograms"
                             min="0"
                             step="0.01"
                           />
                         </div>

                         <div className="form-group">
                           <label htmlFor="netWeight">Net Weight (kg):</label>
                           <input
                             type="number"
                             id="netWeight"
                             name="netWeight"
                             value={formData.netWeight}
                             onChange={handleChange}
                             placeholder="Enter net weight in kilograms"
                             min="0"
                             step="0.01"
                           />
                         </div>
                       </>
                     )}

                     {/* Axle Configuration Sub-section */}
                     {showWeightDimensions && (
                       <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '4px', border: '1px solid #e9ecef' }}>
                         <h4 style={{ margin: '0 0 1rem 0', fontSize: '14px', fontWeight: '600', color: '#495057' }}>Axle Configuration</h4>
                         {axleConfigurations.map((axleConfig, index) => (
                           <div key={index} style={{ marginBottom: '1.5rem', padding: '1rem', backgroundColor: 'white', borderRadius: '4px', border: '1px solid #dee2e6' }}>
                             <h5 style={{ margin: '0 0 1rem 0', fontSize: '13px', fontWeight: '600', color: '#495057' }}>Axle Group {index + 1}</h5>
                             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                               <div className="form-group">
                                 <label htmlFor={`axle-${index}-numberOfAxles`}>Number of Axles:</label>
                                 <input
                                   type="number"
                                   id={`axle-${index}-numberOfAxles`}
                                   value={axleConfig.numberOfAxles}
                                   onChange={(e) => handleAxleConfigurationChange(index, 'numberOfAxles', e.target.value)}
                                   placeholder="Enter number of axles"
                                   min="1"
                                   step="1"
                                 />
                               </div>
                               <div className="form-group">
                                 <label htmlFor={`axle-${index}-axleSpread`}>Axle Spread (m):</label>
                                 <input
                                   type="number"
                                   id={`axle-${index}-axleSpread`}
                                   value={axleConfig.axleSpread}
                                   onChange={(e) => handleAxleConfigurationChange(index, 'axleSpread', e.target.value)}
                                   placeholder="Enter axle spread in meters"
                                   min="0"
                                   step="0.01"
                                 />
                               </div>
                               <div className="form-group">
                                 <label htmlFor={`axle-${index}-interaxleSpacing`}>Interaxle Spacing (m):</label>
                                 <input
                                   type="number"
                                   id={`axle-${index}-interaxleSpacing`}
                                   value={axleConfig.interaxleSpacing}
                                   onChange={(e) => handleAxleConfigurationChange(index, 'interaxleSpacing', e.target.value)}
                                   placeholder="Enter spacing from previous axle group"
                                   min="0"
                                   step="0.01"
                                 />
                               </div>
                               <div className="form-group">
                                 <label htmlFor={`axle-${index}-axleUnitWeight`}>Axle Unit Weight (kg):</label>
                                 <input
                                   type="number"
                                   id={`axle-${index}-axleUnitWeight`}
                                   value={axleConfig.axleUnitWeight}
                                   onChange={(e) => handleAxleConfigurationChange(index, 'axleUnitWeight', e.target.value)}
                                   placeholder="Enter axle unit weight in kilograms"
                                   min="0"
                                   step="0.01"
                                 />
                               </div>
                               <div className="form-group">
                                 <label htmlFor={`axle-${index}-numberOfTires`}>Number of Tires:</label>
                                 <input
                                   type="number"
                                   id={`axle-${index}-numberOfTires`}
                                   value={axleConfig.numberOfTires}
                                   onChange={(e) => handleAxleConfigurationChange(index, 'numberOfTires', e.target.value)}
                                   placeholder="Enter number of tires"
                                   min="1"
                                   step="1"
                                 />
                               </div>
                               <div className="form-group">
                                 <label htmlFor={`axle-${index}-tireSize`}>Tire Size:</label>
                                 <input
                                   type="number"
                                   id={`axle-${index}-tireSize`}
                                   value={axleConfig.tireSize}
                                   onChange={(e) => handleAxleConfigurationChange(index, 'tireSize', e.target.value)}
                                   placeholder="Enter tire size"
                                   min="0"
                                   step="0.01"
                                 />
                               </div>
                             </div>
                           </div>
                         ))}
                       </div>
                     )}
                 </>
               )}
            </div>
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
