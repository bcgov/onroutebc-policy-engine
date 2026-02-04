# Range Matrix Cost Lookup Configuration

## Overview

The `rangeMatrixCostLookup` is a sophisticated cost calculation rule that allows you to determine permit costs based on weight ranges defined in matrix tables. This is commonly used for calculating annual licensing fees, quarterly fees, or other weight-based cost structures.

## How It Works

The `rangeMatrixCostLookup` fact performs the following steps:

1. **Key Selection:** Uses a lookup key from the permit data to determine which matrix to use
2. **Matrix Lookup:** Finds the appropriate range matrix based on the key
3. **Value Matching:** Matches the vehicle weight against the matrix ranges
4. **Cost Calculation:** Applies the matched cost value, optionally dividing by a divisor

## Configuration Structure

```json
{
  "fact": "rangeMatrixCostLookup",
  "params": {
    "divisor": 12,
    "matrixMap": [
      {
        "key": "none",
        "value": "annualFeeCV"
      },
      {
        "key": "x-plated",
        "value": "annualFeeIndustrial"
      },
      {
        "key": "commercial-passenger",
        "value": "annualFeePassenger"
      }
    ],
    "rangeLookupKey": "conditionalLicensingFee",
    "matrixFactValue": "vehicleConfiguration.loadedGVW"
  }
}
```

## Parameters

### divisor (optional)
**Type:** `number`  
**Description:** Divides the final cost by this value. Commonly used to convert annual fees to monthly (12) or quarterly (4) amounts.

### matrixMap
**Type:** `Array<{key: string, value: string}>`  
**Description:** Maps lookup keys to matrix IDs. The key is matched against the `rangeLookupKey` value, and the corresponding matrix ID is used for cost lookup.

### rangeLookupKey
**Type:** `string`  
**Description:** The path to the permit data field that contains the lookup key. This value determines which matrix to use from the `matrixMap`.

### matrixFactValue
**Type:** `string`  
**Description:** The path to the permit data field that contains the numeric value (typically vehicle weight) used to look up the cost in the selected matrix.

## Range Matrix Definition

Range matrices must be defined in the `rangeMatrices` section of your policy configuration:

```json
{
  "rangeMatrices": [
    {
      "id": "annualFeeCV",
      "name": "Annual licensing fee for commercial vehicle",
      "matrix": [
        {
          "min": 0,
          "max": 500,
          "value": 42
        },
        {
          "min": 501,
          "max": 1000,
          "value": 49
        },
        {
          "min": 1001,
          "max": 1500,
          "value": 60
        }
      ]
    }
  ]
}
```

### Matrix Properties

- **id:** Unique identifier referenced in the `matrixMap`
- **name:** Descriptive name for the matrix
- **matrix:** Array of range entries with min, max, and value properties

### Range Entry Properties

- **min:** Minimum value for the range (inclusive)
- **max:** Maximum value for the range (inclusive)
- **value:** Cost value for this range

## Common Use Cases

### 1. Annual Fee Conversion

Convert annual licensing fees to monthly or quarterly amounts:

```json
{
  "fact": "rangeMatrixCostLookup",
  "params": {
    "divisor": 12,
    "matrixMap": [
      {
        "key": "none",
        "value": "annualFeeCV"
      }
    ],
    "rangeLookupKey": "conditionalLicensingFee",
    "matrixFactValue": "vehicleConfiguration.loadedGVW"
  }
}
```

### 2. Multiple Fee Types

Handle different fee structures based on vehicle type:

```json
{
  "fact": "rangeMatrixCostLookup",
  "params": {
    "divisor": 4,
    "matrixMap": [
      {
        "key": "none",
        "value": "annualFeeCV"
      },
      {
        "key": "x-plated",
        "value": "annualFeeIndustrial"
      },
      {
        "key": "farm-vehicle",
        "value": "annualFeeFarm"
      },
      {
        "key": "commercial-passenger",
        "value": "annualFeePassenger"
      }
    ],
    "rangeLookupKey": "conditionalLicensingFee",
    "matrixFactValue": "vehicleConfiguration.loadedGVW"
  }
}
```

### 3. Farm Vehicle Special Handling

Use different weight fields for farm vehicles:

```json
{
  "fact": "rangeMatrixCostLookup",
  "params": {
    "divisor": 12,
    "matrixMap": [
      {
        "key": "farm-vehicle",
        "value": "annualFeeFarm"
      }
    ],
    "rangeLookupKey": "conditionalLicensingFee",
    "matrixFactValue": "vehicleConfiguration.netWeight"
  }
}
```

## Complete Example

Here's a complete example showing how to configure range matrix cost lookup for a non-resident single trip permit:

```json
{
  "rangeMatrices": [
    {
      "id": "annualFeeCV",
      "name": "Annual licensing fee for commercial vehicle",
      "matrix": [
        {
          "min": 0,
          "max": 500,
          "value": 42
        },
        {
          "min": 501,
          "max": 1000,
          "value": 49
        }
      ]
    },
    {
      "id": "annualFeeIndustrial",
      "name": "Annual licensing fee for industrial machine",
      "matrix": [
        {
          "min": 0,
          "max": 2000,
          "value": 45
        },
        {
          "min": 2001,
          "max": 5000,
          "value": 69
        }
      ]
    }
  ],
  "permitTypes": [
    {
      "id": "NRSCV",
      "name": "Non-Resident Single Trip",
      "costRules": [
        {
          "fact": "rangeMatrixCostLookup",
          "params": {
            "divisor": 12,
            "matrixMap": [
              {
                "key": "none",
                "value": "annualFeeCV"
              },
              {
                "key": "x-plated",
                "value": "annualFeeIndustrial"
              },
              {
                "key": "commercial-passenger",
                "value": "annualFeePassenger"
              }
            ],
            "rangeLookupKey": "conditionalLicensingFee",
            "matrixFactValue": "vehicleConfiguration.loadedGVW"
          }
        }
      ]
    }
  ]
}
```

## Calculation Process

1. **Extract Lookup Key:** Get the value from `permitData.conditionalLicensingFee` (e.g., "none", "x-plated", "commercial-passenger")
2. **Find Matrix:** Look up the matrix ID in `matrixMap` using the key
3. **Get Weight Value:** Extract the weight from `permitData.vehicleConfiguration.loadedGVW`
4. **Match Range:** Find the matrix entry where `min <= weight <= max`
5. **Calculate Cost:** Apply the matrix value, divide by divisor if specified
6. **Return Result:** Return the calculated cost

## Error Handling

- If no matching matrix is found, cost defaults to 0
- If no matching range is found in the matrix, cost defaults to 0
- Missing or invalid weight values result in 0 cost
- Invalid matrix references are logged but don't cause errors

## Best Practices

1. **Use Descriptive Matrix IDs:** Choose clear, meaningful names for your matrices
2. **Handle Edge Cases:** Ensure your ranges cover all possible weight values
3. **Test Thoroughly:** Verify calculations with various weight values and lookup keys
4. **Document Matrix Purpose:** Include clear descriptions in matrix names
5. **Consider Performance:** Keep matrix sizes reasonable for lookup performance
6. **Validate Ranges:** Ensure ranges don't overlap and cover the full spectrum

## Troubleshooting

### Common Issues

1. **Cost Always Zero:**
   - Check that `rangeLookupKey` path exists in permit data
   - Verify `matrixFactValue` path contains valid numeric data
   - Ensure matrix ID in `matrixMap` matches a defined matrix

2. **Wrong Matrix Selected:**
   - Verify `rangeLookupKey` value matches a key in `matrixMap`
   - Check that the lookup key value is exactly as expected

3. **Incorrect Cost Calculation:**
   - Verify weight value falls within matrix ranges
   - Check divisor value is appropriate for your use case
   - Ensure matrix values are correct for your fee structure
