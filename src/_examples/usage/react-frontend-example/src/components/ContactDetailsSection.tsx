import React from 'react'

interface ContactDetailsData {
  firstName: string
  lastName: string
  phone1: string
  phone1Extension: string
  phone2: string
  phone2Extension: string
  email: string
  additionalEmail: string
  fax: string
}

interface ContactDetailsSectionProps {
  data: ContactDetailsData
  onChange: (name: string, value: string) => void
  isCollapsed: boolean
  onToggleCollapse: () => void
}

const ContactDetailsSection: React.FC<ContactDetailsSectionProps> = ({
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
        Contact Details
        <span className={`section-arrow ${isCollapsed ? 'collapsed' : 'expanded'}`}>
          ▼
        </span>
      </h3>
      {!isCollapsed && (
        <>
          <div className="form-group">
            <label htmlFor="firstName">First Name:</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={data.firstName}
              onChange={handleChange}
              placeholder="Enter first name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="lastName">Last Name:</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={data.lastName}
              onChange={handleChange}
              placeholder="Enter last name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone1">Phone 1:</label>
            <input
              type="tel"
              id="phone1"
              name="phone1"
              value={data.phone1}
              onChange={handleChange}
              placeholder="Enter primary phone number"
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone1Extension">Phone 1 Extension:</label>
            <input
              type="text"
              id="phone1Extension"
              name="phone1Extension"
              value={data.phone1Extension}
              onChange={handleChange}
              placeholder="Enter extension (optional)"
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone2">Phone 2:</label>
            <input
              type="tel"
              id="phone2"
              name="phone2"
              value={data.phone2}
              onChange={handleChange}
              placeholder="Enter secondary phone number (optional)"
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone2Extension">Phone 2 Extension:</label>
            <input
              type="text"
              id="phone2Extension"
              name="phone2Extension"
              value={data.phone2Extension}
              onChange={handleChange}
              placeholder="Enter extension (optional)"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={data.email}
              onChange={handleChange}
              placeholder="Enter email address"
            />
          </div>

          <div className="form-group">
            <label htmlFor="additionalEmail">Additional Email:</label>
            <input
              type="email"
              id="additionalEmail"
              name="additionalEmail"
              value={data.additionalEmail}
              onChange={handleChange}
              placeholder="Enter additional email (optional)"
            />
          </div>

          <div className="form-group">
            <label htmlFor="fax">Fax:</label>
            <input
              type="tel"
              id="fax"
              name="fax"
              value={data.fax}
              onChange={handleChange}
              placeholder="Enter fax number (optional)"
            />
          </div>
        </>
      )}
    </div>
  )
}

export default ContactDetailsSection
export type { ContactDetailsData }
