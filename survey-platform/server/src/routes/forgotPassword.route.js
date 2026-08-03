import express from "express";

import { forgotPasswordSendOTPController } from "../controllers/forgotPasswordController.js";

import { forgotPasswordResetController } from "../controllers/verifyForgotPasswordOTPController.js";

const router = express.Router();

router.post("/send-otp", forgotPasswordSendOTPController);

router.post("/reset", forgotPasswordResetController);

export default router;