import { useState, useEffect } from 'react'
import { Policy } from 'onroute-policy-engine'
import { ValidationResults, ValidationResult } from 'onroute-policy-engine'
import { PermitAppInfo } from 'onroute-policy-engine/enum'
import dayjs from 'dayjs'
import PermitForm from './components/PermitForm'
import VehicleFontTest from './components/VehicleFontTest'
import './App.css'

const API_BASE_URL = 'http://localhost:3001/api/permits'

function App() {
  const [policy, setPolicy] = useState<Policy | null>(null)
  const [validationResults, setValidationResults] = useState<ValidationResults | null>(null)
  const [permitApplication, setPermitApplication] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'form' | 'font-test'>('form')
  const [validationMethod, setValidationMethod] = useState<'local' | 'api'>('local')
  const [vehicleConfigVisible, setVehicleConfigVisible] = useState(false)

  useEffect(() => {
    const initializePolicy = async () => {
      try {
        // Fetch policy configuration from backend API
        const response = await fetch(`${API_BASE_URL}/config`)
        if (!response.ok) {
          throw new Error(`Failed to fetch policy config: ${response.status}`)
        }
        
        const result = await response.json()
        if (!result.success) {
          throw new Error('Failed to fetch policy configuration')
        }
        
        const policyInstance = new Policy(result.data)
        setPolicy(policyInstance)
        setLoading(false)
      } catch (err) {
        // Don't set error state, just log it and set loading to false
        console.error('Failed to initialize policy:', err)
        setLoading(false)
      }
    }

    initializePolicy()
  }, [])

  const handleValidation = async (permitData: any) => {
    console.debug('🔍 handleValidation called with validationMethod:', validationMethod)
    if (validationMethod === 'local') {
      console.debug('📋 Using local validation')
      await handleLocalValidation(permitData)
    } else {
      console.debug('🌐 Using API validation')
      await handleApiValidation(permitData)
    }
  }

  // Helper function to build vehicle configuration data conditionally
  const buildVehicleConfiguration = (permitData: any) => {
    if (!vehicleConfigVisible) {
      return null
    }
    
    return {
      overallLength: permitData.overallLength ? parseFloat(permitData.overallLength) : null,
      overallWidth: permitData.overallWidth ? parseFloat(permitData.overallWidth) : null,
      overallHeight: permitData.overallHeight ? parseFloat(permitData.overallHeight) : null,
      frontProjection: permitData.frontProjection ? parseFloat(permitData.frontProjection) : null,
      rearProjection: permitData.rearProjection ? parseFloat(permitData.rearProjection) : null,
      loadedGVW: permitData.loadedGVW ? parseFloat(permitData.loadedGVW) : null,
      netWeight: permitData.netWeight ? parseFloat(permitData.netWeight) : null,
      axleConfiguration: permitData.axleConfigurations ? permitData.axleConfigurations
        .map((axleConfig: any) => ({
          numberOfAxles: axleConfig.numberOfAxles ? parseInt(axleConfig.numberOfAxles) : null,
          axleSpread: axleConfig.axleSpread ? parseFloat(axleConfig.axleSpread) : null,
          interaxleSpacing: axleConfig.interaxleSpacing ? parseFloat(axleConfig.interaxleSpacing) : null,
          axleUnitWeight: axleConfig.axleUnitWeight ? parseFloat(axleConfig.axleUnitWeight) : null,
          numberOfTires: axleConfig.numberOfTires ? parseInt(axleConfig.numberOfTires) : null,
          tireSize: axleConfig.tireSize ? parseFloat(axleConfig.tireSize) : null
        }))
        .filter((axleConfig: any) => axleConfig.numberOfAxles !== null) : [],
      trailers: permitData.selectedTrailers ? permitData.selectedTrailers
        .filter((trailer: string) => trailer && trailer.trim() !== '')
        .map((trailerType: string) => ({
          vehicleSubType: trailerType
        })) : []
    }
  }

  // Helper function to remove null and empty string properties recursively
  const removeEmptyProperties = (obj: any): any => {
    if (obj === null || obj === undefined) {
      return undefined
    }
    
    if (typeof obj === 'string') {
      return obj.trim() === '' ? undefined : obj
    }
    
    if (Array.isArray(obj)) {
      return obj.map(removeEmptyProperties).filter(item => item !== undefined)
    }
    
    if (typeof obj === 'object') {
      const cleaned: any = {}
      for (const [key, value] of Object.entries(obj)) {
        const cleanedValue = removeEmptyProperties(value)
        if (cleanedValue !== undefined) {
          cleaned[key] = cleanedValue
        }
      }
      return Object.keys(cleaned).length > 0 ? cleaned : undefined
    }
    
    return obj
  }

  const handleLocalValidation = async (permitData: any) => {
    if (!policy) return

    // Structure the data according to PermitApplication type
    const permitApplication = {
      permitType: permitData.permitType,
      permitData: removeEmptyProperties({
        // Company Information
        companyName: permitData.companyName,
        doingBusinessAs: permitData.doingBusinessAs || null,
        clientNumber: permitData.clientNumber,
        permitDuration: permitData.permitDuration,
        
        // Contact Details
        contactDetails: {
          firstName: permitData.firstName,
          lastName: permitData.lastName,
          phone1: permitData.phone1,
          phone1Extension: permitData.phone1Extension || null,
          phone2: permitData.phone2 || null,
          phone2Extension: permitData.phone2Extension || null,
          email: permitData.email,
          additionalEmail: permitData.additionalEmail || null,
          fax: permitData.fax || null
        },
        
        // Mailing Address
        mailingAddress: {
          addressLine1: permitData.addressLine1,
          addressLine2: permitData.addressLine2 || null,
          city: permitData.city,
          provinceCode: permitData.provinceCode,
          countryCode: permitData.countryCode,
          postalCode: permitData.postalCode
        },
        
        // Vehicle Details
        vehicleDetails: {
          vehicleId: permitData.vehicleId || null,
          unitNumber: permitData.unitNumber || null,
          vin: permitData.vin,
          plate: permitData.plate,
          make: permitData.make || null,
          year: permitData.year ? parseInt(permitData.year) : null,
          countryCode: permitData.vehicleCountryCode || 'CA',
          provinceCode: permitData.vehicleProvinceCode || 'BC',
          vehicleType: permitData.vehicleType,
          vehicleSubType: permitData.vehicleSubType,
          licensedGVW: permitData.licensedGVW ? parseInt(permitData.licensedGVW) : null,
          saveVehicle: permitData.saveVehicle || null
        },
        
        // Dates
        startDate: permitData.startDate || dayjs().format(PermitAppInfo.PermitDateFormat.toString()),
        expiryDate: permitData.expiryDate || null,
        
        // Additional fields
        applicationNotes: permitData.applicationNotes || null,
        thirdPartyLiability: permitData.thirdPartyLiability || null,
        conditionalLicensingFee: permitData.conditionalLicensingFee || null,
        
        // Permitted Route
        permittedRoute: {
          manualRoute: {
            highwaySequence: permitData.highwaySequence 
              ? permitData.highwaySequence.split(',').map((h: string) => h.trim()).filter((h: string) => h.length > 0)
              : [],
            origin: permitData.routeOrigin,
            destination: permitData.routeDestination,
            exitPoint: permitData.routeExitPoint || null,
            totalDistance: permitData.routeTotalDistance ? parseFloat(permitData.routeTotalDistance) : null
          },
          routeDetails: null
        },
        
        // Vehicle Configuration
        vehicleConfiguration: buildVehicleConfiguration(permitData),
        
        // Legacy fields (keeping for backward compatibility)
        commodities: [], // Empty array for now
        feeSummary: null,
        permittedCommodity: permitData.commodityType || permitData.loadDescription ? {
          commodityType: permitData.commodityType || null,
          loadDescription: permitData.loadDescription || null
        } : null
      })
    }

    try {
      const results = await policy.validate(permitApplication)
      setValidationResults(results)
      setPermitApplication(permitApplication)
    } catch (err) {
      // Create a validation results object with an error message
      const errorMessage = err instanceof Error ? err.message : 'Local validation failed'
      const errorResults = new ValidationResults()
      errorResults.violations.push(new ValidationResult('violation', 'LOCAL_VALIDATION_ERROR', errorMessage))
      setValidationResults(errorResults)
      setPermitApplication(permitApplication)
    }
  }

  const handleApiValidation = async (permitData: any) => {
    console.debug('🚀 handleApiValidation called')
    // Structure the data according to PermitApplication type (same as local validation)
    const permitApplication = {
      permitType: permitData.permitType,
      permitData: removeEmptyProperties({
        // Company Information
        companyName: permitData.companyName,
        doingBusinessAs: permitData.doingBusinessAs || null,
        clientNumber: permitData.clientNumber,
        permitDuration: permitData.permitDuration,
        
        // Contact Details
        contactDetails: {
          firstName: permitData.firstName,
          lastName: permitData.lastName,
          phone1: permitData.phone1,
          phone1Extension: permitData.phone1Extension || null,
          phone2: permitData.phone2 || null,
          phone2Extension: permitData.phone2Extension || null,
          email: permitData.email,
          additionalEmail: permitData.additionalEmail || null,
          fax: permitData.fax || null
        },
        
        // Mailing Address
        mailingAddress: {
          addressLine1: permitData.addressLine1,
          addressLine2: permitData.addressLine2 || null,
          city: permitData.city,
          provinceCode: permitData.provinceCode,
          countryCode: permitData.countryCode,
          postalCode: permitData.postalCode
        },
        
        // Vehicle Details
        vehicleDetails: {
          vehicleId: permitData.vehicleId || null,
          unitNumber: permitData.unitNumber || null,
          vin: permitData.vin,
          plate: permitData.plate,
          make: permitData.make || null,
          year: permitData.year ? parseInt(permitData.year) : null,
          countryCode: permitData.vehicleCountryCode || 'CA',
          provinceCode: permitData.vehicleProvinceCode || 'BC',
          vehicleType: permitData.vehicleType,
          vehicleSubType: permitData.vehicleSubType,
          licensedGVW: permitData.licensedGVW ? parseInt(permitData.licensedGVW) : null,
          saveVehicle: permitData.saveVehicle || null
        },
        
        // Dates
        startDate: permitData.startDate || dayjs().format(PermitAppInfo.PermitDateFormat.toString()),
        expiryDate: permitData.expiryDate || null,
        
        // Additional fields
        applicationNotes: permitData.applicationNotes || null,
        thirdPartyLiability: permitData.thirdPartyLiability || null,
        conditionalLicensingFee: permitData.conditionalLicensingFee || null,
        
        // Permitted Route
        permittedRoute: {
          manualRoute: {
            highwaySequence: permitData.highwaySequence 
              ? permitData.highwaySequence.split(',').map((h: string) => h.trim()).filter((h: string) => h.length > 0)
              : [],
            origin: permitData.routeOrigin,
            destination: permitData.routeDestination,
            exitPoint: permitData.routeExitPoint || null,
            totalDistance: permitData.routeTotalDistance ? parseFloat(permitData.routeTotalDistance) : null
          },
          routeDetails: null
        },
        
        // Vehicle Configuration
        vehicleConfiguration: buildVehicleConfiguration(permitData),
        
        // Legacy fields (keeping for backward compatibility)
        commodities: [], // Empty array for now
        feeSummary: null,
        permittedCommodity: permitData.commodityType || permitData.loadDescription ? {
          commodityType: permitData.commodityType || null,
          loadDescription: permitData.loadDescription || null
        } : null
      })
    }

    // Let the wrapper handle all errors and return proper ValidationResults
    console.debug('📤 About to call validateWithApi with permitApplication:', permitApplication)
    const results = await validateWithApi(permitApplication)
    console.debug('📥 validateWithApi returned results:', results)
    setValidationResults(results)
    setPermitApplication(permitApplication)
  }

  // Wrapper method for API validation that handles errors consistently
  const validateWithApi = async (permitApplication: any): Promise<ValidationResults> => {
    console.debug('🔗 validateWithApi called - making API request to:', `${API_BASE_URL}/validate`)
    try {
      const response = await fetch(`${API_BASE_URL}/validate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(permitApplication)
      })

      const result = await response.json()
      console.debug('📡 API Response status:', response.status, 'Response body:', result)
      
      if (!response.ok) {
        // Handle HTTP error responses
        console.debug('❌ HTTP Error - Status:', response.status, 'Error:', result.error)
        const errorMessage = result.error || `API validation failed: ${response.status}`
        const errorResults = new ValidationResults()
        errorResults.violations.push(new ValidationResult('violation', 'API_ERROR', errorMessage))
        return errorResults
      }

      if (!result.success) {
        // Handle API error responses (success: false)
        console.debug('❌ API Error - success: false, Error:', result.error)
        const errorMessage = result.error || 'API validation returned an error'
        const errorResults = new ValidationResults()
        errorResults.violations.push(new ValidationResult('violation', 'API_ERROR', errorMessage))
        return errorResults
      }

      console.debug('✅ API Success - returning result.data')
      return result.data
    } catch (err) {
      // Handle network or parsing errors
      console.debug('💥 Network/parsing error:', err)
      const errorMessage = err instanceof Error ? err.message : 'API validation failed'
      const errorResults = new ValidationResults()
      errorResults.violations.push(new ValidationResult('violation', 'API_ERROR', errorMessage))
      return errorResults
    }
  }

  if (loading) {
    return <div className="loading">Loading policy engine...</div>
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>onRouteBC Policy Engine - React Example</h1>
        <nav className="nav-tabs">
          <button 
            className={activeTab === 'form' ? 'active' : ''} 
            onClick={() => setActiveTab('form')}
          >
            Permit Application
          </button>
          <button 
            className={activeTab === 'font-test' ? 'active' : ''} 
            onClick={() => setActiveTab('font-test')}
          >
            Vehicle Font Test
          </button>
        </nav>
      </header>

      <main className="app-main">
        {activeTab === 'form' ? (
          <div className="form-container">
            <div className="validation-method-selector">
              <label>
                <input
                  type="radio"
                  name="validationMethod"
                  value="local"
                  checked={validationMethod === 'local'}
                  onChange={(e) => setValidationMethod(e.target.value as 'local' | 'api')}
                />
                Local Validation (Policy Engine)
              </label>
              <label>
                <input
                  type="radio"
                  name="validationMethod"
                  value="api"
                  checked={validationMethod === 'api'}
                  onChange={(e) => setValidationMethod(e.target.value as 'local' | 'api')}
                />
                API Validation (Backend)
              </label>
            </div>
            
                         <PermitForm 
               onSubmit={handleValidation} 
               validationResults={validationResults} 
               policy={policy}
               permitApplication={permitApplication}
               onVehicleConfigVisibilityChange={setVehicleConfigVisible}
             />
          </div>
        ) : (
          <div className="font-test-container">
            <VehicleFontTest policy={policy} />
          </div>
        )}
      </main>
    </div>
  )
}

export default App
