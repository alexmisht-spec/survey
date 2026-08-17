import { Router } from "express";

import {
    getMyReferrals
} from "../controllers/referral.controllers.js";

import authMiddleware from "../middleware/auth.middleware.js";

const router = Router();

router.get(
    "/me",
    authMiddleware,
    getMyReferrals
);

export default router;