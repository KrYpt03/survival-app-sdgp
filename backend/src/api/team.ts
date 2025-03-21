import express from "express";
import { getAllTeams, getTeamMembers, createTeam, removeTeamMember, changeTeamLeader, leaveTeam, deactivateTeam, activateTeam, joinTeam } from "../application/team.js";
import { isAuthenticated } from "./middlewares/authentication-middleware.js";

const router = express.Router();

/**
 * Get all teams
 * GET /api/team
 */
router.route("/").get( getAllTeams);

/**
 * Get team members with latest location
 * GET /api/team/:teamID/members
 */
router.route("/:teamID/members").get( getTeamMembers);

/**
 * Create a new team
 * POST /api/team
 */
router.route("/").post(createTeam);

/**
 * Remove a team member
 * DELETE /api/team/member
 */
router.route("/member").delete(removeTeamMember);

/**
 * Change team leader
 * PUT /api/team/leader
 */
router.route("/leader").put( changeTeamLeader);

/**
 *  Leave current team
 * POST /api/team/leave
 */
router.route("/leave").post( leaveTeam);

/**
 * Deactivate team
 * PUT /api/team/deactivate
 */
router.route("/deactivate").put( deactivateTeam);

/**
 * Activate team
 * PUT /api/team/activate
 */
router.route("/activate").put( activateTeam);

/**
 * Join a team using team code
 * POST /api/team/join
 */
router.route("/join").post( joinTeam);

export default router;
