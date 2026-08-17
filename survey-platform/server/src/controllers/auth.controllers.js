import bcrypt from "bcrypt";
import prisma from "../config/prisma.js";
import generateAccessToken from "../utilis/auth/generateAccessToken.js";
import generateRefreshToken from "../utilis/auth/generateRefreshToken.js";
import verifyRefreshToken from "../utilis/auth/verifyRefreshToken.js";


/*
|--------------------------------------------------------------------------
| GENERATE UNIQUE REFERRAL CODE
|--------------------------------------------------------------------------
*/

async function generateReferralCode() {

    const characters =
        "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

    let code;

    let exists = true;

    while (exists) {

        let randomPart = "";

        for (let i = 0; i < 6; i++) {

            randomPart +=
                characters[
                    Math.floor(
                        Math.random() * characters.length
                    )
                ];

        }

        code = `SP-${randomPart}`;

        const existing =
            await prisma.user.findUnique({

                where: {
                    referralCode: code
                },

                select: {
                    id: true
                }

            });

        exists = !!existing;

    }

    return code;

}


/*
|--------------------------------------------------------------------------
| REGISTER
|--------------------------------------------------------------------------
*/

export const register = async (req, res) => {

    console.log("===== REGISTER REQUEST =====");
    console.log(req.body);
    console.log("============================");

    try {

        const {
            firstName,
            lastName,
            email,
            phone,
            password,
            referralCode
        } = req.body;


        /*
        |--------------------------------------------------------------------------
        | VALIDATION
        |--------------------------------------------------------------------------
        */

        if (
            !firstName ||
            !lastName ||
            !email ||
            !phone ||
            !password
        ) {

            return res.status(400).json({

                success: false,

                message: "All fields are required."

            });

        }


        /*
        |--------------------------------------------------------------------------
        | CHECK EMAIL
        |--------------------------------------------------------------------------
        */

        const existingEmail =
            await prisma.user.findUnique({

                where: {
                    email
                }

            });


        if (existingEmail) {

            return res.status(409).json({

                success: false,

                message: "Email already exists."

            });

        }


        /*
        |--------------------------------------------------------------------------
        | CHECK PHONE
        |--------------------------------------------------------------------------
        */

        const existingPhone =
            await prisma.user.findUnique({

                where: {
                    phone
                }

            });


        if (existingPhone) {

            return res.status(409).json({

                success: false,

                message: "Phone number already exists."

            });

        }


        /*
        |--------------------------------------------------------------------------
        | GENERATE USER REFERRAL CODE
        |--------------------------------------------------------------------------
        */

        const newReferralCode =
            await generateReferralCode();


        /*
        |--------------------------------------------------------------------------
        | FIND REFERRER
        |--------------------------------------------------------------------------
        */

        let referrer = null;


        if (
            referralCode &&
            typeof referralCode === "string"
        ) {

            const cleanReferralCode =
                referralCode.trim().toUpperCase();


            referrer =
                await prisma.user.findUnique({

                    where: {

                        referralCode:
                            cleanReferralCode

                    },

                    select: {

                        id: true,

                        referralCode: true

                    }

                });


            /*
            |--------------------------------------------------------------------------
            | INVALID REFERRAL CODE
            |--------------------------------------------------------------------------
            |
            | We don't reject registration if somebody enters
            | an invalid referral code.
            |
            */

            if (!referrer) {

                console.log(
                    "Invalid referral code:",
                    cleanReferralCode
                );

            }

        }


        /*
        |--------------------------------------------------------------------------
        | HASH PASSWORD
        |--------------------------------------------------------------------------
        */

        const hashedPassword =
            await bcrypt.hash(password, 10);


        /*
        |--------------------------------------------------------------------------
        | CREATE USER
        |--------------------------------------------------------------------------
        */

        const user =
            await prisma.user.create({

                data: {

                    firstName,

                    lastName,

                    email,

                    phone,

                    password: hashedPassword,

                    referralCode: newReferralCode,

                    referredById:
                        referrer?.id || null,

                    wallet: {

                        create: {

                            availableBalance: 0,

                            pendingBalance: 0,

                            totalEarned: 0

                        }

                    }

                },

                include: {

                    wallet: true

                }

            });


        /*
        |--------------------------------------------------------------------------
        | CREATE REFERRAL RECORD
        |--------------------------------------------------------------------------
        */

        if (referrer) {

            try {

                await prisma.referral.create({

                    data: {

                        referrerId:
                            referrer.id,

                        referredId:
                            user.id,

                        reward: 50,

                        status: "PENDING"

                    }

                });


                console.log(
                    `Referral created: ${referrer.id} -> ${user.id}`
                );

            } catch (referralError) {

                /*
                |--------------------------------------------------------------------------
                | REFERRAL FAILURE SHOULD NOT BREAK REGISTRATION
                |--------------------------------------------------------------------------
                */

                console.error(
                    "REFERRAL CREATION ERROR:",
                    referralError
                );

            }

        }


        /*
        |--------------------------------------------------------------------------
        | GENERATE TOKENS
        |--------------------------------------------------------------------------
        */

        const accessToken =
            generateAccessToken(user);

        const refreshToken =
            generateRefreshToken(user);


        /*
        |--------------------------------------------------------------------------
        | STORE REFRESH TOKEN
        |--------------------------------------------------------------------------
        */

        res.cookie(
            "refreshToken",
            refreshToken,
            {

                httpOnly: true,

                secure:
                    process.env.NODE_ENV === "production",

                sameSite: "lax",

                maxAge:
                    7 * 24 * 60 * 60 * 1000

            }
        );


        /*
        |--------------------------------------------------------------------------
        | RESPONSE
        |--------------------------------------------------------------------------
        */

        return res.status(201).json({

            success: true,

            message:
                "Account created successfully.",

            accessToken,

            user: {

                id: user.id,

                firstName: user.firstName,

                lastName: user.lastName,

                email: user.email,

                phone: user.phone,

                role: user.role,

                status: user.status,

                referralCode:
                    user.referralCode,

                referredBy:
                    referrer
                        ? true
                        : false,

                profileCompleted: false,

                verificationStatus:
                    "NOT_SUBMITTED",

                paymentMethod: null,

                mpesaNumber: null

            }

        });

    } catch (error) {

        console.error(
            "REGISTER ERROR:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Internal Server Error"

        });

    }

};


/*
|--------------------------------------------------------------------------
| LOGIN
|--------------------------------------------------------------------------
*/

export const login = async (req, res) => {

    try {

        const {
            email,
            password
        } = req.body;


        if (
            !email ||
            !password
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Email and password are required."

            });

        }


        const user =
            await prisma.user.findUnique({

                where: {
                    email
                },

                include: {

                    verification: true,

                    wallet: true

                }

            });


        if (!user) {

            return res.status(401).json({

                success: false,

                message:
                    "Invalid email or password."

            });

        }


        const passwordMatch =
            await bcrypt.compare(

                password,

                user.password

            );


        if (!passwordMatch) {

            return res.status(401).json({

                success: false,

                message:
                    "Invalid email or password."

            });

        }


        /*
        |--------------------------------------------------------------------------
        | GENERATE TOKENS
        |--------------------------------------------------------------------------
        */

        const accessToken =
            generateAccessToken(user);

        const refreshToken =
            generateRefreshToken(user);


        /*
        |--------------------------------------------------------------------------
        | REFRESH TOKEN COOKIE
        |--------------------------------------------------------------------------
        */

        res.cookie(
            "refreshToken",
            refreshToken,
            {

                httpOnly: true,

                secure:
                    process.env.NODE_ENV === "production",

                sameSite: "lax",

                maxAge:
                    7 * 24 * 60 * 60 * 1000

            }
        );


        return res.status(200).json({

            success: true,

            message:
                "Login successful.",

            accessToken,

            user: {

                id: user.id,

                firstName: user.firstName,

                lastName: user.lastName,

                email: user.email,

                phone: user.phone,

                role: user.role,

                status: user.status,

                referralCode:
                    user.referralCode,

                profileCompleted:
                    !!user.verification,

                verificationStatus:
                    user.verification
                        ? user.verification.status
                        : "NOT_SUBMITTED"

            }

        });

    }

    catch (error) {

        console.error(error);

        return res.status(500).json({

            success: false,

            message:
                "Internal Server Error"

        });

    }

};


/*
|--------------------------------------------------------------------------
| LOGOUT
|--------------------------------------------------------------------------
*/

export const logout = async (req, res) => {

    res.clearCookie(
        "refreshToken",
        {

            httpOnly: true,

            secure:
                process.env.NODE_ENV === "production",

            sameSite: "lax"

        }
    );


    return res.json({

        success: true,

        message:
            "Logged out successfully."

    });

};


/*
|--------------------------------------------------------------------------
| CURRENT USER
|--------------------------------------------------------------------------
*/

export const me = async (req, res) => {

    try {

        const user =
            await prisma.user.findUnique({

                where: {

                    id: req.user.id

                },

                include: {

                    verification: true

                }

            });


        if (!user) {

            return res.status(404).json({

                success: false,

                message:
                    "User not found"

            });

        }


        return res.status(200).json({

            success: true,

            user: {

                id: user.id,

                firstName: user.firstName,

                lastName: user.lastName,

                email: user.email,

                phone: user.phone,

                role: user.role,

                status: user.status,

                referralCode:
                    user.referralCode,

                profileCompleted:
                    !!user.verification,

                verificationStatus:
                    user.verification
                        ? user.verification.status
                        : "NOT_SUBMITTED",

                mpesaNumber:
                    user.verification?.mpesaNumber ||
                    null,

                paymentMethod:
                    user.verification?.paymentMethod ||
                    null

            }

        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({

            success: false,

            message:
                "Server Error"

        });

    }

};


/*
|--------------------------------------------------------------------------
| REFRESH TOKEN
|--------------------------------------------------------------------------
*/

export const refresh = async (req, res) => {

    try {

        const refreshToken =
            req.cookies.refreshToken;


        if (!refreshToken) {

            return res.status(401).json({

                success: false,

                message:
                    "No refresh token."

            });

        }


        const decoded =
            verifyRefreshToken(
                refreshToken
            );


        const user =
            await prisma.user.findUnique({

                where: {

                    id: decoded.id

                }

            });


        if (!user) {

            return res.status(401).json({

                success: false,

                message:
                    "User not found."

            });

        }


        const accessToken =
            generateAccessToken(user);


        return res.json({

            success: true,

            accessToken

        });

    }

    catch (error) {

        return res.status(401).json({

            success: false,

            message:
                "Refresh token expired."

        });

    }

};