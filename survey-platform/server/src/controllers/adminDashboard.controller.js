import prisma from "../config/prisma.js";

export const getAdminDashboard = async (req, res) => {

    try {

        const [

            totalUsers,

            verifiedUsers,

            pendingVerifications,

            usersWithoutVerification,

            awaitingVerification,

            activeSurveys,

            completedSurveys,

            pendingWithdrawals,

            wallets

        ] = await Promise.all([

            /*
            |--------------------------------------------------------------------------
            | TOTAL USERS
            |--------------------------------------------------------------------------
            */

            prisma.user.count(),

            /*
            |--------------------------------------------------------------------------
            | VERIFIED USERS
            |--------------------------------------------------------------------------
            */

            prisma.verification.count({

                where: {
                    status: "APPROVED"
                }

            }),

            /*
            |--------------------------------------------------------------------------
            | PENDING VERIFICATIONS
            |--------------------------------------------------------------------------
            */

            prisma.verification.count({

                where: {
                    status: "PENDING"
                }

            }),

            /*
            |--------------------------------------------------------------------------
            | USERS WHO HAVE NOT SUBMITTED DOCUMENTS
            |--------------------------------------------------------------------------
            */

            prisma.user.count({

                where: {

                    verification: {

                        is: null

                    }

                }

            }),

            /*
            |--------------------------------------------------------------------------
            | USERS STILL NEEDING VERIFICATION ACTION
            | (No documents OR Pending verification)
            |--------------------------------------------------------------------------
            */

            prisma.user.count({

                where: {

                    OR: [

                        {

                            verification: {

                                is: null

                            }

                        },

                        {

                            verification: {

                                is: {

                                    status: "PENDING"

                                }

                            }

                        }

                    ]

                }

            }),

            /*
            |--------------------------------------------------------------------------
            | ACTIVE SURVEYS
            |--------------------------------------------------------------------------
            */

            prisma.survey.count({

                where: {
                    status: "ACTIVE"
                }

            }),

            /*
            |--------------------------------------------------------------------------
            | COMPLETED SURVEYS
            |--------------------------------------------------------------------------
            */

            prisma.surveyResponse.count({

                where: {
                    completed: true
                }

            }),

            /*
            |--------------------------------------------------------------------------
            | PENDING WITHDRAWALS
            |--------------------------------------------------------------------------
            */

            prisma.withdrawal.count({

                where: {
                    status: "PENDING"
                }

            }),

            /*
            |--------------------------------------------------------------------------
            | TOTAL PAID
            |--------------------------------------------------------------------------
            */

            prisma.wallet.findMany({

                select: {

                    totalEarned: true

                }

            })

        ]);

        const totalPaid = wallets.reduce((sum, wallet) => {

            return sum + Number(wallet.totalEarned);

        }, 0);

        return res.json({

            success: true,

            data: {

                totalUsers,

                verifiedUsers,

                pendingVerifications,

                usersWithoutVerification,

                awaitingVerification,

                activeSurveys,

                completedSurveys,

                pendingWithdrawals,

                totalPaid

            }

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