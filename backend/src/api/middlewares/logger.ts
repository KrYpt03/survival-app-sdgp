import { Request, Response, NextFunction } from 'express';
import morgan from 'morgan';
import { v4 as uuidv4 } from 'uuid';

// Add request ID to each request
export const addRequestId = (req: Request, res: Response, next: NextFunction) => {
  const requestId = uuidv4();
  req.headers['x-request-id'] = requestId;
  res.setHeader('X-Request-ID', requestId);
  next();
};

// Create a custom morgan token for request ID
morgan.token('request-id', (req: Request) => {
  return req.headers['x-request-id'] as string;
});

// Create a custom morgan token for user ID (if authenticated)
morgan.token('user-id', (req: Request) => {
  // Assuming your auth middleware adds user info to req.user
  const user = (req as any).user;
  return user?.userID || 'anonymous';
});

// JSON formatter for structured logging
const jsonFormat = (tokens: morgan.TokenIndexer<Request, Response>, req: Request, res: Response) => {
  const logEntry = {
    timestamp: new Date().toISOString(),
    method: tokens.method(req, res),
    url: tokens.url(req, res),
    status: parseInt(tokens.status(req, res) || '0', 10),
    responseTime: parseFloat(tokens['response-time'](req, res) || '0'),
    requestId: tokens['request-id'](req, res),
    userId: tokens['user-id'](req, res),
    userAgent: tokens['user-agent'](req, res),
    remoteAddress: tokens['remote-addr'](req, res),
    referrer: tokens.referrer(req, res),
  };

  return JSON.stringify(logEntry);
};

// Development console logger (human-readable)
export const developmentLogger = morgan(
  ':method :url :status :response-time ms - :res[content-length] - :request-id'
);

// Production structured logger (JSON)
export const productionLogger = morgan(jsonFormat);

// Main logger middleware that selects the appropriate format
export const loggerMiddleware = (req: Request, res: Response, next: NextFunction) => {
  if (process.env.NODE_ENV === 'production') {
    return productionLogger(req, res, next);
  } else {
    return developmentLogger(req, res, next);
  }
}; 