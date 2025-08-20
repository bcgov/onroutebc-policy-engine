import { useState, useEffect, useMemo } from 'react'
import { Policy } from 'onroute-policy-engine'

interface UsePolicyDataProps {
  policy?: Policy | null
}

export const usePolicyData = ({ policy }: UsePolicyDataProps) => {
  const [permitTypes, setPermitTypes] = useState<Array<[string, string]>>([])
  const [trailerTypes, setTrailerTypes] = useState<Array<[string, string]>>([])
  const [commodityTypes, setCommodityTypes] = useState<Array<[string, string]>>([])

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
      } catch (error) {
        console.error('Failed to get permit types:', error)
      }
    }
  }, [policy])

  // Memoized functions for getting policy data
  const getPermitTypeDefinition = useMemo(() => {
    return (permitType: string) => {
      if (!policy) return null
      try {
        return policy.getPermitTypeDefinition(permitType)
      } catch (error) {
        console.error('Failed to get permit type definition:', error)
        return null
      }
    }
  }, [policy])

  const getVehicleSubTypes = useMemo(() => {
    return (vehicleType: string) => {
      if (!policy) return []
      try {
        let subTypes: Array<[string, string]> = []
        if (vehicleType === 'powerUnit') {
          subTypes = Array.from(policy.getPowerUnitTypes().entries())
        } else if (vehicleType === 'trailer') {
          subTypes = Array.from(policy.getTrailerTypes().entries())
        }
        return subTypes
      } catch (error) {
        console.error('Failed to get vehicle sub-types:', error)
        return []
      }
    }
  }, [policy])

  return {
    permitTypes,
    trailerTypes,
    commodityTypes,
    getPermitTypeDefinition,
    getVehicleSubTypes
  }
}
