import { Request, Response, NextFunction } from "express";
import UnauthorizedError from "../../domain/errors/unauthorized-error.js";
import { getAuth, WebhookEvent } from "@clerk/express";
import ValidationError from "../../domain/errors/validation-error.js";
import { IncomingHttpHeaders } from "http";
import { Webhook } from "svix";

// Define a custom interface to extend Request
declare global {
  namespace Express {
    interface Request {
      auth?: { userId: string };
    }
  }
}

export const isAuthenticated = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Skip authentication in test environment if CLERK keys are not set
  if (process.env.NODE_ENV === 'test' && (!process.env.CLERK_PUBLISHABLE_KEY || !process.env.CLERK_SECRET_KEY)) {
    // Mock the auth object for tests
    req.auth = { userId: 'test-user-id' };
    return next();
  }

  const auth = getAuth(req);

  if (!auth?.userId) {
    throw new UnauthorizedError("Unauthorized");
  }
  next();
};

export const isValidClerk = ({
  payload,
  secret,
  headers,
}: {
  payload: any;
  secret?: string;
  headers: IncomingHttpHeaders;
}) => {
  // Skip validation in test environment
  if (process.env.NODE_ENV === 'test' && (!process.env.CLERK_PUBLISHABLE_KEY || !process.env.CLERK_SECRET_KEY)) {
    return true;
  }

  const body = JSON.stringify(payload);

  if (!secret) {
    throw new Error(
      "Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local"
    );
  }

  const svix_id = headers["svix-id"];
  const svix_timestamp = headers["svix-timestamp"];
  const svix_signature = headers["svix-signature"];

  if (!svix_id || !svix_timestamp || !svix_signature) {
    throw new ValidationError("No svix parameters recieved from Clerk.");
  }

  const wh = new Webhook(secret);
  let valid = false;

  try {
    wh.verify(body, {
      "svix-id": svix_id as string,
      "svix-timestamp": svix_timestamp as string,
      "svix-signature": svix_signature as string,
    }) as WebhookEvent;
    valid = true;
  } catch (err) {
    valid = false;
  }

  return valid;
};
