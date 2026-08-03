import prisma from "../config/prisma.js";
import { createNotification } from "../utilis/notification.js";

/*
|--------------------------------------------------------------------------
| GET PENDING REWARD APPROVALS
|--------------------------------------------------------------------------
*/

export const getPendingRewards = async (req, res) => {

    try {

        const assignments = await prisma.surveyAssignment.findMany({

            where: {

                completed: true,
                rewardApproved: false

            },

            include: {

                user: {

                    select: {

                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true

                    }

                },

                survey: {

                    select: {

                        id: true,
                        title: true,
                        reward: true

                    }

                }

            },

            orderBy: {

                assignedAt: "desc"

            }

        });

        return res.status(200).json({

            success: true,
            assignments

        });

    }

    catch (error) {

        console.error("GET PENDING REWARDS ERROR");
        console.error(error);

        return res.status(500).json({

            success: false,
            message: error.message

        });

    }

};


/*
|--------------------------------------------------------------------------
| APPROVE SURVEY REWARD
|--------------------------------------------------------------------------
*/

export const approveReward = async (req, res) => {

    try {

        const { assignmentId } = req.params;

        const assignment = await prisma.surveyAssignment.findUnique({

            where: {
                id: assignmentId
            },

            include: {
                survey: true,
                user: true
            }

        });

        if (!assignment) {

            return res.status(404).json({
                success: false,
                message: "Assignment not found."
            });

        }

        if (!assignment.completed) {

            return res.status(400).json({
                success: false,
                message: "Survey has not been completed."
            });

        }

        if (assignment.rewardApproved) {

            return res.status(400).json({
                success: false,
                message: "Reward already approved."
            });

        }

        await prisma.$transaction(async (tx) => {

            /*
            |--------------------------------------------------------------------------
            | FIND USER WALLET
            |--------------------------------------------------------------------------
            */

            const wallet = await tx.wallet.findUnique({

                where: {
                    userId: assignment.userId
                }

            });

            if (!wallet) {

                throw new Error("User wallet not found.");

            }

            /*
            |--------------------------------------------------------------------------
            | ADD REWARD TO PENDING BALANCE
            |--------------------------------------------------------------------------
            */

            await tx.wallet.update({

                where: {
                    id: wallet.id
                },

                data: {

                    pendingBalance: {

                        increment: assignment.survey.reward

                    }

                }

            });

            /*
            |--------------------------------------------------------------------------
            | MARK ASSIGNMENT AS APPROVED
            |--------------------------------------------------------------------------
            */

            await tx.surveyAssignment.update({

                where: {
                    id: assignment.id
                },

                data: {

                    rewardApproved: true,
                    approvedAt: new Date()

                }

            });

            /*
            |--------------------------------------------------------------------------
            | CREATE WALLET TRANSACTION
            |--------------------------------------------------------------------------
            */

            await tx.walletTransaction.create({

                data: {

                    walletId: wallet.id,

                    amount: assignment.survey.reward,

                    type: "SURVEY_REWARD",

                    description: `Reward approved for survey "${assignment.survey.title}"`

                }

            });

        });

        /*
        |--------------------------------------------------------------------------
        | SEND NOTIFICATION
        |--------------------------------------------------------------------------
        */

        try {

            await createNotification({

                userId: assignment.userId,

                title: "Reward Approved",

                message: `Congratulations! KSh ${assignment.survey.reward} has been added to your pending balance.`,

                type: "SUCCESS"

            });

        } catch (err) {

            console.error("Notification Error:", err);

        }

        return res.status(200).json({

            success: true,
            message: "Reward approved successfully."

        });

    }

    catch (error) {

        console.error("APPROVE REWARD ERROR");
        console.error(error);

        return res.status(500).json({

            success: false,
            message: error.message

        });

    }

};
/*
|--------------------------------------------------------------------------
| REJECT SURVEY REWARD
|--------------------------------------------------------------------------
*/

export const rejectReward = async (req, res) => {

    try {

        const { assignmentId } = req.params;

        const assignment = await prisma.surveyAssignment.findUnique({

            where: {
                id: assignmentId
            },

            include: {
                survey: true,
                user: true
            }

        });

        if (!assignment) {

            return res.status(404).json({

                success: false,

                message: "Assignment not found."

            });

        }

        if (!assignment.completed) {

            return res.status(400).json({

                success: false,

                message: "Survey has not been completed."

            });

        }

        if (assignment.rewardApproved) {

            return res.status(400).json({

                success: false,

                message: "Reward has already been approved."

            });

        }

        await prisma.surveyAssignment.update({

            where: {
                id: assignment.id
            },

            data: {

                completed: false,

                completedAt: null

            }

        });

        try {

            await createNotification({

                userId: assignment.userId,

                title: "Survey Reward Rejected",

                message:
                    `Your reward for "${assignment.survey.title}" was rejected. Please contact support if you believe this is a mistake.`,

                type: "WARNING"

            });

        } catch (err) {

            console.error(err);

        }

        return res.status(200).json({

            success: true,

            message: "Reward rejected successfully."

        });

    }

    catch (error) {

        console.error(error);

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};