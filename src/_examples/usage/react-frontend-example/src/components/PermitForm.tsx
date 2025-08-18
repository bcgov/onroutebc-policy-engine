import React, { useState } from 'react'
import './PermitForm.css'

interface PermitFormProps {
  onSubmit: (permitData: any) => void
}

const PermitForm: React.FC<PermitFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    permitType: 'STOS',
    startDate: '',
    endDate: '',
    origin: '',
    destination: '',
    commodity: 'EMPTYXX',
    powerUnitType: 'TRKTRAC',
    trailerType: 'PLATFRM',
    description: ''
  })

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
      <h2>Permit Application</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="permitType">Permit Type:</label>
          <select
            id="permitType"
            name="permitType"
            value={formData.permitType}
            onChange={handleChange}
            required
          >
            <option value="STOS">Single Trip Oversize (STOS)</option>
            <option value="TROS">Trip Oversize (TROS)</option>
            <option value="LCV">Long Combination Vehicle (LCV)</option>
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
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="endDate">End Date:</label>
          <input
            type="date"
            id="endDate"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            required
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
            required
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
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="commodity">Commodity:</label>
          <select
            id="commodity"
            name="commodity"
            value={formData.commodity}
            onChange={handleChange}
            required
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
            required
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
            required
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

        <div className="form-actions">
          <button type="submit" className="submit-btn">
            Validate Permit
          </button>
        </div>
      </form>
    </div>
  )
}

export default PermitForm
