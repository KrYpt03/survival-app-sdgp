import { Request, Response } from "express";
import { prisma } from "../db";
import { checkGeofencing } from "../services/geofencing";

export const updateLocation = async (req: Request, res: Response) => {
    const { userID, latitude, longitude, altitude, speed } = req.body;
  
    try {
      // Find user and their team
      const user = await prisma.user.findUnique({
        where: { userID },
        select: { teamID: true },
      });
  
      if (!user || !user.teamID) {
        res.status(400).json({ error: "User or team not found" });
        return; 
        }
  
      // Save the latest location
      await prisma.userLocation.create({
        data: { userID, latitude, longitude, altitude, speed },
      });
  
      // Check if the user is out of range
      const isOutOfRange = await checkGeofencing(user.teamID, latitude, longitude);
  
      res.status(200).json({ success: true, isOutOfRange });
    } catch (error) {
      console.error("Location update error:", error);
      res.status(500).json({ error: "Failed to update location" });
      return;  
    }
  }

  export  const getLocationForTeam = async (req: Request, res: Response) => {
    const { teamID } = req.params;
  
    try {
      res.setHeader("Cache-Control", "public, max-age=10"); // Cache responses for 10s
  
      const locations = await prisma.userLocation.findMany({
        where: { user: { teamID } },
        select: {
          userID: true,
          latitude: true,
          longitude: true,
          timestamp: true,
        },
        orderBy: { timestamp: "desc" },
        distinct: ["userID"], // Fetch only the latest location per user
      });
  
      res.status(200).json(locations);
    } catch (error) {
      console.error("Error fetching locations:", error);
      res.status(500).json({ error: "Failed to fetch locations" });
    }
  }