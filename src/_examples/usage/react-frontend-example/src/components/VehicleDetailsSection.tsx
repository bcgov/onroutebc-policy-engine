import React from 'react'

interface VehicleDetailsData {
  vehicleType: string
  vehicleSubType: string
  unitNumber: string
  vin: string
  plate: string
  make: string
  year: string
  licensedGVW: string
  vehicleCountryCode: string
  vehicleProvinceCode: string
  loadedGVW: string
  netWeight: string
}

interface VehicleDetailsSectionProps {
  data: VehicleDetailsData
  onChange: (name: string, value: string) => void
  isCollapsed: boolean
  onToggleCollapse: () => void
  vehicleSubTypes: Array<[string, string]>
}

const VehicleDetailsSection: React.FC<VehicleDetailsSectionProps> = ({
  data,
  onChange,
  isCollapsed,
  onToggleCollapse,
  vehicleSubTypes
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
        Vehicle Details
        <span className={`section-arrow ${isCollapsed ? 'collapsed' : 'expanded'}`}>
          ▼
        </span>
      </h3>
      {!isCollapsed && (
        <>
          <div className="form-group">
            <label htmlFor="vehicleType">Vehicle Type:</label>
            <select
              id="vehicleType"
              name="vehicleType"
              value={data.vehicleType}
              onChange={handleChange}
            >
              <option value="">Select a vehicle type...</option>
              <option value="powerUnit">Power Unit</option>
              <option value="trailer">Trailer</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="vehicleSubType">Vehicle Sub-Type:</label>
            <select
              id="vehicleSubType"
              name="vehicleSubType"
              value={data.vehicleSubType}
              onChange={handleChange}
            >
              <option value="">Select a vehicle sub-type...</option>
              {vehicleSubTypes.map(([id, name]) => (
                <option key={id} value={id}>
                  {name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="unitNumber">Unit Number:</label>
            <input
              type="text"
              id="unitNumber"
              name="unitNumber"
              value={data.unitNumber}
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
              value={data.vin}
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
              value={data.plate}
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
              value={data.make}
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
              value={data.year}
              onChange={handleChange}
              placeholder="Enter vehicle year (optional)"
            />
          </div>

          <div className="form-group">
            <label htmlFor="licensedGVW">Licensed GVW:</label>
            <input
              type="number"
              id="licensedGVW"
              name="licensedGVW"
              value={data.licensedGVW}
              onChange={handleChange}
              placeholder="Enter licensed GVW (optional)"
            />
          </div>

          <div className="form-group">
            <label htmlFor="loadedGVW">Loaded GVW (kg):</label>
            <input
              type="number"
              id="loadedGVW"
              name="loadedGVW"
              value={data.loadedGVW}
              onChange={handleChange}
              placeholder="Enter loaded GVW in kilograms"
              min="0"
              step="0.01"
            />
          </div>

          <div className="form-group">
            <label htmlFor="netWeight">Net Weight (kg):</label>
            <input
              type="number"
              id="netWeight"
              name="netWeight"
              value={data.netWeight}
              onChange={handleChange}
              placeholder="Enter net weight in kilograms"
              min="0"
              step="0.01"
            />
          </div>

          <div className="form-group">
            <label htmlFor="vehicleCountryCode">Country of Registration:</label>
            <select
              id="vehicleCountryCode"
              name="vehicleCountryCode"
              value={data.vehicleCountryCode}
              onChange={handleChange}
            >
              <option value="CA">Canada</option>
              <option value="US">United States</option>
              <option value="MX">Mexico</option>
              <option value="XX">Other</option>
            </select>
          </div>

          {data.vehicleCountryCode !== 'MX' && data.vehicleCountryCode !== 'XX' && (
            <div className="form-group">
              <label htmlFor="vehicleProvinceCode">Province / State of Registration:</label>
              <input
                type="text"
                id="vehicleProvinceCode"
                name="vehicleProvinceCode"
                value={data.vehicleProvinceCode}
                onChange={handleChange}
                placeholder="Enter province or state"
              />
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default VehicleDetailsSection
export type { VehicleDetailsData }
