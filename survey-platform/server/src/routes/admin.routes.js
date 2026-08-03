import { Router } from "express";

import authMiddleware from "../middleware/auth.middleware.js";
import adminMiddleware from "../middleware/admin.middleware.js";

import {

    getPendingVerifications,
    getVerification,
    downloadDocument,
    approveVerification,
    rejectVerification,
    

} from "../controllers/admin.controller.js";

const router = Router();

router.get(

    "/verifications",

    authMiddleware,

    adminMiddleware,

    getPendingVerifications

);

router.get(

    "/verifications/:id",

    authMiddleware,

    adminMiddleware,

    getVerification

);
router.get(
    "/verifications/:id/document/:type",
    authMiddleware,
    adminMiddleware,
    downloadDocument
);

router.post(
    "/verifications/:id/approve",
    authMiddleware,
    adminMiddleware,
    approveVerification
);

router.post(
    "/verifications/:id/reject",
    authMiddleware,
    adminMiddleware,
    rejectVerification
);

export default router;