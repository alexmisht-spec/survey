import { Router } from "express";

import authMiddleware from "../middleware/auth.middleware.js";
import adminMiddleware from "../middleware/admin.middleware.js";

import {
    assignSurvey,
    getAssignments,
    getVerifiedUsers,
    markRewardPaid,
    deleteAssignment
} from "../controllers/adminAssignment.controller.js";

const router = Router();

/*
|--------------------------------------------------------------------------
| VERIFIED USERS
|--------------------------------------------------------------------------
*/

router.get(
    "/verification/verified",
    authMiddleware,
    adminMiddleware,
    getVerifiedUsers
);

/*
|--------------------------------------------------------------------------
| ASSIGN SURVEY
|--------------------------------------------------------------------------
*/

router.post(
    "/surveys/:surveyId/assign",
    authMiddleware,
    adminMiddleware,
    assignSurvey
);

/*
|--------------------------------------------------------------------------
| GET ASSIGNMENTS
|--------------------------------------------------------------------------
*/

router.get(
    "/surveys/:surveyId/assignments",
    authMiddleware,
    adminMiddleware,
    getAssignments
);
router.get("/test", (req, res) => {
    res.json({ message: "Assignment routes working" });
});

export default router;
/*
|--------------------------------------------------------------------------
| MARK REWARD PAID
|--------------------------------------------------------------------------
*/

router.patch(
    "/assignments/:assignmentId/pay",
    authMiddleware,
    adminMiddleware,
    markRewardPaid
);

/*
|--------------------------------------------------------------------------
| DELETE ASSIGNMENT
|--------------------------------------------------------------------------
*/

router.delete(
    "/assignments/:assignmentId",
    authMiddleware,
    adminMiddleware,
    deleteAssignment
);