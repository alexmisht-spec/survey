import { Router } from "express";

import authMiddleware from "../middleware/auth.middleware.js";
import adminMiddleware from "../middleware/admin.middleware.js";

import {
    getUnverifiedUsers,
    getEmailTemplates,
    createEmailTemplate,
    updateEmailTemplate,
    deleteEmailTemplate,
    sendAdminEmail
} from "../controllers/adminEmail.controller.js";

const router = Router();


/*
|--------------------------------------------------------------------------
| UNVERIFIED USERS
|--------------------------------------------------------------------------
*/

router.get(
    "/users/unverified",
    authMiddleware,
    adminMiddleware,
    getUnverifiedUsers
);


/*
|--------------------------------------------------------------------------
| EMAIL TEMPLATES
|--------------------------------------------------------------------------
*/

router.get(
    "/templates",
    authMiddleware,
    adminMiddleware,
    getEmailTemplates
);

router.post(
    "/templates",
    authMiddleware,
    adminMiddleware,
    createEmailTemplate
);

router.put(
    "/templates/:id",
    authMiddleware,
    adminMiddleware,
    updateEmailTemplate
);

router.delete(
    "/templates/:id",
    authMiddleware,
    adminMiddleware,
    deleteEmailTemplate
);


/*
|--------------------------------------------------------------------------
| SEND EMAIL
|--------------------------------------------------------------------------
*/

router.post(
    "/send",
    authMiddleware,
    adminMiddleware,
    sendAdminEmail
);


export default router;