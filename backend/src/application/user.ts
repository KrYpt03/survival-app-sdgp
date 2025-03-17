import { NextFunction, Request, Response } from "express";
import { isValidClerk } from "../api/middlewares/authentication-middleware";
import UnauthorizedError from "../domain/errors/unauthorized-error";
import prisma from "../infrastructure/db";

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
      await prisma.user.create({
        data: {
          email: payload.data.email_addresses[0].email_address,
          clerkID: payload.data.id,
          username: `${payload.data.first_name} ${payload.data.last_name}`,          
        },
      });
    }

    res.status(200).json({ message: "User created" });
  } catch (error) {
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
