import express, { Request, Response } from "express";
import prisma from "../infrastructure/db";

const router = express.Router();

/**
 * 📌 Get all teams
 * GET /api/team
 */
router.route("/").get(getAllTeams);

/**
 * 📌 Get team members with latest location
 * GET /api/team/:teamID/members
 */
router.get("/:teamID/members", authenticateUser async (req: Request<{ teamID: string }>, res: Response) => {
  const { teamID } = req.params;
  try {
    const team = await prisma.team.findUnique({
      where: { teamID },
      include: { teamMembers: { include: { locations: { orderBy: { timestamp: "desc" }, take: 1 } } } },
    });

    if (!team) return res.status(404).json({ error: "Team not found" });

    res.json(team.teamMembers);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch team members" });
  }
});

/**
 * 📌 Create a new team
 * POST /api/team
 */
router.post("/", authenticateUser, async (req: Request, res: Response) => {
  const { teamName, leaderID, range } = req.body;
  if (!teamName || !leaderID || !range || range < 100) {
    return res.status(400).json({ error: "Invalid input: Team name, leader ID, and range (min 100m) required" });
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
});

export default router;
