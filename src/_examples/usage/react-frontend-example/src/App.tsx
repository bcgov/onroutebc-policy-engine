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

  const handleLocalValidation = async (permitData: any) => {
    if (!policy) return

    try {
      const permitApplication = {
        permitType: permitData.permitType,
        permitData: {
          ...permitData,
          startDate: dayjs().format(PermitAppInfo.PermitDateFormat.toString())
        }
      }

      const results = await policy.validate(permitApplication)
      setValidationResults(results)
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
            
            <PermitForm onSubmit={handleValidation} />
            {validationResults && (
              <ValidationResultsDisplay results={validationResults} />
            )}
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
