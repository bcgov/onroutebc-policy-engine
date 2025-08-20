# Form Hooks Architecture

This directory contains the refactored form hooks that have been split from the original monolithic `usePermitForm` hook into smaller, focused hooks for better maintainability and separation of concerns.

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

## Migration from Original Hook

The original `usePermitForm` hook was 677 lines long and handled multiple responsibilities. The new structure:

- **Reduced complexity**: Each hook is focused on a single concern
- **Improved readability**: Easier to understand what each hook does
- **Better error handling**: Isolated error handling per hook
- **Enhanced debugging**: Easier to trace issues to specific hooks

## Future Improvements

1. **Add memoization**: Use `useMemo` and `useCallback` for expensive operations
2. **Error boundaries**: Add error boundaries for each hook
3. **Loading states**: Add loading states for async operations
4. **Caching**: Implement caching for policy data
5. **Validation**: Add more granular validation hooks
