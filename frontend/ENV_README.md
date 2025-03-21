# Environment Variables for Trail Guard Frontend

This document describes the environment variables used by the Trail Guard frontend application.

## Setting Up Environment Variables

1. Create a `.env` file in the root of the frontend directory
2. Copy the variables from the example below and set appropriate values

## Available Environment Variables

```
# API Configuration
API_BASE_URL=https://trail-guard.onrender.com/api

# QR Scanner Service
QR_API_BASE_URL=https://your-api-base-url.com/api

# Trip Service
TRIP_API_BASE_URL=https://your-backend-api.com/api

# Auth Configuration 
# Add your Clerk public key if using Clerk for authentication
CLERK_PUBLISHABLE_KEY=pk_test_your_clerk_publishable_key

# Google Maps API key for location services (if needed)
GOOGLE_MAPS_API_KEY=your_google_maps_api_key

# Other Configuration
APP_ENV=development
DEBUG=true
```

## Usage in Code

Environment variables are accessible in the code through the `env` utility:

```typescript
import { env } from '../config/env';

// Access variables
const apiUrl = env.apiBaseUrl;
```

## Environment-Specific Behavior

Helper functions are available to check the current environment:

```typescript
import { isDev, isProd, isStaging } from '../config/env';

if (isDev()) {
  // Development-only code
}

if (isProd()) {
  // Production-only code
}
```

## Building for Different Environments

For different environments (development, staging, production), create separate `.env` files:

- `.env.development` - Development environment
- `.env.staging` - Staging environment
- `.env.production` - Production environment

When building the app for a specific environment, use:

```bash
# For development
npm run start

# For production
APP_ENV=production npm run start
``` 