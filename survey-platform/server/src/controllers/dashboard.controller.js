import prisma from "../config/prisma.js";

export const getDashboard = async (req, res) => {

    try {

        const userId = req.user.id;

        const user = await prisma.user.findUnique({

            where: {
                id: userId
            },

            select: {
                firstName: true,
                lastName: true,
                email: true,
                phone: true,
                status: true
            }

        });

        const wallet = await prisma.wallet.findUnique({

            where: {
                userId
            }

        });

        const verification = await prisma.verification.findUnique({

            where: {
                userId
            },

            select: {
                status: true,
                idFront: true,
                idBack: true,
                reviewedAt: true,
                rejectionReason: true
            }

        });

        const pendingSurveys = await prisma.surveyAssignment.count({

            where: {
                userId,
                completed: false
            }

        });

        const completedSurveys = await prisma.surveyAssignment.count({

            where: {
                userId,
                completed: true
            }

        });

        const pendingWithdrawals = await prisma.withdrawal.count({

            where: {
                userId,
                status: "PENDING"
            }

        });

        const withdrawals = await prisma.withdrawal.findMany({

            where: {
                userId
            },

            orderBy: {
                createdAt: "desc"
            },

            select: {
                id: true,
                amount: true,
                phoneNumber: true,
                status: true,
                createdAt: true,
                approvedAt: true,
                processedAt: true,
                failureReason: true,
                transactionId: true
            }

        });

        const notifications = await prisma.notification.findMany({

            where: {
                userId
            },

            orderBy: {
                createdAt: "desc"
            },

            take: 5

        });

        return res.json({

            success: true,

            data: {

                user,

                verification,

                availableBalance: wallet?.availableBalance ?? 0,

                pendingBalance: wallet?.pendingBalance ?? 0,

                totalEarned: wallet?.totalEarned ?? 0,

                pendingSurveys,

                completedSurveys,

                pendingWithdrawals,

                withdrawals,

                notifications

            }

        });

    }

    catch (error) {

        console.error("Dashboard Error:");
        console.error(error);

        return res.status(500).json({

            success: false,

            message: "Server Error"

        });

    }

};