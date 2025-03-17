import express from "express";
import { getAllTeams, getTeamMembers, createTeam } from "../application/team";

const router = express.Router();

/**
 * 📌 Get all teams
 * GET /api/team
 */
router.route("/").get(getAllTeams);

/**
 * 📌 Get team members with latest location
 * GET /api/team/:teamID/members
 */
router.route("/:teamID/members").get(getTeamMembers);

/**
 * 📌 Create a new team
 * POST /api/team
 */
router.route("/").post(createTeam);

export default router;
