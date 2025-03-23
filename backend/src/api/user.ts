import express from "express";
import { createUser } from "../application/user.js";
import { getTeamById } from "../application/team.js";

const router = express.Router();

/**
 * Create a new user
 * POST /api/user
 */
router.route("/webhook").post(createUser);

router.route("/").get(getTeamById);

export default router;
