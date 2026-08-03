import prisma from "../config/prisma.js";

async function main() {

    const email = "nimrodomangah@gmail.com";

    const admin = await prisma.user.update({

        where: {
            email
        },

        data: {
            role: "ADMIN"
        }

    });

    console.log("Admin created:");
    console.log(admin);

}

main()
    .catch(console.error)
    .finally(async () => {
        await prisma.$disconnect();
    });