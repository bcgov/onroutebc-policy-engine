import React from 'react'
import { useWatch } from 'react-hook-form'
import FormInput from './FormInput'
import FormSelect from './FormSelect'
import { COUNTRY_OPTIONS, PROVINCE_OPTIONS, US_STATE_OPTIONS, VEHICLE_TYPE_OPTIONS } from '../constants'

interface VehicleDetailsSectionProps {
  isCollapsed: boolean
  onToggleCollapse: () => void
  vehicleSubTypes: Array<[string, string]>
}

const VehicleDetailsSection: React.FC<VehicleDetailsSectionProps> = ({
  isCollapsed,
  onToggleCollapse,
  vehicleSubTypes
}) => {
  const { control } = useWatch()
  const watchedVehicleCountryCode = useWatch({
    control,
    name: 'vehicleCountryCode'
  })

  // Get appropriate state/province options based on country
  const getVehicleStateProvinceOptions = (countryCode: string) => {
    switch (countryCode) {
      case 'CA':
        return PROVINCE_OPTIONS
      case 'US':
        return US_STATE_OPTIONS
      default:
        return []
    }
  }

  const vehicleStateProvinceOptions = getVehicleStateProvinceOptions(watchedVehicleCountryCode)
  const vehicleStateProvinceLabel = watchedVehicleCountryCode === 'CA' ? 'Vehicle Province' : 
                                   watchedVehicleCountryCode === 'US' ? 'Vehicle State' : 
                                   'Vehicle Province or State'

  return (
    <div className="form-section">
      <h3 
        className={`section-header clickable ${!isCollapsed ? 'expanded' : ''}`}
        onClick={onToggleCollapse}
      >
        Vehicle Details
        <span className={`section-arrow ${isCollapsed ? 'collapsed' : 'expanded'}`}>
          ▼
        </span>
      </h3>
      {!isCollapsed && (
        <>
          <FormSelect
            name="vehicleType"
            label="Vehicle Type"
            options={VEHICLE_TYPE_OPTIONS}
            placeholder="Select a vehicle type..."
            required
          />

          <FormSelect
            name="vehicleSubType"
            label="Vehicle Sub-Type"
            options={vehicleSubTypes}
            placeholder="Select a vehicle sub-type..."
            required
          />

          <FormInput
            name="unitNumber"
            label="Unit Number"
            placeholder="Enter unit number (optional)"
          />

          <FormInput
            name="vin"
            label="VIN"
            placeholder="Enter VIN (optional)"
          />

          <FormInput
            name="plate"
            label="Plate"
            placeholder="Enter plate number (optional)"
          />

          <FormInput
            name="make"
            label="Make"
            placeholder="Enter make (optional)"
          />

          <FormInput
            name="year"
            label="Year"
            type="number"
            placeholder="Enter year (optional)"
          />

          <FormInput
            name="licensedGVW"
            label="Licensed GVW (kg)"
            type="number"
            placeholder="Enter licensed GVW (optional)"
          />

          <FormSelect
            name="vehicleCountryCode"
            label="Vehicle Country"
            options={COUNTRY_OPTIONS}
            placeholder="Select a country..."
            required
          />

          {watchedVehicleCountryCode && watchedVehicleCountryCode !== 'MX' && watchedVehicleCountryCode !== 'XX' && vehicleStateProvinceOptions.length > 0 && (
            <FormSelect
              name="vehicleProvinceCode"
              label={vehicleStateProvinceLabel}
              options={vehicleStateProvinceOptions}
              placeholder={`Select a ${vehicleStateProvinceLabel.toLowerCase().replace('vehicle ', '')}...`}
            />
          )}

          <FormInput
            name="loadedGVW"
            label="Loaded GVW (kg)"
            type="number"
            placeholder="Enter loaded GVW (optional)"
          />

          <FormInput
            name="netWeight"
            label="Net Weight (kg)"
            type="number"
            placeholder="Enter net weight (optional)"
          />
        </>
      )}
    </div>
  )
}

export default VehicleDetailsSection
