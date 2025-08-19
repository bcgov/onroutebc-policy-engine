import React from 'react'

interface AxleConfigurationData {
  numberOfAxles: string
  axleSpread: string
  interaxleSpacing: string
  axleUnitWeight: string
  numberOfTires: string
  tireSize: string
}

interface VehicleConfigurationData {
  overallLength: string
  overallWidth: string
  overallHeight: string
  frontProjection: string
  rearProjection: string
  commodityType: string
  loadDescription: string
}

interface VehicleConfigurationSectionProps {
  data: VehicleConfigurationData
  onChange: (name: string, value: string) => void
  isCollapsed: boolean
  onToggleCollapse: () => void
  showSizeDimensions: boolean
  showWeightDimensions: boolean
  selectedTrailers: string[]
  onTrailerChange: (index: number, value: string) => void
  onRemoveTrailer: (index: number) => void
  trailerTypes: Array<[string, string]>
  commodityTypes: Array<[string, string]>
  axleConfigurations: AxleConfigurationData[]
  onAxleConfigurationChange: (axleIndex: number, field: string, value: string) => void
}

const VehicleConfigurationSection: React.FC<VehicleConfigurationSectionProps> = ({
  data,
  onChange,
  isCollapsed,
  onToggleCollapse,
  showSizeDimensions,
  showWeightDimensions,
  selectedTrailers,
  onTrailerChange,
  onRemoveTrailer,
  trailerTypes,
  commodityTypes,
  axleConfigurations,
  onAxleConfigurationChange
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
        Vehicle Configuration
        <span className={`section-arrow ${isCollapsed ? 'collapsed' : 'expanded'}`}>
          ▼
        </span>
      </h3>
      {!isCollapsed && (
        <>
          {/* Commodity Sub-section */}
          <div style={{ marginBottom: '1rem', padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '4px', border: '1px solid #e9ecef' }}>
            <h4 style={{ margin: '0 0 1rem 0', fontSize: '14px', fontWeight: '600', color: '#495057' }}>Commodity</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label htmlFor="commodityType">Commodity Type:</label>
                <select
                  id="commodityType"
                  name="commodityType"
                  value={data.commodityType}
                  onChange={handleChange}
                >
                  <option value="">Select a commodity type...</option>
                  {commodityTypes.map(([id, name]) => (
                    <option key={id} value={id}>
                      {name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="loadDescription">Load Description:</label>
                <input
                  type="text"
                  id="loadDescription"
                  name="loadDescription"
                  value={data.loadDescription}
                  onChange={handleChange}
                  placeholder="Enter load description"
                />
              </div>
            </div>
          </div>

          {/* Trailers Sub-section */}
          <div style={{ marginBottom: '1rem', padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '4px', border: '1px solid #e9ecef' }}>
            <h4 style={{ margin: '0 0 1rem 0', fontSize: '14px', fontWeight: '600', color: '#495057' }}>Trailers</h4>
            {selectedTrailers.map((trailer, index) => (
              <div key={index} className="form-group" style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                <div style={{ flex: 1 }}>
                  <label htmlFor={`trailer-${index}`}>Trailer {index + 1}:</label>
                  <select
                    id={`trailer-${index}`}
                    value={trailer}
                    onChange={(e) => onTrailerChange(index, e.target.value)}
                  >
                    <option value="">Select a trailer...</option>
                    {trailerTypes.map(([id, name]) => (
                      <option key={id} value={id}>
                        {name}
                      </option>
                    ))}
                  </select>
                </div>
                {trailer && trailer.trim() !== '' && (
                  <button
                    type="button"
                    className="remove-trailer-btn"
                    onClick={() => onRemoveTrailer(index)}
                    title="Remove trailer"
                    style={{ marginTop: '1.5rem' }}
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
            
            {/* Always show at least one trailer dropdown */}
            {selectedTrailers.length === 0 && (
              <div className="form-group" style={{ marginBottom: '0.5rem' }}>
                <label htmlFor="trailer-0">Trailer 1:</label>
                <select
                  id="trailer-0"
                  value=""
                  onChange={(e) => onTrailerChange(0, e.target.value)}
                >
                  <option value="">Select a trailer...</option>
                  {trailerTypes.map(([id, name]) => (
                    <option key={id} value={id}>
                      {name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Size Dimensions */}
          {showSizeDimensions && (
            <>
              <div className="form-group">
                <label htmlFor="overallLength">Overall Length (m):</label>
                <input
                  type="number"
                  id="overallLength"
                  name="overallLength"
                  value={data.overallLength}
                  onChange={handleChange}
                  placeholder="Enter overall length in meters"
                  min="0"
                  step="0.01"
                />
              </div>

              <div className="form-group">
                <label htmlFor="overallWidth">Overall Width (m):</label>
                <input
                  type="number"
                  id="overallWidth"
                  name="overallWidth"
                  value={data.overallWidth}
                  onChange={handleChange}
                  placeholder="Enter overall width in meters"
                  min="0"
                  step="0.01"
                />
              </div>

              <div className="form-group">
                <label htmlFor="overallHeight">Overall Height (m):</label>
                <input
                  type="number"
                  id="overallHeight"
                  name="overallHeight"
                  value={data.overallHeight}
                  onChange={handleChange}
                  placeholder="Enter overall height in meters"
                  min="0"
                  step="0.01"
                />
              </div>

              <div className="form-group">
                <label htmlFor="frontProjection">Front Projection (m):</label>
                <input
                  type="number"
                  id="frontProjection"
                  name="frontProjection"
                  value={data.frontProjection}
                  onChange={handleChange}
                  placeholder="Enter front projection in meters"
                  min="0"
                  step="0.01"
                />
              </div>

              <div className="form-group">
                <label htmlFor="rearProjection">Rear Projection (m):</label>
                <input
                  type="number"
                  id="rearProjection"
                  name="rearProjection"
                  value={data.rearProjection}
                  onChange={handleChange}
                  placeholder="Enter rear projection in meters"
                  min="0"
                  step="0.01"
                />
              </div>
            </>
          )}

          {/* Axle Configuration Sub-section */}
          {showWeightDimensions && (
            <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '4px', border: '1px solid #e9ecef' }}>
              <h4 style={{ margin: '0 0 1rem 0', fontSize: '14px', fontWeight: '600', color: '#495057' }}>Axle Configuration</h4>
              {axleConfigurations.map((axleConfig, index) => (
                <div key={index} style={{ marginBottom: '1.5rem', padding: '1rem', backgroundColor: 'white', borderRadius: '4px', border: '1px solid #dee2e6' }}>
                  <h5 style={{ margin: '0 0 1rem 0', fontSize: '13px', fontWeight: '600', color: '#495057' }}>Axle Group {index + 1}</h5>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-group">
                      <label htmlFor={`axle-${index}-numberOfAxles`}>Number of Axles:</label>
                      <input
                        type="number"
                        id={`axle-${index}-numberOfAxles`}
                        value={axleConfig.numberOfAxles}
                        onChange={(e) => onAxleConfigurationChange(index, 'numberOfAxles', e.target.value)}
                        placeholder="Enter number of axles"
                        min="1"
                        step="1"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor={`axle-${index}-axleSpread`}>Axle Spread (m):</label>
                      <input
                        type="number"
                        id={`axle-${index}-axleSpread`}
                        value={axleConfig.axleSpread}
                        onChange={(e) => onAxleConfigurationChange(index, 'axleSpread', e.target.value)}
                        placeholder="Enter axle spread in meters"
                        min="0"
                        step="0.01"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor={`axle-${index}-interaxleSpacing`}>Interaxle Spacing (m):</label>
                      <input
                        type="number"
                        id={`axle-${index}-interaxleSpacing`}
                        value={axleConfig.interaxleSpacing}
                        onChange={(e) => onAxleConfigurationChange(index, 'interaxleSpacing', e.target.value)}
                        placeholder="Enter spacing from previous axle group"
                        min="0"
                        step="0.01"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor={`axle-${index}-axleUnitWeight`}>Axle Unit Weight (kg):</label>
                      <input
                        type="number"
                        id={`axle-${index}-axleUnitWeight`}
                        value={axleConfig.axleUnitWeight}
                        onChange={(e) => onAxleConfigurationChange(index, 'axleUnitWeight', e.target.value)}
                        placeholder="Enter axle unit weight in kilograms"
                        min="0"
                        step="0.01"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor={`axle-${index}-numberOfTires`}>Number of Tires:</label>
                      <input
                        type="number"
                        id={`axle-${index}-numberOfTires`}
                        value={axleConfig.numberOfTires}
                        onChange={(e) => onAxleConfigurationChange(index, 'numberOfTires', e.target.value)}
                        placeholder="Enter number of tires"
                        min="1"
                        step="1"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor={`axle-${index}-tireSize`}>Tire Size:</label>
                      <input
                        type="number"
                        id={`axle-${index}-tireSize`}
                        value={axleConfig.tireSize}
                        onChange={(e) => onAxleConfigurationChange(index, 'tireSize', e.target.value)}
                        placeholder="Enter tire size"
                        min="0"
                        step="0.01"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default VehicleConfigurationSection
export type { VehicleConfigurationData, AxleConfigurationData }
