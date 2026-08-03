import { Router } from "express";

import authMiddleware from "../middleware/auth.middleware.js";
import adminMiddleware from "../middleware/admin.middleware.js";

import {
    getPendingRewards,
    approveReward,
    rejectReward
} from "../controllers/adminReward.controller.js";

const router = Router();

/*
|--------------------------------------------------------------------------
| PENDING REWARDS
|--------------------------------------------------------------------------
*/

router.get(
    "/pending",
    authMiddleware,
    adminMiddleware,
    getPendingRewards
);

/*
|--------------------------------------------------------------------------
| APPROVE REWARD
|--------------------------------------------------------------------------
*/

router.post(
    "/:assignmentId/approve",
    authMiddleware,
    adminMiddleware,
    approveReward
);

/*
|--------------------------------------------------------------------------
| REJECT REWARD
|--------------------------------------------------------------------------
*/

router.post(
    "/:assignmentId/reject",
    authMiddleware,
    adminMiddleware,
    rejectReward
);

export default router;