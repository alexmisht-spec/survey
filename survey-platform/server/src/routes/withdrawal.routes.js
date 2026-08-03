import { Router } from "express";
import authMiddleware from "../middleware/auth.middleware.js";

import {
    requestWithdrawal,
    getMyWithdrawals
} from "../controllers/withdrawal.controller.js";

const router = Router();

router.use(authMiddleware);

router.post("/", requestWithdrawal);

router.get("/", getMyWithdrawals);

export default router;