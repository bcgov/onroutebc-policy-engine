import React from 'react'
import { useWatch } from 'react-hook-form'
import FormInput from './FormInput'
import FormSelect from './FormSelect'

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

  const vehicleTypeOptions: Array<[string, string]> = [
    ['powerUnit', 'Power Unit'],
    ['trailer', 'Trailer']
  ]

  const vehicleCountryOptions: Array<[string, string]> = [
    ['CA', 'Canada'],
    ['US', 'United States'],
    ['MX', 'Mexico'],
    ['XX', 'Other']
  ]

  const vehicleProvinceOptions: Array<[string, string]> = [
    ['BC', 'British Columbia'],
    ['AB', 'Alberta'],
    ['SK', 'Saskatchewan'],
    ['MB', 'Manitoba'],
    ['ON', 'Ontario'],
    ['QC', 'Quebec'],
    ['NB', 'New Brunswick'],
    ['NS', 'Nova Scotia'],
    ['PE', 'Prince Edward Island'],
    ['NL', 'Newfoundland and Labrador'],
    ['NT', 'Northwest Territories'],
    ['NU', 'Nunavut'],
    ['YT', 'Yukon']
  ]

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
            options={vehicleTypeOptions}
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
            placeholder="Enter vehicle make (optional)"
          />

          <FormInput
            name="year"
            label="Year"
            type="number"
            placeholder="Enter vehicle year (optional)"
          />

          <FormInput
            name="licensedGVW"
            label="Licensed GVW"
            type="number"
            placeholder="Enter licensed GVW (optional)"
          />

          <FormSelect
            name="vehicleCountryCode"
            label="Vehicle Country"
            options={vehicleCountryOptions}
            placeholder="Select a country..."
            required
          />

          {watchedVehicleCountryCode && watchedVehicleCountryCode !== 'MX' && watchedVehicleCountryCode !== 'XX' && (
            <FormSelect
              name="vehicleProvinceCode"
              label="Vehicle Province"
              options={vehicleProvinceOptions}
              placeholder="Select a province..."
            />
          )}

          <FormInput
            name="loadedGVW"
            label="Loaded GVW"
            type="number"
            placeholder="Enter loaded GVW (optional)"
          />

          <FormInput
            name="netWeight"
            label="Net Weight"
            type="number"
            placeholder="Enter net weight (optional)"
          />
        </>
      )}
    </div>
  )
}

export default VehicleDetailsSection
