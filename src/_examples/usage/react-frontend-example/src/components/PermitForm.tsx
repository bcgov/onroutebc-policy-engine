import React, { useState, useEffect } from 'react'
import { ValidationResults, Policy } from 'onroute-policy-engine'
import ValidationResultsDisplay from './ValidationResults'
import './PermitForm.css'

interface PermitFormProps {
  onSubmit: (permitData: any) => void
  validationResults?: ValidationResults | null
  policy?: Policy | null
  permitApplication?: any
}

const PermitForm: React.FC<PermitFormProps> = ({ onSubmit, validationResults, policy, permitApplication }) => {
  const [permitTypes, setPermitTypes] = useState<Array<[string, string]>>([])
  
  const [formData, setFormData] = useState({
    permitType: 'STOS',
    companyName: '',
    doingBusinessAs: '',
    clientNumber: '',
    permitDuration: 1,
    startDate: '',
    expiryDate: '',
    applicationNotes: '',
    thirdPartyLiability: '',
    conditionalLicensingFee: '',
    // Contact Details
    firstName: '',
    lastName: '',
    phone1: '',
    phone1Extension: '',
    phone2: '',
    phone2Extension: '',
    email: '',
    additionalEmail: '',
    fax: '',
    // Mailing Address
    addressLine1: '',
    addressLine2: '',
    city: '',
    provinceCode: '',
    countryCode: '',
    postalCode: '',
    // Vehicle Details
    vehicleId: '',
    unitNumber: '',
    vin: '',
    plate: '',
    make: '',
    year: '',
    vehicleType: '',
    vehicleSubType: '',
    licensedGVW: '',
    saveVehicle: false,
    // Legacy fields (keeping for backward compatibility)
    origin: '',
    destination: '',
    commodity: 'EMPTYXX',
    powerUnitType: 'TRKTRAC',
    trailerType: 'PLATFRM',
    description: ''
  })

  useEffect(() => {
    if (policy) {
      try {
        const types = policy.getPermitTypes()
        setPermitTypes(Array.from(types.entries()))
      } catch (error) {
        console.error('Failed to get permit types:', error)
      }
    }
  }, [policy])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  return (
    <div className="permit-form">
      <div className="left-column">
        <form onSubmit={handleSubmit}>
          <div className="form-content">
            <div className="form-group">
            <label htmlFor="permitType">Permit Type:</label>
            <select
              id="permitType"
              name="permitType"
              value={formData.permitType}
              onChange={handleChange}
            >
              {permitTypes.length > 0 ? (
                permitTypes.map(([id, name]) => (
                  <option key={id} value={id}>
                    {name}
                  </option>
                ))
              ) : (
                <>
                  <option value="STOS">Single Trip Oversize (STOS)</option>
                  <option value="TROS">Trip Oversize (TROS)</option>
                  <option value="LCV">Long Combination Vehicle (LCV)</option>
                </>
              )}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="startDate">Start Date:</label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="expiryDate">Expiry Date:</label>
            <input
              type="date"
              id="expiryDate"
              name="expiryDate"
              value={formData.expiryDate}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="origin">Origin:</label>
            <input
              type="text"
              id="origin"
              name="origin"
              value={formData.origin}
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
              value={formData.destination}
              onChange={handleChange}
              placeholder="Enter destination location"
            />
          </div>

          <div className="form-group">
            <label htmlFor="commodity">Commodity:</label>
            <select
              id="commodity"
              name="commodity"
              value={formData.commodity}
              onChange={handleChange}
            >
              <option value="EMPTYXX">Empty</option>
              <option value="GENERAL">General Freight</option>
              <option value="HEAVY">Heavy Equipment</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="powerUnitType">Power Unit Type:</label>
            <select
              id="powerUnitType"
              name="powerUnitType"
              value={formData.powerUnitType}
              onChange={handleChange}
            >
              <option value="TRKTRAC">Truck Tractor</option>
              <option value="STRAIGHT">Straight Truck</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="trailerType">Trailer Type:</label>
            <select
              id="trailerType"
              name="trailerType"
              value={formData.trailerType}
              onChange={handleChange}
            >
              <option value="PLATFRM">Platform Trailer</option>
              <option value="JEEPSRG">Jeep Dolly</option>
              <option value="FLATBED">Flatbed Trailer</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="description">Description:</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the load being transported"
              rows={3}
            />
          </div>

          {/* Company Information */}
          <div className="form-group">
            <label htmlFor="companyName">Company Name:</label>
            <input
              type="text"
              id="companyName"
              name="companyName"
              value={formData.companyName}
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
              value={formData.doingBusinessAs}
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
              value={formData.clientNumber}
              onChange={handleChange}
              placeholder="Enter client number"
            />
          </div>

          <div className="form-group">
            <label htmlFor="permitDuration">Permit Duration (days):</label>
            <input
              type="number"
              id="permitDuration"
              name="permitDuration"
              value={formData.permitDuration}
              onChange={handleChange}
              min="1"
            />
          </div>

          <div className="form-group">
            <label htmlFor="applicationNotes">Application Notes:</label>
            <textarea
              id="applicationNotes"
              name="applicationNotes"
              value={formData.applicationNotes}
              onChange={handleChange}
              placeholder="Enter application notes"
              rows={3}
            />
          </div>

          <div className="form-group">
            <label htmlFor="thirdPartyLiability">Third Party Liability:</label>
            <input
              type="text"
              id="thirdPartyLiability"
              name="thirdPartyLiability"
              value={formData.thirdPartyLiability}
              onChange={handleChange}
              placeholder="Enter third party liability"
            />
          </div>

          <div className="form-group">
            <label htmlFor="conditionalLicensingFee">Conditional Licensing Fee:</label>
            <input
              type="text"
              id="conditionalLicensingFee"
              name="conditionalLicensingFee"
              value={formData.conditionalLicensingFee}
              onChange={handleChange}
              placeholder="Enter conditional licensing fee"
            />
          </div>

          {/* Contact Details */}
          <div className="form-group">
            <label htmlFor="firstName">First Name:</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
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
              value={formData.lastName}
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
              value={formData.phone1}
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
              value={formData.phone1Extension}
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
              value={formData.phone2}
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
              value={formData.phone2Extension}
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
              value={formData.email}
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
              value={formData.additionalEmail}
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
              value={formData.fax}
              onChange={handleChange}
              placeholder="Enter fax number (optional)"
            />
          </div>

          {/* Mailing Address */}
          <div className="form-group">
            <label htmlFor="addressLine1">Address Line 1:</label>
            <input
              type="text"
              id="addressLine1"
              name="addressLine1"
              value={formData.addressLine1}
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
              value={formData.addressLine2}
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
              value={formData.city}
              onChange={handleChange}
              placeholder="Enter city"
            />
          </div>

          <div className="form-group">
            <label htmlFor="provinceCode">Province Code:</label>
            <input
              type="text"
              id="provinceCode"
              name="provinceCode"
              value={formData.provinceCode}
              onChange={handleChange}
              placeholder="Enter province code"
            />
          </div>

          <div className="form-group">
            <label htmlFor="countryCode">Country Code:</label>
            <input
              type="text"
              id="countryCode"
              name="countryCode"
              value={formData.countryCode}
              onChange={handleChange}
              placeholder="Enter country code"
            />
          </div>

          <div className="form-group">
            <label htmlFor="postalCode">Postal Code:</label>
            <input
              type="text"
              id="postalCode"
              name="postalCode"
              value={formData.postalCode}
              onChange={handleChange}
              placeholder="Enter postal code"
            />
          </div>

          {/* Vehicle Details */}
          <div className="form-group">
            <label htmlFor="vehicleId">Vehicle ID:</label>
            <input
              type="text"
              id="vehicleId"
              name="vehicleId"
              value={formData.vehicleId}
              onChange={handleChange}
              placeholder="Enter vehicle ID (optional)"
            />
          </div>

          <div className="form-group">
            <label htmlFor="unitNumber">Unit Number:</label>
            <input
              type="text"
              id="unitNumber"
              name="unitNumber"
              value={formData.unitNumber}
              onChange={handleChange}
              placeholder="Enter unit number (optional)"
            />
          </div>

          <div className="form-group">
            <label htmlFor="vin">VIN:</label>
            <input
              type="text"
              id="vin"
              name="vin"
              value={formData.vin}
              onChange={handleChange}
              placeholder="Enter VIN"
            />
          </div>

          <div className="form-group">
            <label htmlFor="plate">License Plate:</label>
            <input
              type="text"
              id="plate"
              name="plate"
              value={formData.plate}
              onChange={handleChange}
              placeholder="Enter license plate"
            />
          </div>

          <div className="form-group">
            <label htmlFor="make">Make:</label>
            <input
              type="text"
              id="make"
              name="make"
              value={formData.make}
              onChange={handleChange}
              placeholder="Enter vehicle make (optional)"
            />
          </div>

          <div className="form-group">
            <label htmlFor="year">Year:</label>
            <input
              type="number"
              id="year"
              name="year"
              value={formData.year}
              onChange={handleChange}
              placeholder="Enter vehicle year (optional)"
            />
          </div>

          <div className="form-group">
            <label htmlFor="vehicleType">Vehicle Type:</label>
            <input
              type="text"
              id="vehicleType"
              name="vehicleType"
              value={formData.vehicleType}
              onChange={handleChange}
              placeholder="Enter vehicle type"
            />
          </div>

          <div className="form-group">
            <label htmlFor="vehicleSubType">Vehicle Sub Type:</label>
            <input
              type="text"
              id="vehicleSubType"
              name="vehicleSubType"
              value={formData.vehicleSubType}
              onChange={handleChange}
              placeholder="Enter vehicle sub type"
            />
          </div>

          <div className="form-group">
            <label htmlFor="licensedGVW">Licensed GVW:</label>
            <input
              type="number"
              id="licensedGVW"
              name="licensedGVW"
              value={formData.licensedGVW}
              onChange={handleChange}
              placeholder="Enter licensed GVW (optional)"
            />
          </div>

          <div className="form-group">
            <label htmlFor="saveVehicle">Save Vehicle:</label>
            <input
              type="checkbox"
              id="saveVehicle"
              name="saveVehicle"
              checked={formData.saveVehicle}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                saveVehicle: e.target.checked
              }))}
            />
          </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="submit-btn">
              Validate Permit
            </button>
          </div>
        </form>
      </div>

      <div className="right-column">
        {validationResults && (
          <ValidationResultsDisplay 
            results={validationResults} 
            permitType={formData.permitType} 
            permitApplication={permitApplication || formData}
          />
        )}
      </div>
    </div>
  )
}

export default PermitForm
