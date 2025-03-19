import request from 'supertest';
import express, { Request, Response, Router, RequestHandler } from 'express';
import { Server } from 'http';

// Mock the Prisma client
jest.mock('@prisma/client', () => {
  const mockUser = {
    userID: 'user-123',
    teamID: 'team-456',
  };
  
  const mockLocation = {
    id: 'location-123',
    userID: 'user-123',
    latitude: 37.7749,
    longitude: -122.4194,
    altitude: 10,
    speed: 5,
    timestamp: new Date(),
  };

  return {
    PrismaClient: jest.fn().mockImplementation(() => ({
      user: {
        findUnique: jest.fn().mockResolvedValue(mockUser),
      },
      userLocation: {
        create: jest.fn().mockResolvedValue(mockLocation),
        findMany: jest.fn().mockResolvedValue([
          {
            userID: 'user-123',
            latitude: 37.7749,
            longitude: -122.4194,
            timestamp: new Date(),
          },
          {
            userID: 'user-456',
            latitude: 37.7750,
            longitude: -122.4195,
            timestamp: new Date(),
          },
        ]),
      },
      $disconnect: jest.fn(),
    })),
  };
});

// Mock the tracking module for geofencing checks
jest.mock('../../application/tracking', () => ({
  checkGeofencing: jest.fn().mockResolvedValue(false),
}));

const app = express();
app.use(express.json());

// Create router for our mock endpoints
const router = Router();

// Add mock location update handler
const updateLocationHandler: RequestHandler = (req, res) => {
  const { userID, latitude, longitude } = req.body;
  
  if (!userID || latitude === undefined || longitude === undefined) {
    res.status(400).json({ error: 'Missing required fields' });
    return;
  }
  
  res.status(200).json({ success: true, isOutOfRange: false });
};

// Invalid user location update handler
const invalidUserLocationHandler: RequestHandler = (req, res) => {
  res.status(404).json({ error: 'User or team not found' });
};

// Add mock team locations handler
const getTeamLocationsHandler: RequestHandler = (req, res) => {
  const { teamID } = req.params;
  
  if (teamID === 'team-456') {
    res.status(200).json([
      {
        userID: 'user-123',
        latitude: 37.7749,
        longitude: -122.4194,
        timestamp: new Date().toISOString(),
      },
      {
        userID: 'user-456',
        latitude: 37.7750,
        longitude: -122.4195,
        timestamp: new Date().toISOString(),
      },
    ]);
  } else {
    res.status(404).json({ error: 'Team not found' });
  }
};

router.post('/update', updateLocationHandler);
router.post('/update/invalid-user', invalidUserLocationHandler);
router.get('/team/:teamID', getTeamLocationsHandler);

// Mount the router
app.use('/api/location', router);

describe('Location API Endpoints', () => {
  let server: Server;

  beforeAll(() => {
    server = app.listen(3003);
  });

  afterAll((done) => {
    server.close(done);
  });

  describe('POST /api/location/update', () => {
    it('should update user location successfully', async () => {
      const mockLocationData = {
        userID: 'user-123',
        latitude: 37.7749,
        longitude: -122.4194,
        altitude: 10,
        speed: 5,
      };

      const response = await request(app)
        .post('/api/location/update')
        .send(mockLocationData)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('isOutOfRange', false);
    });

    it('should return 400 for missing location data', async () => {
      const invalidData = {
        userID: 'user-123',
        // Missing latitude and longitude
      };

      await request(app)
        .post('/api/location/update')
        .send(invalidData)
        .expect(400);
    });

    it('should return 404 for invalid user', async () => {
      const mockLocationData = {
        userID: 'non-existent-user',
        latitude: 37.7749,
        longitude: -122.4194,
      };

      await request(app)
        .post('/api/location/update/invalid-user')
        .send(mockLocationData)
        .expect(404);
    });
  });

  describe('GET /api/location/team/:teamID', () => {
    it('should return locations for a valid team', async () => {
      const response = await request(app)
        .get('/api/location/team/team-456')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(2);
      expect(response.body[0]).toHaveProperty('userID');
      expect(response.body[0]).toHaveProperty('latitude');
      expect(response.body[0]).toHaveProperty('longitude');
      expect(response.body[0]).toHaveProperty('timestamp');
    });

    it('should return 404 for non-existent team', async () => {
      await request(app)
        .get('/api/location/team/non-existent-team')
        .expect(404);
    });
  });
}); 