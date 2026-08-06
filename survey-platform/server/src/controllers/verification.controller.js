import prisma from "../config/prisma.js";
import { createNotification } from "../utilis/notification.js";

import path from "path";

export const uploadVerification = async (req, res) => {

    console.log("===== REQUEST DEBUG =====");
    console.log("Content-Type:", req.headers["content-type"]);
    console.log("Body:", req.body);
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

            return res.status(400).json({

                success: false,
                message: "Verification already submitted."

            });

        }

        /*
        |--------------------------------------------------------------------------
        | STORE ABSOLUTE PATHS
        |--------------------------------------------------------------------------
        */

        const idFrontPath = path.resolve(req.files.idFront[0].path);

        const idBackPath = path.resolve(req.files.idBack[0].path);

        const verification = await prisma.verification.create({

            data: {

                userId,

                idFront: idFrontPath,

                idBack: idBackPath,

                status: "PENDING"

            }

        });

        await prisma.user.update({

            where: {
                id: userId
            },

            data: {
                status: "PENDING_VERIFICATION"
            }

        });

        try {

            await createNotification({

                userId,

                title: "Verification Submitted",

                message:
                    "Your verification documents have been submitted successfully. We will review them shortly.",

                type: "INFO"

            });

        } catch (err) {

            console.error("Notification Error:", err);

        }

        return res.status(201).json({

            success: true,

            message: "Verification submitted successfully.",

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