import React from 'react'
import FormInput from './FormInput'
import FormSelect from './FormSelect'
import AxleGroup, { AxleConfigurationData } from './AxleGroup'

interface VehicleConfigurationSectionProps {
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
  isCollapsed,
  onToggleCollapse,
  showSizeDimensions,
  selectedTrailers,
  onTrailerChange,
  onRemoveTrailer,
  trailerTypes,
  commodityTypes,
  axleConfigurations,
  onAxleConfigurationChange
}) => {
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
              <FormSelect
                name="commodityType"
                label="Commodity Type"
                options={commodityTypes}
                placeholder="Select a commodity type..."
              />
              <FormInput
                name="loadDescription"
                label="Load Description"
                placeholder="Enter load description"
              />
            </div>
          </div>

          {/* Size Dimensions Sub-section */}
          {showSizeDimensions && (
            <div style={{ marginBottom: '1rem', padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '4px', border: '1px solid #e9ecef' }}>
              <h4 style={{ margin: '0 0 1rem 0', fontSize: '14px', fontWeight: '600', color: '#495057' }}>Size Dimensions</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <FormInput
                  name="overallLength"
                  label="Overall Length (m)"
                  type="number"
                  step="0.01"
                  placeholder="Enter overall length"
                />
                <FormInput
                  name="overallWidth"
                  label="Overall Width (m)"
                  type="number"
                  step="0.01"
                  placeholder="Enter overall width"
                />
                <FormInput
                  name="overallHeight"
                  label="Overall Height (m)"
                  type="number"
                  step="0.01"
                  placeholder="Enter overall height"
                />
                <FormInput
                  name="frontProjection"
                  label="Front Projection (m)"
                  type="number"
                  step="0.01"
                  placeholder="Enter front projection"
                />
                <FormInput
                  name="rearProjection"
                  label="Rear Projection (m)"
                  type="number"
                  step="0.01"
                  placeholder="Enter rear projection"
                />
              </div>
            </div>
          )}

          {/* Trailers Sub-section */}
          <div style={{ marginBottom: '1rem', padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '4px', border: '1px solid #e9ecef' }}>
            <h4 style={{ margin: '0 0 1rem 0', fontSize: '14px', fontWeight: '600', color: '#495057' }}>Trailers</h4>
            {selectedTrailers.map((trailer, index) => (
              <div key={index} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem', alignItems: 'center' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#333' }}>
                    Trailer {index + 1}
                  </label>
                  <select
                    value={trailer}
                    onChange={(e) => onTrailerChange(index, e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      fontSize: '1rem',
                      transition: 'border-color 0.2s ease',
                      boxSizing: 'border-box'
                    }}
                  >
                    <option value="">Select a trailer type...</option>
                    {trailerTypes.map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>
                {trailer && trailer.trim() !== '' && (
                  <button
                    type="button"
                    onClick={() => onRemoveTrailer(index)}
                    style={{
                      width: '24px',
                      height: '24px',
                      fontSize: '16px',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      background: '#d4a5a5',
                      color: 'white',
                      border: 'none',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: 0,
                      lineHeight: 1,
                      flexShrink: 0
                    }}
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Axle Configuration Sub-section */}
          <div style={{ marginBottom: '1rem', padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '4px', border: '1px solid #e9ecef' }}>
            <h4 style={{ margin: '0 0 1rem 0', fontSize: '14px', fontWeight: '600', color: '#495057' }}>Axle Configuration</h4>
            {axleConfigurations.map((axleConfiguration, axleIndex) => (
              <AxleGroup
                key={axleIndex}
                axleIndex={axleIndex}
                axleConfiguration={axleConfiguration}
                onAxleConfigurationChange={onAxleConfigurationChange}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default VehicleConfigurationSection
