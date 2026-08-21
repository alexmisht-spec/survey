import prisma from "../config/prisma.js";

const template = {
    name: "Complete Your SurveyPool Profile",

    subject: "{{firstName}}, complete your SurveyPool profile",

    type: "GENERAL",

    htmlContent: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto;">

            <h2>Complete Your SurveyPool Profile</h2>

            <p>
                Hello {{firstName}},
            </p>

            <p>
                Welcome to SurveyPool.
            </p>

            <p>
                We noticed that you recently created your SurveyPool
                account, but your profile is not yet complete.
            </p>

            <p>
                Completing your profile is important because it allows us
                to verify your account and determine your eligibility for
                available surveys, app testing opportunities and other
                activities on the platform.
            </p>

            <p>
                Please log in to your SurveyPool account and complete the
                required profile information as soon as possible.
            </p>

            <p>
                Once your profile has been completed and your verification
                has been approved, you will be able to access eligible
                opportunities available on SurveyPool.
            </p>

            <p>
                <a
                    href="https://surveypool.co.ke/complete-profile"
                    style="
                        display: inline-block;
                        padding: 12px 20px;
                        background-color: #2563eb;
                        color: #ffffff;
                        text-decoration: none;
                        border-radius: 6px;
                        font-weight: bold;
                    "
                >
                    Complete My Profile
                </a>
            </p>

            <p>
                If you have already completed your profile, you can ignore
                this email.
            </p>

            <p>
                Thank you for joining SurveyPool.
            </p>

            <p>
                Regards,<br>
                <strong>SurveyPool Team</strong>
            </p>

        </div>
    `
};


async function seedProfileCompletionEmail() {

    console.log("======================================");
    console.log("PROFILE COMPLETION EMAIL TEMPLATE");
    console.log("======================================");

    try {

        const existing =
            await prisma.emailTemplate.findFirst({
                where: {
                    name: template.name
                }
            });

        if (existing) {

            console.log(
                `Template already exists: ${template.name}`
            );

            return;
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

        console.log(
            "PROFILE COMPLETION EMAIL TEMPLATE CREATED SUCCESSFULLY"
        );

    } catch (error) {

        console.error(
            "FAILED TO CREATE EMAIL TEMPLATE:"
        );

        console.error(error);

        process.exitCode = 1;

    } finally {

        await prisma.$disconnect();

    }

}


seedProfileCompletionEmail();