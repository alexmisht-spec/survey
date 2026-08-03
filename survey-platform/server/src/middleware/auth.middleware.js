import jwt from "jsonwebtoken";
import prisma from "../config/prisma.js";

const authMiddleware = async (req, res, next) => {

    try {

        const authHeader = req.headers.authorization;

        if (!authHeader?.startsWith("Bearer ")) {

            return res.status(401).json({
                success: false,
                code: "NO_TOKEN",
                message: "Authentication required."
            });

        }

        const token = authHeader.split(" ")[1];

        let decoded;

        try {

            decoded = jwt.verify(
                token,
                process.env.JWT_SECRET
            );

        } catch {

            return res.status(401).json({
                success: false,
                code: "TOKEN_EXPIRED",
                message: "Your session has expired."
            });

        }

        const user = await prisma.user.findUnique({

            where: {
                id: decoded.id
            },

            include: {

                verification: {
                    select: {
                        id: true,
                        status: true,
                        reviewedAt: true
                    }
                }

            }

        });

        if (!user) {

            return res.status(401).json({
                success: false,
                code: "USER_NOT_FOUND",
                message: "User account not found."
            });

        }

        req.user = user;

        next();

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal server error."
        });

    }

};

export default authMiddleware;