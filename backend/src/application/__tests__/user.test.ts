import { Request, Response, NextFunction } from 'express';
import { createUser, getTeamIdFromCode } from '../user.js';
import prisma from '../../infrastructure/db.js';
import { isValidClerk } from '../../api/middlewares/authentication-middleware.js';
import UnauthorizedError from '../../domain/errors/unauthorized-error.js';

// Mock the dependencies
jest.mock('../../infrastructure/db', () => ({
  user: {
    create: jest.fn(),
  },
  team: {
    findUnique: jest.fn(),
  },
}));

jest.mock('../../api/middlewares/authentication-middleware', () => ({
  isValidClerk: jest.fn(),
}));

describe('User Module', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockReq = {
      body: {},
      headers: {},
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockNext = jest.fn();

    process.env.CLERK_WEBHOOK_SECRET = 'test-secret';
  });

  afterEach(() => {
    jest.clearAllMocks();
    delete process.env.CLERK_WEBHOOK_SECRET;
  });

  describe('createUser', () => {
    const mockUserData = {
      type: 'user.created',
      data: {
        id: 'clerk123',
        email_addresses: [{ email_address: 'test@example.com' }],
        first_name: 'John',
        last_name: 'Doe',
      },
    };

    it('should create a new user when webhook is valid', async () => {
      mockReq.body = mockUserData;
      (isValidClerk as jest.Mock).mockReturnValue(true);

      await createUser(mockReq as Request, mockRes as Response, mockNext);

      expect(isValidClerk).toHaveBeenCalledWith({
        payload: mockUserData,
        headers: mockReq.headers,
        secret: 'test-secret',
      });

      expect(prisma.user.create).toHaveBeenCalledWith({
        data: {
          email: 'test@example.com',
          clerkID: 'clerk123',
          username: 'John Doe',
        },
      });

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'User created' });
    });

    it('should throw unauthorized error when webhook is invalid', async () => {
      mockReq.body = mockUserData;
      (isValidClerk as jest.Mock).mockReturnValue(false);

      await createUser(mockReq as Request, mockRes as Response, mockNext);

      expect(isValidClerk).toHaveBeenCalled();
      expect(prisma.user.create).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(expect.any(UnauthorizedError));
    });

    it('should not create user for non-user.created events', async () => {
      mockReq.body = { ...mockUserData, type: 'user.updated' };
      (isValidClerk as jest.Mock).mockReturnValue(true);

      await createUser(mockReq as Request, mockRes as Response, mockNext);

      expect(prisma.user.create).not.toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'User created' });
    });

    it('should handle errors properly', async () => {
      mockReq.body = mockUserData;
      (isValidClerk as jest.Mock).mockReturnValue(true);

      const error = new Error('Database error');
      (prisma.user.create as jest.Mock).mockRejectedValue(error);

      await createUser(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('getTeamIdFromCode', () => {
    it('should return teamID when team code exists', async () => {
      const teamCode = 'TEAM123';
      const expectedTeamId = 'team-uuid';

      (prisma.team.findUnique as jest.Mock).mockResolvedValue({
        teamID: expectedTeamId,
      });

      const result = await getTeamIdFromCode(teamCode);

      expect(prisma.team.findUnique).toHaveBeenCalledWith({
        where: { teamCode },
        select: { teamID: true },
      });

      expect(result).toBe(expectedTeamId);
    });

    it('should return null when team code does not exist', async () => {
      const teamCode = 'NONEXISTENT';

      (prisma.team.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await getTeamIdFromCode(teamCode);

      expect(prisma.team.findUnique).toHaveBeenCalledWith({
        where: { teamCode },
        select: { teamID: true },
      });

      expect(result).toBeNull();
    });
  });
}); 