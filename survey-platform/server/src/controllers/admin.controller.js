import prisma from "../config/prisma.js";
import { createNotification } from "../utilis/notification.js";
/*
|--------------------------------------------------------------------------
| GET ALL PENDING VERIFICATIONS
|--------------------------------------------------------------------------
*/
export const getPendingVerifications = async (req, res) => {

    try {

        const [

            pendingVerifications,

            unverifiedUsers

        ] = await Promise.all([

            prisma.verification.findMany({

                where: {

                    status: "PENDING"

                },

                include: {

                    user: true

                },

                orderBy: {

                    createdAt: "desc"

                }

            }),

            prisma.user.findMany({

                where: {

                    verification: {

                        is: null

                    }

                },

                orderBy: {

                    createdAt: "desc"

                }

            })

        ]);

        return res.json({

            success: true,

            pendingVerifications,

            unverifiedUsers

        });

    }

    catch (error) {

        console.error(error);

        return res.status(500).json({

            success: false,

            message: "Server Error"

        });

    }

};

/*
|--------------------------------------------------------------------------
| GET SINGLE VERIFICATION
|--------------------------------------------------------------------------
*/

export const getVerification = async (req, res) => {

    try {

        const verification = await prisma.verification.findUnique({

            where: {
                id: req.params.id
            },

            include: {
                user: true
            }

        });

        if (!verification) {

            return res.status(404).json({

                success: false,

                message: "Verification not found"

            });

        }

        return res.json({

            success: true,

            verification

        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({

            success: false,

            message: "Server Error"

        });

    }

};

export const downloadDocument = async (req, res) => {

    try {

        const verification = await prisma.verification.findUnique({

            where: {
                id: req.params.id
            }

        });

        if (!verification) {

            return res.status(404).json({

                success: false,
                message: "Verification not found"

            });

        }

        let fileUrl;

        switch (req.params.type) {

            case "front":
                fileUrl = verification.idFront;
                break;

            case "back":
                fileUrl = verification.idBack;
                break;

            default:

                return res.status(400).json({

                    success: false,
                    message: "Invalid document type"

                });

        }

        if (!fileUrl) {

            return res.status(404).json({

                success: false,
                message: "Document not found"

            });

        }

        return res.redirect(fileUrl);

    } catch (error) {

        console.error(error);

        return res.status(500).json({

            success: false,
            message: "Server Error"

        });

    }

};
export const approveVerification = async (req, res) => {

    try {

        const verification = await prisma.verification.findUnique({

            where: {
                id: req.params.id
            }

        });

        if (!verification) {

            return res.status(404).json({

                success: false,
                message: "Verification not found"

            });

        }

        if (verification.status === "APPROVED") {

            return res.status(400).json({

                success: false,
                message: "User is already verified."

            });

        }

        await prisma.$transaction(async (tx) => {

            /*
            |--------------------------------------------------------------------------
            | APPROVE VERIFICATION
            |--------------------------------------------------------------------------
            */

            await tx.verification.update({

                where: {
                    id: verification.id
                },

                data: {
                    status: "APPROVED",
                    reviewedBy: req.user.id,
                    reviewedAt: new Date()
                }

            });

            /*
            |--------------------------------------------------------------------------
            | UPDATE USER STATUS
            |--------------------------------------------------------------------------
            */

            await tx.user.update({

                where: {
                    id: verification.userId
                },

                data: {
                    status: "VERIFIED"
                }

            });

            /*
            |--------------------------------------------------------------------------
            | CREATE WALLET IF IT DOESN'T EXIST
            |--------------------------------------------------------------------------
            */

            const wallet = await tx.wallet.findUnique({

                where: {
                    userId: verification.userId
                }

            });

            if (!wallet) {

                await tx.wallet.create({

                    data: {

                        userId: verification.userId,
                        availableBalance: 0,
                        pendingBalance: 0,
                        totalEarned: 0

                    }

                });

            }

            /*
            |--------------------------------------------------------------------------
            | ASSIGN FIRST ACTIVE SURVEY
            |--------------------------------------------------------------------------
            */

            const survey = await tx.survey.findFirst({

                where: {
                    status: "ACTIVE"
                }

            });

            if (survey) {

                const existingAssignment = await tx.surveyAssignment.findUnique({

                    where: {
                        userId_surveyId: {
                            userId: verification.userId,
                            surveyId: survey.id
                        }
                    }

                });

                if (!existingAssignment) {

                    await tx.surveyAssignment.create({

                        data: {

                            userId: verification.userId,
                            surveyId: survey.id

                        }

                    });

                    await createNotification({

                        userId: verification.userId,

                        title: "New Survey Assigned",

                        message: `A new survey "${survey.title}" has been assigned to your account.`,

                        type: "INFO"

                    });

                }

            }

            /*
            |--------------------------------------------------------------------------
            | SEND APPROVAL NOTIFICATION
            |--------------------------------------------------------------------------
            */

            await createNotification({

                userId: verification.userId,

                title: "Verification Approved",

                message: "Congratulations! Your identity has been verified. You can now participate in surveys and request withdrawals.",

                type: "SUCCESS"

            });

        });

        return res.status(200).json({

            success: true,

            message: "Verification approved successfully."

        });

    } catch (error) {

        console.error("APPROVE VERIFICATION ERROR");
        console.error(error);

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};
export const rejectVerification = async (req, res) => {

    try {

        const { reason } = req.body;

        if (!reason) {

            return res.status(400).json({

                success: false,
                message: "Reason is required."

            });

        }

        const verification = await prisma.verification.findUnique({

            where: {
                id: req.params.id
            }

        });

        if (!verification) {

            return res.status(404).json({

                success: false,
                message: "Verification not found"

            });

        }

        if (verification.status === "APPROVED") {

            return res.status(400).json({

                success: false,
                message: "An approved verification cannot be rejected."

            });

        }

        await prisma.verification.update({

            where: {
                id: verification.id
            },

            data: {

                status: "REJECTED",

                rejectionReason: reason,

                reviewedBy: req.user.id,

                reviewedAt: new Date()

            }

        });

        await prisma.user.update({

            where: {
                id: verification.userId
            },

            data: {
                status: "REJECTED"
            }

        });

        /*
        |--------------------------------------------------------------------------
        | SEND NOTIFICATION
        |--------------------------------------------------------------------------
        */

        await createNotification({

            userId: verification.userId,

            title: "Verification Rejected",

            message: `Your identity verification was rejected.\nReason: ${reason}`,

            type: "WARNING"

        });

        return res.status(200).json({

            success: true,

            message: "Verification rejected successfully."

        });

    }

    catch (error) {

        console.error("REJECT VERIFICATION ERROR");
        console.error(error);

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};


