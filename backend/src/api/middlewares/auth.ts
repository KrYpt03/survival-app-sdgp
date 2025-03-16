import { ClerkExpressWithAuth } from "@clerk/clerk-sdk-node";
import { NextFunction, Request, Response } from "express";

export const authenticate = ClerkExpressWithAuth({
  onError: (err: any) => {
    return { status: 401, body: { error: "Unauthorized", details: err.message } };
  },
});

