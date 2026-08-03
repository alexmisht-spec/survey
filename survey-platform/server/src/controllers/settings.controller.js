import bcrypt from "bcrypt";

import prisma from "../config/prisma.js";

import generateOTP from "../utilis/generateOTP.js";

import { sendPasswordOTP } from "../../services/email.service.js";
export async function sendPasswordOTPController(req, res) {

    try {

        const userId = req.user.id;

        const { currentPassword } = req.body;

        if (!currentPassword) {

            return res.status(400).json({

                message: "Current password required",

            });

        }

        const user = await prisma.user.findUnique({

            where: {

                id: userId,

            },

        });

        const correctPassword = await bcrypt.compare(

            currentPassword,

            user.password

        );

        if (!correctPassword) {

            return res.status(400).json({

                message: "Current password is incorrect",

            });

        }

        await prisma.passwordResetOTP.deleteMany({

            where: {

                userId,

            },

        });

        const otp = generateOTP();

        const otpHash = await bcrypt.hash(

            otp,

            10

        );

        await prisma.passwordResetOTP.create({

            data: {

                userId,

                otpHash,

                expiresAt: new Date(

                    Date.now() +

                    10 * 60 * 1000

                ),

            },

        });

        await sendPasswordOTP(

            user.email,

            otp

        );

        return res.json({

            message: "OTP sent successfully",

        });

    }

    catch (err) {

        console.error(err);

        return res.status(500).json({

            message: "Server Error",

        });

    }

}
export async function verifyPasswordOTPController(req, res) {

    try {

        const userId = req.user.id;

        const { otp, newPassword } = req.body;

        if (!otp || !newPassword) {

            return res.status(400).json({
                message: "OTP and new password are required",
            });

        }

        const record = await prisma.passwordResetOTP.findFirst({

            where: {
                userId,
            },

            orderBy: {
                createdAt: "desc",
            },

        });

        if (!record) {

            return res.status(400).json({
                message: "OTP not found",
            });

        }

        if (record.expiresAt < new Date()) {

            await prisma.passwordResetOTP.delete({

                where: {
                    id: record.id,
                },

            });

            return res.status(400).json({
                message: "OTP has expired",
            });

        }

        const validOTP = await bcrypt.compare(

            otp,

            record.otpHash

        );

        if (!validOTP) {

            return res.status(400).json({
                message: "Invalid OTP",
            });

        }

        const passwordHash = await bcrypt.hash(

            newPassword,

            10

        );

        await prisma.user.update({

            where: {
                id: userId,
            },

            data: {
                password: passwordHash,
            },

        });

        await prisma.passwordResetOTP.delete({

            where: {
                id: record.id,
            },

        });

        return res.json({

            message: "Password changed successfully",

        });

    }

    catch (err) {

        console.error(err);

        return res.status(500).json({

            message: "Server Error",

        });

    }

}
export async function changePasswordController(req, res) {

    try {

        const userId = req.user.id;

        const {
            otp,
            newPassword,
            confirmPassword,
        } = req.body;

        if (!otp || !newPassword || !confirmPassword) {

            return res.status(400).json({
                message: "All fields are required.",
            });

        }

        if (newPassword !== confirmPassword) {

            return res.status(400).json({
                message: "Passwords do not match.",
            });

        }

        if (newPassword.length < 8) {

            return res.status(400).json({
                message: "Password must be at least 8 characters.",
            });

        }

        const record = await prisma.passwordResetOTP.findFirst({

            where: {
                userId,
            },

            orderBy: {
                createdAt: "desc",
            },

        });

        if (!record) {

            return res.status(400).json({
                message: "OTP not found.",
            });

        }

        if (record.expiresAt < new Date()) {

            return res.status(400).json({
                message: "OTP expired.",
            });

        }

        const validOTP = await bcrypt.compare(
            otp,
            record.otpHash
        );

        if (!validOTP) {

            return res.status(400).json({
                message: "Invalid OTP.",
            });

        }

        const hashedPassword = await bcrypt.hash(
            newPassword,
            10
        );

        await prisma.user.update({

            where: {
                id: userId,
            },

            data: {
                password: hashedPassword,
            },

        });

        await prisma.passwordResetOTP.deleteMany({

            where: {
                userId,
            },

        });

        return res.json({

            message: "Password changed successfully.",

        });

    }

    catch (err) {

        console.error(err);

        return res.status(500).json({

            message: "Server Error",

        });

    }

}
export async function getProfileController(req, res) {

    try {

        const user = await prisma.user.findUnique({

            where: {
                id: req.user.id,
            },

            select: {
                firstName: true,
                lastName: true,
                email: true,
                phone: true,
            },

        });

        return res.json({

            success: true,

            user,

        });

    }

    catch (err) {

        console.error(err);

        return res.status(500).json({

            success: false,

            message: "Server Error",

        });

    }

}
export async function updateProfileController(req, res) {

    try {

        const { firstName, lastName, phone } = req.body;

        if (!firstName || !lastName || !phone) {

            return res.status(400).json({

                success: false,

                message: "All fields are required.",

            });

        }

        const phoneExists = await prisma.user.findFirst({

            where: {

                phone,

                NOT: {

                    id: req.user.id,

                },

            },

        });

        if (phoneExists) {

            return res.status(400).json({

                success: false,

                message: "Phone number already exists.",

            });

        }

        const user = await prisma.user.update({

            where: {

                id: req.user.id,

            },

            data: {

                firstName,

                lastName,

                phone,

            },

            select: {

                firstName: true,

                lastName: true,

                email: true,

                phone: true,

            },

        });

        return res.json({

            success: true,

            message: "Profile updated successfully.",

            user,

        });

    }

    catch (err) {

        console.error(err);

        return res.status(500).json({

            success: false,

            message: "Server Error",

        });

    }

}