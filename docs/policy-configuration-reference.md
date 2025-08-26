# Policy Configuration Reference

## Overview

The Policy Configuration Reference describes the complete structure and format for configuring the onRouteBC Policy Engine. This document provides detailed information about all configuration properties, their purposes, and how they work together to define the validation rules and business logic for commercial vehicle permits.

## Configuration File Structure

The policy configuration is defined as a JSON object that follows the `PolicyDefinition` TypeScript interface. This configuration contains all the rules, permit types, vehicle definitions, and business logic needed to validate permit applications against British Columbia's commercial vehicle regulations.

### Root Configuration Properties

```typescript
interface PolicyDefinition {
  minPEVersion: string;
  geographicRegions: Array<GeographicRegion>;
  rangeMatrices?: Array<RangeMatrix>;
  bridgeCalculationConstants: BridgeCalculationConstants;
  commonRules: Array<RuleProperties>;
  permitTypes: Array<PermitType>;
  globalWeightDefaults: DefaultWeightDimensions;
  vehicleCategories: VehicleCategories;
  vehicleTypes: VehicleTypes;
  commodities: Array<Commodity>;
  conditions?: Array<PermitConditionDefinition>;
  standardTireSizes?: Array<StandardTireSize>;
  vehicleDisplayCodeDefaults?: VehicleDisplayCodeDefaults;
}
```

## Core Configuration Sections

### minPEVersion

**Type:** `string`  
**Required:** Yes  
**Description:** Minimum required policy engine version for compatibility

Specifies the minimum version of the policy engine required to process this configuration. This ensures that configurations are not used with incompatible engine versions.

```json
{
  "minPEVersion": "2.0.0"
}
```

### geographicRegions

**Type:** `Array<GeographicRegion>`  
**Required:** Yes  
**Description:** Geographic regions with specific policy rules

Defines distinct regions in British Columbia that may have unique policy rules. For example, the Peace region may have different permittable size dimensions than the Lower Mainland.

```json
{
  "geographicRegions": [
    {
      "id": "LMN",
      "name": "Lower Mainland"
    },
    {
      "id": "ELK", 
      "name": "Elk Valley"
    },
    {
      "id": "YHO",
      "name": "Yoho"
    },
    {
      "id": "PCE",
      "name": "Peace"
    }
  ]
}
```

**Note:** Geographic regions are only used for permits that require routing (e.g., single trip oversize). The spatial geometry is maintained by the external route planner API.

### rangeMatrices

**Type:** `Array<RangeMatrix>`  
**Required:** No  
**Description:** Range-based cost calculation matrices

Defines matrices for calculating costs based on weight ranges. Used for annual licensing fees and other weight-based cost calculations.

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
    }
  ]
}
```

### bridgeCalculationConstants

**Type:** `BridgeCalculationConstants`  
**Required:** Yes  
**Description:** Constants for bridge formula calculations

Defines the minimum weight and multiplier used in bridge formula calculations for axle group weight limits.

```json
{
  "bridgeCalculationConstants": {
    "minWeight": 18000,
    "multiplier": 30
  }
}
```

### commonRules

**Type:** `Array<RuleProperties>`  
**Required:** Yes  
**Description:** Rules that apply to all permit types

Standard validation rules that apply to every permit application, such as required company information, contact details, and vehicle information.

```json
{
  "commonRules": [
    {
      "conditions": {
        "not": {
          "fact": "permitData",
          "path": "companyName",
          "operator": "stringMinimumLength",
          "value": 1
        }
      },
      "event": {
        "type": "violation",
        "params": {
          "message": "Company is required",
          "code": "field-validation-error",
          "fieldReference": "permitData.companyName"
        }
      }
    }
  ]
}
```

### permitTypes

**Type:** `Array<PermitType>`  
**Required:** Yes  
**Description:** All available permit types and their rules

Defines all permit types available in the system, including their validation rules, cost calculations, and requirements.

```json
{
  "permitTypes": [
    {
      "id": "TROS",
      "name": "Term Oversize",
      "routingRequired": false,
      "weightDimensionRequired": false,
      "sizeDimensionRequired": false,
      "commodityRequired": false,
      "allowedVehicles": ["TRKTRAC", "SEMITRL"],
      "rules": [...],
      "costRules": [...],
      "conditions": [...]
    }
  ]
}
```

#### Permit Type Properties

- **id:** Unique identifier for the permit type
- **name:** Human-readable name
- **routingRequired:** Whether the permit requires a driving route
- **weightDimensionRequired:** Whether weight dimensions are required
- **sizeDimensionRequired:** Whether size dimensions are required
- **commodityRequired:** Whether a commodity must be specified
- **allowedVehicles:** Array of vehicle types allowed for this permit (for single-vehicle permits)
- **rules:** Validation rules specific to this permit type
- **costRules:** Cost calculation rules
- **conditions:** Required permit conditions

### globalWeightDefaults

**Type:** `DefaultWeightDimensions`  
**Required:** Yes  
**Description:** Default weight limits for vehicles

Defines default legal and permittable weight limits for power units and trailers based on axle configurations.

```json
{
  "globalWeightDefaults": {
    "powerUnits": [
      {
        "axles": 12,
        "saLegal": 6000,
        "saPermittable": 9100,
        "daLegal": 17000,
        "daPermittable": 23000
      }
    ],
    "trailers": [
      {
        "axles": 2,
        "legal": 17000,
        "permittable": 23000
      }
    ]
  }
}
```

### vehicleCategories

**Type:** `VehicleCategories`  
**Required:** Yes  
**Description:** Vehicle category definitions

Defines categories for power units and trailers, including default weight dimensions for each category.

```json
{
  "vehicleCategories": {
    "trailerCategories": [
      {
        "id": "trailer",
        "name": "Default trailer category"
      },
      {
        "id": "semi",
        "name": "Semi-Trailer",
        "defaultWeightDimensions": [...]
      }
    ],
    "powerUnitCategories": [
      {
        "id": "powerunit",
        "name": "Default power unit category"
      },
      {
        "id": "multisteer",
        "name": "Power units supporting greater than tandem steer axle units",
        "defaultWeightDimensions": [...]
      }
    ]
  }
}
```

### vehicleTypes

**Type:** `VehicleTypes`  
**Required:** Yes  
**Description:** All available vehicle types

Defines all power unit and trailer types available in the system, including their categories and display codes.

```json
{
  "vehicleTypes": {
    "powerUnitTypes": [
      {
        "id": "TRKTRAC",
        "name": "Truck Tractors",
        "category": "powerunit",
        "displayCodePrefix": "TT",
        "displayCodeSteerAxle": "S",
        "displayCodeDriveAxle": "D"
      }
    ],
    "trailerTypes": [
      {
        "id": "SEMITRL",
        "name": "Semi-Trailers",
        "category": "semi",
        "displayCode": "T"
      }
    ]
  }
}
```

### commodities

**Type:** `Array<Commodity>`  
**Required:** Yes  
**Description:** Commodity definitions and vehicle combinations

Defines commodities that can be transported and the vehicle combinations permitted for each commodity.

```json
{
  "commodities": [
    {
      "id": "XXXXXXX",
      "name": "None",
      "powerUnits": [
        {
          "type": "TRKTRAC",
          "trailers": [
            {
              "type": "SEMITRL",
              "jeep": true,
              "booster": true,
              "selfIssue": true,
              "sizePermittable": true,
              "sizeDimensions": [...],
              "weightPermittable": true
            }
          ]
        }
      ]
    }
  ]
}
```

## Rule System

### Rule Structure

Rules use the [JSON Rules Engine](https://github.com/cachecontrol/json-rules-engine) syntax and consist of:

- **conditions:** The logical conditions that must be met
- **event:** The action to take when conditions are met

```json
{
  "conditions": {
    "all": [
      {
        "fact": "permitData",
        "path": "permitDuration",
        "operator": "greaterThan",
        "value": 0
      }
    ]
  },
  "event": {
    "type": "violation",
    "params": {
      "message": "Duration must be greater than zero",
      "code": "field-validation-error",
      "fieldReference": "permitData.permitDuration"
    }
  }
}
```

### Common Operators

- **equal:** Exact equality
- **notEqual:** Inequality
- **greaterThan:** Greater than comparison
- **lessThan:** Less than comparison
- **greaterThanInclusive:** Greater than or equal
- **lessThanInclusive:** Less than or equal
- **in:** Check if value is in array
- **stringMinimumLength:** Check string length
- **regex:** Regular expression matching
- **isEmptyArray:** Check if array is empty

### Fact References

Rules can reference data using facts:

- **permitData:** The permit application data
- **validationDate:** Current validation date
- **allowedVehicles:** Allowed vehicles for permit type
- **daysInPermitYear:** Days in the permit year

## Cost Rules

Cost rules define how permit costs are calculated:

### Fixed Cost

```json
{
  "fact": "fixedCost",
  "params": {
    "cost": 15
  }
}
```

### Cost Per Month

```json
{
  "fact": "costPerMonth",
  "params": {
    "cost": 30
  }
}
```

### Cost Per Kilometer

```json
{
  "fact": "costPerKilometre",
  "params": {
    "cost": 0.07,
    "minValue": 10,
    "maxValue": 140
  }
}
```

### Range Matrix Cost Lookup

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

For detailed information about configuring range matrix cost lookups, see [Range Matrix Cost Lookup Configuration](./range-matrix-cost-lookup.md).

## Size Dimensions

Size dimensions define permittable vehicle dimensions for different regions:

```json
{
  "sizeDimensions": [
    {
      "fp": 3,
      "rp": 6.5,
      "w": 3.8,
      "h": 4.72,
      "l": 31,
      "regions": [
        {
          "region": "PCE",
          "h": 5.33
        }
      ]
    }
  ]
}
```

**Properties:**
- **fp:** Front projection (meters)
- **rp:** Rear projection (meters)
- **w:** Width (meters)
- **h:** Height (meters)
- **l:** Length (meters)
- **regions:** Region-specific overrides

## Vehicle Configuration

### Power Unit Configuration

Power units are defined with their axle configurations and weight limits:

```json
{
  "axles": 12,
  "saLegal": 6000,
  "saPermittable": 9100,
  "daLegal": 17000,
  "daPermittable": 23000
}
```

**Properties:**
- **axles:** Axle code (e.g., 12 = 1 steer + 2 drive axles)
- **saLegal:** Steer axle legal weight limit
- **saPermittable:** Steer axle permittable weight limit
- **daLegal:** Drive axle legal weight limit
- **daPermittable:** Drive axle permittable weight limit

### Trailer Configuration

Trailers are defined with their axle configurations and weight limits:

```json
{
  "axles": 2,
  "legal": 17000,
  "permittable": 23000
}
```

**Properties:**
- **axles:** Number of axles
- **legal:** Legal weight limit
- **permittable:** Permittable weight limit


This enables Long Combination Vehicle (LCV) permits when set to true.

## Configuration Validation

The policy engine validates configuration files against the `PolicyDefinition` interface. Common validation checks include:

- Required properties are present
- Array properties contain valid objects
- Rule syntax is valid JSON Rules Engine format
- Vehicle type references are consistent
- Geographic region IDs are unique

## Best Practices

1. **Version Control:** Always specify a `minPEVersion` to ensure compatibility
2. **Rule Organization:** Use `commonRules` for rules that apply to all permits
3. **Vehicle Categories:** Group similar vehicles into categories for easier management
4. **Regional Variations:** Use geographic regions for region-specific rules
5. **Cost Calculations:** Use range matrices for complex weight-based cost calculations
6. **Documentation:** Include descriptive names for all configuration elements
7. **Testing:** Validate configurations with unit tests before deployment

## Example Configuration

See the sample configuration files in `src/_test/policy-config/` for complete examples of working policy configurations.