import express from "express";
import { getTeamAlerts, resolveAlert } from "../application/alert";

const router = express.Router();

/**
 * 📌 Get all alerts for a team
 * GET /api/alert/team/:teamID
 */
router.route("/team/:teamID").get(getTeamAlerts);

/**
 * 📌 Mark an alert as resolved
 * PATCH /api/alert/:alertID
 */
router.route("/:alertID").patch(resolveAlert);

export default router;
