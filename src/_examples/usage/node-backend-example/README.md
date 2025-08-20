# onRouteBC Policy Engine - Node.js Backend Example

This is a Node.js backend example demonstrating how to use the `onroute-policy-engine` npm package in a REST API server.

## Features

- **REST API**: Express.js server with RESTful endpoints
- **Permit Validation**: Validate permit applications using the policy engine
- **Bulk Validation**: Process multiple permit applications at once
- **Health Checks**: Built-in health monitoring endpoints
- **Error Handling**: Comprehensive error handling and logging
- **TypeScript**: Full TypeScript support with type safety

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Navigate to this directory:
   ```bash
   cd src/_examples/usage/node-backend-example
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Build the project:
   ```bash
   npm run build
   ```

4. Start the server:
   ```bash
   npm start
   ```

   Or for development with auto-reload:
   ```bash
   npm run dev
   ```

5. The server will start on `http://localhost:3001`

## API Endpoints

### Health Checks

- `GET /api/health` - Basic health check
- `GET /api/health/ready` - Readiness check

### Permit Validation

- `POST /api/permits/validate` - Validate a single permit application
- `POST /api/permits/validate/bulk` - Validate multiple permit applications
- `GET /api/permits/types` - Get available permit types
- `GET /api/permits/vehicles` - Get available vehicle types

## Usage Examples

### Validate a Single Permit

```bash
curl -X POST http://localhost:3001/api/permits/validate \
  -H "Content-Type: application/json" \
  -d '{
    "permitType": "STOS",
    "permitData": {
      "companyName": "Test Company",
      "clientNumber": "B3-000102-466",
      "permitDuration": 7,
      "vehicleConfiguration": {
        "overallLength": 25,
        "overallWidth": 3,
        "overallHeight": 4.1,
        "frontProjection": 1,
        "rearProjection": 1,
        "trailers": [
          { "vehicleSubType": "JEEPSRG" },
          { "vehicleSubType": "PLATFRM" }
        ]
      },
      "vehicleDetails": {
        "vehicleId": "101",
        "vehicleType": "powerUnit",
        "vehicleSubType": "TRKTRAC",
        "licensedGVW": 40000
      },
      "permittedCommodity": {
        "commodityType": "EMPTYXX",
        "loadDescription": "empty"
      }
    }
  }'
```

### Bulk Validation

```bash
curl -X POST http://localhost:3001/api/permits/validate/bulk \
  -H "Content-Type: application/json" \
  -d '{
    "permits": [
      {
        "permitType": "STOS",
        "permitData": { /* permit data */ }
      },
      {
        "permitType": "TROS", 
        "permitData": { /* permit data */ }
      }
    ]
  }'
```

### Get Available Types

```bash
# Get permit types
curl http://localhost:3001/api/permits/types

# Get vehicle types
curl http://localhost:3001/api/permits/vehicles
```

## Response Format

### Success Response

```json
{
  "success": true,
  "data": {
    "isValid": true,
    "cost": 30,
    "validationResults": [],
    "conditions": [
      {
        "condition": "CVSE-1000",
        "description": "General Permit Conditions",
        "link": "https://www.th.gov.bc.ca/forms/getForm.aspx?formId=1251"
      }
    ]
  },
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### Error Response

```json
{
  "success": false,
  "error": {
    "message": "permitType is required",
    "statusCode": 400,
    "timestamp": "2024-01-15T10:30:00.000Z",
    "path": "/api/permits/validate"
  }
}
```

## Project Structure

```
src/
├── index.ts              # Main server entry point
├── routes/               # API route handlers
│   ├── healthRoutes.ts   # Health check endpoints
│   └── permitRoutes.ts   # Permit validation endpoints
├── services/             # Business logic
│   └── permitService.ts  # Policy engine integration
├── middleware/           # Express middleware
│   ├── errorHandler.ts   # Error handling
│   └── validation.ts     # Request validation
└── utils/                # Utility functions
    └── logger.ts         # Logging utility
```

## Configuration

The example uses a simplified policy configuration for demonstration. In a production environment, you would:

1. Load policy configuration from a database or configuration service
2. Add authentication and authorization middleware
3. Implement rate limiting and request validation
4. Add database integration for storing permit applications
5. Configure proper logging and monitoring

## Development

### Available Scripts

- `npm run build` - Build the TypeScript code
- `npm start` - Start the production server
- `npm run dev` - Start development server with auto-reload
- `npm run lint` - Run ESLint
- `npm test` - Run tests

### Environment Variables

- `PORT` - Server port (default: 3001)
- `NODE_ENV` - Environment (development/production)

## Dependencies

- `express` - Web framework
- `cors` - Cross-origin resource sharing
- `helmet` - Security middleware
- `morgan` - HTTP request logging
- `onroute-policy-engine` - The main policy engine library
- `dayjs` - Date handling

## License

This example is part of the onRouteBC Policy Engine project and follows the same Apache 2.0 license.
