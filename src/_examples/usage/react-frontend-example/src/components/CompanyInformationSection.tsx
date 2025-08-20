import React from 'react'
import FormInput from './FormInput'

interface CompanyInformationSectionProps {
  isCollapsed: boolean
  onToggleCollapse: () => void
}

const CompanyInformationSection: React.FC<CompanyInformationSectionProps> = ({
  isCollapsed,
  onToggleCollapse
}) => {
  return (
    <div className="form-section">
      <h3 
        className={`section-header clickable ${!isCollapsed ? 'expanded' : ''}`}
        onClick={onToggleCollapse}
      >
        Company Information
        <span className={`section-arrow ${isCollapsed ? 'collapsed' : 'expanded'}`}>
          ▼
        </span>
      </h3>
      {!isCollapsed && (
        <>
          <FormInput
            name="companyName"
            label="Company Name"
            placeholder="Enter company name"
            required
          />

          <FormInput
            name="doingBusinessAs"
            label="Doing Business As"
            placeholder="Enter DBA name (optional)"
          />

          <FormInput
            name="clientNumber"
            label="Client Number"
            placeholder="Enter client number"
            required
          />
        </>
      )}
    </div>
  )
}

export default CompanyInformationSection
