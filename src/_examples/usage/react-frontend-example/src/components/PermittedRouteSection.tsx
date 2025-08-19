import React from 'react'

interface PermittedRouteData {
  highwaySequence: string
  routeOrigin: string
  routeDestination: string
  routeExitPoint: string
  routeTotalDistance: string
}

interface PermittedRouteSectionProps {
  data: PermittedRouteData
  onChange: (name: string, value: string) => void
  isCollapsed: boolean
  onToggleCollapse: () => void
}

const PermittedRouteSection: React.FC<PermittedRouteSectionProps> = ({
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
        Permitted Route
        <span className={`section-arrow ${isCollapsed ? 'collapsed' : 'expanded'}`}>
          ▼
        </span>
      </h3>
      {!isCollapsed && (
        <>
          <div className="form-group">
            <label htmlFor="highwaySequence">Highway Sequence:</label>
            <input
              type="text"
              id="highwaySequence"
              name="highwaySequence"
              value={data.highwaySequence}
              onChange={handleChange}
              placeholder="Enter highway sequence (comma-separated)"
            />
          </div>

          <div className="form-group">
            <label htmlFor="routeOrigin">Origin:</label>
            <input
              type="text"
              id="routeOrigin"
              name="routeOrigin"
              value={data.routeOrigin}
              onChange={handleChange}
              placeholder="Enter route origin"
            />
          </div>

          <div className="form-group">
            <label htmlFor="routeDestination">Destination:</label>
            <input
              type="text"
              id="routeDestination"
              name="routeDestination"
              value={data.routeDestination}
              onChange={handleChange}
              placeholder="Enter route destination"
            />
          </div>

          <div className="form-group">
            <label htmlFor="routeExitPoint">Exit Point:</label>
            <input
              type="text"
              id="routeExitPoint"
              name="routeExitPoint"
              value={data.routeExitPoint}
              onChange={handleChange}
              placeholder="Enter exit point (optional)"
            />
          </div>

          <div className="form-group">
            <label htmlFor="routeTotalDistance">Total Distance (km):</label>
            <input
              type="number"
              id="routeTotalDistance"
              name="routeTotalDistance"
              value={data.routeTotalDistance}
              onChange={handleChange}
              placeholder="Enter total distance in kilometers"
              min="0"
              step="0.1"
            />
          </div>
        </>
      )}
    </div>
  )
}

export default PermittedRouteSection
export type { PermittedRouteData }
