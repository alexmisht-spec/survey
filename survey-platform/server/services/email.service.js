import axios from "axios";

export async function sendPasswordOTP(email, otp) {

    await axios.post(

        "https://api.brevo.com/v3/smtp/email",

        {

            sender: {

                name: "SurveyPool",

                email: "nimrodomangar@gmail.com"

            },

            to: [

                {

                    email

                }

            ],

            subject: "SurveyPool Password Verification",

           htmlContent: `

<div style="background:#f4f7fb;padding:40px 20px;font-family:Arial,Helvetica,sans-serif;">

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
                If you did not request a password change, you can safely ignore this email. Your account will remain secure.
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

</div>

`

        },

        {

            headers: {

                accept: "application/json",

                "api-key": process.env.BREVO_API_KEY,

                "content-type": "application/json"

            }

        }

    );

}