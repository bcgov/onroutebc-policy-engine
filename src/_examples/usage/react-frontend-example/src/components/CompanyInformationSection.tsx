import React from 'react'

interface CompanyInformationData {
  companyName: string
  doingBusinessAs: string
  clientNumber: string
}

interface CompanyInformationSectionProps {
  data: CompanyInformationData
  onChange: (name: string, value: string) => void
  isCollapsed: boolean
  onToggleCollapse: () => void
}

const CompanyInformationSection: React.FC<CompanyInformationSectionProps> = ({
  data,
  onChange,
  isCollapsed,
  onToggleCollapse
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.name, e.target.value)
  }

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
          <div className="form-group">
            <label htmlFor="companyName">Company Name:</label>
            <input
              type="text"
              id="companyName"
              name="companyName"
              value={data.companyName}
              onChange={handleChange}
              placeholder="Enter company name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="doingBusinessAs">Doing Business As:</label>
            <input
              type="text"
              id="doingBusinessAs"
              name="doingBusinessAs"
              value={data.doingBusinessAs}
              onChange={handleChange}
              placeholder="Enter DBA name (optional)"
            />
          </div>

          <div className="form-group">
            <label htmlFor="clientNumber">Client Number:</label>
            <input
              type="text"
              id="clientNumber"
              name="clientNumber"
              value={data.clientNumber}
              onChange={handleChange}
              placeholder="Enter client number"
            />
          </div>
        </>
      )}
    </div>
  )
}

export default CompanyInformationSection
export type { CompanyInformationData }
