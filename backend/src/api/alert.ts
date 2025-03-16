import express, { Request, Response } from "express";
import prisma from "../infrastructure/db";

const router = express.Router();

/**
 * 📌 Get all alerts for a team
 * GET /api/alert/team/:teamID
 */
router.get("/team/:teamID", async (req: Request<{ teamID: string }>, res: Response) => {
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
});

/**
 * 📌 Mark an alert as resolved
 * PATCH /api/alert/:alertID
 */
router.patch("/:alertID", async (req: Request<{ alertID: string }>, res: Response) => {
  const { alertID } = req.params;
  try {
    await prisma.alert.update({ where: { alertID }, data: { resolved: true } });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to resolve alert" });
  }
});

export default router;
