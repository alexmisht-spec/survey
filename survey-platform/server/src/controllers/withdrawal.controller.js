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

        /*
        |--------------------------------------------------------------------------
        | VALIDATE AMOUNT
        |--------------------------------------------------------------------------
        */

        if (!withdrawalAmount || withdrawalAmount <= 0) {

            return res.status(400).json({

                success: false,

                message: "Invalid withdrawal amount."

            });

        }

        if (withdrawalAmount < MINIMUM_WITHDRAWAL) {

            return res.status(400).json({

                success: false,

                message:
                    `Minimum withdrawal is KES ${MINIMUM_WITHDRAWAL}.`

            });

        }

        /*
        |--------------------------------------------------------------------------
        | GET USER
        |--------------------------------------------------------------------------
        */

        const user = await prisma.user.findUnique({

            where: {
                id: req.user.id
            },

            include: {

                wallet: true,

                verification: true,

                profile: true

            }

        });

        if (!user) {

            return res.status(404).json({

                success: false,

                message: "User not found."

            });

        }

        /*
        |--------------------------------------------------------------------------
        | ACCOUNT VERIFICATION
        |--------------------------------------------------------------------------
        */

        if (user.status !== "VERIFIED") {

            return res.status(403).json({

                success: false,

                message:
                    "Your account must be verified before requesting withdrawals."

            });

        }

        /*
        |--------------------------------------------------------------------------
        | WALLET CHECK
        |--------------------------------------------------------------------------
        */

        if (!user.wallet) {

            return res.status(404).json({

                success: false,

                message: "Wallet not found."

            });

        }

        /*
        |--------------------------------------------------------------------------
        | PROFILE CHECK
        |--------------------------------------------------------------------------
        */

        if (!user.profile) {

            return res.status(400).json({

                success: false,

                message:
                    "Please complete your profile before requesting a withdrawal."

            });

        }

        /*
        |--------------------------------------------------------------------------
        | MPESA NUMBER CHECK
        |--------------------------------------------------------------------------
        */

        const mpesaNumber = user.profile.mpesaNumber?.trim();

        if (!mpesaNumber) {

            return res.status(400).json({

                success: false,

                code: "MPESA_NUMBER_REQUIRED",

                message:
                    "No M-Pesa number found. Please add your M-Pesa number in Settings before requesting a withdrawal."

            });

        }

        /*
        |--------------------------------------------------------------------------
        | AVAILABLE BALANCE
        |--------------------------------------------------------------------------
        */

        const availableBalance =
            Number(user.wallet.availableBalance);

        if (availableBalance < withdrawalAmount) {

            return res.status(400).json({

                success: false,

                message: "Insufficient available balance."

            });

        }

        /*
        |--------------------------------------------------------------------------
        | PREVENT MULTIPLE PENDING WITHDRAWALS
        |--------------------------------------------------------------------------
        |
        | This prevents the same user from submitting several withdrawals
        | before the admin processes the previous one.
        |
        */

        const existingPending =
            await prisma.withdrawal.findFirst({

                where: {

                    userId: user.id,

                    status: {
                        in: [
                            "PENDING",
                            "APPROVED",
                            "PROCESSING"
                        ]
                    }

                }

            });

        if (existingPending) {

            return res.status(400).json({

                success: false,

                message:
                    "You already have a withdrawal being processed. Please wait for it to be completed before requesting another withdrawal."

            });

        }

        /*
        |--------------------------------------------------------------------------
        | CREATE WITHDRAWAL
        |--------------------------------------------------------------------------
        */

        await prisma.$transaction(async (tx) => {

            /*
            |--------------------------------------------------------------------------
            | MOVE MONEY:
            |
            | availableBalance -> pendingBalance
            |--------------------------------------------------------------------------
            */

            const updatedWallet =
                await tx.wallet.update({

                    where: {

                        id: user.wallet.id

                    },

                    data: {

                        availableBalance: {

                            decrement:
                                new Prisma.Decimal(
                                    withdrawalAmount
                                )

                        },

                        pendingBalance: {

                            increment:
                                new Prisma.Decimal(
                                    withdrawalAmount
                                )

                        }

                    }

                });

            /*
            |--------------------------------------------------------------------------
            | CREATE WITHDRAWAL RECORD
            |--------------------------------------------------------------------------
            */

            const withdrawal =
                await tx.withdrawal.create({

                    data: {

                        userId: user.id,

                        amount:
                            new Prisma.Decimal(
                                withdrawalAmount
                            ),

                        /*
                        IMPORTANT:
                        Store the M-Pesa number from PROFILE.
                        */

                        phoneNumber:
                            mpesaNumber,

                        status: "PENDING",

                        requestIp:
                            req.ip,

                        userAgent:
                            req.get("user-agent")

                    }

                });

            /*
            |--------------------------------------------------------------------------
            | CREATE WALLET TRANSACTION
            |--------------------------------------------------------------------------
            */

            await tx.walletTransaction.create({

                data: {

                    walletId:
                        user.wallet.id,

                    amount:
                        new Prisma.Decimal(
                            withdrawalAmount
                        ),

                    type: "WITHDRAWAL",

                    status: "PENDING",

                    balanceBefore:
                        new Prisma.Decimal(
                            availableBalance
                        ),

                    balanceAfter:
                        updatedWallet.availableBalance,

                    description:
                        `Withdrawal request to M-Pesa ${mpesaNumber}`,

                    withdrawalId:
                        withdrawal.id,

                    requestIp:
                        req.ip,

                    userAgent:
                        req.get("user-agent")

                }

            });

        });

        /*
        |--------------------------------------------------------------------------
        | RESPONSE
        |--------------------------------------------------------------------------
        */

        return res.status(201).json({

            success: true,

            message:
                "Withdrawal request submitted successfully. Awaiting admin approval.",

            phoneNumber: mpesaNumber

        });

    }

    catch (error) {

        console.error(
            "REQUEST WITHDRAWAL ERROR:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Internal server error."

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

        const withdrawals =
            await prisma.withdrawal.findMany({

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

    }

    catch (error) {

        console.error(
            "GET MY WITHDRAWALS ERROR:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Internal server error."

        });

    }

};