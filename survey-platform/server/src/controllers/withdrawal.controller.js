import prisma from "../config/prisma.js";
import { Prisma } from "@prisma/client";

const MINIMUM_WITHDRAWAL = 100;

/*
|--------------------------------------------------------------------------
| REQUEST WITHDRAWAL
|--------------------------------------------------------------------------
*/

export const requestWithdrawal = async (req, res) => {
    try {
        const { amount } = req.body;

        const withdrawalAmount = Number(amount);

        if (!withdrawalAmount || withdrawalAmount <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid withdrawal amount."
            });
        }

        if (withdrawalAmount < MINIMUM_WITHDRAWAL) {
            return res.status(400).json({
                success: false,
                message: `Minimum withdrawal is KES ${MINIMUM_WITHDRAWAL}.`
            });
        }

        const user = await prisma.user.findUnique({
            where: {
                id: req.user.id
            },
            include: {
                wallet: true,
                verification: true
            }
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }

        if (user.status !== "VERIFIED") {
            return res.status(403).json({
                success: false,
                message:
                    "Your account must be verified before requesting withdrawals."
            });
        }

        if (!user.wallet) {
            return res.status(404).json({
                success: false,
                message: "Wallet not found."
            });
        }

        if (!user.verification) {
            return res.status(400).json({
                success: false,
                message: "Verification details not found."
            });
        }

        const availableBalance = Number(user.wallet.availableBalance);

        if (availableBalance < withdrawalAmount) {
            return res.status(400).json({
                success: false,
                message: "Insufficient available balance."
            });
        }

        await prisma.$transaction(async (tx) => {

            const updatedWallet = await tx.wallet.update({
                where: {
                    id: user.wallet.id
                },
                data: {
                    availableBalance: {
                        decrement: new Prisma.Decimal(withdrawalAmount)
                    },
                    pendingBalance: {
                        increment: new Prisma.Decimal(withdrawalAmount)
                    }
                }
            });

            const withdrawal = await tx.withdrawal.create({
                data: {
                    userId: user.id,
                    amount: new Prisma.Decimal(withdrawalAmount),
                    phoneNumber: user.verification.mpesaNumber,
                    status: "PENDING",
                    requestIp: req.ip,
                    userAgent: req.get("user-agent")
                }
            });

            await tx.walletTransaction.create({
                data: {
                    walletId: user.wallet.id,
                    amount: new Prisma.Decimal(withdrawalAmount),
                    type: "WITHDRAWAL",
                    status: "PENDING",
                    balanceBefore: new Prisma.Decimal(availableBalance),
                    balanceAfter: updatedWallet.availableBalance,
                    description: "Withdrawal request awaiting admin approval",
                    withdrawalId: withdrawal.id,
                    requestIp: req.ip,
                    userAgent: req.get("user-agent")
                }
            });

        });

        return res.status(201).json({
            success: true,
            message:
                "Withdrawal request submitted successfully. Awaiting admin approval."
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal server error."
        });

    }
};

/*
|--------------------------------------------------------------------------
| GET MY WITHDRAWALS
|--------------------------------------------------------------------------
*/

export const getMyWithdrawals = async (req, res) => {

    try {

        const withdrawals = await prisma.withdrawal.findMany({

            where: {
                userId: req.user.id
            },

            orderBy: {
                createdAt: "desc"
            }

        });

        return res.json({

            success: true,

            withdrawals

        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({

            success: false,

            message: "Internal server error."

        });

    }

};