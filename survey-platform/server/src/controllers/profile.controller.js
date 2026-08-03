import prisma from "../config/prisma.js";

export const completeProfile = async (req, res) => {
    try {

        const userId = req.user.id;

        const {
            nationalId,
            paymentMethod,
            mpesaNumber
        } = req.body;

        if (!nationalId || !paymentMethod || !mpesaNumber) {
            return res.status(400).json({
                success: false,
                message: "All fields are required."
            });
        }

        // Check if profile already exists
        const existingProfile = await prisma.profile.findUnique({
            where: {
                userId
            }
        });

        if (existingProfile) {
            return res.status(400).json({
                success: false,
                message: "Profile already completed."
            });
        }

        // Check duplicate National ID
        const duplicateId = await prisma.profile.findUnique({
            where: {
                nationalId
            }
        });

        if (duplicateId) {
            return res.status(400).json({
                success: false,
                message: "National ID already registered."
            });
        }

        // Create profile
        const profile = await prisma.profile.create({
            data: {
                userId,
                nationalId,
                paymentMethod,
                mpesaNumber,
                completed: true
            }
        });

        // Update user status
        await prisma.user.update({
            where: {
                id: userId
            },
            data: {
                status: "PROFILE_COMPLETED"
            }
        });

        return res.status(201).json({
            success: true,
            message: "Profile completed successfully.",
            profile
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }
};


export const getProfile = async (req, res) => {

    try {

        const profile = await prisma.profile.findUnique({

            where: {
                userId: req.user.id
            }

        });

        return res.json({
            success: true,
            profile
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }

};