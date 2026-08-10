import axios from "axios";

export const sendBrevoEmail = async ({
    to,
    subject,
    htmlContent
}) => {

    return axios.post(
        "https://api.brevo.com/v3/smtp/email",

        {
            sender: {
                name: "SurveyPool",
                email: "nimrodomangar@gmail.com"
            },

            to: [
                {
                    email: to
                }
            ],

            subject,

            htmlContent
        },

        {
            headers: {
                accept: "application/json",
                "api-key": process.env.BREVO_API_KEY,
                "content-type": "application/json"
            }
        }
    );

};