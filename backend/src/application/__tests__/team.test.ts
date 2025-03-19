import { Request, Response, NextFunction } from 'express';
import {
  getAllTeams,
  getTeamMembers,
  createTeam,
  removeTeamMember,
  changeTeamLeader,
  leaveTeam,
  deactivateTeam,
} from '../team.js';
import prisma from '../../infrastructure/db.js';
import NotFoundError from '../../domain/errors/not-found-error.js';
import ValidationError from '../../domain/errors/validation-error.js';
import { getAuth } from '@clerk/express';

// Mock dependencies
jest.mock('../../infrastructure/db', () => ({
  team: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
  user: {
    findUnique: jest.fn(),
    update: jest.fn(),
  },
}));

jest.mock('@clerk/express', () => ({
  getAuth: jest.fn(),
}));

describe('Team Module', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockReq = {
      body: {},
      params: {},
    };
    mockRes = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };
    mockNext = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllTeams', () => {
    it('should return all teams', async () => {
      const mockTeams = [
        { teamID: '1', teamName: 'Team 1' },
        { teamID: '2', teamName: 'Team 2' },
      ];

      (prisma.team.findMany as jest.Mock).mockResolvedValue(mockTeams);

      await getAllTeams(mockReq as Request, mockRes as Response, mockNext);

      expect(prisma.team.findMany).toHaveBeenCalled();
      expect(mockRes.json).toHaveBeenCalledWith(mockTeams);
    });

    it('should handle errors properly', async () => {
      const error = new Error('Database error');
      (prisma.team.findMany as jest.Mock).mockRejectedValue(error);

      await getAllTeams(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('getTeamMembers', () => {
    it('should return team members with their latest locations', async () => {
      const teamID = 'team123';
      mockReq.params = { teamID };

      const mockTeam = {
        teamID,
        teamMembers: [
          {
            userID: 'user1',
            username: 'User 1',
            locations: [{ timestamp: new Date(), latitude: 0, longitude: 0 }],
          },
        ],
      };

      (prisma.team.findUnique as jest.Mock).mockResolvedValue(mockTeam);

      await getTeamMembers(mockReq as Request<{ teamID: string }>, mockRes as Response, mockNext);

      expect(prisma.team.findUnique).toHaveBeenCalledWith({
        where: { teamID },
        include: {
          teamMembers: {
            include: { locations: { orderBy: { timestamp: 'desc' }, take: 1 } },
          },
        },
      });
      expect(mockRes.json).toHaveBeenCalledWith(mockTeam.teamMembers);
    });

    it('should handle team not found', async () => {
      mockReq.params = { teamID: 'nonexistent' };
      (prisma.team.findUnique as jest.Mock).mockResolvedValue(null);

      await getTeamMembers(mockReq as Request<{ teamID: string }>, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.any(NotFoundError));
    });
  });

  describe('createTeam', () => {
    it('should create a new team with valid input', async () => {
      const teamData = {
        teamName: 'New Team',
        leaderID: 'leader123',
        range: 200,
      };

      mockReq.body = teamData;

      const mockTeam = {
        ...teamData,
        teamID: 'team123',
        teamCode: 'ABC123',
      };

      (prisma.team.create as jest.Mock).mockResolvedValue(mockTeam);

      await createTeam(mockReq as Request, mockRes as Response, mockNext);

      expect(prisma.team.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          teamName: teamData.teamName,
          leaderID: teamData.leaderID,
          range: teamData.range,
        }),
      });
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith(mockTeam);
    });

    it('should validate required fields', async () => {
      mockReq.body = { teamName: 'New Team' };

      await createTeam(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.any(ValidationError));
      expect(prisma.team.create).not.toHaveBeenCalled();
    });
  });

  describe('removeTeamMember', () => {
    const setupRemoveMemberTest = () => {
      const teamID = 'team123';
      const userID = 'user123';
      const clerkID = 'clerk123';
      const leaderID = 'leader123';

      mockReq.body = { teamID, userID };
      (getAuth as jest.Mock).mockReturnValue({ userId: clerkID });

      return { teamID, userID, clerkID, leaderID };
    };

    it('should successfully remove a team member', async () => {
      const { teamID, userID, clerkID, leaderID } = setupRemoveMemberTest();

      (prisma.user.findUnique as jest.Mock)
        .mockResolvedValueOnce({ userID: leaderID }) // Current user (leader)
        .mockResolvedValueOnce({ userID }); // User to remove

      (prisma.team.findUnique as jest.Mock).mockResolvedValue({
        teamID,
        leaderID,
      });

      await removeTeamMember(mockReq as Request, mockRes as Response, mockNext);

      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { userID },
        data: { teamID: null },
      });
      expect(mockRes.status).toHaveBeenCalledWith(200);
    });

    it('should validate team leader permission', async () => {
      const { teamID, clerkID } = setupRemoveMemberTest();

      (prisma.user.findUnique as jest.Mock).mockResolvedValueOnce({
        userID: 'notLeader',
      });

      (prisma.team.findUnique as jest.Mock).mockResolvedValue({
        teamID,
        leaderID: 'differentLeader',
      });

      await removeTeamMember(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.any(ValidationError));
      expect(prisma.user.update).not.toHaveBeenCalled();
    });
  });

  describe('changeTeamLeader', () => {
    const setupChangeLeaderTest = () => {
      const teamID = 'team123';
      const newLeaderID = 'newLeader123';
      const currentLeaderID = 'currentLeader123';
      const clerkID = 'clerk123';

      mockReq.body = { teamID, newLeaderID };
      (getAuth as jest.Mock).mockReturnValue({ userId: clerkID });

      return { teamID, newLeaderID, currentLeaderID, clerkID };
    };

    it('should successfully change team leader', async () => {
      const { teamID, newLeaderID, currentLeaderID } = setupChangeLeaderTest();

      (prisma.user.findUnique as jest.Mock)
        .mockResolvedValueOnce({ userID: currentLeaderID }) // Current leader
        .mockResolvedValueOnce({ userID: newLeaderID }); // New leader

      (prisma.team.findUnique as jest.Mock).mockResolvedValue({
        teamID,
        leaderID: currentLeaderID,
      });

      await changeTeamLeader(mockReq as Request, mockRes as Response, mockNext);

      expect(prisma.team.update).toHaveBeenCalledWith({
        where: { teamID },
        data: { leaderID: newLeaderID },
      });
      expect(mockRes.status).toHaveBeenCalledWith(200);
    });

    it('should validate current leader permission', async () => {
      const { teamID, currentLeaderID } = setupChangeLeaderTest();

      (prisma.user.findUnique as jest.Mock).mockResolvedValueOnce({
        userID: 'notLeader',
      });

      (prisma.team.findUnique as jest.Mock).mockResolvedValue({
        teamID,
        leaderID: currentLeaderID,
      });

      await changeTeamLeader(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.any(ValidationError));
      expect(prisma.team.update).not.toHaveBeenCalled();
    });
  });

  describe('leaveTeam', () => {
    const setupLeaveTeamTest = () => {
      const clerkID = 'clerk123';
      const userID = 'user123';
      const teamID = 'team123';

      (getAuth as jest.Mock).mockReturnValue({ userId: clerkID });

      return { clerkID, userID, teamID };
    };

    it('should successfully leave team', async () => {
      const { clerkID, userID, teamID } = setupLeaveTeamTest();

      (prisma.user.findUnique as jest.Mock).mockResolvedValue({
        userID,
        team: {
          teamID,
          leaderID: 'differentLeader',
          teamMembers: [],
        },
      });

      await leaveTeam(mockReq as Request, mockRes as Response, mockNext);

      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { userID },
        data: { teamID: null },
      });
      expect(mockRes.status).toHaveBeenCalledWith(200);
    });

    it('should prevent team leader from leaving', async () => {
      const { clerkID, userID, teamID } = setupLeaveTeamTest();

      (prisma.user.findUnique as jest.Mock).mockResolvedValue({
        userID,
        team: {
          teamID,
          leaderID: userID,
          teamMembers: [],
        },
      });

      await leaveTeam(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.any(ValidationError));
      expect(prisma.user.update).not.toHaveBeenCalled();
    });
  });

  describe('deactivateTeam', () => {
    const setupDeactivateTeamTest = () => {
      const teamID = 'team123';
      const leaderID = 'leader123';
      const clerkID = 'clerk123';

      mockReq.body = { teamID };
      (getAuth as jest.Mock).mockReturnValue({ userId: clerkID });

      return { teamID, leaderID, clerkID };
    };

    it('should successfully deactivate team', async () => {
      const { teamID, leaderID } = setupDeactivateTeamTest();

      // Mock the current user as team leader
      (prisma.user.findUnique as jest.Mock).mockResolvedValueOnce({
        userID: leaderID,
        leads: [{ teamID }],
      });

      // Mock the team lookup
      (prisma.team.findUnique as jest.Mock).mockResolvedValueOnce({
        teamID,
        leaderID,
      });

      // Mock the team update
      (prisma.team.update as jest.Mock).mockResolvedValueOnce({
        teamID,
        active: false,
      });

      await deactivateTeam(mockReq as Request, mockRes as Response, mockNext);

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { clerkID: 'clerk123' },
        include: { leads: true },
      });

      expect(prisma.team.findUnique).toHaveBeenCalledWith({
        where: { teamID },
      });

      expect(prisma.team.update).toHaveBeenCalledWith({
        where: { teamID },
        data: { active: false },
      });

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Team deactivated' });
    });

    it('should validate team leader permission', async () => {
      const { teamID } = setupDeactivateTeamTest();

      // Mock the current user as non-leader
      (prisma.user.findUnique as jest.Mock).mockResolvedValueOnce({
        userID: 'notLeader',
        leads: [], // User doesn't lead any teams
      });

      // Mock the team lookup
      (prisma.team.findUnique as jest.Mock).mockResolvedValueOnce({
        teamID,
        leaderID: 'differentLeader',
      });

      await deactivateTeam(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.any(ValidationError));
      expect(prisma.team.update).not.toHaveBeenCalled();
    });

    it('should handle unauthenticated user', async () => {
      const { teamID } = setupDeactivateTeamTest();
      (getAuth as jest.Mock).mockReturnValue({ userId: null });

      await deactivateTeam(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.any(ValidationError));
      expect(prisma.team.update).not.toHaveBeenCalled();
    });

    it('should handle user not found', async () => {
      const { teamID } = setupDeactivateTeamTest();
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      await deactivateTeam(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.any(NotFoundError));
      expect(prisma.team.update).not.toHaveBeenCalled();
    });

    it('should handle team not found', async () => {
      const { teamID, leaderID } = setupDeactivateTeamTest();

      // Mock the current user
      (prisma.user.findUnique as jest.Mock).mockResolvedValueOnce({
        userID: leaderID,
        leads: [{ teamID }],
      });

      // Mock team not found
      (prisma.team.findUnique as jest.Mock).mockResolvedValueOnce(null);

      await deactivateTeam(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.any(NotFoundError));
      expect(prisma.team.update).not.toHaveBeenCalled();
    });
  });
}); 