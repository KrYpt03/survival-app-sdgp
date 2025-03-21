// Load environment variables
require('./config/loadEnv');

// Import base app config
const baseConfig = require('./app.json');

// Environment configuration from .env files
module.exports = {
  ...baseConfig,
  expo: {
    ...baseConfig.expo,
    extra: {
      apiBaseUrl: process.env.API_BASE_URL || 'https://trail-guard.onrender.com/api',
      qrApiBaseUrl: process.env.QR_API_BASE_URL || 'https://your-api-base-url.com/api',
      tripApiBaseUrl: process.env.TRIP_API_BASE_URL || 'https://your-backend-api.com/api',
      clerkPublishableKey: process.env.CLERK_PUBLISHABLE_KEY || '',
      googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY || '',
      appEnv: process.env.APP_ENV || 'development',
      debug: process.env.DEBUG === 'true' || false,
      eas: {
        projectId: process.env.EAS_PROJECT_ID || 'your-eas-project-id'
      }
    },
  },
}; 