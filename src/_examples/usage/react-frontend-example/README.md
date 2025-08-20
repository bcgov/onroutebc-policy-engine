# onRouteBC Policy Engine - React Frontend Example

This is a React frontend example demonstrating how to use the `onroute-policy-engine` npm package in a web application.

## Features

- **Permit Application Form**: Interactive form for creating permit applications
- **Real-time Validation**: Uses the policy engine to validate permit data
- **Validation Results Display**: Shows validation messages, costs, and conditions
- **Vehicle Font Test**: Interactive tool for testing vehicle display codes
- **Modern React**: Built with React 18, TypeScript, and Vite

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- **Node.js Backend Example** (see dependency section below)

### Installation

#### Option 1: Run with Backend (Recommended)
1. **Start the Node.js backend first** (in a separate terminal):
   ```bash
   cd ../node-backend-example
   npm install
   npm run dev
   ```
   The backend will run on `http://localhost:3001`

2. **Start the React frontend**:
   ```bash
   cd ../react-frontend-example
   npm install
   npm run dev
   ```

3. Open your browser and navigate to `http://localhost:3000`

#### Option 2: Run Independently (Limited Functionality)
The React example can run independently but will show errors when trying to load policy configuration:

1. Navigate to this directory:
   ```bash
   cd src/_examples/usage/react-frontend-example
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:3000`

## Usage

### Permit Application Tab

1. Fill out the permit application form with company and vehicle information
2. Click "Validate Permit Application" to submit
3. View validation results including:
   - Permit cost calculation
   - Validation messages (errors, warnings, info)
   - Required permit conditions
   - Overall validation status

### Vehicle Font Test Tab

1. Select from preset vehicle configurations or create a custom one
2. For custom configurations:
   - Choose a power unit type
   - Set number of steer and drive axles
   - Add trailers with their axle configurations
3. View the generated vehicle display code

## Key Components

- `App.tsx`: Main application with tab navigation
- `PermitForm.tsx`: Form for permit application data entry
- `ValidationResults.tsx`: Display validation results from the policy engine
- `VehicleFontTest.tsx`: Interactive vehicle configuration tool

## Dependencies

### Runtime Dependencies
- `onroute-policy-engine`: The main policy engine library
- `react`: UI framework
- `dayjs`: Date handling
- `vite`: Build tool and dev server

### Backend Dependency
This React example **depends on the Node.js backend example** running on `http://localhost:3001`. The React app:

1. **Fetches policy configuration** from `http://localhost:3001/api/permits/config`
2. **Sends validation requests** to `http://localhost:3001/api/permits/validate` (when using API validation mode)
3. **Requires the backend to be running** for full functionality

If the backend is not running, the React app will show error messages when trying to load policy configuration.

## API Integration

This example uses a simplified policy configuration for demonstration. In a real application, you would:

1. Load policy configuration from an API
2. Send permit applications to a backend for validation
3. Handle authentication and authorization
4. Implement proper error handling and loading states

## Customization

- Modify the sample policy configuration in `App.tsx`
- Add more form fields to `PermitForm.tsx`
- Customize the styling in the CSS files
- Add additional validation features

## Building for Production

```bash
npm run build
```

This creates a production build in the `dist` directory.

## License

This example is part of the onRouteBC Policy Engine project and follows the same Apache 2.0 license.
