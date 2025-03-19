import express from "express";
import { createUser } from "../application/user";

const router = express.Router();

/**
 * Create a new user
 * POST /api/user
 */
router.route("/webhook").post(createUser);

export default router;
