import React, { useState, useEffect } from 'react'
import { Policy } from 'onroute-policy-engine'
import { AxleConfiguration } from 'onroute-policy-engine/types'
import './VehicleFontTest.css'

interface VehicleFontTestProps {
  policy: Policy | null
}

const VehicleFontTest: React.FC<VehicleFontTestProps> = ({ policy }) => {
  const [fontInput, setFontInput] = useState('')
  const [fontSize, setFontSize] = useState(128)
  const [showCustomConfig, setShowCustomConfig] = useState(false)
  const [powerUnitTypes, setPowerUnitTypes] = useState<Array<[string, string]>>([])
  const [trailerTypes, setTrailerTypes] = useState<Array<[string, string]>>([])
  const [selectedPowerUnit, setSelectedPowerUnit] = useState<string>('')
  const [trailerRows, setTrailerRows] = useState<Array<{ id: string; selectedTrailer: string }>>([])
  const [powerUnitAxle1, setPowerUnitAxle1] = useState<number>(1)
  const [powerUnitAxle2, setPowerUnitAxle2] = useState<number>(1)
  const [trailerAxles, setTrailerAxles] = useState<Array<{ id: string; numberOfAxles: number }>>([])

  useEffect(() => {
    if (policy) {
      try {
        const powerTypes = policy.getPowerUnitTypes()
        setPowerUnitTypes(Array.from(powerTypes.entries()))
        
        const trailerTypes = policy.getTrailerTypes(true)
        setTrailerTypes(Array.from(trailerTypes.entries()))
      } catch (error) {
        console.error('Failed to get vehicle types:', error)
      }
    }
  }, [policy])

  // Generate vehicle display code when selections change
  useEffect(() => {
    generateVehicleDisplayCode()
  }, [selectedPowerUnit, trailerRows, powerUnitAxle1, powerUnitAxle2, trailerAxles])

  // Initialize trailer axles when trailer rows change
  useEffect(() => {
    const newTrailerAxles = trailerRows.map(row => {
      // Check if we already have axle data for this row
      const existingAxle = trailerAxles.find(axle => axle.id === row.id)
      return {
        id: row.id,
        numberOfAxles: existingAxle ? existingAxle.numberOfAxles : 1
      }
    })
    setTrailerAxles(newTrailerAxles)
  }, [trailerRows])

  // Add initial trailer row when power unit is selected
  useEffect(() => {
    if (selectedPowerUnit && trailerRows.length === 0) {
      addTrailerRow()
    }
  }, [selectedPowerUnit, trailerRows.length])

  const setInput = (value: string) => {
    setFontInput(value)
  }

  const increaseFontSize = () => {
    setFontSize(prev => prev * 2)
  }

  const decreaseFontSize = () => {
    setFontSize(prev => Math.max(prev / 2, 8)) // Minimum size of 8pt
  }

  const addTrailerRow = () => {
    const newRow = {
      id: `trailer-${Date.now()}-${Math.random()}`,
      selectedTrailer: ''
    }
    setTrailerRows(prev => [...prev, newRow])
  }

  const updateTrailerSelection = (rowId: string, trailerId: string) => {
    setTrailerRows(prev => 
      prev.map(row => 
        row.id === rowId 
          ? { ...row, selectedTrailer: trailerId }
          : row
      )
    )
  }

  const removeTrailerRow = (rowId: string) => {
    setTrailerRows(prev => prev.filter(row => row.id !== rowId))
    setTrailerAxles(prev => prev.filter(axle => axle.id !== rowId))
  }

  const updateTrailerAxles = (rowId: string, numberOfAxles: number) => {
    setTrailerAxles(prev => 
      prev.map(axle => 
        axle.id === rowId 
          ? { ...axle, numberOfAxles }
          : axle
      )
    )
  }

  const resetCustomConfiguration = () => {
    setSelectedPowerUnit('')
    setTrailerRows([])
    setTrailerAxles([])
    setPowerUnitAxle1(1)
    setPowerUnitAxle2(1)
    setFontInput('')
  }

  const generateVehicleDisplayCode = () => {
    if (!policy || !selectedPowerUnit) return

    try {
      // Build configuration array: power unit + selected trailers
      const configuration = [selectedPowerUnit]
      trailerRows.forEach(row => {
        if (row.selectedTrailer) {
          configuration.push(row.selectedTrailer)
        }
      })

      // Build axle configuration array
      const axleConfiguration: Array<AxleConfiguration> = [
        { numberOfAxles: powerUnitAxle1, axleUnitWeight: 0 },
        { numberOfAxles: powerUnitAxle2, axleUnitWeight: 0 }
      ]

      // Add trailer axle configurations (only for selected trailers)
      trailerRows.forEach(row => {
        if (row.selectedTrailer) {
          const trailerAxle = trailerAxles.find(axle => axle.id === row.id)
          if (trailerAxle) {
            axleConfiguration.push({ numberOfAxles: trailerAxle.numberOfAxles, axleUnitWeight: 0 })
          }
        }
      })

      // Generate display code
      const displayCode = policy.getVehicleDisplayCode(configuration, axleConfiguration)
      setFontInput(displayCode)
    } catch (error) {
      console.error('Failed to generate vehicle display code:', error)
    }
  }


  return (
    <div className="vehicle-font-test">
      <div className="left-column">
        <input
          type="text"
          id="fontInput"
          value={fontInput}
          onChange={(e) => setFontInput(e.target.value)}
          placeholder="Type here to test the font…"
        />

        <div className="button-group">
          <button onClick={() => setInput('TT1S12D2-1J32T4')}>Heavy haul</button>
          <button onClick={() => setInput('MC2S1-2A2-3A3--2B4')}>Mobile crane</button>
          <button onClick={() => setInput('=1U1MU2U2=SU1U3LU2U4')}>Universal configuration</button>
          <button onClick={() => setInput('=2U1=MU4+U2===XUXUXUEU')}>Many axles in a unit</button>
          <button onClick={() => {
            if (showCustomConfig) {
              resetCustomConfiguration()
            }
            setShowCustomConfig(!showCustomConfig)
          }}>Custom configuration</button>
        </div>

        {showCustomConfig && (
          <div className="custom-config-section">
            <div className="custom-config-row">
              <select 
                className="power-unit-dropdown"
                value={selectedPowerUnit}
                onChange={(e) => setSelectedPowerUnit(e.target.value)}
              >
                <option value="" disabled>Choose a Power Unit...</option>
                {powerUnitTypes.map(([id, name]) => (
                  <option key={id} value={id}>
                    {name}
                  </option>
                ))}
              </select>
                             <input 
                 type="number" 
                 className="number-input" 
                 min="1" 
                 value={powerUnitAxle1}
                 onChange={(e) => setPowerUnitAxle1(parseInt(e.target.value) || 1)}
               />
               <input 
                 type="number" 
                 className="number-input" 
                 min="1" 
                 value={powerUnitAxle2}
                 onChange={(e) => setPowerUnitAxle2(parseInt(e.target.value) || 1)}
               />
            </div>
            
                         {selectedPowerUnit && trailerRows.map((row, index) => (
              <div key={row.id} className="custom-config-row">
                <select 
                  className="trailer-dropdown"
                  value={row.selectedTrailer}
                  onChange={(e) => {
                    updateTrailerSelection(row.id, e.target.value)
                    // Add a new row if this is the last row and a trailer is selected
                    if (index === trailerRows.length - 1 && e.target.value) {
                      addTrailerRow()
                    }
                  }}
                >
                  <option value="" disabled>Choose a Trailer...</option>
                  {trailerTypes.map(([id, name]) => (
                    <option key={id} value={id}>
                      {name}
                    </option>
                  ))}
                </select>
                                  <input 
                   type="number" 
                   className="number-input" 
                   min="1" 
                   value={trailerAxles.find(axle => axle.id === row.id)?.numberOfAxles || 1}
                   onChange={(e) => updateTrailerAxles(row.id, parseInt(e.target.value) || 1)}
                   disabled={!row.selectedTrailer}
                 />
                                  {trailerRows.length > 1 && row.selectedTrailer && (
                   <button 
                     className="remove-trailer-btn"
                     onClick={() => removeTrailerRow(row.id)}
                     title="Remove trailer"
                   >
                     ×
                   </button>
                 )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="right-column">
        <section className="preview-box woff2">
          <div 
            className="preview-output"
            style={{ fontSize: `${fontSize}pt` }}
          >
            {fontInput || 'Preview'}
          </div>
          <div className="floating-font-controls">
            <button onClick={increaseFontSize} className="font-control-btn">+</button>
            <button onClick={decreaseFontSize} className="font-control-btn">−</button>
          </div>
        </section>
      </div>
    </div>
  )
}

export default VehicleFontTest
