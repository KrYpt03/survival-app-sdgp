import { Request, Response, NextFunction } from "express";
import prisma from "../infrastructure/db.js";
import { checkGeofencing } from "../application/tracking.js";
import NotFoundError from "../domain/errors/not-found-error.js";

/**
 * Updates a user's location and checks if they are within their team's geofence
 * 
 * @param req Request containing userID and location data (latitude, longitude, altitude, speed)
 * @param res Response object to send back the result
 * @param next Next function for error handling middleware
 * 
 * @throws NotFoundError if user or their team is not found
 * @returns Promise<void> Resolves with success status and whether user is out of range
 */
export const updateLocation = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    // Extract location data from request body
    const { userId, latitude, longitude, altitude, speed } = req.body;
  
    try {
      // Find user and check if they belong to a team
      const user = await prisma.user.findUnique({
        where: { clerkID: userId },
        include: {
          team: true,
        },
      });
  
      // Validate user exists and belongs to a team
      if (!user || !user.teamID) {
        throw new NotFoundError("User or team not found");
      }
  
      // Record the user's current location in the database
      await prisma.userLocation.create({
        data: { userID: user.userID, latitude, longitude, altitude, speed },
      });

      // Determine if user has moved outside their team's designated area
      const isOutOfRange = await checkGeofencing(user, latitude, longitude);
  
      // Return success status and whether user is out of range
      res.status(200).json({ success: true, isOutOfRange });
    } catch (error) {
      next(error);
    }
}

/**
 * Retrieves the latest location for all members of a specific team
 * 
 * @param req Request containing teamID parameter
 * @param res Response object to send back the locations
 * @param next Next function for error handling middleware
 * 
 * @returns Promise<void> Resolves with array of latest user locations
 */
export const getLocationForTeam = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    // Extract team ID from request parameters
    const { teamID } = req.params;
  
    try {
      // Query database for latest location of each team member
      const locations = await prisma.userLocation.findMany({
        where: { user: { teamID } },
        select: {
          userID: true,
          latitude: true,
          longitude: true,
          timestamp: true,
        },
        orderBy: { timestamp: "desc" },
        distinct: ["userID"], // Ensure only one location per user (the latest)
      });
  
      // Return the locations array
      res.status(200).json(locations);
    } catch (error) {
      next(error);
    }
}