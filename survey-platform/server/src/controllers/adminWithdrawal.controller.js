import prisma from "../config/prisma.js";
import { Prisma } from "@prisma/client";
import { processWithdrawal } from "../../services/payment.service.js";

/*
|--------------------------------------------------------------------------
| GET ALL WITHDRAWALS
|--------------------------------------------------------------------------
*/

export const getWithdrawals = async (req, res) => {
    try {
        const withdrawals = await prisma.withdrawal.findMany({
            include: {
                user: {
                    include: {
                        profile: true,
                        wallet: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        return res.json({
            success: true,
            total: withdrawals.length,
            withdrawals,
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};

/*
|--------------------------------------------------------------------------
| APPROVE WITHDRAWAL
|--------------------------------------------------------------------------
*/

export const approveWithdrawal = async (req, res) => {
    try {

        const withdrawal = await prisma.withdrawal.findUnique({
            where: {
                id: req.params.id,
            },
            include: {
                user: true,
            },
        });

        if (!withdrawal) {
            return res.status(404).json({
                success: false,
                message: "Withdrawal not found.",
            });
        }

        if (withdrawal.status !== "PENDING") {
            return res.status(400).json({
                success: false,
                message: "Withdrawal already processed.",
            });
        }

        await prisma.$transaction(async (tx) => {

            await tx.withdrawal.update({
                where: {
                    id: withdrawal.id,
                },
                data: {
                    status: "APPROVED",
                    approvedAt: new Date(),
                    adminId: req.user.id,
                },
            });

            await tx.walletTransaction.updateMany({
                where: {
                    withdrawalId: withdrawal.id,
                },
                data: {
                    status: "PROCESSING",
                    approvedBy: req.user.id,
                    description:
                        "Withdrawal approved by admin and queued for payment.",
                },
            });

        });

        try {
            await processWithdrawal(withdrawal.id);
        } catch (paymentError) {
            console.error("Payment Processing Error:", paymentError);
        }

        return res.json({
            success: true,
            message: "Withdrawal approved successfully.",
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};

/*
|--------------------------------------------------------------------------
| REJECT WITHDRAWAL
|--------------------------------------------------------------------------
*/

export const rejectWithdrawal = async (req, res) => {
    try {

        const withdrawal = await prisma.withdrawal.findUnique({
            where: {
                id: req.params.id,
            },
        });

        if (!withdrawal) {
            return res.status(404).json({
                success: false,
                message: "Withdrawal not found.",
            });
        }

        if (withdrawal.status !== "PENDING") {
            return res.status(400).json({
                success: false,
                message: "Withdrawal already processed.",
            });
        }

        const wallet = await prisma.wallet.findUnique({
            where: {
                userId: withdrawal.userId,
            },
        });

        if (!wallet) {
            return res.status(404).json({
                success: false,
                message: "Wallet not found.",
            });
        }

        await prisma.$transaction(async (tx) => {

            await tx.wallet.update({
                where: {
                    id: wallet.id,
                },
                data: {
                    availableBalance: {
                        increment: new Prisma.Decimal(withdrawal.amount),
                    },
                    pendingBalance: {
                        decrement: new Prisma.Decimal(withdrawal.amount),
                    },
                },
            });

            await tx.withdrawal.update({
                where: {
                    id: withdrawal.id,
                },
                data: {
                    status: "REJECTED",
                    adminId: req.user.id,
                    failureReason: "Rejected by administrator",
                },
            });

            await tx.walletTransaction.updateMany({
                where: {
                    withdrawalId: withdrawal.id,
                },
                data: {
                    type: "WITHDRAWAL_REFUND",
                    status: "REVERSED",
                    approvedBy: req.user.id,
                    description:
                        "Withdrawal rejected by administrator. Funds returned to available balance.",
                },
            });

        });

        return res.json({
            success: true,
            message: "Withdrawal rejected successfully.",
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};