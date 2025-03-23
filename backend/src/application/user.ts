import { NextFunction, Request, Response } from "express";
import { isValidClerk } from "../api/middlewares/authentication-middleware.js";
import UnauthorizedError from "../domain/errors/unauthorized-error.js";
import prisma from "../infrastructure/db.js";

export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const CLERK_WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;
    const payload = req.body;

    if (
      !isValidClerk({
        payload,
        headers: req.headers,
        secret: CLERK_WEBHOOK_SECRET,
      })
    ) {
      throw new UnauthorizedError("Unauthorized");
    }

    console.log("payload", payload);
    console.log("type", payload.type);
    console.log("userId", payload.data.id);
    
    if (payload.type === "user.created") {
      const clerkID = payload.data.id;
      
      // Check if user already exists (to avoid duplicate creation)
      const existingUser = await prisma.user.findUnique({
        where: { clerkID }
      });
      
      if (existingUser) {
        // User already exists, we can return success
        console.log("User already exists, skipping creation");
        res.status(200).json({ message: "User already exists" });
        return;
      }
      
      // Extract the email address from the payload if available
      const emailAddress = payload.data.email_addresses && 
                           payload.data.email_addresses[0]?.email_address;
      
      // Use a proper email if available, otherwise create a placeholder one
      // that's clearly identifiable as a placeholder
      const email = emailAddress && emailAddress.includes('@')
        ? emailAddress
        : `user-${clerkID.substring(0, 8)}@trailguard.example.com`;
      
      // Generate a username that doesn't exist yet
      let username = generateUsername(payload.data);
      
      // Check if username exists and generate a unique one if needed
      let usernameExists = await checkUsernameExists(username);
      let counter = 1;
      
      // If username exists, add a suffix to make it unique
      while (usernameExists && counter < 100) {
        username = `${username}${counter}`;
        usernameExists = await checkUsernameExists(username);
        counter++;
      }
      
      // If we still can't generate a unique username, use the clerk ID
      if (usernameExists) {
        username = `user_${clerkID}`;
      }
      
      // Create the user with a unique username and proper email
      await prisma.user.create({
        data: {
          email: email,
          clerkID: clerkID,
          username: username,
        },
      });
      
      console.log(`User created with email: ${email}`);
    }

    res.status(200).json({ message: "User created" });
  } catch (error) {
    console.error("Error in webhook handler:", error);
    next(error);
  }
};

// Helper function to generate a username
function generateUsername(userData: any): string {
  // Try to use first and last name
  if (userData.first_name && userData.last_name) {
    return `${userData.first_name.toLowerCase()}_${userData.last_name.toLowerCase()}`;
  }
  
  // Try to use just first name if available
  if (userData.first_name) {
    return `${userData.first_name.toLowerCase()}_user`;
  }
  
  // Try to use just last name if available
  if (userData.last_name) {
    return `user_${userData.last_name.toLowerCase()}`;
  }
  
  // Use email prefix if available
  if (userData.email_addresses && userData.email_addresses[0]?.email_address) {
    const emailPrefix = userData.email_addresses[0].email_address.split('@')[0];
    return `user_${emailPrefix}`;
  }
  
  // Use ID as last resort
  return `user_${userData.id}`;
}

// Helper function to check if a username already exists
async function checkUsernameExists(username: string): Promise<boolean> {
  const user = await prisma.user.findFirst({
    where: { username },
  });
  
  return !!user;
}

// Helper function to get team ID from team code
export async function getTeamIdFromCode(teamCode: string): Promise<string | null> {
  const team = await prisma.team.findUnique({
    where: { teamCode },
    select: { teamID: true },
  });

  return team?.teamID || null;
}
