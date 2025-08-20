import React from 'react'
import FormInput from './FormInput'
import FormSelect from './FormSelect'
import { THIRD_PARTY_LIABILITY_OPTIONS, CONDITIONAL_LICENSING_FEE_OPTIONS } from '../constants'

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
            placeholder="Enter description"
          />

          <FormInput
            name="applicationNotes"
            label="Application Notes"
            placeholder="Enter application notes"
          />

          <FormSelect
            name="thirdPartyLiability"
            label="Third Party Liability"
            options={THIRD_PARTY_LIABILITY_OPTIONS}
            placeholder="Select third party liability type"
          />

          <FormSelect
            name="conditionalLicensingFee"
            label="Conditional Licensing Fee"
            options={CONDITIONAL_LICENSING_FEE_OPTIONS}
            placeholder="Select conditional licensing fee type"
          />
        </>
      )}
    </div>
  )
}

export default TripDetailsSection
