import { Router } from "express";

import {
    register,
    login,
    me,
    logout,
    refresh,
} from "../controllers/auth.controllers.js";

import authMiddleware from "../middleware/auth.middleware.js";

const router = Router();

router.post("/register", register);

router.post("/login", login);

router.post("/logout", logout);

router.get("/me", authMiddleware, me);

router.post("/refresh", refresh);

export default router;