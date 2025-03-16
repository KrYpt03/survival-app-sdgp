import { Request, Response } from "express";
import prisma from "../infrastructure/db";

export const getAllTeams = async (req: Request, res: Response): Promise<void> => {
  try {
    const teams = await prisma.team.findMany();
    res.json(teams);
  } catch (error) {
    console.error("Error fetching teams:", error);
    res.status(500).json({ error: "Failed to fetch teams" });
  }
};

export const getTeamMembers = async (req: Request<{ teamID: string }>, res: Response): Promise<void> => {
  const { teamID } = req.params;
  try {
    const team = await prisma.team.findUnique({
      where: { teamID },
      include: { teamMembers: { include: { locations: { orderBy: { timestamp: "desc" }, take: 1 } } } },
    });

    if (!team) {
      res.status(404).json({ error: "Team not found" });
      return;
    }

    res.json(team.teamMembers);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch team members" });
  }
};

export const createTeam = async (req: Request, res: Response): Promise<void> => {
  const { teamName, leaderID, range } = req.body;
  if (!teamName || !leaderID || !range || range < 100) {
    res.status(400).json({ error: "Invalid input: Team name, leader ID, and range (min 100m) required" });
    return;
  }

  try {
    const newTeam = await prisma.team.create({
      data: { teamName, teamCode: Math.random().toString(36).substring(2, 8), range, leaderID },
    });

    res.status(201).json(newTeam);
  } catch (error) {
    console.error("Error creating team:", error);
    res.status(500).json({ error: "Failed to create team" });
  }
};
