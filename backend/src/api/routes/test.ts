import { Router } from 'express';
import { ClerkExpressWithAuth } from '@clerk/clerk-sdk-node';

const router = Router();
const clerkAuth = ClerkExpressWithAuth({
  jwtKey: process.env.CLERK_JWT_KEY,
  publishableKey: process.env.CLERK_PUBLISHABLE_KEY
});

// Public route - no authentication required
router.get('/public', (req, res) => {
  res.json({ message: 'This is a public endpoint', timestamp: new Date().toISOString() });
});

// Protected route - requires authentication
router.get('/protected', clerkAuth, async (req, res) => {
  if (!req.auth?.userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  res.json({
    message: 'This is a protected endpoint',
    userId: req.auth.userId,
    timestamp: new Date().toISOString()
  });
});

export default router; 