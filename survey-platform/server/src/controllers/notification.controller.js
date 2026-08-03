import prisma from "../config/prisma.js";

/*
|--------------------------------------------------------------------------
| GET USER NOTIFICATIONS
|--------------------------------------------------------------------------
*/

export const getNotifications = async (req, res) => {

    try {

        const notifications = await prisma.notification.findMany({

            where: {

                userId: req.user.id,

            },

            orderBy: {

                createdAt: "desc",

            },

        });

        return res.json({

            success: true,
            notifications,

        });

    }

    catch (error) {

        console.error(error);

        return res.status(500).json({

            success: false,
            message: error.message,

        });

    }

};

/*
|--------------------------------------------------------------------------
| MARK ONE AS READ
|--------------------------------------------------------------------------
*/

export const markAsRead = async (req, res) => {

    try {

        await prisma.notification.update({

            where: {

                id: req.params.id,

            },

            data: {

                read: true,

            },

        });

        return res.json({

            success: true,

        });

    }

    catch (error) {

        console.error(error);

        return res.status(500).json({

            success: false,
            message: error.message,

        });

    }

};

/*
|--------------------------------------------------------------------------
| MARK ALL AS READ
|--------------------------------------------------------------------------
*/

export const markAllAsRead = async (req, res) => {

    try {

        await prisma.notification.updateMany({

            where: {

                userId: req.user.id,
                read: false,

            },

            data: {

                read: true,

            },

        });

        return res.json({

            success: true,

        });

    }

    catch (error) {

        console.error(error);

        return res.status(500).json({

            success: false,
            message: error.message,

        });

    }

};