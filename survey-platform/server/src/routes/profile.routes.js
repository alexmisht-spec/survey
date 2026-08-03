import { Router } from "express";

import authMiddleware from "../middleware/auth.middleware.js";

import {
    completeProfile,
    getProfile
} from "../controllers/profile.controller.js";

const router = Router();

router.post(
    "/",
    authMiddleware,
    completeProfile
);

router.get(
    "/",
    authMiddleware,
    getProfile
);

export default router;