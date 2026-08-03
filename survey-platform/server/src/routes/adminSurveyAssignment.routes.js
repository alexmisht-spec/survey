import { Router } from "express";

import authMiddleware from "../middleware/auth.middleware.js";
import adminMiddleware from "../middleware/admin.middleware.js";

import {

    assignSurvey,
    getVerifiedUsers

} from "../controllers/adminAssignment.controller.js";

const router = Router();

router.get(

    "/users",

    authMiddleware,

    adminMiddleware,

    getVerifiedUsers

);

router.post(

    "/assign",

    authMiddleware,

    adminMiddleware,

    assignSurvey

);

export default router;