import { Router } from "express";

import authMiddleware from "../middleware/auth.middleware.js";
import adminMiddleware from "../middleware/admin.middleware.js";

import {
    getWithdrawals,
    approveWithdrawal,
    markWithdrawalPaid,
    rejectWithdrawal
} from "../controllers/adminWithdrawal.controller.js";

const router = Router();


/*
|--------------------------------------------------------------------------
| GET ALL WITHDRAWALS
|--------------------------------------------------------------------------
*/

router.get(
    "/",
    authMiddleware,
    adminMiddleware,
    getWithdrawals
);


/*
|--------------------------------------------------------------------------
| APPROVE WITHDRAWAL
|--------------------------------------------------------------------------
|
| This only approves the withdrawal.
| It does NOT send the M-Pesa payment.
|
*/

router.put(
    "/:id/approve",
    authMiddleware,
    adminMiddleware,
    approveWithdrawal
);


/*
|--------------------------------------------------------------------------
| MARK WITHDRAWAL AS PAID
|--------------------------------------------------------------------------
|
| Admin manually sends the M-Pesa payment first,
| then clicks "Mark as Paid".
|
*/

router.put(
    "/:id/paid",
    authMiddleware,
    adminMiddleware,
    markWithdrawalPaid
);


/*
|--------------------------------------------------------------------------
| REJECT WITHDRAWAL
|--------------------------------------------------------------------------
*/

router.put(
    "/:id/reject",
    authMiddleware,
    adminMiddleware,
    rejectWithdrawal
);


export default router;