import Constants from 'expo-constants';

// Define the type for our environment variables
interface AppConfig {
  apiBaseUrl: string;
  qrApiBaseUrl: string;
  tripApiBaseUrl: string;
  clerkPublishableKey: string;
  googleMapsApiKey: string;
  appEnv: 'development' | 'staging' | 'production';
  debug: boolean;
}

// Get the extra config from app.json/app.config.js
const extraConfig = Constants.expoConfig?.extra || {};

// Export the environment config with fallbacks
export const env: AppConfig = {
  apiBaseUrl: extraConfig.apiBaseUrl || process.env.API_BASE_URL || 'http://localhost:3000/api',
  qrApiBaseUrl: extraConfig.qrApiBaseUrl || process.env.QR_API_BASE_URL || 'https://your-api-base-url.com/api',
  tripApiBaseUrl: extraConfig.tripApiBaseUrl || process.env.TRIP_API_BASE_URL || 'https://your-backend-api.com/api',
  clerkPublishableKey: extraConfig.clerkPublishableKey || process.env.CLERK_PUBLISHABLE_KEY || '',
  googleMapsApiKey: extraConfig.googleMapsApiKey || process.env.GOOGLE_MAPS_API_KEY || '',
  appEnv: (extraConfig.appEnv || process.env.APP_ENV || 'development') as 'development' | 'staging' | 'production',
  debug: extraConfig.debug || process.env.DEBUG === 'true' || false,
};

// Helper function to check if we're in development
export const isDev = () => env.appEnv === 'development';

// Helper function to check if we're in production
export const isProd = () => env.appEnv === 'production';

// Helper function to check if we're in staging
export const isStaging = () => env.appEnv === 'staging'; 