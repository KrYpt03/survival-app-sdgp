import { Request, Response, NextFunction } from 'express';
import { getTeamAlerts, resolveAlert } from '../alert.js';
import prisma from '../../infrastructure/db.js';
import NotFoundError from '../../domain/errors/not-found-error.js';

// Mock the prisma client
jest.mock('../../infrastructure/db', () => ({
  alert: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
  },
}));

describe('Alert Module', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockReq = {
      params: {},
    };
    mockRes = {
      json: jest.fn(),
    };
    mockNext = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getTeamAlerts', () => {
    it('should return all alerts for a team', async () => {
      const teamID = 'team123';
      mockReq.params = { teamID };

      const mockAlerts = [
        {
          alertID: 'alert1',
          teamID,
          message: 'Test alert',
          timestamp: new Date(),
          resolved: false,
        },
      ];

      (prisma.alert.findMany as jest.Mock).mockResolvedValue(mockAlerts);

      await getTeamAlerts(mockReq as Request<{ teamID: string }>, mockRes as Response, mockNext);

      expect(prisma.alert.findMany).toHaveBeenCalledWith({
        where: { teamID },
        orderBy: { timestamp: 'desc' },
      });

      expect(mockRes.json).toHaveBeenCalledWith(mockAlerts);
    });

    it('should handle errors properly', async () => {
      mockReq.params = { teamID: 'team123' };

      const error = new Error('Database error');
      (prisma.alert.findMany as jest.Mock).mockRejectedValue(error);

      await getTeamAlerts(mockReq as Request<{ teamID: string }>, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('resolveAlert', () => {
    it('should successfully resolve an alert', async () => {
      const alertID = 'alert123';
      mockReq.params = { alertID };

      (prisma.alert.findUnique as jest.Mock).mockResolvedValue({
        alertID,
        resolved: false,
      });

      (prisma.alert.update as jest.Mock).mockResolvedValue({
        alertID,
        resolved: true,
      });

      await resolveAlert(mockReq as Request<{ alertID: string }>, mockRes as Response, mockNext);

      expect(prisma.alert.findUnique).toHaveBeenCalledWith({
        where: { alertID },
      });

      expect(prisma.alert.update).toHaveBeenCalledWith({
        where: { alertID },
        data: { resolved: true },
      });

      expect(mockRes.json).toHaveBeenCalledWith({ success: true });
    });

    it('should handle non-existent alert', async () => {
      mockReq.params = { alertID: 'nonexistent' };

      (prisma.alert.findUnique as jest.Mock).mockResolvedValue(null);

      await resolveAlert(mockReq as Request<{ alertID: string }>, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.any(NotFoundError));
      expect(prisma.alert.update).not.toHaveBeenCalled();
    });

    it('should handle errors properly', async () => {
      mockReq.params = { alertID: 'alert123' };

      const error = new Error('Database error');
      (prisma.alert.findUnique as jest.Mock).mockRejectedValue(error);

      await resolveAlert(mockReq as Request<{ alertID: string }>, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
}); 