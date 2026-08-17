import prisma from "../config/prisma.js";

async function checkReferrals() {

    console.log("======================================");
    console.log("CHECKING REFERRAL SYSTEM");
    console.log("======================================");

    try {

        // ---------------------------------------------------------
        // 1. CHECK REFERRAL RECORDS
        // ---------------------------------------------------------

        const referrals = await prisma.referral.findMany({

            include: {

                referrer: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                        referralCode: true
                    }
                },

                referred: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                        referredById: true
                    }
                }

            },

            orderBy: {
                createdAt: "desc"
            }

        });

        console.log("");
        console.log("REFERRAL RECORDS FOUND:", referrals.length);
        console.log("");

        if (referrals.length === 0) {

            console.log(
                "NO REFERRAL RECORDS EXIST IN THE Referral TABLE."
            );

        } else {

            for (const referral of referrals) {

                console.log("--------------------------------------");

                console.log(
                    "Referrer:",
                    referral.referrer?.firstName,
                    referral.referrer?.lastName
                );

                console.log(
                    "Referrer Code:",
                    referral.referrer?.referralCode
                );

                console.log(
                    "Referred:",
                    referral.referred?.firstName,
                    referral.referred?.lastName
                );

                console.log(
                    "Referred Email:",
                    referral.referred?.email
                );

                console.log(
                    "Status:",
                    referral.status
                );

                console.log(
                    "Reward:",
                    referral.reward
                );

            }

        }


        // ---------------------------------------------------------
        // 2. CHECK USERS WITH referredById
        // ---------------------------------------------------------

        const referredUsers =
            await prisma.user.findMany({

                where: {
                    referredById: {
                        not: null
                    }
                },

                select: {

                    id: true,

                    firstName: true,

                    lastName: true,

                    email: true,

                    referralCode: true,

                    referredById: true,

                    createdAt: true

                },

                orderBy: {
                    createdAt: "desc"
                }

            });


        console.log("");
        console.log("======================================");
        console.log("USERS WITH referredById");
        console.log("======================================");

        console.log(
            "Users found:",
            referredUsers.length
        );

        for (const user of referredUsers) {

            console.log("--------------------------------------");

            console.log(
                "Name:",
                `${user.firstName} ${user.lastName}`
            );

            console.log(
                "Email:",
                user.email
            );

            console.log(
                "Referral Code:",
                user.referralCode
            );

            console.log(
                "Referred By ID:",
                user.referredById
            );

        }


        console.log("");
        console.log("======================================");
        console.log("DONE");
        console.log("======================================");

    } catch (error) {

        console.error(
            "REFERRAL CHECK ERROR:"
        );

        console.error(error);

        process.exitCode = 1;

    } finally {

        await prisma.$disconnect();

    }

}

checkReferrals();