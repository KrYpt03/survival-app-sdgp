import { getPerformanceReport as getMetrics, resetMetrics } from '../infrastructure/monitoring';
import { clearCache } from '../api/middlewares/cache';

/**
 * Get performance metrics report
 * @returns Performance metrics report
 */
export const getPerformanceReport = () => {
  return getMetrics();
};

/**
 * Reset performance metrics
 */
export const clearMetrics = () => {
  resetMetrics();
};

/**
 * Clear API cache
 * @param pattern Optional regex pattern to match specific cache keys
 * @returns Number of cleared keys or -1 if all keys were cleared
 */
export const clearApiCache = (pattern?: RegExp) => {
  return clearCache(pattern);
};

/**
 * Get system health information
 * @returns System health information
 */
export const getSystemHealth = () => {
  const memoryUsage = process.memoryUsage();
  const uptime = process.uptime();
  
  return {
    uptime,
    memory: {
      rss: Math.round(memoryUsage.rss / 1024 / 1024) + 'MB',
      heapTotal: Math.round(memoryUsage.heapTotal / 1024 / 1024) + 'MB',
      heapUsed: Math.round(memoryUsage.heapUsed / 1024 / 1024) + 'MB',
      external: Math.round(memoryUsage.external / 1024 / 1024) + 'MB',
    },
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  };
};

/**
 * Verify admin API key
 * @param apiKey The admin API key to verify
 * @returns True if valid, false otherwise
 */
export const verifyAdminApiKey = (apiKey: string) => {
  return apiKey === process.env.ADMIN_API_KEY;
}; 