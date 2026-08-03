import prisma from "../config/prisma.js";

export const getAdminDashboard = async (req, res) => {

    try {

        const [

            users,
            verifiedUsers,
            pendingVerifications,
            activeSurveys,
            completedSurveys,
            pendingWithdrawals,
            wallets

        ] = await Promise.all([

            prisma.user.count(),

            prisma.verification.count({

                where: {

                    status: "APPROVED"

                }

            }),

            prisma.verification.count({

                where: {

                    status: "PENDING"

                }

            }),

            prisma.survey.count({

                where: {

                    status: "ACTIVE"

                }

            }),

            prisma.surveyResponse.count({

                where: {

                    completed: true

                }

            }),

            prisma.withdrawal.count({

                where: {

                    status: "PENDING"

                }

            }),

            prisma.wallet.findMany({

                select: {

                    totalEarned: true

                }

            })

        ]);

        const totalPaid = wallets.reduce((sum, wallet) => {

            return sum + Number(wallet.totalEarned);

        }, 0);

        res.json({

            success: true,

            data: {

                users,

                verifiedUsers,

                pendingVerifications,

                activeSurveys,

                completedSurveys,

                pendingWithdrawals,

                totalPaid

            }

        });

    } catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,

            message: "Server Error"

        });

    }

};