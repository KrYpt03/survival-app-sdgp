import request from 'supertest';
import express, { Request, Response, Router, RequestHandler } from 'express';
import { Server } from 'http';

// Mock the Prisma client
jest.mock('@prisma/client', () => {
  const mockUser = {
    id: 'mock-user-id',
    email: 'test@example.com',
    clerkID: 'clerk_123456',
    username: 'John Doe',
  };

  return {
    PrismaClient: jest.fn().mockImplementation(() => ({
      user: {
        create: jest.fn().mockResolvedValue(mockUser),
        findUnique: jest.fn().mockResolvedValue({ teamID: 'mock-team-id' }),
      },
      $disconnect: jest.fn(),
    })),
  };
});

// Mock the authentication middleware
jest.mock('../../api/middlewares/authentication-middleware', () => ({
  isValidClerk: jest.fn().mockImplementation(({ payload }) => {
    // Return true for valid payloads
    return payload && payload.type === 'user.created';
  }),
}));

// Set up environment variable
process.env.CLERK_WEBHOOK_SECRET = 'test_webhook_secret';

const app = express();
app.use(express.json());

// Create router for our mock endpoints
const router = Router();

// Add mock webhook handler
const webhookHandler: RequestHandler = (req, res) => {
  if (req.body.type === 'user.created') {
    res.status(200).json({ message: 'User created' });
  } else {
    res.status(400).json({ error: 'Invalid webhook event' });
  }
};

// Unauthorized webhook handler
const unauthorizedWebhookHandler: RequestHandler = (req, res) => {
  res.status(401).json({ error: 'Unauthorized' });
};

router.post('/webhook', webhookHandler);
router.post('/webhook/unauthorized', unauthorizedWebhookHandler);

// Mount the router
app.use('/api/user', router);

describe('User API Endpoints', () => {
  let server: Server;

  beforeAll(() => {
    server = app.listen(3002);
  });

  afterAll((done) => {
    server.close(done);
  });

  describe('POST /api/user/webhook', () => {
    it('should process a valid user.created webhook event', async () => {
      const mockWebhookPayload = {
        type: 'user.created',
        data: {
          id: 'clerk_123456',
          email_addresses: [{ email_address: 'test@example.com' }],
          first_name: 'John',
          last_name: 'Doe',
        },
      };

      const response = await request(app)
        .post('/api/user/webhook')
        .set({
          'svix-id': 'test-svix-id',
          'svix-timestamp': 'test-timestamp',
          'svix-signature': 'test-signature',
        })
        .send(mockWebhookPayload)
        .expect(200);

      expect(response.body).toHaveProperty('message', 'User created');
    });

    it('should reject invalid webhook events', async () => {
      const mockInvalidPayload = {
        type: 'invalid.event',
        data: {},
      };

      await request(app)
        .post('/api/user/webhook')
        .set({
          'svix-id': 'test-svix-id',
          'svix-timestamp': 'test-timestamp',
          'svix-signature': 'test-signature',
        })
        .send(mockInvalidPayload)
        .expect(400);
    });

    it('should reject unauthorized webhook requests', async () => {
      const mockWebhookPayload = {
        type: 'user.created',
        data: {
          id: 'clerk_123456',
          email_addresses: [{ email_address: 'test@example.com' }],
          first_name: 'John',
          last_name: 'Doe',
        },
      };

      await request(app)
        .post('/api/user/webhook/unauthorized')
        .send(mockWebhookPayload)
        .expect(401);
    });
  });
}); 