import { Request, Response, NextFunction } from 'express';
import { ClerkExpressWithAuth, WithAuthProp } from '@clerk/clerk-sdk-node';

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
      };
    }
  }
}

type AuthRequest = WithAuthProp<Request>;

// Initialize Clerk middleware
export const clerkAuth = ClerkExpressWithAuth({
  jwtKey: process.env.CLERK_SECRET_KEY,
  authorizedParties: [process.env.CLERK_PUBLISHABLE_KEY || '']
});

// Custom middleware to handle authentication
export const requireAuth = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.auth?.userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
};

// Middleware to attach user data to request
export const attachUser = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.auth?.userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  req.user = {
    id: req.auth.userId,
    email: (req.auth as any).sessionClaims?.email || '',
  };
  next();
}; 