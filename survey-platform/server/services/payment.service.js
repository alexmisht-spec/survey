import prisma from "../src/config/prisma.js";
import { sendB2CPayment } from "./daraja.service.js";

/*
|--------------------------------------------------------------------------
| PROCESS WITHDRAWAL PAYMENT
|--------------------------------------------------------------------------
*/

export async function processWithdrawal(withdrawalId) {

    /*
    |--------------------------------------------------------------------------
    | FETCH WITHDRAWAL
    |--------------------------------------------------------------------------
    */

    const withdrawal = await prisma.withdrawal.findUnique({

        where: {
            id: withdrawalId
        },

        include: {

            user: {

                include: {

                    profile: true,

                    wallet: true

                }

            }

        }

    });

    if (!withdrawal) {

        throw new Error("Withdrawal not found.");

    }

    if (withdrawal.status !== "APPROVED") {

        throw new Error("Withdrawal is not approved.");

    }

    /*
    |--------------------------------------------------------------------------
    | SEND PAYMENT TO DARAJA
    |--------------------------------------------------------------------------
    */

    const response = await sendB2CPayment({

        amount: Number(withdrawal.amount),

        phone: withdrawal.phoneNumber,

        remarks: "Survey Withdrawal",

        occasion: `WD-${withdrawal.id}`

    });

    /*
    |--------------------------------------------------------------------------
    | UPDATE WITHDRAWAL
    |--------------------------------------------------------------------------
    */

    await prisma.withdrawal.update({

        where: {

            id: withdrawal.id

        },

        data: {

            status: "PROCESSING",

            conversationId:
                response.conversationId,

            originatorConversationId:
                response.originatorConversationId

        }

    });

    /*
    |--------------------------------------------------------------------------
    | UPDATE WALLET TRANSACTION
    |--------------------------------------------------------------------------
    */

    await prisma.walletTransaction.updateMany({

        where: {

            withdrawalId: withdrawal.id

        },

        data: {

            status: "PROCESSING",

            reference:
                response.originatorConversationId,

            description:
                "Sent to Safaricom. Awaiting callback."

        }

    });

    return response;

}