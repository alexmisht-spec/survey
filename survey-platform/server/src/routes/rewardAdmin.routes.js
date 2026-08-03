import express from "express";

import authMiddleware from "../middleware/auth.middleware.js";
import adminMiddleware from "../middleware/admin.middleware.js";

import {
    getRewardSubmissions,
    approveRewardTask,
    rejectRewardTask
} from "../controllers/adminBonus.Controller.js";

const router = express.Router();

router.use(authMiddleware);
router.use(adminMiddleware);

router.get("/", getRewardSubmissions);

router.put("/:rewardId/approve", approveRewardTask);

router.put("/:rewardId/reject", rejectRewardTask);

export default router;