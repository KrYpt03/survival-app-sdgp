// Set environment variables for testing
process.env.NODE_ENV = 'test';

// Mock Clerk keys for testing if not provided
if (!process.env.CLERK_PUBLISHABLE_KEY) {
  process.env.CLERK_PUBLISHABLE_KEY = 'test_key';
}

if (!process.env.CLERK_SECRET_KEY) {
  process.env.CLERK_SECRET_KEY = 'test_secret';
}

// Add other global test setup here if needed 