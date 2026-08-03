import jwt from "jsonwebtoken";

export default function verifyRefreshToken(token) {

    return jwt.verify(

        token,

        process.env.JWT_REFRESH_SECRET

    );

}