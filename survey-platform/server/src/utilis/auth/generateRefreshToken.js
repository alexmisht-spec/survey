import jwt from "jsonwebtoken";

export default function generateRefreshToken(user) {

    return jwt.sign(

        {

            id: user.id,

        },

        process.env.JWT_REFRESH_SECRET,

        {

            expiresIn: "7d",

        }

    );

}