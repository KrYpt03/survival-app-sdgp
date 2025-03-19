import express, { Express } from 'express';
import cors from 'cors';
import { errorHandler } from './errorHandler';
import { loggerMiddleware, addRequestId } from './logger';
import { securityHeaders, corsOptions } from './security';
import { standardLimiter } from './rateLimiter';
import { performanceMonitoring } from '../../infrastructure/monitoring';

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
  app.use(standardLimiter);
  
  // Performance monitoring
  app.use(performanceMonitoring);
};

/**
 * Registers error handling middleware
 * This should be called after all routes are registered
 * @param app Express application
 */
export const registerErrorHandlers = (app: Express): void => {
  // Error handler should be registered last
  app.use(errorHandler);
};

// Export all middleware for individual use
export * from './errorHandler';
export * from './validateRequest';
export * from './rateLimiter';
export * from './logger';
export * from './security';
export * from './cache'; 