import NodeCache from 'node-cache';
import { Request, Response, NextFunction } from 'express';

// In-memory cache for metrics
// In production, consider using a time-series database like Prometheus
const metricsCache = new NodeCache({
  stdTTL: 3600, // Store metrics for 1 hour
  checkperiod: 120, // Check expired keys every 2 minutes
});

interface RouteMetrics {
  totalRequests: number;
  successCount: number;
  errorCount: number;
  responseTimes: number[];
  minResponseTime: number;
  maxResponseTime: number;
  avgResponseTime: number;
  lastUpdated: Date;
}

/**
 * Initialize empty metrics for a route
 */
const initializeRouteMetrics = (): RouteMetrics => ({
  totalRequests: 0,
  successCount: 0,
  errorCount: 0,
  responseTimes: [],
  minResponseTime: Number.MAX_SAFE_INTEGER,
  maxResponseTime: 0,
  avgResponseTime: 0,
  lastUpdated: new Date(),
});

/**
 * Update route metrics with a new request
 */
const updateRouteMetrics = (
  metrics: RouteMetrics,
  responseTime: number,
  isSuccess: boolean
): RouteMetrics => {
  metrics.totalRequests += 1;
  
  if (isSuccess) {
    metrics.successCount += 1;
  } else {
    metrics.errorCount += 1;
  }
  
  // Store last 100 response times for percentile calculations
  if (metrics.responseTimes.length >= 100) {
    metrics.responseTimes.shift();
  }
  metrics.responseTimes.push(responseTime);
  
  // Update min/max/avg
  metrics.minResponseTime = Math.min(metrics.minResponseTime, responseTime);
  metrics.maxResponseTime = Math.max(metrics.maxResponseTime, responseTime);
  
  // Calculate new average
  const sum = metrics.responseTimes.reduce((acc, time) => acc + time, 0);
  metrics.avgResponseTime = sum / metrics.responseTimes.length;
  
  metrics.lastUpdated = new Date();
  
  return metrics;
};

/**
 * Performance monitoring middleware
 */
export const performanceMonitoring = (req: Request, res: Response, next: NextFunction): void => {
  const start = Date.now();
  const route = `${req.method}:${req.originalUrl.split('?')[0]}`;
  
  // Create a listener for the 'finish' event
  res.on('finish', () => {
    const responseTime = Date.now() - start;
    const isSuccess = res.statusCode >= 200 && res.statusCode < 400;
    
    // Get existing metrics or initialize new ones
    const existingMetrics = metricsCache.get<RouteMetrics>(route) || initializeRouteMetrics();
    
    // Update metrics
    const updatedMetrics = updateRouteMetrics(existingMetrics, responseTime, isSuccess);
    
    // Store updated metrics
    metricsCache.set(route, updatedMetrics);
    
    // Set performance headers for debugging
    if (process.env.NODE_ENV === 'development') {
      res.setHeader('X-Response-Time', `${responseTime}ms`);
    }
  });
  
  next();
};

/**
 * Get all route metrics
 */
export const getAllMetrics = (): Record<string, RouteMetrics> => {
  const metrics: Record<string, RouteMetrics> = {};
  const keys = metricsCache.keys();
  
  keys.forEach(key => {
    const routeMetrics = metricsCache.get<RouteMetrics>(key);
    if (routeMetrics) {
      metrics[key] = routeMetrics;
    }
  });
  
  return metrics;
};

/**
 * Get metrics for a specific route
 */
export const getRouteMetrics = (route: string): RouteMetrics | null => {
  return metricsCache.get<RouteMetrics>(route) || null;
};

/**
 * Reset all metrics
 */
export const resetMetrics = (): void => {
  metricsCache.flushAll();
};

/**
 * Calculate percentile from an array of values
 */
export const calculatePercentile = (values: number[], percentile: number): number => {
  if (values.length === 0) return 0;
  
  // Sort values
  const sortedValues = [...values].sort((a, b) => a - b);
  
  // Calculate index
  const index = Math.ceil((percentile / 100) * sortedValues.length) - 1;
  
  return sortedValues[index];
};

/**
 * Get performance report
 */
export const getPerformanceReport = (): any => {
  const metrics = getAllMetrics();
  const routes = Object.keys(metrics);
  
  // Sort routes by average response time (descending)
  routes.sort((a, b) => metrics[b].avgResponseTime - metrics[a].avgResponseTime);
  
  // Generate report
  const topSlowRoutes = routes.slice(0, 5).map(route => ({
    route,
    avgResponseTime: metrics[route].avgResponseTime.toFixed(2),
    p95ResponseTime: calculatePercentile(metrics[route].responseTimes, 95).toFixed(2),
    totalRequests: metrics[route].totalRequests,
    errorRate: ((metrics[route].errorCount / metrics[route].totalRequests) * 100).toFixed(2),
  }));
  
  // Calculate overall stats
  const totalRequests = routes.reduce((sum, route) => sum + metrics[route].totalRequests, 0);
  const totalErrors = routes.reduce((sum, route) => sum + metrics[route].errorCount, 0);
  const errorRate = totalRequests > 0 ? (totalErrors / totalRequests) * 100 : 0;
  
  return {
    summary: {
      totalRoutes: routes.length,
      totalRequests,
      totalErrors,
      errorRate: errorRate.toFixed(2),
      timestamp: new Date().toISOString(),
    },
    slowestRoutes: topSlowRoutes,
  };
}; 