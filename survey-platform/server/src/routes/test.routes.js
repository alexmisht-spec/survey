import { Router } from "express";
import prisma from "../config/prisma.js";

const router = Router();

router.get("/", async (req, res) => {

    try {

        await prisma.$queryRaw`SELECT NOW()`;

        res.json({
            success: true,
            message: "Connected to Neon PostgreSQL 🚀"
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Database connection failed"
        });

    }

});

export default router;