import axios from "axios";

const BASE_URL =
    process.env.DARAJA_ENV === "production"
        ? "https://api.safaricom.co.ke"
        : "https://sandbox.safaricom.co.ke";

const daraja = axios.create({
    baseURL: BASE_URL,
    timeout: 30000,
    headers: {
        "Content-Type": "application/json",
    },
});

/*
|--------------------------------------------------------------------------
| REQUIRED ENVIRONMENT VARIABLES
|--------------------------------------------------------------------------
| Only require OAuth credentials during development.
| B2C credentials will be validated when sending a payment.
*/

const required = [
    "CONSUMER_KEY",
    "CONSUMER_SECRET",
];

for (const key of required) {
    if (!process.env[key]) {
        throw new Error(`${key} is missing from .env`);
    }
}

/*
|--------------------------------------------------------------------------
| GET ACCESS TOKEN
|--------------------------------------------------------------------------
*/

export async function getAccessToken() {
    try {
        const auth = Buffer.from(
            `${process.env.CONSUMER_KEY}:${process.env.CONSUMER_SECRET}`
        ).toString("base64");

        const { data } = await daraja.get(
            "/oauth/v1/generate?grant_type=client_credentials",
            {
                headers: {
                    Authorization: `Basic ${auth}`,
                },
            }
        );

        if (!data.access_token) {
            throw new Error("Unable to obtain Daraja access token.");
        }

        return data.access_token;
    } catch (error) {
        console.error("========== DARAJA TOKEN ERROR ==========");
        console.error(error.response?.data || error.message);

        throw new Error("Failed to authenticate with Daraja.");
    }
}

/*
|--------------------------------------------------------------------------
| SEND B2C PAYMENT
|--------------------------------------------------------------------------
*/

export async function sendB2CPayment({
    amount,
    phone,
    remarks,
    occasion,
}) {
    // Validate B2C credentials only when payment is actually sent
    const requiredB2C = [
        "INITIATOR_NAME",
        "SECURITY_CREDENTIAL",
        "SHORT_CODE",
        "RESULT_CALLBACK_URL",
        "QUEUE_TIMEOUT_URL",
    ];

    for (const key of requiredB2C) {
        if (!process.env[key]) {
            throw new Error(`${key} is missing from .env`);
        }
    }

    try {
        const token = await getAccessToken();

        const { data } = await daraja.post(
            "/mpesa/b2c/v1/paymentrequest",
            {
                InitiatorName: process.env.INITIATOR_NAME,
                SecurityCredential: process.env.SECURITY_CREDENTIAL,
                CommandID:
                    process.env.COMMAND_ID || "BusinessPayment",
                Amount: Number(amount),
                PartyA: process.env.SHORT_CODE,
                PartyB: phone,
                Remarks: remarks || "Survey Withdrawal",
                QueueTimeOutURL: process.env.QUEUE_TIMEOUT_URL,
                ResultURL: process.env.RESULT_CALLBACK_URL,
                Occasion: occasion || "SurveyPool Withdrawal",
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        return {
            success: true,
            conversationId: data.ConversationID,
            originatorConversationId: data.OriginatorConversationID,
            responseCode: data.ResponseCode,
            responseDescription: data.ResponseDescription,
            customerMessage: data.ResponseDescription,
            raw: data,
        };
    } catch (error) {
        console.error("========== DARAJA B2C ERROR ==========");
        console.error(error.response?.data || error.message);

        throw new Error(
            error.response?.data?.errorMessage ||
            "Failed to send B2C payment."
        );
    }
}