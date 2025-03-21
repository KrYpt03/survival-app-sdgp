// Load environment variables from .env files
const path = require('path');
const dotenv = require('dotenv');
const fs = require('fs');

// Get the app environment
const appEnv = process.env.APP_ENV || 'development';

// Define paths to look for .env files
const envPaths = [
  // .env.{environment}.local has highest priority
  path.resolve(__dirname, '..', `.env.${appEnv}.local`),
  // .env.local skipped for 'test' environment
  ...(appEnv !== 'test' ? [path.resolve(__dirname, '..', '.env.local')] : []),
  // .env.{environment}
  path.resolve(__dirname, '..', `.env.${appEnv}`),
  // .env as fallback
  path.resolve(__dirname, '..', '.env'),
];

// Load from each file if it exists
envPaths.forEach(envPath => {
  if (fs.existsSync(envPath)) {
    const envConfig = dotenv.parse(fs.readFileSync(envPath));
    // Apply each variable to process.env
    Object.entries(envConfig).forEach(([key, value]) => {
      process.env[key] = value;
    });
    console.log(`Loaded environment variables from ${envPath}`);
  }
});

console.log(`Environment: ${appEnv}`);

// Export the environment for use in app.config.js
module.exports = {
  environment: appEnv,
  // Add any other environment-specific configurations
}; 