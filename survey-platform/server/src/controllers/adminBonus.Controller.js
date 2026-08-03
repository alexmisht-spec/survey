import prisma from "../config/prisma.js";
import { createNotification } from "../utilis/notification.js";

/*
|--------------------------------------------------------------------------
| GET ALL REWARD TASK SUBMISSIONS
|--------------------------------------------------------------------------
*/

export const getRewardSubmissions = async (req, res) => {

    try {

        const submissions = await prisma.rewardCredential.findMany({

            include: {

                user: {

                    select: {

                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true

                    }

                }

            },

            orderBy: {

                createdAt: "desc"

            }

        });

        return res.json({

            success: true,

            submissions

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
| APPROVE BONUS TASK
|--------------------------------------------------------------------------
*/

export const approveRewardTask = async (req, res) => {

    try {

        const { rewardId } = req.params;

        const reward = await prisma.rewardCredential.findUnique({

            where: {

                id: rewardId

            }

        });

        if (!reward) {

            return res.status(404).json({

                success: false,

                message: "Submission not found."

            });

        }

        if (reward.adminApproved === true) {

            return res.status(400).json({

                success: false,

                message: "Already approved."

            });

        }

        await prisma.$transaction(async (tx) => {

            await tx.rewardCredential.update({

                where: {

                    id: reward.id

                },

                data: {

                    adminApproved: true,

                    rewardPaid: true,

                    taskCompleted: true,

                    rejectionReason: null

                }

            });

            const wallet = await tx.wallet.findUnique({

                where: {

                    userId: reward.userId

                }

            });

            await tx.wallet.update({

                where: {

                    id: wallet.id

                },

                data: {

                    pendingBalance: {

                        increment: 100 // Bonus amount

                    }

                }

            });

        });

        await createNotification({

            userId: reward.userId,

            title: "Bonus Approved",

            message: "Your bonus task has been approved and KSh 100 added to your pending balance.",

            type: "SUCCESS"

        });

        return res.json({

            success: true,

            message: "Bonus approved."

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
| REJECT BONUS TASK
|--------------------------------------------------------------------------
*/

export const rejectRewardTask = async (req, res) => {

    try {

        const { rewardId } = req.params;

        const { reason } = req.body;

        const reward = await prisma.rewardCredential.findUnique({

            where: {

                id: rewardId

            }

        });

        if (!reward) {

            return res.status(404).json({

                success: false,

                message: "Submission not found."

            });

        }

        await prisma.rewardCredential.update({

            where: {

                id: reward.id

            },

            data: {

                adminApproved: false,

                rewardPaid: false,

                taskCompleted: false,

                rejectionReason: reason || "Incorrect credentials."

            }

        });

        await createNotification({

            userId: reward.userId,

            title: "Bonus Rejected",

            message: reason || "Your bonus task was rejected. Please correct the credentials and submit again.",

            type: "WARNING"

        });

        return res.json({

            success: true,

            message: "Submission rejected."

        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};