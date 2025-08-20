import React from 'react'

interface ValidationMethodSelectorProps {
  validationMethod: 'local' | 'api'
  onValidationMethodChange: (method: 'local' | 'api') => void
}

const ValidationMethodSelector: React.FC<ValidationMethodSelectorProps> = ({
  validationMethod,
  onValidationMethodChange
}) => {
  return (
    <div className="validation-method-selector">
      <label>
        <input
          type="radio"
          name="validationMethod"
          value="local"
          checked={validationMethod === 'local'}
          onChange={(e) => onValidationMethodChange(e.target.value as 'local' | 'api')}
        />
        Local Validation (Policy Engine)
      </label>
      <label>
        <input
          type="radio"
          name="validationMethod"
          value="api"
          checked={validationMethod === 'api'}
          onChange={(e) => onValidationMethodChange(e.target.value as 'local' | 'api')}
        />
        API Validation (Backend)
      </label>
    </div>
  )
}

export default ValidationMethodSelector
