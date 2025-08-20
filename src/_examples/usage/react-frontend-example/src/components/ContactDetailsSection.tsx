import React from 'react'
import FormInput from './FormInput'

interface ContactDetailsSectionProps {
  isCollapsed: boolean
  onToggleCollapse: () => void
}

const ContactDetailsSection: React.FC<ContactDetailsSectionProps> = ({
  isCollapsed,
  onToggleCollapse
}) => {
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
          <FormInput
            name="firstName"
            label="First Name"
            placeholder="Enter first name"
            required
          />

          <FormInput
            name="lastName"
            label="Last Name"
            placeholder="Enter last name"
            required
          />

          <FormInput
            name="phone1"
            label="Phone 1"
            type="tel"
            placeholder="Enter primary phone number"
            required
          />

          <FormInput
            name="phone1Extension"
            label="Phone 1 Extension"
            placeholder="Enter extension"
          />

          <FormInput
            name="phone2"
            label="Phone 2"
            type="tel"
            placeholder="Enter secondary phone number"
          />

          <FormInput
            name="phone2Extension"
            label="Phone 2 Extension"
            placeholder="Enter extension"
          />

          <FormInput
            name="email"
            label="Email"
            type="email"
            placeholder="Enter email address"
            required
          />

          <FormInput
            name="additionalEmail"
            label="Additional Email"
            type="email"
            placeholder="Enter additional email"
          />

          <FormInput
            name="fax"
            label="Fax"
            type="tel"
            placeholder="Enter fax number"
          />
        </>
      )}
    </div>
  )
}

export default ContactDetailsSection
