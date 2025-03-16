import { Request, Response, NextFunction } from "express";
import prisma from "../infrastructure/db";
import ValidationError from "../domain/errors/validation-error";

export const createUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { name, email, password, teamCode } = req.body;
  
  try {
    // Validate input
    if (!name || !email || !password) {
      throw new ValidationError("Name, email, and password are required");
    }
    
    // Check if user with email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    
    if (existingUser) {
      throw new ValidationError("User with this email already exists");
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
    next(error);
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
