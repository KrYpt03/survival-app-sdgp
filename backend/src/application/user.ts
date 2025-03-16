import { Request, Response } from "express";
import prisma from "../infrastructure/db";

export const createUser = async (req: Request, res: Response): Promise<void> => {
  const { name, email, password, teamCode } = req.body;
  
  try {
    // Validate input
    if (!name || !email || !password) {
      res.status(400).json({ error: "Name, email, and password are required" });
      return;
    }
    
    // Check if user with email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    
    if (existingUser) {
      res.status(400).json({ error: "User with this email already exists" });
      return;
    }
    
    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password, // In a real app, you would hash this password
        teamID: teamCode ? await getTeamIdFromCode(teamCode) : null,
      },
    });
    
    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;
    
    res.status(201).json(userWithoutPassword);
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Failed to create user" });
  }
};

// Helper function to get team ID from team code
async function getTeamIdFromCode(teamCode: string): Promise<string | null> {
  const team = await prisma.team.findUnique({
    where: { teamCode },
    select: { teamID: true },
  });
  
  return team?.teamID || null;
}
