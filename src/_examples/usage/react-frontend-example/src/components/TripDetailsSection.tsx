import React from 'react'

interface TripDetailsData {
  permitDuration: number
  startDate: string
  expiryDate: string
  origin: string
  destination: string
  commodity: string
  description: string
  applicationNotes: string
  thirdPartyLiability: string
  conditionalLicensingFee: string
}

interface TripDetailsSectionProps {
  data: TripDetailsData
  onChange: (name: string, value: string) => void
  isCollapsed: boolean
  onToggleCollapse: () => void
}

const TripDetailsSection: React.FC<TripDetailsSectionProps> = ({
  data,
  onChange,
  isCollapsed,
  onToggleCollapse
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    onChange(e.target.name, e.target.value)
  }

  return (
    <div className="form-section">
      <h3 
        className={`section-header clickable ${!isCollapsed ? 'expanded' : ''}`}
        onClick={onToggleCollapse}
      >
        Trip Details
        <span className={`section-arrow ${isCollapsed ? 'collapsed' : 'expanded'}`}>
          ▼
        </span>
      </h3>
      {!isCollapsed && (
        <>
          <div className="form-group">
            <label htmlFor="permitDuration">Permit Duration (days):</label>
            <input
              type="number"
              id="permitDuration"
              name="permitDuration"
              value={data.permitDuration}
              onChange={handleChange}
              min="1"
            />
          </div>

          <div className="form-group">
            <label htmlFor="startDate">Start Date:</label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={data.startDate}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="expiryDate">Expiry Date:</label>
            <input
              type="date"
              id="expiryDate"
              name="expiryDate"
              value={data.expiryDate}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="origin">Origin:</label>
            <input
              type="text"
              id="origin"
              name="origin"
              value={data.origin}
              onChange={handleChange}
              placeholder="Enter origin location"
            />
          </div>

          <div className="form-group">
            <label htmlFor="destination">Destination:</label>
            <input
              type="text"
              id="destination"
              name="destination"
              value={data.destination}
              onChange={handleChange}
              placeholder="Enter destination location"
            />
          </div>

          <div className="form-group">
            <label htmlFor="commodity">Commodity:</label>
            <select
              id="commodity"
              name="commodity"
              value={data.commodity}
              onChange={handleChange}
            >
              <option value="EMPTYXX">Empty</option>
              <option value="GENERAL">General Freight</option>
              <option value="HEAVY">Heavy Equipment</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="description">Description:</label>
            <textarea
              id="description"
              name="description"
              value={data.description}
              onChange={handleChange}
              placeholder="Describe the load being transported"
              rows={3}
            />
          </div>

          <div className="form-group">
            <label htmlFor="applicationNotes">Application Notes:</label>
            <textarea
              id="applicationNotes"
              name="applicationNotes"
              value={data.applicationNotes}
              onChange={handleChange}
              placeholder="Enter application notes"
              rows={3}
            />
          </div>

          <div className="form-group">
            <label htmlFor="thirdPartyLiability">Third Party Liability:</label>
            <select
              id="thirdPartyLiability"
              name="thirdPartyLiability"
              value={data.thirdPartyLiability}
              onChange={handleChange}
            >
              <option value="">Select a third party liability option...</option>
              <option value="GENERAL_GOODS">General Goods</option>
              <option value="DANGEROUS_GOODS">Dangerous Goods</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="conditionalLicensingFee">Conditional Licensing Fee:</label>
            <input
              type="text"
              id="conditionalLicensingFee"
              name="conditionalLicensingFee"
              value={data.conditionalLicensingFee}
              onChange={handleChange}
              placeholder="Enter conditional licensing fee"
            />
          </div>
        </>
      )}
    </div>
  )
}

export default TripDetailsSection
export type { TripDetailsData }
