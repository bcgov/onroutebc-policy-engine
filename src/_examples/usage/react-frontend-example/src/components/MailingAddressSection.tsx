import React from 'react'
import { useWatch } from 'react-hook-form'
import FormInput from './FormInput'
import FormSelect from './FormSelect'

interface MailingAddressSectionProps {
  isCollapsed: boolean
  onToggleCollapse: () => void
}

const MailingAddressSection: React.FC<MailingAddressSectionProps> = ({
  isCollapsed,
  onToggleCollapse
}) => {
  const { control } = useWatch()
  const watchedCountryCode = useWatch({
    control,
    name: 'countryCode'
  })

  const countryOptions: Array<[string, string]> = [
    ['CA', 'Canada'],
    ['US', 'United States'],
    ['MX', 'Mexico'],
    ['XX', 'Other']
  ]

  const provinceOptions: Array<[string, string]> = [
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
        Mailing Address
        <span className={`section-arrow ${isCollapsed ? 'collapsed' : 'expanded'}`}>
          ▼
        </span>
      </h3>
      {!isCollapsed && (
        <>
          <FormInput
            name="addressLine1"
            label="Address Line 1"
            placeholder="Enter address line 1"
            required
          />

          <FormInput
            name="addressLine2"
            label="Address Line 2"
            placeholder="Enter address line 2 (optional)"
          />

          <FormInput
            name="city"
            label="City"
            placeholder="Enter city"
            required
          />

          <FormSelect
            name="countryCode"
            label="Country"
            options={countryOptions}
            placeholder="Select a country..."
            required
          />

          {watchedCountryCode && watchedCountryCode !== 'MX' && watchedCountryCode !== 'XX' && (
            <FormSelect
              name="provinceCode"
              label="Province or State"
              options={provinceOptions}
              placeholder="Select a province..."
              required
            />
          )}

          <FormInput
            name="postalCode"
            label="Postal Code"
            placeholder="Enter postal code"
            required
          />
        </>
      )}
    </div>
  )
}

export default MailingAddressSection
