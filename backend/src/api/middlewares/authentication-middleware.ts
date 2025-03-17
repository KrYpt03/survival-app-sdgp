import { Request, Response, NextFunction } from "express";
import UnauthorizedError from "../../domain/errors/unauthorized-error";
import { getAuth, WebhookEvent } from "@clerk/express";
import ValidationError from "../../domain/errors/validation-error";
import { IncomingHttpHeaders } from "http";
import { Webhook } from "svix";

export const isAuthenticated = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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
