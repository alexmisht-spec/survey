import prisma from "../config/prisma.js";

export const getAdminDashboard = async (req, res) => {

    try {

        const [

            totalUsers,

            verifiedUsers,

            pendingVerifications,

            usersWithoutVerification,

            activeSurveys,

            completedSurveys,

            pendingWithdrawals,

            wallets

        ] = await Promise.all([

            prisma.user.count(),

            prisma.verification.count({

                where: {
                    status: "APPROVED",
                },

            }),

            prisma.verification.count({

                where: {
                    status: "PENDING",
                },

            }),

            prisma.user.count({

                where: {
                    verification: null,
                },

            }),

            prisma.survey.count({

                where: {
                    status: "ACTIVE",
                },

            }),

            prisma.surveyResponse.count({

                where: {
                    completed: true,
                },

            }),

            prisma.withdrawal.count({

                where: {
                    status: "PENDING",
                },

            }),

            prisma.wallet.findMany({

                select: {
                    totalEarned: true,
                },

            }),

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

                activeSurveys,

                completedSurveys,

                pendingWithdrawals,

                totalPaid,

            },

        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({

            success: false,
            message: "Server Error",

        });

    }

};