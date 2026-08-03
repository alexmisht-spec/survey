import { Router } from "express";

import authMiddleware from "../middleware/auth.middleware.js";
import adminMiddleware from "../middleware/admin.middleware.js";

import {
    addQuestion,
    updateQuestion,
    deleteQuestion
} from "../controllers/adminQuestion.controller.js";

const router = Router();

router.post(

    "/:id/questions",

    authMiddleware,

    adminMiddleware,

    addQuestion

);
router.put(
    "/questions/:questionId",
    authMiddleware,
    adminMiddleware,
    updateQuestion
);

router.delete(
    "/questions/:questionId",
    authMiddleware,
    adminMiddleware,
    deleteQuestion
);

export default router;