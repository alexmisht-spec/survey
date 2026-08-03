import express from "express";

import authMiddleware from "../middleware/auth.middleware.js";

import {
    submitRewardCredentials,
    getRewardStatus
} from "../controllers/reward.controller.js";

const router = express.Router();

router.use(authMiddleware);

/*
|--------------------------------------------------------------------------
| USER SUBMITS REWARD CREDENTIALS
|--------------------------------------------------------------------------
*/

router.post("/submit", submitRewardCredentials);

/*
|--------------------------------------------------------------------------
| GET CURRENT USER REWARD STATUS
|--------------------------------------------------------------------------
*/

router.get("/status", getRewardStatus);

export default router;