import { NextFunction, Request, Response } from "express";
import ForbiddenError from "./../../domain/errors/forbidden-error.js";
import { clerkClient, getAuth } from "@clerk/express";

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
    const auth = getAuth(req);
    
    if (auth?.sessionClaims?.role !== "admin") {
        throw new ForbiddenError("Forbidden");
    }

    next();
}