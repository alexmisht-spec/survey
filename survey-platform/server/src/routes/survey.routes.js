import { Router } from "express";

import authMiddleware from "../middleware/auth.middleware.js";

import {

    getMySurveys,

    getSurvey,
    submitSurvey 

} from "../controllers/survey.controllers.js";

const router = Router();

router.get(

    "/my",

    authMiddleware,

    getMySurveys

);

router.get(

    "/:id",

    authMiddleware,

    getSurvey

);
router.post(

    "/:id/submit",

    authMiddleware,

    submitSurvey

);
export default router;