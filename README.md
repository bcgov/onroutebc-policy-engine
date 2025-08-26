# onRouteBC Policy Engine

A comprehensive JSON-based rules engine for validating commercial vehicle permit applications against British Columbia's transportation policy regulations.

[![License: Apache-2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7.2-blue.svg)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)

## Overview

The onRouteBC Policy Engine is a sophisticated validation library designed to ensure commercial vehicle permit applications comply with British Columbia's transportation regulations. It provides a flexible, rule-based system that can validate complex vehicle configurations, weight distributions, axle arrangements, and permit requirements.

### Key Features

- **Comprehensive Vehicle Validation**: Validates vehicle configurations, weights, dimensions, and axle arrangements
- **Policy-Driven Rules**: Uses JSON-based policy definitions for flexible rule configuration
- **Bridge Formula Calculations**: Implements provincial bridge formula requirements for axle group weight limits
- **Tire Load Validation**: Ensures tire configurations meet safety and regulatory requirements
- **Weight Distribution Checks**: Validates proper weight distribution across vehicle axles
- **Permit Type Support**: Handles multiple permit types including Term Oversize, Single Trip Oversize, and Motive Fuel
- **Commodity-Based Validation**: Supports commodity-specific permit requirements
- **Extensible Architecture**: Built on json-rules-engine with custom operators for complex validations

## Installation

```bash
npm install onroute-policy-engine
```

## Quick Start

```typescript
import Policy from 'onroute-policy-engine';

// Load your policy definition
const policyDefinition = require('./policy-definition.json');

// Create policy instance
const policy = new Policy(policyDefinition);

// Validate a permit application
const permitApplication = {
  permitType: 'TROS',
  permitData: {
    // Your permit data here
  }
};

const results = await policy.validate(permitApplication);
console.log(results);
```

## Core Concepts

### Policy Definition

The policy engine uses a JSON-based policy definition that describes:
- **Permit Types**: Different types of permits (TROS, STOS, MFP, etc.)
- **Vehicle Types**: Power units and trailers with their characteristics
- **Validation Rules**: Complex rules for weight, dimension, and configuration validation
- **Commodities**: Cargo types that affect permit requirements

### Vehicle Configuration

A vehicle configuration consists of:
- **Power Units**: The primary vehicle (truck, tractor, etc.)
- **Trailers**: Additional units being towed
- **Axle Configurations**: Detailed axle arrangements with weights and dimensions

### Validation Results

The engine returns comprehensive validation results including:
- **Policy Violations**: Specific rule violations with detailed messages
- **Informational Messages**: Guidance and recommendations
- **Axle Calculations**: Bridge formula and weight distribution results

## API Reference

### Main Policy Class

```typescript
class Policy {
  constructor(policyDefinition: PolicyDefinition)
  
  // Core validation
  validate(permitApplication: PermitApplication): Promise<ValidationResults>
  
  // Vehicle configuration validation
  runAxleCalculation(
    vehicleConfiguration: string[],
    axleConfiguration: AxleConfiguration[],
    licensedGVW: number
  ): AxleCalcResults
  
  // Policy information
  getPermitTypes(): Map<string, string>
  getCommodities(permitTypeId?: string): Map<string, string>
  getPowerUnitTypes(): Map<string, string>
  getTrailerTypes(): Map<string, string>
  
  // Vehicle configuration helpers
  getNextPermittableVehicles(
    permitTypeId: string,
    commodityId: string,
    currentConfiguration: string[]
  ): Map<string, string>
  
  // Weight and dimension calculations
  getDefaultPowerUnitWeight(vehicleType: string, axleCode: number): WeightDimension[]
  getDefaultTrailerWeight(vehicleType: string, axles: number): TrailerWeightDimension[]
  calculateBridge(axleConfiguration: AxleConfiguration[]): BridgeCalculationResult[]
}
```

### Key Types

```typescript
interface PermitApplication {
  permitType: string;
  permitData: any;
}

interface ValidationResults {
  results: ValidationResult[];
  summary: {
    totalViolations: number;
    totalWarnings: number;
    totalInfo: number;
  };
}

interface AxleConfiguration {
  numberOfAxles: number;
  numberOfTires?: number;
  tireSize?: number;
  axleUnitWeight: number;
  axleSpread?: number;
}
```

## Usage Examples

### Basic Permit Validation

```typescript
import Policy from 'onroute-policy-engine';

const policy = new Policy(policyDefinition);

const permitApp = {
  permitType: 'TROS',
  permitData: {
    vehicleConfiguration: ['TRKTRAC', 'SEMITRL'],
    axleConfiguration: [
      { numberOfAxles: 2, axleUnitWeight: 12000, numberOfTires: 4, tireSize: 445 },
      { numberOfAxles: 3, axleUnitWeight: 34000, numberOfTires: 12, tireSize: 445 },
      { numberOfAxles: 3, axleUnitWeight: 34000, numberOfTires: 12, tireSize: 445 }
    ],
    licensedGVW: 63500
  }
};

const results = await policy.validate(permitApp);
console.log(`Validation completed with ${results.violations.length} violations`);
```

### Axle Calculation Validation

```typescript
// Validate axle configuration against policy rules
const axleResults = policy.runAxleCalculation(
  ['TRKTRAC', 'SEMITRL'],
  [
    { numberOfAxles: 2, axleUnitWeight: 12000, numberOfTires: 4, tireSize: 445 },
    { numberOfAxles: 3, axleUnitWeight: 34000, numberOfTires: 12, tireSize: 445 },
    { numberOfAxles: 3, axleUnitWeight: 34000, numberOfTires: 12, tireSize: 445 }
  ],
  63500
);

console.log('Axle validation results:', axleResults.results);
```

### Getting Available Options

```typescript
// Get all available permit types
const permitTypes = policy.getPermitTypes();
console.log('Available permit types:', Array.from(permitTypes.entries()));

// Get commodities for a specific permit type
const commodities = policy.getCommodities('TROS');
console.log('TROS commodities:', Array.from(commodities.entries()));

// Get valid next vehicles for a configuration
const nextVehicles = policy.getNextPermittableVehicles(
  'STOS',
  'IMCONTN',
  ['TRKTRAC']
);
console.log('Valid next vehicles:', Array.from(nextVehicles.entries()));
```

## Policy Check Rules

The engine implements several key validation rules:

1. **Bridge Formula Check**: Validates axle group weights based on axle spacing
2. **Number of Wheels Per Axle**: Ensures valid tire counts per axle unit
3. **Permittable Weight Check**: Validates axle unit weights against limits
4. **Minimum Steer Axle Weight**: Ensures proper front axle weight distribution
5. **Minimum Drive Axle Weight**: Validates drive axle weight requirements
6. **Maximum Tire Load**: Checks tire load capacity based on size and quantity

For detailed information about these rules, see [Policy Check Rules Documentation](./docs/policy-check-rules.md).

## Development

### Prerequisites

- Node.js 18+
- TypeScript 5.7+
- npm or yarn

### Setup

```bash
# Clone the repository
git clone https://github.com/bcgov/onroutebc-policy-engine.git
cd onroutebc-policy-engine

# Install dependencies
npm install

# Build the project
npm run build

# Run tests
npm test

# Run linting
npm run lint
```

### Project Structure

```
src/
├── enum/                 # Enumerations and constants
├── helper/              # Helper functions and utilities
├── types/               # TypeScript type definitions
├── _examples/           # Usage examples and demos
├── _test/               # Test data and configurations
├── policy-engine.ts     # Main policy engine implementation
├── validation-result.ts # Validation result types
└── index.ts            # Public API exports
```

### Building

```bash
# Clean build
npm run clean-build

# Development build
npm run build
```

## Documentation

- [Policy Configuration Reference](./docs/policy-configuration-reference.md) - Detailed policy definition format
- [Validation Result Reference](./docs/validation-result-reference.md) - Understanding validation results
- [Basic Client-Server Flow](./docs/basic-client-server-flow.md) - Integration patterns
- [Policy Check Rules](./docs/policy-check-rules.md) - Detailed explanation of validation rules

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -m 'Add new feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Open a Pull Request

### Code Style

- Follow TypeScript best practices
- Use ESLint and Prettier for code formatting
- Write comprehensive tests for new features
- Update documentation for API changes

## Testing

```bash
# Run all tests
npm test

# Run tests with coverage
npm test -- --coverage

# Run specific test file
npm test -- validate-tros.spec.ts
```

## License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.

## Support

For questions, issues, or contributions:

- **Issues**: [GitHub Issues](https://github.com/bcgov/onroutebc-policy-engine/issues)
- **Documentation**: Check the [docs](./docs/) directory
- **Examples**: See [src/_examples](./src/_examples/) for usage examples

## Related Projects

- [json-rules-engine](https://github.com/CacheControl/json-rules-engine) - Core rules engine functionality
- [onRouteBC](https://onroutebc.gov.bc.ca/) - British Columbia's commercial vehicle permitting system

---

**Note**: This policy engine is specifically designed for British Columbia's commercial vehicle regulations. Ensure compliance with local regulations when adapting for other jurisdictions.
