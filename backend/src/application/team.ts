import { Request, Response, NextFunction } from "express";
import prisma from "../infrastructure/db";
import NotFoundError from "../domain/errors/not-found-error";
import ValidationError from "../domain/errors/validation-error";
import { getAuth } from "@clerk/express";

export const getAllTeams = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const teams = await prisma.team.findMany();
    res.json(teams);
  } catch (error) {
    next(error);
  }
};

export const getTeamMembers = async (
  req: Request<{ teamID: string }>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { teamID } = req.params;
  try {
    const team = await prisma.team.findUnique({
      where: { teamID },
      include: {
        teamMembers: {
          include: { locations: { orderBy: { timestamp: "desc" }, take: 1 } },
        },
      },
    });

    if (!team) {
      throw new NotFoundError("Team not found");
    }

    res.json(team.teamMembers);
  } catch (error) {
    next(error);
  }
};

export const createTeam = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { teamName, leaderID, range } = req.body;

  try {
    if (!teamName || !leaderID || !range || range < 100) {
      throw new ValidationError(
        "Invalid input: Team name, leader ID, and range (min 100m) required"
      );
    }

    const newTeam = await prisma.team.create({
      data: {
        teamName,
        teamCode: Math.random().toString(36).substring(2, 8),
        range,
        leaderID,
      },
    });

    res.status(201).json(newTeam);
  } catch (error) {
    next(error);
  }
};

export const removeTeamMember = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { teamID, userID } = req.body;
  const { userId: clerkID } = getAuth(req);

  try {
    // Get current user from Clerk ID
    const currentUser = await prisma.user.findUnique({
      where: { clerkID },
    });

    if (!currentUser) {
      throw new NotFoundError("Current user not found");
    }

    const team = await prisma.team.findUnique({ where: { teamID } });
    if (!team) {
      throw new NotFoundError("Team not found");
    }

    // Check if current user is the team leader
    if (team.leaderID !== currentUser.userID) {
      throw new ValidationError("Only the team leader can remove members");
    }

    const user = await prisma.user.findUnique({ where: { userID } });
    if (!user) {
      throw new NotFoundError("User not found");
    }

    await prisma.user.update({ where: { userID }, data: { teamID: null } });

    res.status(200).json({ message: "User removed from team" });
  } catch (error) {
    next(error);
  }
};

export const changeTeamLeader = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { teamID, newLeaderID } = req.body;
  const { userId: clerkID } = getAuth(req);

  try {
    // Get current user from Clerk ID
    const currentUser = await prisma.user.findUnique({
      where: { clerkID },
      include: {
        leads: true,
      },
    });

    if (!currentUser) {
      throw new NotFoundError("Current user not found");
    }

    // Check if current user is the team leader
    const team = await prisma.team.findUnique({
      where: { teamID },
      include: {
        leader: true,
      },
    });

    if (!team) {
      throw new NotFoundError("Team not found");
    }

    if (team.leaderID !== currentUser.userID) {
      throw new ValidationError("Only the team leader can change leadership");
    }

    const newLeader = await prisma.user.findUnique({
      where: { userID: newLeaderID },
    });
    if (!newLeader) {
      throw new NotFoundError("New leader not found");
    }

    await prisma.team.update({
      where: { teamID },
      data: { leaderID: newLeaderID },
    });

    res.status(200).json({ message: "Team leader changed" });
  } catch (error) {
    next(error);
  }
};

export const leaveTeam = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { userId: clerkID } = getAuth(req);

  try {
    // Get current user with team info
    const currentUser = await prisma.user.findUnique({
      where: { clerkID },
      include: {
        team: {
          include: {
            teamMembers: true,
            leader: true
          }
        }
      }
    });

    if (!currentUser) {
      throw new NotFoundError("User not found");
    }

    if (!currentUser.team) {
      throw new ValidationError("User is not in a team");
    }

    // Check if user is team leader
    if (currentUser.team.leaderID === currentUser.userID) {
      throw new ValidationError("Team leader cannot leave without assigning a new leader first");
    }

    // Remove user from team
    await prisma.user.update({
      where: { userID: currentUser.userID },
      data: { teamID: null }
    });

    res.status(200).json({ message: "Successfully left team" });
  } catch (error) {
    next(error);
  }
};

export const deactivateTeam = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { teamID } = req.body;
  const { userId: clerkID } = getAuth(req);

  try {
    // Get current user from Clerk ID
    const currentUser = await prisma.user.findUnique({
      where: { clerkID },
      include: {
        leads: true,
      },
    });

    if (!currentUser) {
      throw new NotFoundError("Current user not found");
    }

    const team = await prisma.team.findUnique({ where: { teamID } });
    if (!team) {
      throw new NotFoundError("Team not found");
    }

    // Check if current user is the team leader
    if (team.leaderID !== currentUser.userID) {
      throw new ValidationError("Only the team leader can deactivate the team");
    }

    await prisma.team.update({ where: { teamID }, data: { active: false } });

    res.status(200).json({ message: "Team deactivated" });
  } catch (error) {
    next(error);
  }
};

export const activateTeam = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { teamID } = req.body;
  const { userId: clerkID } = getAuth(req);

  try {
    // Get current user from Clerk ID
    const currentUser = await prisma.user.findUnique({
      where: { clerkID },
      include: {
        leads: true,
      },
    });

    if (!currentUser) {
      throw new NotFoundError("Current user not found");
    }

    const team = await prisma.team.findUnique({ where: { teamID } });
    if (!team) {
      throw new NotFoundError("Team not found");
    }

    // Check if current user is the team leader
    if (team.leaderID !== currentUser.userID) {
      throw new ValidationError("Only the team leader can activate the team");
    }

    await prisma.team.update({ where: { teamID }, data: { active: true } });

    res.status(200).json({ message: "Team activated" });
  } catch (error) {
    next(error);
  }
};
