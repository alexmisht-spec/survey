import { Router } from "express";

import authMiddleware from "../middleware/auth.middleware.js";
import adminMiddleware from "../middleware/admin.middleware.js";

import {
    getEmailUsers,
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
| USERS FOR EMAIL CAMPAIGNS
|--------------------------------------------------------------------------
|
| Returns ALL users.
|
| Admin can email:
| - VERIFIED
| - REGISTERED
| - PENDING_VERIFICATION
| - REJECTED
| - Any other account status
|
*/

router.get(
    "/users",
    authMiddleware,
    adminMiddleware,
    getEmailUsers
);


/*
|--------------------------------------------------------------------------
| UNVERIFIED USERS
|--------------------------------------------------------------------------
|
| Kept separately for verification follow-up functionality.
|
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

// Get active templates
router.get(
    "/templates",
    authMiddleware,
    adminMiddleware,
    getEmailTemplates
);


// Create template
router.post(
    "/templates",
    authMiddleware,
    adminMiddleware,
    createEmailTemplate
);


// Update template
router.put(
    "/templates/:id",
    authMiddleware,
    adminMiddleware,
    updateEmailTemplate
);


// Deactivate template
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
|
| Sends a selected template to any selected user.
|
*/

router.post(
    "/send",
    authMiddleware,
    adminMiddleware,
    sendAdminEmail
);


export default router;