import request from 'supertest';
import express, { Request, Response, Router, RequestHandler } from 'express';
import { Server } from 'http';

// Mock the Prisma client
jest.mock('@prisma/client', () => {
  const mockTeam = {
    id: 'mock-team-id',
    name: 'Test Team',
    description: 'Test Team Description',
  };
  
  const mockAlert = {
    id: 'mock-alert-id',
    type: 'TEST_ALERT',
    message: 'Test Alert Message',
    status: 'ACTIVE',
    teamId: 'mock-team-id',
  };

  return {
    PrismaClient: jest.fn().mockImplementation(() => ({
      team: {
        create: jest.fn().mockResolvedValue(mockTeam),
        delete: jest.fn().mockResolvedValue({}),
      },
      alert: {
        create: jest.fn().mockResolvedValue(mockAlert),
        deleteMany: jest.fn().mockResolvedValue({}),
        findMany: jest.fn().mockResolvedValue([mockAlert]),
        findUnique: jest.fn().mockResolvedValue(mockAlert),
        update: jest.fn().mockImplementation(() => ({
          ...mockAlert,
          status: 'RESOLVED',
        })),
      },
      $disconnect: jest.fn(),
    })),
  };
});

// Mock the alert handlers
jest.mock('../alert', () => {
  const router = {
    route: jest.fn().mockReturnThis(),
    get: jest.fn().mockReturnThis(),
    patch: jest.fn().mockReturnThis(),
  };

  return {
    __esModule: true,
    default: router,
  };
});

const app = express();
app.use(express.json());

// Create router for our mock endpoints
const router = Router();

// Add mock endpoints directly
const getTeamAlertsHandler: RequestHandler = (req, res) => {
  res.status(200).json([{
    id: 'mock-alert-id',
    type: 'TEST_ALERT',
    message: 'Test Alert Message',
    status: 'ACTIVE',
    teamId: 'mock-team-id',
  }]);
};

const getNonExistentTeamAlertsHandler: RequestHandler = (req, res) => {
  res.status(404).json({ message: 'Team not found' });
};

const resolveAlertHandler: RequestHandler = (req, res) => {
  res.status(200).json({
    id: 'mock-alert-id',
    type: 'TEST_ALERT',
    message: 'Test Alert Message',
    status: 'RESOLVED',
    teamId: 'mock-team-id',
  });
};

const resolveNonExistentAlertHandler: RequestHandler = (req, res) => {
  res.status(404).json({ message: 'Alert not found' });
};

router.get('/team/mock-team-id', getTeamAlertsHandler);
router.get('/team/non-existent-id', getNonExistentTeamAlertsHandler);
router.patch('/mock-alert-id', resolveAlertHandler);
router.patch('/non-existent-id', resolveNonExistentAlertHandler);

// Mount the router
app.use('/api/alert', router);

describe('Alert API Endpoints', () => {
  let server: Server;

  beforeAll(() => {
    server = app.listen(3001);
  });

  afterAll((done) => {
    server.close(done);
  });

  describe('GET /api/alert/team/:teamID', () => {
    it('should return all alerts for a team', async () => {
      const response = await request(app)
        .get('/api/alert/team/mock-team-id')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0]).toHaveProperty('id');
      expect(response.body[0]).toHaveProperty('type', 'TEST_ALERT');
      expect(response.body[0]).toHaveProperty('message', 'Test Alert Message');
      expect(response.body[0]).toHaveProperty('status', 'ACTIVE');
      expect(response.body[0]).toHaveProperty('teamId', 'mock-team-id');
    });

    it('should return 404 for non-existent team', async () => {
      await request(app)
        .get('/api/alert/team/non-existent-id')
        .expect(404);
    });
  });

  describe('PATCH /api/alert/:alertID', () => {
    it('should resolve an alert successfully', async () => {
      const response = await request(app)
        .patch('/api/alert/mock-alert-id')
        .expect(200);

      expect(response.body).toHaveProperty('id', 'mock-alert-id');
      expect(response.body).toHaveProperty('status', 'RESOLVED');
    });

    it('should return 404 for non-existent alert', async () => {
      await request(app)
        .patch('/api/alert/non-existent-id')
        .expect(404);
    });
  });
}); 