import { Request, Response } from "express";
import prisma from "../infrastructure/db";

export const getTeamAlerts = async (req: Request<{ teamID: string }>, res: Response): Promise<void> => {
  const { teamID } = req.params;
  try {
    const alerts = await prisma.alert.findMany({
      where: { teamID },
      orderBy: { timestamp: "desc" },
    });

    res.json(alerts);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch alerts" });
  }
};

export const resolveAlert = async (req: Request<{ alertID: string }>, res: Response): Promise<void> => {
  const { alertID } = req.params;
  try {
    await prisma.alert.update({ where: { alertID }, data: { resolved: true } });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to resolve alert" });
  }
}; 