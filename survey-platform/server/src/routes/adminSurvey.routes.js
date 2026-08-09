import { Router } from "express";

import authMiddleware from "../middleware/auth.middleware.js";
import adminMiddleware from "../middleware/admin.middleware.js";

import {
    createSurvey,
    getAllSurveys,
    getSurvey,
    updateSurvey,
    deleteSurvey,
    activateSurvey,
    setSurveyStatus,
    getSurveyDetails
} from "../controllers/adminSurvey.controller.js";

const router = Router();

/*
|--------------------------------------------------------------------------
| CREATE SURVEY
|--------------------------------------------------------------------------
*/

router.post(
    "/",
    authMiddleware,
    adminMiddleware,
    createSurvey
);

/*
|--------------------------------------------------------------------------
| GET ALL SURVEYS
|--------------------------------------------------------------------------
*/

router.get(
    "/",
    authMiddleware,
    adminMiddleware,
    getAllSurveys
);

/*
|--------------------------------------------------------------------------
| GET SINGLE SURVEY
|--------------------------------------------------------------------------
*/

router.get(
    "/:id",
    authMiddleware,
    adminMiddleware,
    getSurvey
);

/*
|--------------------------------------------------------------------------
| UPDATE SURVEY
|--------------------------------------------------------------------------
*/

router.put(
    "/:id",
    authMiddleware,
    adminMiddleware,
    updateSurvey
);

/*
|--------------------------------------------------------------------------
| DELETE SURVEY
|--------------------------------------------------------------------------
*/

router.delete(
    "/:id",
    authMiddleware,
    adminMiddleware,
    deleteSurvey
);

/*
|--------------------------------------------------------------------------
| ACTIVATE SURVEY
|--------------------------------------------------------------------------
|
| This activates the selected survey and handles the
| active-survey assignment logic.
|
|--------------------------------------------------------------------------
*/

router.post(
    "/:id/activate",
    authMiddleware,
    adminMiddleware,
    activateSurvey
);

/*
|--------------------------------------------------------------------------
| SET SURVEY STATUS
|--------------------------------------------------------------------------
|
| Allows admin to manually set:
|
| ACTIVE
| COMING_SOON
| LOCKED
| CLOSED
|
|--------------------------------------------------------------------------
*/

router.patch(
    "/:id/status",
    authMiddleware,
    adminMiddleware,
    setSurveyStatus
);

/*
|--------------------------------------------------------------------------
| GET SURVEY DETAILS
|--------------------------------------------------------------------------
*/

router.get(
    "/:id/details",
    authMiddleware,
    adminMiddleware,
    getSurveyDetails
);

export default router;