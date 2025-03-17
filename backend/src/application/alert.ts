import { Request, Response, NextFunction } from "express";
import prisma from "../infrastructure/db";
import NotFoundError from "../domain/errors/not-found-error";

export const getTeamAlerts = async (req: Request<{ teamID: string }>, res: Response, next: NextFunction): Promise<void> => {
  const { teamID } = req.params;
  try {
    const alerts = await prisma.alert.findMany({
      where: { teamID },
      orderBy: { timestamp: "desc" },
    });

    res.json(alerts);
  } catch (error) {
    next(error);
  }
};

export const resolveAlert = async (req: Request<{ alertID: string }>, res: Response, next: NextFunction): Promise<void> => {
  const { alertID } = req.params;
  try {
    const alert = await prisma.alert.findUnique({
      where: { alertID }
    });
    
    if (!alert) {
      throw new NotFoundError("Alert not found");
    }
    
    await prisma.alert.update({ where: { alertID }, data: { resolved: true } });
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
}; 