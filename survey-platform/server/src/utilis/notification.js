import prisma from "../config/prisma.js";

/*
|--------------------------------------------------------------------------
| CREATE NOTIFICATION
|--------------------------------------------------------------------------
*/

export async function createNotification({
    userId,
    title,
    message,
    type = "INFO",
}) {

    return await prisma.notification.create({

        data: {

            userId,
            title,
            message,
            type,

        },

    });

}