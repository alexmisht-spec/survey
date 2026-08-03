import express from "express";

import authMiddleware from "../middleware/auth.middleware.js";

import {
    sendPasswordOTPController,
    verifyPasswordOTPController,
    changePasswordController,
    getProfileController,
    updateProfileController,
} from "../controllers/settings.controller.js";

const router = express.Router();

router.post(
    "/password/send-otp",
    authMiddleware,
    sendPasswordOTPController
);

router.post(
    "/password/verify-otp",
    authMiddleware,
    verifyPasswordOTPController
);

router.post(
    "/password/change",
    authMiddleware,
    changePasswordController
);
router.get(
    "/profile",
    authMiddleware,
    getProfileController
);

router.put(
    "/profile",
    authMiddleware,
    updateProfileController
);

export default router;