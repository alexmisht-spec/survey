import prisma from "../config/prisma.js";

/*
|--------------------------------------------------------------------------
| GET MY REFERRAL INFORMATION
|--------------------------------------------------------------------------
*/

export const getMyReferrals = async (req, res) => {
    try {
        const userId = req.user.id;

        const user = await prisma.user.findUnique({
            where: {
                id: userId
            },
            select: {
                id: true,
                referralCode: true
            }
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }

        const referrals = await prisma.referral.findMany({
            where: {
                referrerId: userId
            },
            include: {
                referred: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        createdAt: true,
                        status: true
                    }
                }
            },
            orderBy: {
                createdAt: "desc"
            }
        });

        const totalReferrals = referrals.length;

        const approvedReferrals = referrals.filter(
            referral => referral.status === "APPROVED"
        );

        const pendingReferrals = referrals.filter(
            referral => referral.status === "PENDING"
        );

        const totalEarned = approvedReferrals.reduce(
            (total, referral) => {
                return total + Number(referral.reward);
            },
            0
        );

        const referralLink =
            `https://surveypool.co.ke/register?ref=${user.referralCode}`;

        return res.status(200).json({
            success: true,

            referral: {
                code: user.referralCode,
                link: referralLink,

                totalReferrals,

                pendingReferrals:
                    pendingReferrals.length,

                approvedReferrals:
                    approvedReferrals.length,

                totalEarned
            },

            referrals: referrals.map(referral => ({
                id: referral.id,

                name:
                    `${referral.referred.firstName} ${referral.referred.lastName}`,

                status: referral.status,

                reward: Number(referral.reward),

                joinedAt: referral.referred.createdAt
            }))
        });

    } catch (error) {

        console.error(
            "GET MY REFERRALS ERROR:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to load referral information."
        });
    }
};