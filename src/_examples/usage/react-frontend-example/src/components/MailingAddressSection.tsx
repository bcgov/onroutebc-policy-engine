import React from 'react'

interface MailingAddressData {
  addressLine1: string
  addressLine2: string
  city: string
  provinceCode: string
  countryCode: string
  postalCode: string
}

interface MailingAddressSectionProps {
  data: MailingAddressData
  onChange: (name: string, value: string) => void
  isCollapsed: boolean
  onToggleCollapse: () => void
}

const MailingAddressSection: React.FC<MailingAddressSectionProps> = ({
  data,
  onChange,
  isCollapsed,
  onToggleCollapse
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    onChange(e.target.name, e.target.value)
  }

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
          <div className="form-group">
            <label htmlFor="addressLine1">Address Line 1:</label>
            <input
              type="text"
              id="addressLine1"
              name="addressLine1"
              value={data.addressLine1}
              onChange={handleChange}
              placeholder="Enter address line 1"
            />
          </div>

          <div className="form-group">
            <label htmlFor="addressLine2">Address Line 2:</label>
            <input
              type="text"
              id="addressLine2"
              name="addressLine2"
              value={data.addressLine2}
              onChange={handleChange}
              placeholder="Enter address line 2 (optional)"
            />
          </div>

          <div className="form-group">
            <label htmlFor="city">City:</label>
            <input
              type="text"
              id="city"
              name="city"
              value={data.city}
              onChange={handleChange}
              placeholder="Enter city"
            />
          </div>

          <div className="form-group">
            <label htmlFor="countryCode">Country:</label>
            <select
              id="countryCode"
              name="countryCode"
              value={data.countryCode}
              onChange={handleChange}
            >
              <option value="">Select a country...</option>
              <option value="CA">Canada</option>
              <option value="US">United States</option>
              <option value="MX">Mexico</option>
              <option value="XX">Other</option>
            </select>
          </div>

          {data.countryCode !== 'MX' && data.countryCode !== 'XX' && (
            <div className="form-group">
              <label htmlFor="provinceCode">Province or State:</label>
              <input
                type="text"
                id="provinceCode"
                name="provinceCode"
                value={data.provinceCode}
                onChange={handleChange}
                placeholder="Enter province or state"
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="postalCode">Postal Code:</label>
            <input
              type="text"
              id="postalCode"
              name="postalCode"
              value={data.postalCode}
              onChange={handleChange}
              placeholder="Enter postal code"
            />
          </div>
        </>
      )}
    </div>
  )
}

export default MailingAddressSection
export type { MailingAddressData }
