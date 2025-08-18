import { Policy } from 'onroute-policy-engine'
import { ValidationResults } from 'onroute-policy-engine'
import { PermitAppInfo } from 'onroute-policy-engine/enum'
import dayjs from 'dayjs'

// Use require for JSON import to avoid TypeScript module resolution issues
const completePolicyConfig = require('../config/_current-config.json')

let policyInstance: Policy | null = null

// Initialize the policy engine
const initializePolicy = (): Policy => {
  if (!policyInstance) {
    try {
      policyInstance = new Policy(completePolicyConfig)
      console.log('Policy engine initialized successfully')
    } catch (error) {
      console.error('Failed to initialize policy engine:', error)
      throw new Error('Policy engine initialization failed')
    }
  }
  return policyInstance
}

// Validate a permit application
export const validatePermit = async (permitData: any): Promise<ValidationResults> => {
  const policy = initializePolicy()
  
  try {
    // Ensure the permit data has a start date
    const permitApplication = {
      ...permitData,
      permitData: {
        ...permitData.permitData,
        startDate: permitData.permitData?.startDate || dayjs().format(PermitAppInfo.PermitDateFormat.toString())
      }
    }
    
    console.log('Validating permit application', { 
      permitType: permitApplication.permitType,
      companyName: permitApplication.permitData?.companyName 
    })
    
    const results = await policy.validate(permitApplication)
    
    console.log('Permit validation completed', {
      violations: results.violations.length,
      warnings: results.warnings.length,
      cost: results.cost.length
    })
    
    return results
  } catch (error) {
    console.error('Permit validation failed:', error)
    throw error
  }
}

// Get available permit types
export const getPermitTypes = (): Map<string, string> => {
  const policy = initializePolicy()
  return policy.getPermitTypes()
}

// Get available power unit types
export const getPowerUnitTypes = (): Map<string, string> => {
  const policy = initializePolicy()
  return policy.getPowerUnitTypes()
}

// Get available trailer types
export const getTrailerTypes = (): Map<string, string> => {
  const policy = initializePolicy()
  return policy.getTrailerTypes()
}

// Get available commodities
export const getCommodities = (permitTypeId?: string): Map<string, string> => {
  const policy = initializePolicy()
  return policy.getCommodities(permitTypeId)
}

// Get next permittable vehicles
export const getNextPermittableVehicles = (
  permitTypeId: string,
  commodityId: string,
  currentConfiguration: string[]
): Map<string, string> => {
  const policy = initializePolicy()
  return policy.getNextPermittableVehicles(permitTypeId, commodityId, currentConfiguration)
}

// Get vehicle display code
export const getVehicleDisplayCode = (
  vehicleTypes: string[],
  axleConfigurations: Array<{ numberOfAxles: number; axleUnitWeight: number }>
): string => {
  const policy = initializePolicy()
  return policy.getVehicleDisplayCode(vehicleTypes, axleConfigurations)
}

// Get permit cost from validation results
export const getPermitCost = (validationResults: ValidationResults): number => {
  return validationResults.cost.reduce((total, costResult) => {
    return total + (costResult.cost || 0)
  }, 0)
}

// Get conditions for permit
export const getConditionsForPermit = (permit: any): Array<{ condition: string; description: string; link?: string }> => {
  const policy = initializePolicy()
  return policy.getConditionsForPermit(permit)
}
