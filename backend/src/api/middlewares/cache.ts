import { Request, Response, NextFunction } from 'express';
import NodeCache from 'node-cache';

// Simple in-memory cache
// In production, consider using Redis for distributed caching
const cache = new NodeCache({
  stdTTL: 300, // Default TTL: 5 minutes
  checkperiod: 60, // Check for expired keys every 60 seconds
});

interface CacheOptions {
  ttl?: number; // Time to live in seconds
  keyPrefix?: string; // Prefix for cache keys
  keyGenerator?: (req: Request) => string; // Function to generate cache key
}

/**
 * Middleware to cache API responses
 * @param options Cache configuration options
 */
export const cacheMiddleware = (options: CacheOptions = {}) => {
  const {
    ttl = 300, // Default: 5 minutes
    keyPrefix = 'api:cache:',
    keyGenerator = (req: Request) => {
      // Default: generate key from method + URL + query params + auth status
      const userId = (req as any).user?.userID || 'anonymous';
      return `${keyPrefix}${req.method}:${req.originalUrl}:${userId}`;
    }
  } = options;

  return (req: Request, res: Response, next: NextFunction) => {
    // Skip caching for non-GET requests
    if (req.method !== 'GET') {
      return next();
    }

    // Generate cache key
    const key = keyGenerator(req);

    // Check if we have a cached response
    const cachedData = cache.get<string>(key);
    if (cachedData) {
      const parsed = JSON.parse(cachedData);
      res.setHeader('X-Cache', 'HIT');
      return res.status(parsed.statusCode).json(parsed.data);
    }

    // Cache miss - store the original res.json method
    const originalJson = res.json;
    res.setHeader('X-Cache', 'MISS');

    // Override res.json method to cache the response
    res.json = function (data: any) {
      // Only cache successful responses
      if (res.statusCode >= 200 && res.statusCode < 300) {
        const responseData = {
          data,
          statusCode: res.statusCode,
          timestamp: Date.now()
        };
        
        cache.set(key, JSON.stringify(responseData), ttl);
      }
      
      // Call the original json method
      return originalJson.call(this, data);
    };

    next();
  };
};

/**
 * Helper function to clear cache for specific paths
 * @param pattern Regex pattern to match cache keys
 */
export const clearCache = (pattern?: RegExp) => {
  if (pattern) {
    const keys = cache.keys();
    const matchingKeys = keys.filter(key => pattern.test(key));
    matchingKeys.forEach(key => cache.del(key));
    return matchingKeys.length;
  } else {
    cache.flushAll();
    return -1; // Indicates all keys were flushed
  }
};

// Pre-configured cache middleware instances
export const shortCache = cacheMiddleware({ ttl: 60 }); // 1 minute
export const standardCache = cacheMiddleware(); // 5 minutes
export const longCache = cacheMiddleware({ ttl: 3600 }); // 1 hour 