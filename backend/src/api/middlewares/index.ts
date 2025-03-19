import express, { Express, NextFunction, Request, Response } from 'express';
import cors from 'cors';
import { errorHandler } from './errorHandler.js';
import { loggerMiddleware, addRequestId } from './logger.js';
import { securityHeaders, corsOptions } from './security.js';
import { performanceMonitoring } from '../../infrastructure/monitoring.js';
import NodeCache from 'node-cache';

// Simple rate limiter implementation
const cache = new NodeCache();

const rateLimit = (req: Request, res: Response, next: NextFunction) => {
  const key = `${req.ip}:${req.originalUrl}`;
  const windowMs = 60 * 1000; // 1 minute
  const maxRequests = 100; // 100 requests per minute
  
  let hits = cache.get<number>(key) || 0;
  
  if (hits === 0) {
    cache.set(key, 1, windowMs / 1000);
  } else {
    if (hits >= maxRequests) {
      return res.status(429).json({
        success: false,
        message: 'Too many requests, please try again later',
      });
    }
    
    cache.set(key, hits + 1);
  }
  
  // Set rate limit headers
  res.setHeader('X-RateLimit-Limit', String(maxRequests));
  res.setHeader('X-RateLimit-Remaining', String(maxRequests - (hits + 1)));
  
  next();
};

/**
 * Registers all middleware with the Express application
 * @param app Express application
 */
export const registerMiddleware = (app: Express): void => {
  // Request ID and logging should be first
  app.use(addRequestId);
  app.use(loggerMiddleware);
  
  // Security headers
  app.use(securityHeaders);
  
  // CORS configuration
  app.use(cors(corsOptions));
  
  // Standard middleware
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true, limit: '1mb' }));
  
  // Rate limiting
  app.use(rateLimit);
  
  // Performance monitoring
  app.use(performanceMonitoring);
};

/**
 * Error handler wrapper to avoid type errors
 */
const errorHandlerWrapper = (err: any, req: Request, res: Response, next: NextFunction) => {
  return errorHandler(err, req, res, next);
};

/**
 * Registers error handling middleware
 * This should be called after all routes are registered
 * @param app Express application
 */
export const registerErrorHandlers = (app: Express): void => {
  // Error handler should be registered last
  app.use(errorHandlerWrapper);
};

// Export all middleware for individual use
export * from './errorHandler.js';
export * from './validateRequest.js';
export * from './rateLimiter.js';
export * from './logger.js';
export * from './security.js';
export * from './cache.js'; 