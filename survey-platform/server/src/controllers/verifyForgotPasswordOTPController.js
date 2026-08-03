import bcrypt from "bcrypt";
import prisma from "../config/prisma.js";
export async function forgotPasswordResetController(req, res) {

    try {

        const {

            email,

            otp,

            newPassword,

            confirmPassword,

        } = req.body;

        if (

            !email ||

            !otp ||

            !newPassword ||

            !confirmPassword

        ) {

            return res.status(400).json({

                message: "All fields are required."

            });

        }

        if (newPassword !== confirmPassword) {

            return res.status(400).json({

                message: "Passwords do not match."

            });

        }

        const user = await prisma.user.findUnique({

            where: {

                email,

            },

        });

        if (!user) {

            return res.status(404).json({

                message: "User not found."

            });

        }

        const record = await prisma.passwordResetOTP.findFirst({

            where: {

                userId: user.id,

            },

            orderBy: {

                createdAt: "desc",

            },

        });

        if (!record) {

            return res.status(400).json({

                message: "OTP not found."

            });

        }

        if (record.expiresAt < new Date()) {

            return res.status(400).json({

                message: "OTP expired."

            });

        }

        const validOTP = await bcrypt.compare(

            otp,

            record.otpHash

        );

        if (!validOTP) {

            return res.status(400).json({

                message: "Invalid OTP."

            });

        }

        const hashedPassword = await bcrypt.hash(

            newPassword,

            10

        );

        await prisma.user.update({

            where: {

                id: user.id,

            },

            data: {

                password: hashedPassword,

            },

        });

        await prisma.passwordResetOTP.deleteMany({

            where: {

                userId: user.id,

            },

        });

        return res.json({

            message: "Password reset successfully."

        });

    }

    catch (err) {

        console.error(err);

        return res.status(500).json({

            message: "Server Error"

        });

    }

}