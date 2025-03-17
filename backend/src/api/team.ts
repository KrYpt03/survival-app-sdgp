import express from "express";
import { getAllTeams, getTeamMembers, createTeam, removeTeamMember, changeTeamLeader, leaveTeam, deactivateTeam, activateTeam } from "../application/team";
import { isAuthenticated } from "./middlewares/authentication-middleware";

const router = express.Router();

/**
 * 📌 Get all teams
 * GET /api/team
 */
router.route("/").get(isAuthenticated, getAllTeams);

/**
 * 📌 Get team members with latest location
 * GET /api/team/:teamID/members
 */
router.route("/:teamID/members").get(isAuthenticated, getTeamMembers);

/**
 * 📌 Create a new team
 * POST /api/team
 */
router.route("/").post(isAuthenticated, createTeam);

/**
 * 📌 Remove a team member
 * DELETE /api/team/member
 */
router.route("/member").delete(isAuthenticated, removeTeamMember);

/**
 * 📌 Change team leader
 * PUT /api/team/leader
 */
router.route("/leader").put(isAuthenticated, changeTeamLeader);

/**
 * 📌 Leave current team
 * POST /api/team/leave
 */
router.route("/leave").post(isAuthenticated, leaveTeam);

/**
 * 📌 Deactivate team
 * PUT /api/team/deactivate
 */
router.route("/deactivate").put(isAuthenticated, deactivateTeam);

/**
 * 📌 Activate team
 * PUT /api/team/activate
 */
router.route("/activate").put(isAuthenticated, activateTeam);

export default router;
