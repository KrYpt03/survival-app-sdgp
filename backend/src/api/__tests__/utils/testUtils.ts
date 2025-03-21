import { Express } from 'express';
import request from 'supertest';

/**
 * Helper function to make authenticated API requests for testing
 * 
 * @param app Express application
 * @param method HTTP method (get, post, put, patch, delete)
 * @param url API endpoint URL
 * @param body Request body (for POST, PUT, PATCH)
 * @param token Authentication token (optional)
 * @param query Query parameters (optional)
 * @returns SuperTest response
 */
export const apiRequest = async (
  app: Express,
  method: 'get' | 'post' | 'put' | 'patch' | 'delete',
  url: string,
  body?: any,
  token?: string,
  query?: Record<string, string>
) => {
  let req = request(app)[method](url);
  
  // Add query parameters if provided
  if (query) {
    const queryString = Object.entries(query)
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join('&');
    url = `${url}?${queryString}`;
    req = request(app)[method](url);
  }
  
  // Add authentication if token is provided
  if (token) {
    req = req.set('Authorization', `Bearer ${token}`);
  }
  
  // Add request body for methods that support it
  if (body && ['post', 'put', 'patch'].includes(method)) {
    req = req.send(body);
  }
  
  return req;
};

/**
 * Helper function to create a mock user for testing
 * 
 * @param role User role (default: 'user')
 * @returns Mock user object with a valid JWT token
 */
export const createMockUser = (role: string = 'user') => {
  // This is a placeholder - in a real app, you might use a test database
  // and create an actual user record, then generate a real JWT
  const user = {
    id: 'test-user-id',
    name: 'Test User',
    email: 'test@example.com',
    role,
  };
  
  // Mock JWT token - in a real app you would generate a real JWT
  const token = `mock-jwt-token-for-${role}`;
  
  return { user, token };
};

/**
 * Test that an endpoint requires authentication
 * 
 * @param app Express application
 * @param method HTTP method
 * @param url API endpoint
 */
export const testAuthRequirement = async (
  app: Express,
  method: 'get' | 'post' | 'put' | 'patch' | 'delete',
  url: string,
  body?: any
) => {
  const response = await apiRequest(app, method, url, body);
  
  expect(response.status).toBe(401);
  expect(response.body).toHaveProperty('success', false);
  expect(response.body).toHaveProperty('message');
};

/**
 * Test that an endpoint requires specific permissions
 * 
 * @param app Express application
 * @param method HTTP method
 * @param url API endpoint
 * @param body Request body (optional)
 * @param userRole Role that should NOT have access
 */
export const testPermissionRequirement = async (
  app: Express,
  method: 'get' | 'post' | 'put' | 'patch' | 'delete',
  url: string,
  body?: any,
  userRole: string = 'user'
) => {
  const { token } = createMockUser(userRole);
  const response = await apiRequest(app, method, url, body, token);
  
  expect(response.status).toBe(403);
  expect(response.body).toHaveProperty('success', false);
  expect(response.body).toHaveProperty('message');
};

// Add a simple test to prevent Jest error
describe('Test Utilities', () => {
  test('createMockUser works correctly', () => {
    const { user, token } = createMockUser('admin');
    expect(user).toBeDefined();
    expect(user.role).toBe('admin');
    expect(token).toContain('admin');
  });
}); 