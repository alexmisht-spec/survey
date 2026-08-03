import jwt from "jsonwebtoken";

export default function generateAccessToken(user) {

    return jwt.sign(

        {

            id: user.id,
            role: user.role,
            status: user.status,

        },

        process.env.JWT_SECRET,

        {

            expiresIn: "15m",

        }

    );

}