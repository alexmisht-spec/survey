import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import adminMiddleware from "../middleware/admin.middleware.js";
import {
    getVerifiedUsers
} from "../controllers/adminAssignment.controller.js";

const router = express.Router();

router.get(
    "/verified",
    authMiddleware,
    adminMiddleware,
    getVerifiedUsers
);

export default router;