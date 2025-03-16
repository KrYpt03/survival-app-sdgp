import { Request, Response, NextFunction } from "express";
import prisma from "../infrastructure/db";
import NotFoundError from "../domain/errors/not-found-error";
import ValidationError from "../domain/errors/validation-error";

export const getAllTeams = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const teams = await prisma.team.findMany();
    res.json(teams);
  } catch (error) {
    console.error("Error fetching teams:", error);
    next(error);
  }
};

export const getTeamMembers = async (req: Request<{ teamID: string }>, res: Response, next: NextFunction): Promise<void> => {
  const { teamID } = req.params;
  try {
    const team = await prisma.team.findUnique({
      where: { teamID },
      include: { teamMembers: { include: { locations: { orderBy: { timestamp: "desc" }, take: 1 } } } },
    });

    if (!team) {
      throw new NotFoundError("Team not found");
    }

    res.json(team.teamMembers);
  } catch (error) {
    next(error);
  }
};

export const createTeam = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { teamName, leaderID, range } = req.body;
  
  try {
    if (!teamName || !leaderID || !range || range < 100) {
      throw new ValidationError("Invalid input: Team name, leader ID, and range (min 100m) required");
    }

    const newTeam = await prisma.team.create({
      data: { teamName, teamCode: Math.random().toString(36).substring(2, 8), range, leaderID },
    });

    res.status(201).json(newTeam);
  } catch (error) {
    console.error("Error creating team:", error);
    next(error);
  }
};
