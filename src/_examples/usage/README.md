# onRouteBC Policy Engine - Usage Examples

This directory contains practical examples demonstrating how to use the `onroute-policy-engine` npm package in different environments.

## Examples Overview

### React Frontend Example
**Location**: `react-frontend-example/`

A modern React application showing how to integrate the policy engine in a web frontend:
- Interactive permit application form
- Real-time validation using the policy engine
- Validation results display with costs and conditions
- Vehicle font test tool (similar to the existing test-font.html)
- Built with React 18, TypeScript, and Vite

**Key Features**:
- Form-based permit application creation
- Real-time validation feedback
- Cost calculation display
- Permit conditions listing
- Vehicle configuration testing

### Node.js Backend Example
**Location**: `node-backend-example/`

A REST API server demonstrating backend integration of the policy engine:
- Express.js REST API
- Permit validation endpoints
- Bulk validation support
- Health check endpoints
- Comprehensive error handling

**Key Features**:
- Single permit validation
- Bulk permit processing
- Available permit types endpoint
- Vehicle types endpoint
- Structured error responses

## Getting Started

### Running the Examples

**Important**: The React frontend example depends on the Node.js backend example. You need to run both for the React example to work properly.

#### Option 1: Run Both Examples (Recommended)
1. **Start the Node.js backend first**:
   ```bash
   cd node-backend-example
   npm install
   npm run dev
   ```
   The backend will run on `http://localhost:3001`

2. **Start the React frontend**:
   ```bash
   cd react-frontend-example
   npm install
   npm run dev
   ```
   The frontend will run on `http://localhost:3000`

#### Option 2: Run Backend Only
If you only need the REST API:
```bash
cd node-backend-example
npm install
npm run dev
```

#### Option 3: Run Frontend Only (Limited Functionality)
The React example can run independently but will show errors when trying to load policy configuration:
```bash
cd react-frontend-example
npm install
npm run dev
```

## Example Use Cases

### Frontend Integration
Use the React example if you need to:
- Build a web interface for permit applications
- Provide real-time validation feedback to users
- Display validation results with proper styling
- Test vehicle configurations interactively

### Backend Integration
Use the Node.js example if you need to:
- Create a REST API for permit validation
- Process multiple permit applications
- Integrate with existing backend systems
- Provide validation services to multiple clients

## Architecture Patterns

Both examples demonstrate common integration patterns:

### Policy Engine Initialization
```typescript
import { Policy } from 'onroute-policy-engine'

const policy = new Policy(policyConfiguration)
```

### Permit Validation
```typescript
const results = await policy.validate(permitApplication)
```

### Error Handling
Both examples include comprehensive error handling for:
- Policy engine initialization failures
- Validation errors
- Invalid input data
- Network/API errors

## Customization

These examples use simplified policy configurations for demonstration. In production:

1. **Load policy configuration** from your preferred source (database, API, file system)
2. **Add authentication/authorization** as needed
3. **Implement proper logging** and monitoring
4. **Add database integration** for storing applications
5. **Configure environment-specific settings**

## Dependencies

Both examples depend on:
- `onroute-policy-engine` - The main policy engine library
- `dayjs` - Date handling (used by the policy engine)

### Frontend-specific
- React 18+ and related dependencies
- Vite for build tooling
- TypeScript for type safety

### Backend-specific
- Express.js for the web framework
- Security middleware (helmet, cors)
- Request logging (morgan)

## Ports Used

- **React Frontend**: `http://localhost:3000`
- **Node.js Backend**: `http://localhost:3001`

## Development

Each example includes:
- TypeScript configuration
- Development scripts
- Build processes
- Linting setup
- Comprehensive documentation

## Contributing

When adding new examples or modifying existing ones:

1. Keep examples focused and simple
2. Include comprehensive documentation
3. Use realistic but simplified data
4. Follow the existing project structure
5. Test thoroughly before committing

## License

These examples are part of the onRouteBC Policy Engine project and follow the same Apache 2.0 license.
