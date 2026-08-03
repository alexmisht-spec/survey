import { Router } from "express";

import authMiddleware from "../middleware/auth.middleware.js";

import upload from "../middleware/upload.middleware.js";

import {

    uploadVerification

} from "../controllers/verification.controller.js";

const router = Router();

router.post(

    "/",

    authMiddleware,

    upload.fields([

        {

            name: "idFront",

            maxCount: 1

        },

        {

            name: "idBack",

            maxCount: 1

        },

        {

            name: "kraCertificate",

            maxCount: 1

        }

    ]),

    uploadVerification

);

export default router;