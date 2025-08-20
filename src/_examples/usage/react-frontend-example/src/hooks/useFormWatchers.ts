import { useWatch } from 'react-hook-form'
import { useEffect } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { PermitFormSchema } from '../validation/permitFormSchema'

interface UseFormWatchersProps {
  form: UseFormReturn<PermitFormSchema>
  policy: any
  getPermitTypeDefinition: (permitType: string) => any
  getVehicleSubTypes: (vehicleType: string) => Array<[string, string]>
  setVehicleSubTypes: (types: Array<[string, string]>) => void
  setShowVehicleConfig: (show: boolean) => void
  setShowSizeDimensions: (show: boolean) => void
  setShowWeightDimensions: (show: boolean) => void
  loadSampleData: (permitType: string) => void
}

export const useFormWatchers = ({
  form,
  policy,
  getPermitTypeDefinition,
  getVehicleSubTypes,
  setVehicleSubTypes,
  setShowVehicleConfig,
  setShowSizeDimensions,
  setShowWeightDimensions,
  loadSampleData
}: UseFormWatchersProps) => {
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

  // Handle permit type changes
  useEffect(() => {
    if (watchedPermitType && policy) {
      try {
        const permitTypeDefinition = getPermitTypeDefinition(watchedPermitType)
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
  }, [watchedPermitType, policy, getPermitTypeDefinition, setShowVehicleConfig, setShowSizeDimensions, setShowWeightDimensions, loadSampleData])

  // Handle vehicle type changes
  useEffect(() => {
    if (watchedVehicleType && policy) {
      try {
        const subTypes = getVehicleSubTypes(watchedVehicleType)
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
  }, [watchedVehicleType, policy, getVehicleSubTypes, form, setVehicleSubTypes])

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

  return {
    watchedPermitType,
    watchedVehicleType,
    watchedVehicleCountryCode,
    watchedCountryCode
  }
}
