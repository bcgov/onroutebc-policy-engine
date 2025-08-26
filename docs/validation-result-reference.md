# Validation Result Reference

## Overview

The onRouteBC Policy Engine returns comprehensive validation results when processing permit applications. This document describes the structure and meaning of these results, including violations, warnings, information messages, requirements, and cost calculations.

## Validation Process

Permits are validated by calling the `validate` method on an instantiated Policy object:

```typescript
import { Policy } from 'onroute-policy-engine';

const policy = new Policy(policyDefinition);
const validationResults = await policy.validate(permitApplication);
```

The `validate` method returns a `ValidationResults` object containing arrays of different types of validation messages.

## ValidationResults Structure

The `ValidationResults` class contains five main properties, each containing an array of `ValidationResult` objects:

```typescript
interface ValidationResults {
  violations: Array<ValidationResult>;
  requirements: Array<ValidationResult>;
  warnings: Array<ValidationResult>;
  information: Array<ValidationResult>;
  cost: Array<ValidationResult>;
}
```

## ValidationResult Structure

Each individual validation result contains the following properties:

```typescript
interface ValidationResult {
  type: string;           // Type of result (violation, warning, etc.)
  code: string;           // Result code for categorization
  message: string;        // Human-readable message
  fieldReference?: string; // Optional field reference for UI highlighting
  cost?: number;          // Optional cost amount for cost results
  details?: Array<string>; // Optional additional details
}
```

## Result Types

### Violations

**Type:** `"violation"`  
**Purpose:** Policy violations that prevent permit approval

Violations represent critical issues that must be resolved before a permit can be approved. A permit application is considered valid only when the `violations` array is empty.

```json
{
  "violations": [
    {
      "type": "violation",
      "code": "field-validation-error",
      "message": "Duration must be in 30 day increments or a full year",
      "fieldReference": "permitData.permitDuration"
    }
  ]
}
```

**Common Violation Codes:**
- `field-validation-error`: Invalid field values or missing required fields
- `policy-validation-error`: Policy rule violations
- `permit-type-unknown`: Invalid permit type specified
- `configuration-invalid`: Configuration-related errors

### Requirements

**Type:** `"requirement"`  
**Purpose:** Additional requirements that must be met

Requirements indicate additional permits, documents, or conditions that must be satisfied for the permit to be valid.

```json
{
  "requirements": [
    {
      "type": "requirement",
      "code": "general-result",
      "message": "Additional permit required for this vehicle configuration"
    }
  ]
}
```

### Warnings

**Type:** `"warning"`  
**Purpose:** Non-critical issues that should be addressed

Warnings indicate potential problems or recommendations that don't prevent permit approval but should be considered.

```json
{
  "warnings": [
    {
      "type": "warning",
      "code": "general-result",
      "message": "Consider reducing vehicle weight for better efficiency"
    }
  ]
}
```

### Information

**Type:** `"information"`  
**Purpose:** Informational messages for the user

Information messages provide helpful context or confirmations that don't require action.

```json
{
  "information": [
    {
      "type": "information",
      "code": "no-fee-client",
      "message": "No fee applies to this permit application"
    }
  ]
}
```

**Common Information Codes:**
- `no-fee-client`: Indicates no fee applies (special authorization)
- `lcv-carrier`: Long Combination Vehicle carrier status
- `general-result`: General informational message

### Cost

**Type:** `"cost"`  
**Purpose:** Permit cost calculations

Cost results contain the calculated permit fees. Multiple cost results should be summed to get the total permit cost.

```json
{
  "cost": [
    {
      "type": "cost",
      "code": "cost-value",
      "message": "Calculated permit cost",
      "cost": 30
    }
  ]
}
```

**Cost Calculation:**
- Multiple cost results are common when permits have both fixed and variable costs
- Sum all `cost` properties to get the total permit fee
- Cost is in Canadian dollars

## Valid Permit Applications

A permit application is considered valid when:

1. **No Violations:** The `violations` array is empty
2. **Valid Cost:** The `cost` array contains at least one result (even if cost is 0)

```json
{
  "violations": [],
  "requirements": [],
  "warnings": [],
  "information": [],
  "cost": [
    {
      "type": "cost",
      "code": "cost-value",
      "message": "Calculated permit cost",
      "cost": 30
    }
  ]
}
```

## Field References

The `fieldReference` property provides the path to the specific field that caused a validation issue. This is useful for:

- **UI Highlighting:** Highlighting problematic form fields
- **Error Placement:** Positioning error messages near relevant fields
- **Debugging:** Identifying the source of validation problems

**Example Field References:**
- `permitData.permitDuration` - Permit duration field
- `permitData.companyName` - Company name field
- `permitData.vehicleDetails.vin` - Vehicle identification number
- `permitData.contactDetails.email` - Contact email address

## Cost Calculation Examples

### Single Cost Result

```json
{
  "cost": [
    {
      "type": "cost",
      "code": "cost-value",
      "message": "Calculated permit cost",
      "cost": 30
    }
  ]
}
```

### Multiple Cost Results

```json
{
  "cost": [
    {
      "type": "cost",
      "code": "cost-value",
      "message": "Calculated permit cost",
      "cost": 15
    },
    {
      "type": "cost",
      "code": "cost-value",
      "message": "Calculated permit cost",
      "cost": 5
    }
  ]
}
```

**Total Cost:** 15 + 5 = 20 Canadian dollars

### No Fee Application

```json
{
  "cost": [
    {
      "type": "cost",
      "code": "cost-value",
      "message": "Calculated permit cost",
      "cost": 0
    }
  ],
  "information": [
    {
      "type": "information",
      "code": "no-fee-client",
      "message": "No fee applies to this permit application"
    }
  ]
}
```

## Axle Calculation Results

For permits requiring axle calculations, the `runAxleCalculation` method returns `AxleCalcResults`:

```typescript
interface AxleCalcResults {
  results: Array<PolicyCheckResult>;
  totalOverload: number;
}
```

### Policy Check Results

Each policy check result contains:

```typescript
interface PolicyCheckResult {
  id: string;                    // Policy check identifier
  result: PolicyCheckResultType; // "pass" or "fail"
  message: string;               // Description of the check result
  actualWeight?: number;         // Actual weight measured
  thresholdWeight?: number;      // Maximum or minimum allowed weight
}
```

### Axle Unit Results

Results for individual axle units include:

```typescript
interface AxleUnitPolicyCheckResult extends PolicyCheckResult {
  axleUnit: number; // The axle unit number being checked
}
```

### Axle Group Results

Results for groups of axles include:

```typescript
interface AxleGroupPolicyCheckResult extends PolicyCheckResult {
  startAxleUnit: number; // Starting axle unit number
  endAxleUnit: number;   // Ending axle unit number
}
```

## Common Validation Scenarios

### Valid Permit Application

```json
{
  "violations": [],
  "requirements": [],
  "warnings": [],
  "information": [],
  "cost": [
    {
      "type": "cost",
      "code": "cost-value",
      "message": "Calculated permit cost",
      "cost": 30
    }
  ]
}
```

### Invalid Permit Application

```json
{
  "violations": [
    {
      "type": "violation",
      "code": "field-validation-error",
      "message": "Company name is required",
      "fieldReference": "permitData.companyName"
    },
    {
      "type": "violation",
      "code": "field-validation-error",
      "message": "Permit start date cannot be in the past",
      "fieldReference": "permitData.startDate"
    }
  ],
  "requirements": [],
  "warnings": [],
  "information": [],
  "cost": []
}
```

### Permit with Warnings

```json
{
  "violations": [],
  "requirements": [],
  "warnings": [
    {
      "type": "warning",
      "code": "general-result",
      "message": "Increasing licensed GVW may be more efficient if multiple overweight trips are run in a given year"
    }
  ],
  "information": [],
  "cost": [
    {
      "type": "cost",
      "code": "cost-value",
      "message": "Calculated permit cost",
      "cost": 45
    }
  ]
}
```

## Error Handling

### Missing or Invalid Data

When permit data is missing or invalid:

- **Missing Required Fields:** Results in violations with `field-validation-error` code
- **Invalid Field Values:** Results in violations with appropriate error messages
- **Invalid Permit Type:** Results in `permit-type-unknown` violation

### Configuration Errors

When policy configuration is invalid:

- **Missing Policy Definition:** Results in `configuration-invalid` violation
- **Invalid Rule Syntax:** Results in `configuration-invalid` violation
- **Missing Vehicle Types:** Results in policy validation errors

## Best Practices

### For Application Developers

1. **Check Violations First:** Always check the `violations` array before proceeding
2. **Sum Cost Results:** Add all cost values to get the total permit fee
3. **Use Field References:** Display error messages near the relevant form fields
4. **Handle All Result Types:** Process violations, warnings, and information appropriately
5. **Validate Input:** Ensure permit data is complete before validation

### For Policy Configuration

1. **Clear Messages:** Provide descriptive, user-friendly error messages
2. **Specific Field References:** Use precise field paths for better UX
3. **Appropriate Result Types:** Use the correct result type for each validation
4. **Comprehensive Coverage:** Ensure all validation scenarios are covered

## Integration Examples

### JavaScript/TypeScript

```typescript
const validationResults = await policy.validate(permitApplication);

// Check if permit is valid
if (validationResults.violations.length === 0) {
  // Permit is valid
  const totalCost = validationResults.cost.reduce((sum, cost) => sum + cost.cost, 0);
  console.log(`Permit approved. Cost: $${totalCost}`);
} else {
  // Handle violations
  validationResults.violations.forEach(violation => {
    console.error(`Violation: ${violation.message}`);
    if (violation.fieldReference) {
      console.error(`Field: ${violation.fieldReference}`);
    }
  });
}

// Display warnings and information
validationResults.warnings.forEach(warning => {
  console.warn(`Warning: ${warning.message}`);
});

validationResults.information.forEach(info => {
  console.info(`Info: ${info.message}`);
});
```

### React Component Example

```jsx
function PermitValidationResult({ validationResults }) {
  const totalCost = validationResults.cost.reduce((sum, cost) => sum + cost.cost, 0);
  
  return (
    <div>
      {validationResults.violations.length > 0 && (
        <div className="violations">
          <h3>Violations</h3>
          {validationResults.violations.map((violation, index) => (
            <div key={index} className="error">
              <span>{violation.message}</span>
              {violation.fieldReference && (
                <span className="field-ref">Field: {violation.fieldReference}</span>
              )}
            </div>
          ))}
        </div>
      )}
      
      {validationResults.cost.length > 0 && (
        <div className="cost">
          <h3>Permit Cost</h3>
          <span className="total-cost">Total: ${totalCost}</span>
        </div>
      )}
    </div>
  );
}
```