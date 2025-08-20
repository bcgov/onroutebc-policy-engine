# Constants Directory

This directory contains shared constants used across the application to avoid code duplication and ensure consistency.

## Files

### `formOptions.ts`
Contains form-related option arrays that are used in multiple components:

- **`COUNTRY_OPTIONS`**: Array of country codes and names
- **`PROVINCE_OPTIONS`**: Array of Canadian province/territory codes and names
- **`US_STATE_OPTIONS`**: Array of US state and territory codes and names
- **`VEHICLE_TYPE_OPTIONS`**: Array of vehicle type codes and names

### `index.ts`
Export file that provides clean imports for all constants.

## Usage

```typescript
// Import specific constants
import { COUNTRY_OPTIONS, PROVINCE_OPTIONS, US_STATE_OPTIONS } from '../constants'

// Or import all constants
import * as Constants from '../constants'

// Dynamic usage based on country selection
const getStateProvinceOptions = (countryCode: string) => {
  switch (countryCode) {
    case 'CA':
      return PROVINCE_OPTIONS
    case 'US':
      return US_STATE_OPTIONS
    default:
      return []
  }
}

// Use in components with react-hook-form
const watchedCountryCode = useWatch({ control, name: 'countryCode' })
const stateProvinceOptions = getStateProvinceOptions(watchedCountryCode)
```

## Benefits

1. **DRY Principle**: Eliminates code duplication
2. **Consistency**: Ensures all components use the same data
3. **Maintainability**: Single source of truth for form options
4. **Type Safety**: TypeScript ensures correct usage across components

## Migration

Previously, these options were hard-coded in individual components:
- `VehicleDetailsSection.tsx` had `vehicleProvinceOptions` and `vehicleCountryOptions`
- `MailingAddressSection.tsx` had `provinceOptions` and `countryOptions`

Now all components use the shared constants from this directory.

## Available Options

### Countries
- `COUNTRY_OPTIONS`: Canada, United States, Mexico, Other

### Canadian Provinces/Territories
- `PROVINCE_OPTIONS`: All 13 provinces and territories including BC, AB, ON, QC, etc.

### US States/Territories
- `US_STATE_OPTIONS`: All 50 states plus DC and territories (American Samoa, Guam, etc.)

### Vehicle Types
- `VEHICLE_TYPE_OPTIONS`: Power Unit, Trailer

## Dynamic State/Province Selection

The form components dynamically show appropriate state/province options based on the selected country:

- **Canada (CA)**: Shows Canadian provinces and territories
- **United States (US)**: Shows US states and territories  
- **Mexico (MX)** or **Other (XX)**: No state/province field shown
- **No country selected**: No state/province field shown

### Implementation Details

Both `MailingAddressSection` and `VehicleDetailsSection` components use:
- Dynamic option selection based on `useWatch` for country changes
- Appropriate labels ("Province" for Canada, "State" for US)
- Conditional rendering with proper validation
- Responsive placeholder text
