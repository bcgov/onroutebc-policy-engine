import { useState } from 'react'
import { Policy } from 'onroute-policy-engine'
import { useFormCore } from './useFormCore'
import { usePolicyData } from './usePolicyData'
import { useFormSections } from './useFormSections'
import { useVehicleConfiguration } from './useVehicleConfiguration'
import { useFormWatchers } from './useFormWatchers'
import { useSampleData } from './useSampleData'

interface UsePermitFormProps {
  policy?: Policy | null
  onSubmit: (permitData: any) => void
}

export const usePermitForm = ({ policy, onSubmit }: UsePermitFormProps) => {
  // State for UI visibility
  const [showVehicleConfig, setShowVehicleConfig] = useState(false)
  const [showSizeDimensions, setShowSizeDimensions] = useState(false)
  const [showWeightDimensions, setShowWeightDimensions] = useState(false)
  const [vehicleSubTypes, setVehicleSubTypes] = useState<Array<[string, string]>>([])

  // Initialize hooks
  const { permitTypes, trailerTypes, commodityTypes, getPermitTypeDefinition, getVehicleSubTypes } = usePolicyData({ policy })
  const { collapsedSections, setCollapsedSections, toggleSection } = useFormSections()
  const {
    selectedTrailers,
    axleConfigurations,
    handleTrailerChange,
    removeTrailer,
    handleAxleConfigurationChange,
    setTrailersFromData,
    setAxleConfigurationsFromData
  } = useVehicleConfiguration()

  // Initialize form core
  const { form, expandSectionsWithErrors } = useFormCore({
    onSubmit,
    selectedTrailers,
    axleConfigurations
  })

  // Initialize sample data loading
  const { loadSampleData } = useSampleData({
    form,
    policy,
    getVehicleSubTypes,
    setVehicleSubTypes,
    setTrailersFromData,
    setAxleConfigurationsFromData
  })

  // Initialize form watchers
  useFormWatchers({
    form,
    policy,
    getPermitTypeDefinition,
    getVehicleSubTypes,
    setVehicleSubTypes,
    setShowVehicleConfig,
    setShowSizeDimensions,
    setShowWeightDimensions,
    loadSampleData
  })

  // Override handleSubmit to include error expansion
  const handleFormSubmit = form.handleSubmit(
    // Success callback
    (data) => {
      onSubmit({
        ...data,
        selectedTrailers: selectedTrailers.filter(trailer => trailer && trailer.trim() !== ''),
        axleConfigurations: axleConfigurations
      })
    },
    // Error callback
    (errors) => {
      console.log('Form validation errors:', errors)
      expandSectionsWithErrors(errors, setCollapsedSections)
    }
  )

  return {
    form,
    handleSubmit: handleFormSubmit,
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
