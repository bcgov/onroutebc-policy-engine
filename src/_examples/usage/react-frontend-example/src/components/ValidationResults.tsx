import React from 'react'
import { ValidationResults } from 'onroute-policy-engine'
import { ValidationResultType } from 'onroute-policy-engine/enum'
import './ValidationResults.css'

interface ValidationResultsDisplayProps {
  results: ValidationResults
}

const ValidationResultsDisplay: React.FC<ValidationResultsDisplayProps> = ({ results }) => {
  const getResultIcon = (type: string) => {
    switch (type) {
      case ValidationResultType.Violation:
        return '❌'
      case ValidationResultType.Warning:
        return '⚠️'
      case ValidationResultType.Information:
        return 'ℹ️'
      default:
        return '✅'
    }
  }

  const getResultClass = (type: string) => {
    switch (type) {
      case ValidationResultType.Violation:
        return 'error'
      case ValidationResultType.Warning:
        return 'warning'
      case ValidationResultType.Information:
        return 'info'
      default:
        return 'success'
    }
  }

  const getResultTitle = (type: string) => {
    switch (type) {
      case ValidationResultType.Violation:
        return 'Error'
      case ValidationResultType.Warning:
        return 'Warning'
      case ValidationResultType.Information:
        return 'Information'
      default:
        return 'Success'
    }
  }

  const formatCost = (cost: number) => {
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD'
    }).format(cost)
  }

  // Calculate total cost from cost array
  const totalCost = results.cost.reduce((total, costResult) => {
    return total + (costResult.cost || 0)
  }, 0)

  // Combine all validation results
  const allValidationResults = [
    ...results.violations,
    ...results.requirements,
    ...results.warnings,
    ...results.information
  ]

  return (
    <div className="validation-results">
      <h2>Validation Results</h2>
      
      {totalCost > 0 && (
        <div className="cost-summary">
          <h3>Permit Cost</h3>
          <div className="cost-amount">
            {formatCost(totalCost)}
          </div>
        </div>
      )}

      {allValidationResults.length > 0 && (
        <div className="validation-messages">
          <h3>Validation Messages</h3>
          <div className="messages-list">
            {allValidationResults.map((result, index) => (
              <div 
                key={index} 
                className={`message-item ${getResultClass(result.type)}`}
              >
                <div className="message-header">
                  <span className="message-icon">{getResultIcon(result.type)}</span>
                  <span className="message-type">{getResultTitle(result.type)}</span>
                  {result.code && (
                    <span className="message-code">({result.code})</span>
                  )}
                </div>
                <div className="message-content">
                  {result.message}
                </div>
                {result.fieldReference && (
                  <div className="message-details">
                    <strong>Field:</strong> {result.fieldReference}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {allValidationResults.length === 0 && totalCost === 0 && (
        <div className="no-results">
          <p>No validation results to display.</p>
        </div>
      )}
    </div>
  )
}

export default ValidationResultsDisplay
