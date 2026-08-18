import prisma from "../config/prisma.js";
import { Prisma } from "@prisma/client";

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

                        wallet: true

                    }

                }

            },

            orderBy: {

                createdAt: "desc"

            }

        });


        return res.json({

            success: true,

            total: withdrawals.length,

            withdrawals: withdrawals.map(withdrawal => ({

                id: withdrawal.id,

                amount: Number(withdrawal.amount),

                phoneNumber: withdrawal.phoneNumber,

                status: withdrawal.status,

                createdAt: withdrawal.createdAt,

                approvedAt: withdrawal.approvedAt,

                processedAt: withdrawal.processedAt,

                failureReason: withdrawal.failureReason,

                user: {

                    id: withdrawal.user.id,

                    firstName: withdrawal.user.firstName,

                    lastName: withdrawal.user.lastName,

                    email: withdrawal.user.email,

                    phone: withdrawal.user.phone,

                    wallet: withdrawal.user.wallet
                        ? {

                            availableBalance:
                                Number(
                                    withdrawal.user.wallet.availableBalance
                                ),

                            pendingBalance:
                                Number(
                                    withdrawal.user.wallet.pendingBalance
                                ),

                            totalEarned:
                                Number(
                                    withdrawal.user.wallet.totalEarned
                                )

                        }
                        : null,

                    profile:
                        withdrawal.user.profile || null

                }

            }))

        });

    } catch (error) {

        console.error(
            "GET WITHDRAWALS ERROR:",
            error
        );

        return res.status(500).json({

            success: false,

            message: "Server Error"

        });

    }
};


/*
|--------------------------------------------------------------------------
| APPROVE WITHDRAWAL
|--------------------------------------------------------------------------
|
| IMPORTANT:
|
| This does NOT send money.
|
| Admin manually sends the M-Pesa payment first.
| After successful payment, admin clicks "Mark as Paid".
|
|--------------------------------------------------------------------------
*/

export const approveWithdrawal = async (req, res) => {

    try {

        const withdrawal =
            await prisma.withdrawal.findUnique({

                where: {

                    id: req.params.id

                }

            });


        if (!withdrawal) {

            return res.status(404).json({

                success: false,

                message:
                    "Withdrawal not found."

            });

        }


        if (withdrawal.status !== "PENDING") {

            return res.status(400).json({

                success: false,

                message:
                    "Only pending withdrawals can be approved."

            });

        }


        await prisma.$transaction(async (tx) => {

            await tx.withdrawal.update({

                where: {

                    id: withdrawal.id

                },

                data: {

                    status: "APPROVED",

                    approvedAt: new Date(),

                    adminId: req.user.id

                }

            });


            await tx.walletTransaction.updateMany({

                where: {

                    withdrawalId:
                        withdrawal.id

                },

                data: {

                    status: "PROCESSING",

                    approvedBy:
                        req.user.id,

                    description:
                        "Withdrawal approved by administrator. Awaiting manual payment."

                }

            });

        });


        return res.json({

            success: true,

            message:
                "Withdrawal approved. Send the payment manually, then mark it as paid."

        });

    } catch (error) {

        console.error(
            "APPROVE WITHDRAWAL ERROR:",
            error
        );

        return res.status(500).json({

            success: false,

            message: "Server Error"

        });

    }

};


/*
|--------------------------------------------------------------------------
| MARK WITHDRAWAL AS PAID
|--------------------------------------------------------------------------
|
| Admin manually sends the M-Pesa payment first.
|
| Then this endpoint:
|
| 1. Changes withdrawal → PAID
| 2. Removes amount from pendingBalance
| 3. Creates/updates wallet transaction
| 4. Records admin
| 5. Records payment time
|
|--------------------------------------------------------------------------
*/

export const markWithdrawalPaid = async (req, res) => {

    try {

        const withdrawal =
            await prisma.withdrawal.findUnique({

                where: {

                    id: req.params.id

                },

                include: {

                    user: {

                        include: {

                            wallet: true

                        }

                    }

                }

            });


        if (!withdrawal) {

            return res.status(404).json({

                success: false,

                message:
                    "Withdrawal not found."

            });

        }


        /*
        |--------------------------------------------------------------------------
        | PREVENT ALREADY PAID WITHDRAWAL
        |--------------------------------------------------------------------------
        */

        if (withdrawal.status === "PAID") {

            return res.status(400).json({

                success: false,

                message:
                    "This withdrawal has already been marked as paid."

            });

        }


        /*
        |--------------------------------------------------------------------------
        | ONLY APPROVED WITHDRAWALS CAN BE PAID
        |--------------------------------------------------------------------------
        */

        if (
            withdrawal.status !== "APPROVED" &&
            withdrawal.status !== "PROCESSING"
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Withdrawal must be approved before it can be marked as paid."

            });

        }


        /*
        |--------------------------------------------------------------------------
        | CHECK WALLET
        |--------------------------------------------------------------------------
        */

        const wallet =
            withdrawal.user.wallet;


        if (!wallet) {

            return res.status(404).json({

                success: false,

                message:
                    "User wallet not found."

            });

        }


        const amount =
            new Prisma.Decimal(
                withdrawal.amount
            );


        /*
        |--------------------------------------------------------------------------
        | CHECK PENDING BALANCE
        |--------------------------------------------------------------------------
        */

        if (
            new Prisma.Decimal(
                wallet.pendingBalance
            ).lessThan(amount)
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "User pending balance is insufficient for this withdrawal."

            });

        }


        /*
        |--------------------------------------------------------------------------
        | COMPLETE PAYMENT
        |--------------------------------------------------------------------------
        */

        await prisma.$transaction(async (tx) => {

            /*
            |--------------------------------------------------------------------------
            | REDUCE PENDING BALANCE
            |--------------------------------------------------------------------------
            */

            await tx.wallet.update({

                where: {

                    id: wallet.id

                },

                data: {

                    pendingBalance: {

                        decrement: amount

                    }

                }

            });


            /*
            |--------------------------------------------------------------------------
            | MARK WITHDRAWAL PAID
            |--------------------------------------------------------------------------
            */

            await tx.withdrawal.update({

                where: {

                    id: withdrawal.id

                },

                data: {

                    status: "PAID",

                    processedAt: new Date(),

                    adminId:
                        req.user.id

                }

            });


            /*
            |--------------------------------------------------------------------------
            | UPDATE WALLET TRANSACTION
            |--------------------------------------------------------------------------
            */

            const transaction =
                await tx.walletTransaction.findFirst({

                    where: {

                        withdrawalId:
                            withdrawal.id

                    },

                    orderBy: {

                        createdAt: "desc"

                    }

                });


            if (transaction) {

                await tx.walletTransaction.update({

                    where: {

                        id: transaction.id

                    },

                    data: {

                        status: "SUCCESS",

                        approvedBy:
                            req.user.id,

                        description:
                            "Withdrawal manually paid by administrator."

                    }

                });

            } else {

                /*
                |--------------------------------------------------------------------------
                | FALLBACK
                |--------------------------------------------------------------------------
                */

                await tx.walletTransaction.create({

                    data: {

                        walletId:
                            wallet.id,

                        amount:
                            amount,

                        balanceBefore:
                            wallet.availableBalance,

                        balanceAfter:
                            wallet.availableBalance,

                        type:
                            "WITHDRAWAL",

                        status:
                            "SUCCESS",

                        withdrawalId:
                            withdrawal.id,

                        approvedBy:
                            req.user.id,

                        description:
                            "Withdrawal manually paid by administrator."

                    }

                });

            }

        });


        return res.json({

            success: true,

            message:
                "Withdrawal marked as paid successfully."

        });

    } catch (error) {

        console.error(
            "MARK WITHDRAWAL PAID ERROR:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Failed to mark withdrawal as paid."

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

        const withdrawal =
            await prisma.withdrawal.findUnique({

                where: {

                    id: req.params.id

                }

            });


        if (!withdrawal) {

            return res.status(404).json({

                success: false,

                message:
                    "Withdrawal not found."

            });

        }


        if (
            withdrawal.status !== "PENDING" &&
            withdrawal.status !== "APPROVED" &&
            withdrawal.status !== "PROCESSING"
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Withdrawal cannot be rejected in its current state."

            });

        }


        const wallet =
            await prisma.wallet.findUnique({

                where: {

                    userId:
                        withdrawal.userId

                }

            });


        if (!wallet) {

            return res.status(404).json({

                success: false,

                message:
                    "Wallet not found."

            });

        }


        const amount =
            new Prisma.Decimal(
                withdrawal.amount
            );


        await prisma.$transaction(async (tx) => {

            /*
            |--------------------------------------------------------------------------
            | RETURN MONEY TO AVAILABLE BALANCE
            |--------------------------------------------------------------------------
            */

            await tx.wallet.update({

                where: {

                    id: wallet.id

                },

                data: {

                    availableBalance: {

                        increment: amount

                    },

                    pendingBalance: {

                        decrement: amount

                    }

                }

            });


            /*
            |--------------------------------------------------------------------------
            | REJECT WITHDRAWAL
            |--------------------------------------------------------------------------
            */

            await tx.withdrawal.update({

                where: {

                    id: withdrawal.id

                },

                data: {

                    status: "REJECTED",

                    adminId:
                        req.user.id,

                    failureReason:
                        "Rejected by administrator."

                }

            });


            /*
            |--------------------------------------------------------------------------
            | REVERSE WALLET TRANSACTION
            |--------------------------------------------------------------------------
            */

            await tx.walletTransaction.updateMany({

                where: {

                    withdrawalId:
                        withdrawal.id

                },

                data: {

                    type:
                        "WITHDRAWAL_REFUND",

                    status:
                        "REVERSED",

                    approvedBy:
                        req.user.id,

                    description:
                        "Withdrawal rejected by administrator. Funds returned to available balance."

                }

            });

        });


        return res.json({

            success: true,

            message:
                "Withdrawal rejected successfully."

        });

    } catch (error) {

        console.error(
            "REJECT WITHDRAWAL ERROR:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Server Error"

        });

    }

};