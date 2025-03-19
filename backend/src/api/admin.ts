import express, { Request, Response, NextFunction } from 'express';
import asyncHandler from 'express-async-handler';
import { z } from 'zod';
import { ApiError } from './middlewares/errorHandler.js';
import {
  getPerformanceReport,
  clearMetrics,
  clearApiCache,
  getSystemHealth,
  verifyAdminApiKey
} from '../application/performance.js';

const router = express.Router();

// Schema for admin authentication
const adminAuthSchema = z.object({
  adminKey: z.string().min(32),
});

// Middleware to verify admin credentials
const verifyAdmin = (req: Request, res: Response, next: NextFunction) => {
  try {
    // Validate request body against schema
    const result = adminAuthSchema.safeParse(req.body);
    if (!result.success) {
      throw new ApiError(400, 'Invalid request body', result.error.format());
    }

    // Check admin key
    const { adminKey } = result.data;
    if (!verifyAdminApiKey(adminKey)) {
      throw new ApiError(403, 'Invalid admin credentials');
    }

    next();
  } catch (error) {
    next(error);
  }
};

// Rate limiting middleware
const adminRateLimiter = (req: Request, res: Response, next: NextFunction) => {
  // Simple rate limiting implementation
  const ip = req.ip || req.socket.remoteAddress || 'unknown';
  const endpoint = req.path;
  // This is a placeholder for future implementation
  // const key = `admin:${ip}:${endpoint}`;
  
  // In a real app, you'd use a proper rate limiter here with a store
  // This is simplified for the example
  // const now = Date.now();
  
  // Check if we should rate limit - would use Redis or other distributed cache in production
  next();
};

// Apply admin verification to all routes
router.use(verifyAdmin);

// Get system metrics
router.get('/metrics', adminRateLimiter, asyncHandler(async (req: Request, res: Response) => {
  const metrics = getPerformanceReport();
  
  res.status(200).json({
    success: true,
    data: metrics,
  });
}));

// Reset metrics
router.post('/metrics/reset', adminRateLimiter, asyncHandler(async (req: Request, res: Response) => {
  clearMetrics();
  
  res.status(200).json({
    success: true,
    message: 'Metrics reset successfully',
  });
}));

// Clear cache
router.post('/cache/clear', adminRateLimiter, asyncHandler(async (req: Request, res: Response) => {
  const count = clearApiCache();
  
  res.status(200).json({
    success: true,
    message: count === -1 ? 'All caches cleared' : `${count} cache entries cleared`,
  });
}));

// Get system health
router.get('/health', adminRateLimiter, asyncHandler(async (req: Request, res: Response) => {
  const healthData = getSystemHealth();
  
  res.status(200).json({
    success: true,
    data: healthData,
  });
}));

export default router; 