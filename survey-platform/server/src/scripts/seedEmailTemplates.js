import prisma from "../config/prisma.js";

const templates = [
    {
        name: "Withdrawal System Restoration",
        subject: "Important Update Regarding Withdrawals",
        type: "GENERAL",
        htmlContent: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <h2>Important Update Regarding Withdrawals</h2>

                <p>Hello {{firstName}},</p>

                <p>
                    We would like to inform you that our withdrawal system is
                    currently undergoing maintenance.
                </p>

                <p>
                    Unfortunately, withdrawals are temporarily unavailable.
                    Our development team is actively working to restore the
                    system as quickly as possible.
                </p>

                <p>
                    We appreciate your patience and understanding while we
                    work on this issue.
                </p>

                <p>
                    In the meantime, you can continue participating in
                    available activities on SurveyPool.
                </p>

                <p>
                    We will provide an update once the withdrawal system has
                    been fully restored.
                </p>

                <p>
                    Regards,<br>
                    SurveyPool Team
                </p>
            </div>
        `
    },

    {
        name: "Complete Your Verification",
        subject: "{{firstName}}, complete your SurveyPool verification",
        type: "VERIFICATION_FOLLOWUP",
        htmlContent: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <h2>Complete Your SurveyPool Verification</h2>

                <p>Hello {{firstName}},</p>

                <p>
                    We noticed that you recently signed up for SurveyPool,
                    but your account verification has not yet been completed.
                </p>

                <p>
                    Completing your verification allows you to access
                    available surveys and other activities on the platform.
                </p>

                <p>
                    Please log in to your SurveyPool account and complete
                    the required verification steps.
                </p>

                <p>
                    Once your verification has been approved, you can begin
                    participating in available surveys and other opportunities.
                </p>

                <p>
                    We look forward to having you fully onboard.
                </p>

                <p>
                    Regards,<br>
                    SurveyPool Team
                </p>
            </div>
        `
    },

    {
        name: "New Referral Program",
        subject: "SurveyPool Referral Program is now live",
        type: "GENERAL",
        htmlContent: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <h2>Our Referral Program Is Now Live</h2>

                <p>Hello {{firstName}},</p>

                <p>
                    We are excited to announce that SurveyPool has officially
                    launched our referral program.
                </p>

                <p>
                    You can now invite other people to join SurveyPool using
                    your referral link.
                </p>

                <p>
                    When your referrals meet the required conditions,
                    you can earn referral rewards according to the current
                    SurveyPool referral program terms.
                </p>

                <p>
                    To get started, log in to your SurveyPool account and
                    visit the referral section to find your referral link
                    and available referral information.
                </p>

                <p>
                    Start sharing SurveyPool with your network and earn
                    additional rewards.
                </p>

                <p>
                    Regards,<br>
                    SurveyPool Team
                </p>
            </div>
        `
    },

    {
        name: "App Testing Program",
        subject: "SurveyPool App Testing Opportunity – Earn After 14 Days",
        type: "GENERAL",
        htmlContent: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <h2>New App Testing Opportunity</h2>

                <p>Hello {{firstName}},</p>

                <p>
                    SurveyPool has launched a new app testing opportunity
                    where eligible participants can test selected mobile
                    applications.
                </p>

                <h3>How App Testing Works</h3>

                <ol>
                    <li>
                        Select an available app testing task on SurveyPool.
                    </li>

                    <li>
                        Download and install the specified application using
                        the instructions provided in the task.
                    </li>

                    <li>
                        Use the application throughout the required
                        <strong>14-day testing period</strong>.
                    </li>

                    <li>
                        During the testing period, follow all instructions
                        provided with the task and use the application
                        normally.
                    </li>

                    <li>
                        Where the task specifically requires a store review,
                        leave an honest positive review based on your genuine
                        experience with the application.
                    </li>

                    <li>
                        After successfully completing the required 14-day
                        testing period and all task requirements have been
                        verified, your reward will be processed according to
                        the task terms.
                    </li>
                </ol>

                <p>
                    Please do not uninstall the application before the
                    required testing period is complete unless the task
                    instructions specifically tell you otherwise.
                </p>

                <p>
                    Each app testing task may have its own additional
                    requirements, so always read the task instructions before
                    starting.
                </p>

                <p>
                    Log in to your SurveyPool account to check available
                    app testing opportunities.
                </p>

                <p>
                    Regards,<br>
                    SurveyPool Team
                </p>
            </div>
        `
    }
];

async function seedEmailTemplates() {

    console.log("Starting email template seed...");

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

        console.log("Email template seed completed successfully.");

    } catch (error) {

        console.error("EMAIL TEMPLATE SEED ERROR:");
        console.error(error);

        process.exitCode = 1;

    } finally {

        await prisma.$disconnect();

    }
}

seedEmailTemplates();