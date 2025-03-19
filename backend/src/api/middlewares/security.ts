import { Request, Response, NextFunction } from 'express';

/**
 * Sets security headers to protect against common web vulnerabilities
 */
export const securityHeaders = (req: Request, res: Response, next: NextFunction) => {
  // Strict-Transport-Security
  // Force HTTPS in browsers that support it
  res.setHeader(
    'Strict-Transport-Security',
    'max-age=31536000; includeSubDomains'
  );

  // Content-Security-Policy
  // Prevent XSS attacks by controlling which resources can be loaded
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self'; connect-src 'self'; img-src 'self'; style-src 'self';"
  );

  // X-Content-Type-Options
  // Prevent MIME-sniffing (browser guessing the content type)
  res.setHeader('X-Content-Type-Options', 'nosniff');

  // X-Frame-Options
  // Prevent clickjacking attacks by disabling iframe embedding
  res.setHeader('X-Frame-Options', 'DENY');

  // X-XSS-Protection
  // Enable browser's XSS filtering capabilities
  res.setHeader('X-XSS-Protection', '1; mode=block');

  // Referrer-Policy
  // Control how much referrer information is included with requests
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

  // Permissions-Policy (formerly Feature-Policy)
  // Control which browser features can be used
  res.setHeader(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(self), interest-cohort=()'
  );

  // Cache-Control for API responses
  // Ensure API responses aren't cached inappropriately
  if (req.method === 'GET') {
    res.setHeader('Cache-Control', 'private, max-age=0, must-revalidate');
  } else {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
  }

  next();
};

/**
 * Cors options for production use
 * Should be used with the cors package
 */
export const corsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    // Allow requests with no origin (like mobile apps, curl, etc)
    if (!origin) return callback(null, true);
    
    // Check if origin is in allowed list
    const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [];
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV !== 'production') {
      callback(null, true);
    } else {
      callback(new Error('CORS not allowed'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['X-RateLimit-Limit', 'X-RateLimit-Remaining', 'X-RateLimit-Reset'],
  credentials: true,
  maxAge: 86400 // 24 hours
}; 