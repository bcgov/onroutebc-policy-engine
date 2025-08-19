import React, { useState } from 'react'
import { ValidationResults } from 'onroute-policy-engine'
import { ValidationResultType } from 'onroute-policy-engine/enum'
import './ValidationResults.css'

interface ValidationResultsDisplayProps {
  results: ValidationResults
  permitType?: string
  permitApplication?: any
}

const ValidationResultsDisplay: React.FC<ValidationResultsDisplayProps> = ({ results, permitType, permitApplication }) => {
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set())
  const [costExpanded, setCostExpanded] = useState(false)
  const [permitTypeExpanded, setPermitTypeExpanded] = useState(false)

  const toggleExpanded = (index: number) => {
    const newExpandedItems = new Set(expandedItems)
    if (newExpandedItems.has(index)) {
      newExpandedItems.delete(index)
    } else {
      newExpandedItems.add(index)
    }
    setExpandedItems(newExpandedItems)
  }

  const toggleCostExpanded = () => {
    setCostExpanded(!costExpanded)
  }

  const togglePermitTypeExpanded = () => {
    setPermitTypeExpanded(!permitTypeExpanded)
  }
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
      {/* Permit Type */}
      {permitType && (
        <div className="permit-type-container">
          <div className="permit-type-summary">
            <span className="permit-type-label">Permit Type:</span>
            <span className="permit-type-value">{permitType}</span>
            <div 
              className={`permit-type-arrow ${permitTypeExpanded ? 'expanded' : ''}`}
              onClick={togglePermitTypeExpanded}
            >
              ▼
            </div>
          </div>
          {permitTypeExpanded && permitApplication && (
            <div className="permit-type-details-panel">
              <pre className="json-display">
                {JSON.stringify(permitApplication, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}

      {totalCost > 0 && (
        <div className="cost-container">
          <div className="cost-summary">
            <span className="cost-label">Permit Cost:</span>
            <span className="cost-amount">{formatCost(totalCost)}</span>
            <div 
              className={`cost-arrow ${costExpanded ? 'expanded' : ''}`}
              onClick={toggleCostExpanded}
            >
              ▼
            </div>
          </div>
          {costExpanded && (
            <div className="cost-details-panel">
              <pre className="json-display">
                {JSON.stringify(results.cost, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}

      {allValidationResults.length > 0 && (
        <div className="validation-messages">
          <h3>Validation Messages</h3>
          <div className="messages-list">
            {allValidationResults.map((result, index) => (
              <div key={index} className="message-container">
                <div 
                  className={`message-item ${getResultClass(result.type)}`}
                >
                  <div className="message-content">
                    {result.message}
                  </div>
                  <div 
                    className={`message-arrow ${expandedItems.has(index) ? 'expanded' : ''}`}
                    onClick={() => toggleExpanded(index)}
                  >
                    ▼
                  </div>
                </div>
                {expandedItems.has(index) && (
                  <div className="message-details-panel">
                    <pre className="json-display">
                      {JSON.stringify(result, null, 2)}
                    </pre>
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
