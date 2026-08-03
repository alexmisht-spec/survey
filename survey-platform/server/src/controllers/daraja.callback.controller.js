import prisma from "../config/prisma.js";
import { Prisma } from "@prisma/client";

/*
|--------------------------------------------------------------------------
| B2C RESULT CALLBACK
|--------------------------------------------------------------------------
*/

export const b2cResultCallback = async (req, res) => {

    try {

        console.log("========== B2C RESULT CALLBACK ==========");

        const result = req.body.Result;

        if (!result) {

            return res.json({

                ResultCode: 0,
                ResultDesc: "Accepted"

            });

        }

        const conversationId = result.ConversationID;

        const resultCode = result.ResultCode;

        const resultDesc = result.ResultDesc;

        console.log(
            `[B2C RESULT] Conversation: ${conversationId} | ResultCode: ${resultCode}`
        );

        console.log(JSON.stringify(req.body, null, 2));

        /*
        |--------------------------------------------------------------------------
        | FIND WITHDRAWAL
        |--------------------------------------------------------------------------
        */

        const withdrawal = await prisma.withdrawal.findFirst({

            where: {

                conversationId

            }

        });

        if (!withdrawal) {

            return res.json({

                ResultCode: 0,

                ResultDesc: "Accepted"

            });

        }

        /*
        |--------------------------------------------------------------------------
        | PREVENT DUPLICATE CALLBACKS
        |--------------------------------------------------------------------------
        */

        if (

            withdrawal.status === "PAID" ||

            withdrawal.status === "FAILED"

        ) {

            return res.json({

                ResultCode: 0,

                ResultDesc: "Accepted"

            });

        }

        /*
        |--------------------------------------------------------------------------
        | FIND WALLET
        |--------------------------------------------------------------------------
        */

        const wallet = await prisma.wallet.findUnique({

            where: {

                userId: withdrawal.userId

            }

        });

        if (!wallet) {

            return res.json({

                ResultCode: 0,

                ResultDesc: "Accepted"

            });

        }

        /*
        |--------------------------------------------------------------------------
        | FIND TRANSACTION
        |--------------------------------------------------------------------------
        */

        const transaction = await prisma.walletTransaction.findFirst({

            where: {

                withdrawalId: withdrawal.id

            },

            orderBy: {

                createdAt: "desc"

            }

        });

        if (!transaction) {

            return res.json({

                ResultCode: 0,

                ResultDesc: "Accepted"

            });

        }

        /*
        |--------------------------------------------------------------------------
        | CALCULATIONS
        |--------------------------------------------------------------------------
        */

        const availableBalance =
            new Prisma.Decimal(wallet.availableBalance);

        const withdrawalAmount =
            new Prisma.Decimal(withdrawal.amount);

        /*
        |--------------------------------------------------------------------------
        | EXTRACT MPESA RECEIPT
        |--------------------------------------------------------------------------
        */

        const transactionReceipt =

            result.ResultParameters?.ResultParameter?.find(

                item =>

                    item.Key === "TransactionReceipt"

            )?.Value ?? null;

        /*
        |--------------------------------------------------------------------------
        | SUCCESS
        |--------------------------------------------------------------------------
        */

        if (resultCode === 0) {

            await prisma.$transaction(async (tx) => {

                await tx.wallet.update({

                    where: {

                        id: wallet.id

                    },

                    data: {

                        pendingBalance: {

                            decrement: withdrawalAmount

                        }

                    }

                });

                await tx.withdrawal.update({

                    where: {

                        id: withdrawal.id

                    },

                    data: {

                        status: "PAID",

                        processedAt: new Date(),

                        transactionId: transactionReceipt,

                        callbackPayload: req.body

                    }

                });

                await tx.walletTransaction.update({

                    where: {

                        id: transaction.id

                    },

                    data: {

                        status: "SUCCESS",

                        balanceAfter: availableBalance,

                        callbackPayload: req.body,

                        description:
                            "Withdrawal paid successfully."

                    }

                });

            });

        }

        /*
        |--------------------------------------------------------------------------
        | FAILED
        |--------------------------------------------------------------------------
        */

        else {

            await prisma.$transaction(async (tx) => {

                await tx.wallet.update({

                    where: {

                        id: wallet.id

                    },

                    data: {

                        availableBalance: {

                            increment: withdrawalAmount

                        },

                        pendingBalance: {

                            decrement: withdrawalAmount

                        }

                    }

                });

                await tx.withdrawal.update({

                    where: {

                        id: withdrawal.id

                    },

                    data: {

                        status: "FAILED",

                        processedAt: new Date(),

                        failureReason: resultDesc,

                        callbackPayload: req.body

                    }

                });

                await tx.walletTransaction.update({

                    where: {

                        id: transaction.id

                    },

                    data: {

                        status: "FAILED",

                        balanceAfter:
                            availableBalance.plus(withdrawalAmount),

                        callbackPayload: req.body,

                        description: resultDesc

                    }

                });

            });

        }

        return res.json({

            ResultCode: 0,

            ResultDesc: "Accepted"

        });

    }

    catch (error) {

        console.error(error);

        return res.json({

            ResultCode: 0,

            ResultDesc: "Accepted"

        });

    }

};

/*
|--------------------------------------------------------------------------
| B2C TIMEOUT CALLBACK
|--------------------------------------------------------------------------
*/

export const b2cTimeoutCallback = async (req, res) => {

    try {

        console.log("========== B2C TIMEOUT CALLBACK ==========");

        console.log(JSON.stringify(req.body, null, 2));

        return res.json({

            ResultCode: 0,

            ResultDesc: "Accepted"

        });

    }

    catch (error) {

        console.error(error);

        return res.json({

            ResultCode: 0,

            ResultDesc: "Accepted"

        });

    }

};