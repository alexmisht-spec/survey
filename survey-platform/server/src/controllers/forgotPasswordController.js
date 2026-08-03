import bcrypt from "bcrypt";
import prisma from "../config/prisma.js";

import generateOTP from "../utilis/generateOTP.js";
import { sendPasswordOTP } from "../../services/email.service.js";
export async function forgotPasswordSendOTPController(req, res) {

    try {

        const { email } = req.body;

        if (!email) {

            return res.status(400).json({
                message: "Email is required."
            });

        }

        const user = await prisma.user.findUnique({

            where: {
                email,
            },

        });

        if (!user) {

            return res.status(404).json({
                message: "Account not found."
            });

        }

        await prisma.passwordResetOTP.deleteMany({

            where: {
                userId: user.id,
            },

        });

        const otp = generateOTP();

        const otpHash = await bcrypt.hash(

            otp,

            10

        );

        await prisma.passwordResetOTP.create({

            data: {

                userId: user.id,

                otpHash,

                expiresAt: new Date(
                    Date.now() + 10 * 60 * 1000
                ),

            },

        });

        await sendPasswordOTP(

            user.email,

            otp

        );

        return res.json({

            message: "OTP sent successfully."

        });

    }

    catch (err) {

        console.error(err);

        return res.status(500).json({

            message: "Server Error"

        });

    }

}