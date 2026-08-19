import prisma from "../config/prisma.js";

const templates = [

    {
        name: "Early Withdrawal Payment Disbursement",
        subject: "SurveyPool Withdrawal Payments Have Been Disbursed",
        type: "GENERAL",

        htmlContent: `
            <div style="
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 650px;
                margin: 0 auto;
            ">

                <h2>
                    Withdrawal Payments Have Been Disbursed
                </h2>

                <p>
                    Hello {{firstName}},
                </p>

                <p>
                    We are pleased to inform you that SurveyPool
                    withdrawal payments have been disbursed earlier
                    today.
                </p>

                <p>
                    If you had an available withdrawal balance that
                    was eligible for payment, please check your
                    registered M-Pesa number and confirm that your
                    payment has been received.
                </p>

                <p>
                    We appreciate your patience and continued
                    participation as we work to improve the SurveyPool
                    platform and expand the number of opportunities
                    available to our users.
                </p>

                <h3>
                    Increase Your Earnings While Waiting for Surveys
                </h3>

                <p>
                    While we continue working on bringing more surveys
                    and opportunities to the platform, don't forget to
                    check the <strong>Refer & Earn</strong> section in
                    your SurveyPool dashboard.
                </p>

                <p>
                    You can invite friends, family members and other
                    eligible participants to join SurveyPool using your
                    personal referral link.
                </p>

                <p>
                    Referral rewards are subject to the applicable
                    SurveyPool referral program requirements and terms.
                </p>

                <p>
                    Log in to your SurveyPool account and open the
                    <strong>Refer & Earn</strong> section to find your
                    referral link and monitor your referrals.
                </p>

                <p>
                    Thank you for being part of SurveyPool.
                </p>

                <p>
                    Regards,<br>
                    <strong>SurveyPool Team</strong>
                </p>

            </div>
        `
    }

];


async function seedEmailTemplates() {

    console.log(
        "Starting payment announcement email template seed..."
    );


    try {

        for (const template of templates) {

            const existing =
                await prisma.emailTemplate.findFirst({

                    where: {
                        name: template.name
                    }

                });


            if (existing) {

                console.log(
                    `Skipping existing template: ${template.name}`
                );

                continue;
            }


            await prisma.emailTemplate.create({

                data: {

                    name:
                        template.name,

                    subject:
                        template.subject,

                    htmlContent:
                        template.htmlContent,

                    type:
                        template.type,

                    active:
                        true

                }

            });


            console.log(
                `Created template: ${template.name}`
            );

        }


        console.log(
            "Payment announcement template seed completed successfully."
        );


    } catch (error) {

        console.error(
            "EMAIL TEMPLATE SEED ERROR:"
        );

        console.error(error);

        process.exitCode = 1;

    } finally {

        await prisma.$disconnect();

    }

}


seedEmailTemplates();