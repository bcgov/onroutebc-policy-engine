import React from 'react'

export interface AxleConfigurationData {
  numberOfAxles: string
  axleSpread: string
  interaxleSpacing: string
  axleUnitWeight: string
  numberOfTires: string
  tireSize: string
}

interface AxleGroupProps {
  axleIndex: number
  axleConfiguration: AxleConfigurationData
  onAxleConfigurationChange: (axleIndex: number, field: string, value: string) => void
}

const AxleGroup: React.FC<AxleGroupProps> = ({
  axleIndex,
  axleConfiguration,
  onAxleConfigurationChange
}) => {
  return (
    <div style={{ marginBottom: '1rem', padding: '1rem', backgroundColor: 'white', borderRadius: '4px', border: '1px solid #dee2e6' }}>
      <h5 style={{ margin: '0 0 1rem 0', fontSize: '12px', fontWeight: '600', color: '#6c757d' }}>Axle Unit {axleIndex + 1}</h5>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <label style={{ marginRight: '0.5rem', fontWeight: '500', color: '#333', width: '140px', fontSize: '0.9rem' }}>
            Number of Axles
          </label>
          <input
            type="number"
            value={axleConfiguration.numberOfAxles || ''}
            onChange={(e) => onAxleConfigurationChange(axleIndex, 'numberOfAxles', e.target.value)}
            placeholder="Enter number of axles"
            style={{
              width: '200px',
              padding: '0.5rem',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '0.9rem',
              transition: 'border-color 0.2s ease',
              boxSizing: 'border-box'
            }}
          />
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <label style={{ marginRight: '0.5rem', fontWeight: '500', color: '#333', width: '140px', fontSize: '0.9rem' }}>
            Axle Spread (m)
          </label>
          <input
            type="number"
            step="0.01"
            value={axleConfiguration.axleSpread || ''}
            onChange={(e) => onAxleConfigurationChange(axleIndex, 'axleSpread', e.target.value)}
            placeholder="Enter axle spread"
            style={{
              width: '200px',
              padding: '0.5rem',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '0.9rem',
              transition: 'border-color 0.2s ease',
              boxSizing: 'border-box'
            }}
          />
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <label style={{ marginRight: '0.5rem', fontWeight: '500', color: '#333', width: '140px', fontSize: '0.9rem' }}>
            Interaxle Spacing (m)
          </label>
          <input
            type="number"
            step="0.01"
            value={axleConfiguration.interaxleSpacing || ''}
            onChange={(e) => onAxleConfigurationChange(axleIndex, 'interaxleSpacing', e.target.value)}
            placeholder="Enter interaxle spacing"
            style={{
              width: '200px',
              padding: '0.5rem',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '0.9rem',
              transition: 'border-color 0.2s ease',
              boxSizing: 'border-box'
            }}
          />
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <label style={{ marginRight: '0.5rem', fontWeight: '500', color: '#333', width: '140px', fontSize: '0.9rem' }}>
            Axle Unit Weight (kg)
          </label>
          <input
            type="number"
            step="0.01"
            value={axleConfiguration.axleUnitWeight || ''}
            onChange={(e) => onAxleConfigurationChange(axleIndex, 'axleUnitWeight', e.target.value)}
            placeholder="Enter axle unit weight"
            style={{
              width: '200px',
              padding: '0.5rem',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '0.9rem',
              transition: 'border-color 0.2s ease',
              boxSizing: 'border-box'
            }}
          />
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <label style={{ marginRight: '0.5rem', fontWeight: '500', color: '#333', width: '140px', fontSize: '0.9rem' }}>
            Number of Tires
          </label>
          <input
            type="number"
            value={axleConfiguration.numberOfTires || ''}
            onChange={(e) => onAxleConfigurationChange(axleIndex, 'numberOfTires', e.target.value)}
            placeholder="Enter number of tires"
            style={{
              width: '200px',
              padding: '0.5rem',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '0.9rem',
              transition: 'border-color 0.2s ease',
              boxSizing: 'border-box'
            }}
          />
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <label style={{ marginRight: '0.5rem', fontWeight: '500', color: '#333', width: '140px', fontSize: '0.9rem' }}>
            Tire Size
          </label>
          <input
            type="text"
            value={axleConfiguration.tireSize || ''}
            onChange={(e) => onAxleConfigurationChange(axleIndex, 'tireSize', e.target.value)}
            placeholder="Enter tire size"
            style={{
              width: '200px',
              padding: '0.5rem',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '0.9rem',
              transition: 'border-color 0.2s ease',
              boxSizing: 'border-box'
            }}
          />
        </div>
      </div>
    </div>
  )
}

export default AxleGroup
