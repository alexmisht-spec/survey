import { Router } from "express";

import authMiddleware from "../middleware/auth.middleware.js";
import adminMiddleware from "../middleware/admin.middleware.js";

import { getAdminDashboard } from "../controllers/adminDashboard.controller.js";

const router = Router();

router.get(

    "/",

    authMiddleware,

    adminMiddleware,

    getAdminDashboard

);

export default router;