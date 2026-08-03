import prisma from "../config/prisma.js";
import { createNotification } from "../utilis/notification.js";

/*
|--------------------------------------------------------------------------
| ASSIGN SURVEY TO USERS
|--------------------------------------------------------------------------
*/
export const assignSurvey = async (req, res) => {

    try {

        const { surveyId } = req.params;
        const { userIds } = req.body;

        if (!surveyId) {

            return res.status(400).json({
                success: false,
                message: "Survey ID is required."
            });

        }

        if (!Array.isArray(userIds) || userIds.length === 0) {

            return res.status(400).json({
                success: false,
                message: "Select at least one user."
            });

        }

        const survey = await prisma.survey.findUnique({

            where: {
                id: surveyId
            }

        });

        if (!survey) {

            return res.status(404).json({
                success: false,
                message: "Survey not found."
            });

        }

        let assigned = 0;
        let skipped = 0;

        for (const userId of userIds) {

            const exists = await prisma.surveyAssignment.findFirst({

                where: {
                    surveyId,
                    userId
                }

            });

            if (exists) {

                skipped++;
                continue;

            }

            await prisma.surveyAssignment.create({

                data: {

                    surveyId,
                    userId,
                    started: false,
                    completed: false,
                    rewardPaid: false

                }

            });

            // Notify the user
            try {

                await createNotification({

                    userId,

                    title: "New Survey Assigned",

                    message: `A new survey "${survey.title}" has been assigned to your account.`,

                    type: "INFO"

                });

            } catch (err) {

                console.error("Notification Error:", err);

            }

            assigned++;

        }

        return res.status(200).json({

            success: true,
            assigned,
            skipped,
            message: `${assigned} user(s) assigned successfully.`

        });

    }

    catch (error) {

        console.error("ASSIGN SURVEY ERROR");
        console.error(error);

        return res.status(500).json({

            success: false,
            message: error.message

        });

    }

};

/*
|--------------------------------------------------------------------------
| GET VERIFIED USERS
|--------------------------------------------------------------------------
*/

export const getVerifiedUsers = async (req, res) => {

    try {

        const users = await prisma.user.findMany({

            where: {
                role: "USER",
                status: "VERIFIED"
            },

            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true
            },

            orderBy: {
                firstName: "asc"
            }

        });

        return res.status(200).json({
            success: true,
            users
        });

    } catch (error) {

        console.error("GET VERIFIED USERS ERROR");
        console.error(error);

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

/*
|--------------------------------------------------------------------------
| GET ASSIGNMENTS
|--------------------------------------------------------------------------
*/

export const getAssignments = async (req, res) => {

    try {

        const { surveyId } = req.params;

        const assignments = await prisma.surveyAssignment.findMany({

            where: {
                surveyId
            },

            include: {

                user: {

                    select: {
                        firstName: true,
                        lastName: true,
                        email: true,
                        status: true
                    }

                }

            }

        });

        return res.status(200).json({
            success: true,
            assignments
        });

    } catch (error) {

        console.error("GET ASSIGNMENTS ERROR");
        console.error(error);

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }

};
/*
|--------------------------------------------------------------------------
| MARK REWARD AS PAID
|--------------------------------------------------------------------------
*/

export const markRewardPaid = async (req, res) => {

    try {

        const { assignmentId } = req.params;

        const assignment = await prisma.surveyAssignment.update({

            where: {
                id: assignmentId
            },

            data: {
                rewardPaid: true
            }

        });

        return res.status(200).json({

            success: true,
            message: "Reward marked as paid.",
            assignment

        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({

            success: false,
            message: error.message

        });

    }

};

/*
|--------------------------------------------------------------------------
| DELETE ASSIGNMENT
|--------------------------------------------------------------------------
*/

export const deleteAssignment = async (req, res) => {

    try {

        const { assignmentId } = req.params;

        await prisma.surveyAssignment.delete({

            where: {
                id: assignmentId
            }

        });

        return res.status(200).json({

            success: true,
            message: "Assignment removed."

        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({

            success: false,
            message: error.message

        });

    }

};