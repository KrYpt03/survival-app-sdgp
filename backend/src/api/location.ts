import express, { Request, Response } from "express";
import prisma from "../infrastructure/db.js";
import { checkGeofencing } from "../application/tracking.js";
import {updateLocation, getLocationForTeam} from "../application/location.js";

const router = express.Router();

// Define request body interface
interface LocationUpdateRequest {
  userID: string;
  latitude: number;
  longitude: number;
  altitude: number;
  speed: number;
}

/**
 * Update user location (optimized for polling)
 * POST /api/location/update
 */
router.route("/update").post(updateLocation);

/**
 * Get latest locations of team members (optimized for mobile)
 * GET /api/location/team/:teamID
 */
router.route("/team/:teamID").get(getLocationForTeam);

export default router;
