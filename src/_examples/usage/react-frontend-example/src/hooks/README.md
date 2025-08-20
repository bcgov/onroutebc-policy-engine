# Form Hooks Architecture

This directory contains focused form hooks for maintainability and separation of concerns.

## Hook Structure

### Main Hook
- **`usePermitForm`** - The main orchestrator hook that combines all other hooks and provides the complete form interface

### Focused Hooks

#### 1. `useFormCore`
**Purpose**: Core form functionality including initialization, validation, and submission
- Form initialization with react-hook-form
- Form validation with Yup schema
- Form submission handling
- Error expansion logic

#### 2. `usePolicyData`
**Purpose**: Policy engine data management
- Permit types from policy
- Trailer types from policy
- Commodity types from policy
- Policy data retrieval functions

#### 3. `useFormSections`
**Purpose**: Form section UI state management
- Collapsed/expanded section state
- Section toggle functionality
- Section expansion/collapse utilities

#### 4. `useVehicleConfiguration`
**Purpose**: Vehicle configuration state management
- Selected trailers state
- Axle configurations state
- Trailer addition/removal logic
- Axle configuration updates

#### 5. `useFormWatchers`
**Purpose**: Form field watching and side effects
- Field change watching with useWatch
- Side effects for field changes
- Policy-based field updates

#### 6. `useSampleData`
**Purpose**: Sample data loading and form population
- Sample data fetching
- Form data mapping
- Form reset functionality

## Benefits of This Architecture

### 1. **Separation of Concerns**
Each hook has a single responsibility, making the code easier to understand and maintain.

### 2. **Reusability**
Individual hooks can be reused in other components or contexts.

### 3. **Testability**
Each hook can be tested independently with focused test cases.

### 4. **Maintainability**
Changes to specific functionality are isolated to their respective hooks.

### 5. **Performance**
Smaller hooks with focused dependencies can optimize re-renders.

## Usage Example

```typescript
import { usePermitForm } from '../hooks'

const MyComponent = () => {
  const {
    form,
    handleSubmit,
    permitTypes,
    vehicleSubTypes,
    collapsedSections,
    showVehicleConfig,
    // ... other properties
  } = usePermitForm({ policy, onSubmit })

  return (
    // Component JSX
  )
}
```
