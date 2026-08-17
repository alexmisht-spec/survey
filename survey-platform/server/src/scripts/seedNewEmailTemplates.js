import prisma from "../config/prisma.js";

const templates = [

    /*
    |--------------------------------------------------------------------------
    | WELCOME EMAIL
    |--------------------------------------------------------------------------
    */

    {
        name: "Welcome to SurveyPool",
        subject: "Welcome to SurveyPool, {{firstName}}",
        type: "GENERAL",

        htmlContent: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 650px; margin: auto;">

                <h2>Welcome to SurveyPool</h2>

                <p>Hello {{firstName}},</p>

                <p>
                    Welcome to SurveyPool. Your account has been successfully
                    created, and we are pleased to have you join our growing
                    community of participants.
                </p>

                <p>
                    SurveyPool provides opportunities to participate in surveys,
                    research activities, product testing and other eligible
                    activities available on the platform.
                </p>

                <p>
                    To get started, log in to your SurveyPool account and
                    complete any remaining account and verification requirements.
                </p>

                <p>
                    Once your account is fully verified, you will be able to
                    access eligible opportunities available to you.
                </p>

                <p>
                    We recommend keeping your account information accurate and
                    up to date.
                </p>

                <p>
                    Welcome aboard.
                </p>

                <p>
                    Regards,<br>
                    <strong>SurveyPool Team</strong>
                </p>

            </div>
        `
    },


    /*
    |--------------------------------------------------------------------------
    | EMAIL VERIFIED
    |--------------------------------------------------------------------------
    */

    {
        name: "Email Verification Approved",
        subject: "{{firstName}}, your SurveyPool email has been verified",
        type: "GENERAL",

        htmlContent: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 650px; margin: auto;">

                <h2>Your Email Has Been Verified</h2>

                <p>Hello {{firstName}},</p>

                <p>
                    Good news. Your email address has been successfully
                    verified on SurveyPool.
                </p>

                <p>
                    Your account can now continue through the remaining
                    account verification and onboarding process, where
                    applicable.
                </p>

                <p>
                    You can log in to your SurveyPool account to check your
                    account status and access the activities currently
                    available to you.
                </p>

                <p>
                    Please remember that some SurveyPool activities may have
                    additional eligibility or verification requirements.
                </p>

                <p>
                    If you did not request or expect this verification,
                    please contact SurveyPool support.
                </p>

                <p>
                    Regards,<br>
                    <strong>SurveyPool Team</strong>
                </p>

            </div>
        `
    },


    /*
    |--------------------------------------------------------------------------
    | WITHDRAWAL SYSTEM UPDATE
    |--------------------------------------------------------------------------
    */

    {
        name: "Withdrawal System Update - September 2026",
        subject: "Important SurveyPool Withdrawal System Update",
        type: "GENERAL",

        htmlContent: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 650px; margin: auto;">

                <h2>Important Update Regarding Withdrawals</h2>

                <p>Hello {{firstName}},</p>

                <p>
                    We are writing to provide an important update regarding
                    withdrawals on SurveyPool.
                </p>

                <p>
                    We have recently been reviewing and updating our
                    withdrawal procedures to ensure that the process is
                    properly aligned with applicable Kenyan regulatory,
                    compliance and operational requirements.
                </p>

                <p>
                    As part of this process, the previous withdrawal
                    procedure is being replaced with an updated withdrawal
                    system.
                </p>

                <h3>New Withdrawal Schedule</h3>

                <p>
                    Starting <strong>7 September 2026</strong>, SurveyPool
                    withdrawals will be processed through the new
                    withdrawal system.
                </p>

                <p>
                    Under the new system, withdrawal processing will be
                    initiated by the SurveyPool administration team every
                    <strong>Thursday</strong>.
                </p>

                <p>
                    Eligible users with withdrawable balances will have their
                    withdrawal requests reviewed and processed during the
                    scheduled withdrawal cycle.
                </p>

                <h3>What You Need To Do</h3>

                <p>
                    You do not need to create a new account or take any
                    special action simply because of this system change.
                </p>

                <p>
                    Please ensure that your SurveyPool account information,
                    verification details and payment information are
                    accurate and up to date.
                </p>

                <p>
                    If your account or withdrawal information requires
                    verification, additional information may be requested
                    before a withdrawal can be processed.
                </p>

                <h3>We Appreciate Your Patience</h3>

                <p>
                    We understand that changes to the withdrawal process may
                    cause inconvenience, particularly for users who were
                    expecting withdrawals to be processed under the previous
                    system.
                </p>

                <p>
                    We sincerely appreciate your patience and understanding
                    while we complete this transition.
                </p>

                <p>
                    Our goal is to provide a more consistent, transparent and
                    reliable withdrawal process for SurveyPool users.
                </p>

                <p>
                    Please continue using SurveyPool normally while the new
                    withdrawal system is being implemented.
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

    console.log("Starting new email template seed...");

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

                    name: template.name,

                    subject: template.subject,

                    htmlContent: template.htmlContent,

                    type: template.type,

                    active: true

                }

            });


            console.log(
                `Created template: ${template.name}`
            );

        }


        console.log(
            "New email template seed completed successfully."
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