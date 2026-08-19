import prisma from "../config/prisma.js";
import { Prisma } from "@prisma/client";

async function settlePaidBalances() {

    console.log("======================================");
    console.log("SETTLING PAID AVAILABLE BALANCES");
    console.log("======================================");

    try {

        const wallets = await prisma.wallet.findMany({
            where: {
                availableBalance: {
                    gt: 0
                }
            },
            include: {
                user: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true
                    }
                }
            },
            orderBy: {
                availableBalance: "desc"
            }
        });


        console.log(
            `Users with available balances: ${wallets.length}`
        );


        if (wallets.length === 0) {

            console.log(
                "No available balances need to be settled."
            );

            return;
        }


        let totalPaid = new Prisma.Decimal(0);


        for (const wallet of wallets) {

            const amount =
                new Prisma.Decimal(
                    wallet.availableBalance
                );


            console.log(
                `${wallet.user.firstName} ${wallet.user.lastName} | ` +
                `${wallet.user.email} | ` +
                `KSh ${amount.toFixed(2)}`
            );


            await prisma.$transaction(async (tx) => {

                /*
                |--------------------------------------------------------------------------
                | RECORD MANUAL PAYMENT RECONCILIATION
                |--------------------------------------------------------------------------
                */

                await tx.walletTransaction.create({

                    data: {

                        walletId:
                            wallet.id,

                        amount:
                            amount,

                        balanceBefore:
                            amount,

                        balanceAfter:
                            new Prisma.Decimal(0),

                        type:
                            "ADJUSTMENT",

                        status:
                            "SUCCESS",

                        reference:
                            `MANUAL-PAYMENT-${Date.now()}-${wallet.id}`,

                        description:
                            "Available wallet balance settled after manual payment to user by administrator."

                    }

                });


                /*
                |--------------------------------------------------------------------------
                | CLEAR AVAILABLE BALANCE
                |--------------------------------------------------------------------------
                */

                await tx.wallet.update({

                    where: {
                        id: wallet.id
                    },

                    data: {

                        availableBalance:
                            new Prisma.Decimal(0)

                    }

                });

            });


            totalPaid =
                totalPaid.add(amount);

        }


        console.log("");
        console.log("======================================");
        console.log("SETTLEMENT COMPLETED");
        console.log("======================================");

        console.log(
            `Users settled: ${wallets.length}`
        );

        console.log(
            `Total settled: KSh ${totalPaid.toFixed(2)}`
        );

    } catch (error) {

        console.error(
            "SETTLEMENT ERROR:"
        );

        console.error(error);

        process.exitCode = 1;

    } finally {

        await prisma.$disconnect();

    }

}


settlePaidBalances();