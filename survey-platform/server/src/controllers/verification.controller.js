import prisma from "../config/prisma.js";
import cloudinary from "../config/cloudinary.js";
import { uploadToCloudinary } from "../utilis/uploadToCloudinary.js";
import { createNotification } from "../utilis/notification.js";

function getPublicId(url) {

    if (!url) return null;

    const parts = url.split("/upload/");

    if (parts.length < 2) return null;

    return parts[1]
        .replace(/^v\d+\//, "")
        .replace(/\.[^/.]+$/, "");

}

export const uploadVerification = async (req, res) => {

    console.log("===== REQUEST DEBUG =====");
    console.log("Files:", req.files);
    console.log("=========================");

    try {

        const userId = req.user.id;

        if (
            !req.files?.idFront ||
            !req.files?.idBack
        ) {

            return res.status(400).json({

                success: false,
                message: "Upload both front and back of your National ID."

            });

        }

        const existing = await prisma.verification.findUnique({

            where: {
                userId
            }

        });

        if (existing) {

            if (existing.status === "PENDING") {

                return res.status(400).json({

                    success: false,
                    message: "Your verification is already under review."

                });

            }

            if (existing.status === "APPROVED") {

                return res.status(400).json({

                    success: false,
                    message: "Your account is already verified."

                });

            }

            /*
            |--------------------------------------------------------------------------
            | DELETE OLD REJECTED DOCUMENTS FROM CLOUDINARY
            |--------------------------------------------------------------------------
            */

            const frontPublicId = getPublicId(existing.idFront);
            const backPublicId = getPublicId(existing.idBack);

            if (frontPublicId) {

                await cloudinary.uploader.destroy(frontPublicId).catch(console.error);

            }

            if (backPublicId) {

                await cloudinary.uploader.destroy(backPublicId).catch(console.error);

            }

        }

        /*
        |--------------------------------------------------------------------------
        | UPLOAD NEW DOCUMENTS TO CLOUDINARY
        |--------------------------------------------------------------------------
        */

        const frontUpload = await uploadToCloudinary(

            req.files.idFront[0].buffer,

            "verification"

        );

        const backUpload = await uploadToCloudinary(

            req.files.idBack[0].buffer,

            "verification"

        );

        let verification;

        if (existing && existing.status === "REJECTED") {

            verification = await prisma.verification.update({

                where: {

                    id: existing.id

                },

                data: {

                    idFront: frontUpload.secure_url,

                    idBack: backUpload.secure_url,

                    status: "PENDING",

                    rejectionReason: null,

                    reviewedBy: null,

                    reviewedAt: null

                }

            });

        } else {

            verification = await prisma.verification.create({

                data: {

                    userId,

                    idFront: frontUpload.secure_url,

                    idBack: backUpload.secure_url,

                    status: "PENDING"

                }

            });

        }

        await prisma.user.update({

            where: {

                id: userId

            },

            data: {

                status: "PENDING_VERIFICATION"

            }

        });

        await createNotification({

            userId,

            title: "Verification Submitted",

            message: "Your verification documents have been submitted successfully. We will review them shortly.",

            type: "INFO"

        });

        return res.status(201).json({

            success: true,

            message: existing && existing.status === "REJECTED"
                ? "Verification resubmitted successfully."
                : "Verification submitted successfully.",

            verification

        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};