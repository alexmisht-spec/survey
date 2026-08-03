import dotenv from "dotenv";
dotenv.config();

import { sendPasswordOTP } from "./services/email.service.js";
console.log({
  host: process.env.BREVO_SMTP_HOST,
  port: process.env.BREVO_SMTP_PORT,
  user: process.env.BREVO_SMTP_USER,
});

await sendPasswordOTP(
    "nimrodomangar@gmail.com",
    "582941"
);

console.log("Email Sent Successfully");