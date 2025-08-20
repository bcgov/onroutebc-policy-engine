import React from 'react'
import FormInput from './FormInput'

interface PermittedRouteSectionProps {
  isCollapsed: boolean
  onToggleCollapse: () => void
}

const PermittedRouteSection: React.FC<PermittedRouteSectionProps> = ({
  isCollapsed,
  onToggleCollapse
}) => {
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
          <FormInput
            name="highwaySequence"
            label="Highway Sequence"
            placeholder="Enter highway sequence (comma-separated)"
          />

          <FormInput
            name="routeOrigin"
            label="Origin"
            placeholder="Enter route origin"
          />

          <FormInput
            name="routeDestination"
            label="Destination"
            placeholder="Enter route destination"
          />

          <FormInput
            name="routeExitPoint"
            label="Exit Point"
            placeholder="Enter exit point (optional)"
          />

          <FormInput
            name="routeTotalDistance"
            label="Total Distance (km)"
            type="number"
            placeholder="Enter total distance in kilometers"
          />
        </>
      )}
    </div>
  )
}

export default PermittedRouteSection
