import request from 'supertest';
import express from 'express';
import adminRoutes from '../admin';
import { ApiError } from '../middlewares/errorHandler';
import * as performanceModule from '../../application/performance';

// Mock the application logic
jest.mock('../../application/performance', () => ({
  getPerformanceReport: jest.fn(),
  clearMetrics: jest.fn(),
  clearApiCache: jest.fn(),
  getSystemHealth: jest.fn(),
  verifyAdminApiKey: jest.fn(),
}));

describe('Admin API Routes', () => {
  let app: express.Express;
  const validAdminKey = 'valid-admin-key-that-is-at-least-32-chars';
  
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Setup express app
    app = express();
    app.use(express.json());
    
    // Setup mock implementations
    (performanceModule.verifyAdminApiKey as jest.Mock).mockImplementation(
      (key) => key === validAdminKey
    );
    
    (performanceModule.getPerformanceReport as jest.Mock).mockReturnValue({
      summary: { totalRequests: 100 },
      slowestRoutes: [],
    });
    
    (performanceModule.getSystemHealth as jest.Mock).mockReturnValue({
      uptime: 3600,
      memory: { rss: '100MB' },
    });
    
    (performanceModule.clearApiCache as jest.Mock).mockReturnValue(5);
    
    // Add admin routes
    app.use('/api/admin', adminRoutes);
    
    // Add simplified error handler for tests
    app.use((err: any, req: any, res: any, next: any) => {
      if (err instanceof ApiError) {
        return res.status(err.statusCode).json({
          success: false,
          message: err.message,
          errors: err.errors,
        });
      }
      
      res.status(500).json({
        success: false,
        message: err.message,
      });
    });
  });
  
  describe('Authentication', () => {
    it('should reject requests without a valid admin key', async () => {
      const response = await request(app)
        .get('/api/admin/metrics')
        .send({ adminKey: 'invalid-key-that-is-at-least-32-chars-long-12345678' });
      
      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Invalid admin credentials');
    });
    
    it('should reject requests with invalid admin key schema', async () => {
      const response = await request(app)
        .get('/api/admin/metrics')
        .send({ adminKey: 'too-short' });
      
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Invalid request body');
    });
    
    it('should reject requests with missing admin key', async () => {
      const response = await request(app)
        .get('/api/admin/metrics')
        .send({});
      
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });
  
  describe('GET /metrics', () => {
    it('should return performance metrics with valid authentication', async () => {
      const response = await request(app)
        .get('/api/admin/metrics')
        .send({ adminKey: validAdminKey });
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('summary');
      expect(performanceModule.getPerformanceReport).toHaveBeenCalled();
    });
  });
  
  describe('POST /metrics/reset', () => {
    it('should reset metrics with valid authentication', async () => {
      const response = await request(app)
        .post('/api/admin/metrics/reset')
        .send({ adminKey: validAdminKey });
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Metrics reset successfully');
      expect(performanceModule.clearMetrics).toHaveBeenCalled();
    });
  });
  
  describe('POST /cache/clear', () => {
    it('should clear cache with valid authentication', async () => {
      const response = await request(app)
        .post('/api/admin/cache/clear')
        .send({ adminKey: validAdminKey });
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('5 cache entries cleared');
      expect(performanceModule.clearApiCache).toHaveBeenCalled();
    });
  });
  
  describe('GET /health', () => {
    it('should return system health with valid authentication', async () => {
      const response = await request(app)
        .get('/api/admin/health')
        .send({ adminKey: validAdminKey });
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('uptime');
      expect(response.body.data).toHaveProperty('memory');
      expect(performanceModule.getSystemHealth).toHaveBeenCalled();
    });
  });
}); 