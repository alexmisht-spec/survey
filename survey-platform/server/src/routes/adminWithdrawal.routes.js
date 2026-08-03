import { Router } from "express";

import authMiddleware from "../middleware/auth.middleware.js";
import adminMiddleware from "../middleware/admin.middleware.js";

import {

    getWithdrawals,
    approveWithdrawal,
    rejectWithdrawal

} from "../controllers/adminWithdrawal.controller.js";

const router = Router();

router.get(
    "/",
    authMiddleware,
    adminMiddleware,
    getWithdrawals
);

router.put(
    "/:id/approve",
    authMiddleware,
    adminMiddleware,
    approveWithdrawal
);

router.put(
    "/:id/reject",
    authMiddleware,
    adminMiddleware,
    rejectWithdrawal
);

export default router;