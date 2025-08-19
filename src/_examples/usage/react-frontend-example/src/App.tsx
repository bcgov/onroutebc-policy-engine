import { useState, useEffect } from 'react'
import { Policy } from 'onroute-policy-engine'
import { ValidationResults } from 'onroute-policy-engine'
import { PermitAppInfo } from 'onroute-policy-engine/enum'
import dayjs from 'dayjs'
import PermitForm from './components/PermitForm'
import ValidationResultsDisplay from './components/ValidationResults'
import VehicleFontTest from './components/VehicleFontTest'
import './App.css'

const API_BASE_URL = 'http://localhost:3001/api/permits'

function App() {
  const [policy, setPolicy] = useState<Policy | null>(null)
  const [validationResults, setValidationResults] = useState<ValidationResults | null>(null)
  const [permitApplication, setPermitApplication] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'form' | 'font-test'>('form')
  const [validationMethod, setValidationMethod] = useState<'local' | 'api'>('local')

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
        setError(err instanceof Error ? err.message : 'Failed to initialize policy')
        setLoading(false)
      }
    }

    initializePolicy()
  }, [])

  const handleValidation = async (permitData: any) => {
    if (validationMethod === 'local') {
      await handleLocalValidation(permitData)
    } else {
      await handleApiValidation(permitData)
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

    try {
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
            countryCode: permitData.countryCode || 'CA',
            provinceCode: permitData.provinceCode || 'BC',
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
          
          // Legacy fields (keeping for backward compatibility)
          commodities: [], // Empty array for now
          feeSummary: null,
          permittedCommodity: null,
          vehicleConfiguration: null,
          permittedRoute: null
        })
      }

      const results = await policy.validate(permitApplication)
      setValidationResults(results)
      setPermitApplication(permitApplication)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Local validation failed')
    }
  }

  const handleApiValidation = async (permitData: any) => {
    try {
      const response = await fetch(`${API_BASE_URL}/validate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(permitData)
      })

      if (!response.ok) {
        throw new Error(`API validation failed: ${response.status}`)
      }

      const result = await response.json()
      if (!result.success) {
        throw new Error('API validation returned an error')
      }

      setValidationResults(result.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'API validation failed')
    }
  }

  if (loading) {
    return <div className="loading">Loading policy engine...</div>
  }

  if (error) {
    return <div className="error">Error: {error}</div>
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
