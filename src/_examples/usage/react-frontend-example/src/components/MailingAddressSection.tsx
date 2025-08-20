import React from 'react'
import { useWatch } from 'react-hook-form'
import FormInput from './FormInput'
import FormSelect from './FormSelect'
import { COUNTRY_OPTIONS, PROVINCE_OPTIONS, US_STATE_OPTIONS } from '../constants'

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

  // Get appropriate state/province options based on country
  const getStateProvinceOptions = (countryCode: string) => {
    switch (countryCode) {
      case 'CA':
        return PROVINCE_OPTIONS
      case 'US':
        return US_STATE_OPTIONS
      default:
        return []
    }
  }

  const stateProvinceOptions = getStateProvinceOptions(watchedCountryCode)
  const stateProvinceLabel = watchedCountryCode === 'CA' ? 'Province' : 
                            watchedCountryCode === 'US' ? 'State' : 
                            'Province or State'

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
            placeholder="Enter address line 2"
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
            options={COUNTRY_OPTIONS}
            placeholder="Select a country..."
            required
          />

          {watchedCountryCode && watchedCountryCode !== 'MX' && watchedCountryCode !== 'XX' && stateProvinceOptions.length > 0 && (
            <FormSelect
              name="provinceCode"
              label={stateProvinceLabel}
              options={stateProvinceOptions}
              placeholder={`Select a ${stateProvinceLabel.toLowerCase()}...`}
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
