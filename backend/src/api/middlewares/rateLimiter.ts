import { Request, Response, NextFunction } from 'express';
import NodeCache from 'node-cache';

// Using in-memory cache for simplicity
// In production, consider using Redis or another distributed cache
const cache = new NodeCache();

interface RateLimitOptions {
  windowMs: number;    // Time window in milliseconds
  maxRequests: number; // Max number of requests per window
  message?: string;    // Custom error message
  statusCode?: number; // HTTP status code for rate limit error
  keyGenerator?: (req: Request) => string; // Function to generate a unique key
}

/**
 * Creates a rate limiter middleware
 */
export const createRateLimiter = (options: RateLimitOptions) => {
  const {
    windowMs = 60 * 1000, // 1 minute
    maxRequests = 100,    // 100 requests per minute
    message = 'Too many requests, please try again later',
    statusCode = 429,
    keyGenerator = (req) => {
      // Default key is IP address + route
      return `${req.ip}:${req.originalUrl}`;
    }
  } = options;

  return (req: Request, res: Response, next: NextFunction) => {
    const key = keyGenerator(req);
    
    // Get current hits for this key
    let hits = cache.get<number>(key) || 0;
    
    // If this is the first hit, set the TTL
    if (hits === 0) {
      cache.set(key, 1, windowMs / 1000); // windowMs is in ms, TTL is in seconds
    } else {
      // Check if hits exceed the limit
      if (hits >= maxRequests) {
        return res.status(statusCode).json({
          success: false,
          message,
          rateLimitReset: cache.getTtl(key),
        });
      }
      
      // Increment hit count
      cache.set(key, hits + 1);
    }
    
    // Set rate limit headers
    res.setHeader('X-RateLimit-Limit', String(maxRequests));
    res.setHeader('X-RateLimit-Remaining', String(maxRequests - (hits + 1)));
    
    const resetTime = cache.getTtl(key);
    if (resetTime) {
      res.setHeader('X-RateLimit-Reset', String(resetTime));
    }
    
    next();
  };
};

// Pre-configured rate limiters
export const standardLimiter = createRateLimiter({
  windowMs: 60 * 1000,  // 1 minute
  maxRequests: 100,     // 100 requests per minute
});

export const strictLimiter = createRateLimiter({
  windowMs: 60 * 1000,  // 1 minute
  maxRequests: 10,      // 10 requests per minute
  message: 'Rate limit exceeded for sensitive endpoint',
});

export const emergencyLimiter = createRateLimiter({
  windowMs: 60 * 1000,  // 1 minute
  maxRequests: 5,       // 5 requests per minute
  message: 'Emergency endpoint rate limit exceeded',
}); 