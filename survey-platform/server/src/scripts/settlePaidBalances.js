import prisma from "../config/prisma.js";
import { Prisma } from "@prisma/client";

async function settlePaidBalances() {

    console.log("======================================");
    console.log("SETTLING PAID WALLET BALANCES");
    console.log("======================================");

    try {

        const wallets = await prisma.wallet.findMany({

            where: {
                OR: [
                    {
                        availableBalance: {
                            gt: 0
                        }
                    },
                    {
                        pendingBalance: {
                            gt: 0
                        }
                    }
                ]
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
                updatedAt: "desc"
            }

        });


        console.log(
            `Users with balances to settle: ${wallets.length}`
        );


        if (wallets.length === 0) {

            console.log(
                "No balances need to be settled."
            );

            return;

        }


        let totalAvailable = new Prisma.Decimal(0);
        let totalPending = new Prisma.Decimal(0);
        let totalSettled = new Prisma.Decimal(0);


        for (const wallet of wallets) {

            const available =
                new Prisma.Decimal(
                    wallet.availableBalance
                );

            const pending =
                new Prisma.Decimal(
                    wallet.pendingBalance
                );

            const total =
                available.add(pending);


            console.log("--------------------------------------");

            console.log(
                `${wallet.user.firstName} ${wallet.user.lastName}`
            );

            console.log(
                `Email: ${wallet.user.email}`
            );

            console.log(
                `Available: KSh ${available.toFixed(2)}`
            );

            console.log(
                `Pending: KSh ${pending.toFixed(2)}`
            );

            console.log(
                `Total: KSh ${total.toFixed(2)}`
            );


            await prisma.$transaction(async (tx) => {

                /*
                |--------------------------------------------------------------------------
                | RECORD RECONCILIATION
                |--------------------------------------------------------------------------
                */

                if (total.greaterThan(0)) {

                    await tx.walletTransaction.create({

                        data: {

                            walletId:
                                wallet.id,

                            amount:
                                total,

                            balanceBefore:
                                available,

                            balanceAfter:
                                new Prisma.Decimal(0),

                            type:
                                "ADJUSTMENT",

                            status:
                                "SUCCESS",

                            reference:
                                `MANUAL-SETTLEMENT-${wallet.id}-${Date.now()}`,

                            description:
                                "Wallet balances reconciled after manual payment disbursement by administrator."

                        }

                    });

                }


                /*
                |--------------------------------------------------------------------------
                | CLEAR BOTH BALANCES
                |--------------------------------------------------------------------------
                */

                await tx.wallet.update({

                    where: {
                        id: wallet.id
                    },

                    data: {

                        availableBalance:
                            new Prisma.Decimal(0),

                        pendingBalance:
                            new Prisma.Decimal(0)

                    }

                });

            });


            totalAvailable =
                totalAvailable.add(available);

            totalPending =
                totalPending.add(pending);

            totalSettled =
                totalSettled.add(total);

        }


        console.log("");
        console.log("======================================");
        console.log("SETTLEMENT COMPLETED");
        console.log("======================================");

        console.log(
            `Users settled: ${wallets.length}`
        );

        console.log(
            `Available settled: KSh ${totalAvailable.toFixed(2)}`
        );

        console.log(
            `Pending settled: KSh ${totalPending.toFixed(2)}`
        );

        console.log(
            `TOTAL SETTLED: KSh ${totalSettled.toFixed(2)}`
        );

        console.log("======================================");


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