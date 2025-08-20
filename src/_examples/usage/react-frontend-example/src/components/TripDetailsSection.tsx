import React from 'react'
import FormInput from './FormInput'

interface TripDetailsSectionProps {
  isCollapsed: boolean
  onToggleCollapse: () => void
}

const TripDetailsSection: React.FC<TripDetailsSectionProps> = ({
  isCollapsed,
  onToggleCollapse
}) => {
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
          <FormInput
            name="permitDuration"
            label="Permit Duration (days)"
            type="number"
            required
          />

          <FormInput
            name="startDate"
            label="Start Date"
            type="date"
            required
          />

          <FormInput
            name="expiryDate"
            label="Expiry Date"
            type="date"
            required
          />

          <FormInput
            name="origin"
            label="Origin"
            placeholder="Enter origin location"
          />

          <FormInput
            name="destination"
            label="Destination"
            placeholder="Enter destination location"
          />

          <FormInput
            name="description"
            label="Description"
            placeholder="Enter description (optional)"
          />

          <FormInput
            name="applicationNotes"
            label="Application Notes"
            placeholder="Enter application notes (optional)"
          />

          <FormInput
            name="thirdPartyLiability"
            label="Third Party Liability"
            placeholder="Enter third party liability (optional)"
          />

          <FormInput
            name="conditionalLicensingFee"
            label="Conditional Licensing Fee"
            placeholder="Enter conditional licensing fee (optional)"
          />
        </>
      )}
    </div>
  )
}

export default TripDetailsSection
