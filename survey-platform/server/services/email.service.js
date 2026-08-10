import axios from "axios";
import prisma from "../config/prisma.js";

const BREVO_URL = "https://api.brevo.com/v3/smtp/email";

const BREVO_HEADERS = {
    accept: "application/json",
    "api-key": process.env.BREVO_API_KEY,
    "content-type": "application/json"
};

const SENDER = {
    name: "SurveyPool",
    email: "nimrodomangar@gmail.com"
};


/*
|--------------------------------------------------------------------------
| SEND EMAIL THROUGH BREVO
|--------------------------------------------------------------------------
*/

export async function sendEmail({
    userId = null,
    email,
    subject,
    htmlContent,
    templateId = null
}) {

    if (!email) {
        throw new Error("Recipient email is required.");
    }

    if (!subject) {
        throw new Error("Email subject is required.");
    }

    if (!htmlContent) {
        throw new Error("Email content is required.");
    }

    try {

        await axios.post(

            BREVO_URL,

            {
                sender: SENDER,

                to: [
                    {
                        email
                    }
                ],

                subject,

                htmlContent
            },

            {
                headers: BREVO_HEADERS
            }

        );

        /*
        |--------------------------------------------------------------------------
        | LOG SUCCESSFUL EMAIL
        |--------------------------------------------------------------------------
        */

        if (userId) {

            await prisma.emailLog.create({

                data: {

                    userId,

                    templateId,

                    email,

                    subject,

                    status: "SENT"

                }

            });

        }

        return {
            success: true
        };

    } catch (error) {

        console.error(
            "BREVO EMAIL ERROR:",
            error.response?.data || error.message
        );

        /*
        |--------------------------------------------------------------------------
        | LOG FAILED EMAIL
        |--------------------------------------------------------------------------
        */

        if (userId) {

            try {

                await prisma.emailLog.create({

                    data: {

                        userId,

                        templateId,

                        email,

                        subject,

                        status: "FAILED",

                        errorMessage:
                            error.response?.data?.message ||
                            error.message

                    }

                });

            } catch (logError) {

                console.error(
                    "EMAIL LOG ERROR:",
                    logError
                );

            }

        }

        throw error;

    }

}


/*
|--------------------------------------------------------------------------
| PASSWORD OTP
|--------------------------------------------------------------------------
*/

export async function sendPasswordOTP(email, otp) {

    const htmlContent = `

<div style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e5e7eb;">

    <div style="background:#2563eb;padding:30px;text-align:center;">

        <h1 style="margin:0;color:#ffffff;font-size:30px;font-weight:700;">
            SurveyPool
        </h1>

        <p style="margin:10px 0 0;color:#dbeafe;font-size:15px;">
            Secure Account Verification
        </p>

    </div>

    <div style="padding:40px;">

        <h2 style="margin-top:0;color:#111827;">
            Password Verification
        </h2>

        <p style="color:#4b5563;font-size:16px;line-height:1.7;">
            Hello,
        </p>

        <p style="color:#4b5563;font-size:16px;line-height:1.7;">
            We received a request to change the password for your
            <strong>SurveyPool</strong> account.
        </p>

        <p style="color:#4b5563;font-size:16px;line-height:1.7;">
            Please use the verification code below to continue:
        </p>

        <div style="margin:35px 0;text-align:center;">

            <div style="
                display:inline-block;
                background:#eff6ff;
                border:2px dashed #2563eb;
                border-radius:12px;
                padding:18px 35px;
            ">

                <span style="
                    font-size:34px;
                    font-weight:700;
                    letter-spacing:10px;
                    color:#2563eb;
                ">
                    ${otp}
                </span>

            </div>

        </div>

        <p style="color:#6b7280;font-size:15px;line-height:1.7;">
            This verification code will expire in
            <strong>10 minutes</strong>.
        </p>

        <p style="color:#6b7280;font-size:15px;line-height:1.7;">
            If you did not request a password change, you can safely
            ignore this email. Your account will remain secure.
        </p>

        <hr style="margin:35px 0;border:none;border-top:1px solid #e5e7eb;">

        <p style="color:#9ca3af;font-size:13px;line-height:1.7;text-align:center;">
            This is an automated message from SurveyPool.<br>
            Please do not reply to this email.
        </p>

    </div>

    <div style="
        background:#f9fafb;
        padding:18px;
        text-align:center;
        color:#9ca3af;
        font-size:12px;
    ">

        © ${new Date().getFullYear()} SurveyPool. All rights reserved.

    </div>

</div>

`;

    return sendEmail({

        email,

        subject: "SurveyPool Password Verification",

        htmlContent

    });

}


/*
|--------------------------------------------------------------------------
| SEND ADMIN TEMPLATE TO USER
|--------------------------------------------------------------------------
*/

export async function sendTemplateEmail({
    userId,
    templateId
}) {

    const user = await prisma.user.findUnique({

        where: {
            id: userId
        }

    });

    if (!user) {

        throw new Error("User not found.");

    }

    /*
    |--------------------------------------------------------------------------
    | ONLY UNVERIFIED USERS
    |--------------------------------------------------------------------------
    */

    if (user.status === "VERIFIED") {

        throw new Error(
            "This email can only be sent to unverified users."
        );

    }

    const template = await prisma.emailTemplate.findUnique({

        where: {
            id: templateId
        }

    });

    if (!template) {

        throw new Error("Email template not found.");

    }

    if (!template.active) {

        throw new Error(
            "This email template is inactive."
        );

    }

    /*
    |--------------------------------------------------------------------------
    | PERSONALIZATION
    |--------------------------------------------------------------------------
    */

    const htmlContent = template.htmlContent
        .replaceAll(
            "{{firstName}}",
            user.firstName || ""
        )
        .replaceAll(
            "{{lastName}}",
            user.lastName || ""
        )
        .replaceAll(
            "{{fullName}}",
            `${user.firstName || ""} ${user.lastName || ""}`.trim()
        )
        .replaceAll(
            "{{email}}",
            user.email
        );

    const subject = template.subject
        .replaceAll(
            "{{firstName}}",
            user.firstName || ""
        )
        .replaceAll(
            "{{lastName}}",
            user.lastName || ""
        )
        .replaceAll(
            "{{fullName}}",
            `${user.firstName || ""} ${user.lastName || ""}`.trim()
        );

    return sendEmail({

        userId: user.id,

        templateId: template.id,

        email: user.email,

        subject,

        htmlContent

    });

}