import prisma from "../config/prisma.js";

function generateCode() {

    const characters =
        "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

    let code = "SP-";

    for (let i = 0; i < 6; i++) {

        code +=
            characters[
                Math.floor(
                    Math.random() * characters.length
                )
            ];

    }

    return code;

}

async function generateReferralCodes() {

    try {

        console.log(
            "Starting referral code generation..."
        );


        const users =
            await prisma.user.findMany({

                where: {

                    referralCode: null

                },

                select: {

                    id: true

                }

            });


        console.log(
            `Found ${users.length} users without referral codes.`
        );


        let updated = 0;


        for (const user of users) {

            let referralCode;

            let exists = true;


            while (exists) {

                referralCode =
                    generateCode();


                const existing =
                    await prisma.user.findUnique({

                        where: {

                            referralCode

                        },

                        select: {

                            id: true

                        }

                    });


                exists = !!existing;

            }


            await prisma.user.update({

                where: {

                    id: user.id

                },

                data: {

                    referralCode

                }

            });


            updated++;


            console.log(
                `Generated ${referralCode} for user ${user.id}`
            );

        }


        console.log(
            `Successfully generated ${updated} referral codes.`
        );

    } catch (error) {

        console.error(
            "REFERRAL CODE GENERATION ERROR:",
            error
        );

        process.exitCode = 1;

    } finally {

        await prisma.$disconnect();

    }

}


generateReferralCodes();