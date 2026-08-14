import prisma from "../config/prisma.js";
import { sendBrevoEmail } from "../../services/brevo.service.js";


/*
|--------------------------------------------------------------------------
| GET USERS FOR EMAIL CAMPAIGNS
|--------------------------------------------------------------------------
|
| Returns ALL users so admins can email:
|
| - VERIFIED users
| - REGISTERED users
| - PENDING_VERIFICATION users
| - REJECTED users
| - Any other user account status
|
*/

export const getEmailUsers = async (req, res) => {

    try {

        const users = await prisma.user.findMany({

            select: {

                id: true,

                firstName: true,

                lastName: true,

                email: true,

                phone: true,

                status: true,

                createdAt: true

            },

            orderBy: {

                createdAt: "desc"

            }

        });

        return res.status(200).json({

            success: true,

            total: users.length,

            users

        });

    } catch (error) {

        console.error(
            "GET EMAIL USERS ERROR:",
            error
        );

        return res.status(500).json({

            success: false,

            message: "Failed to load users for email campaign.",

            error: error.message

        });

    }

};


/*
|--------------------------------------------------------------------------
| GET UNVERIFIED USERS
|--------------------------------------------------------------------------
|
| This endpoint remains separate from the email campaign users.
| It is used for verification/document follow-up.
|
*/

export const getUnverifiedUsers = async (req, res) => {

    try {

        const users = await prisma.user.findMany({

            where: {

                status: {

                    in: [

                        "REGISTERED",

                        "PENDING_VERIFICATION",

                        "REJECTED"

                    ]

                }

            },

            select: {

                id: true,

                firstName: true,

                lastName: true,

                email: true,

                phone: true,

                status: true,

                createdAt: true,

                verification: {

                    select: {

                        status: true,

                        rejectionReason: true,

                        createdAt: true,

                        updatedAt: true

                    }

                }

            },

            orderBy: {

                createdAt: "desc"

            }

        });

        return res.status(200).json({

            success: true,

            total: users.length,

            users

        });

    } catch (error) {

        console.error(
            "GET UNVERIFIED USERS ERROR:",
            error
        );

        return res.status(500).json({

            success: false,

            message: "Failed to load unverified users.",

            error: error.message

        });

    }

};


/*
|--------------------------------------------------------------------------
| GET EMAIL TEMPLATES
|--------------------------------------------------------------------------
*/

export const getEmailTemplates = async (req, res) => {

    try {

        console.log(
            "GET EMAIL TEMPLATES: starting..."
        );


        const templates =
            await prisma.emailTemplate.findMany({

                where: {

                    active: true

                },

                orderBy: {

                    createdAt: "desc"

                }

            });


        console.log(
            "GET EMAIL TEMPLATES: found",
            templates.length,
            "templates"
        );


        return res.status(200).json({

            success: true,

            total: templates.length,

            templates

        });

    } catch (error) {

        console.error(
            "=========================================="
        );

        console.error(
            "GET EMAIL TEMPLATES ERROR"
        );

        console.error(
            "MESSAGE:",
            error.message
        );

        console.error(
            "CODE:",
            error.code
        );

        console.error(
            "META:",
            error.meta
        );

        console.error(
            "STACK:",
            error.stack
        );

        console.error(
            "=========================================="
        );


        return res.status(500).json({

            success: false,

            message: "Failed to load email templates.",

            error: error.message,

            code: error.code || null

        });

    }

};


/*
|--------------------------------------------------------------------------
| CREATE EMAIL TEMPLATE
|--------------------------------------------------------------------------
*/

export const createEmailTemplate = async (req, res) => {

    try {

        const {

            name,

            subject,

            htmlContent,

            type

        } = req.body;


        /*
        |--------------------------------------------------------------------------
        | VALIDATION
        |--------------------------------------------------------------------------
        */

        if (
            !name ||
            typeof name !== "string" ||
            !name.trim()
        ) {

            return res.status(400).json({

                success: false,

                message: "Template name is required."

            });

        }


        if (
            !subject ||
            typeof subject !== "string" ||
            !subject.trim()
        ) {

            return res.status(400).json({

                success: false,

                message: "Email subject is required."

            });

        }


        if (
            !htmlContent ||
            typeof htmlContent !== "string" ||
            !htmlContent.trim()
        ) {

            return res.status(400).json({

                success: false,

                message: "Email content is required."

            });

        }


        /*
        |--------------------------------------------------------------------------
        | VALID TEMPLATE TYPES
        |--------------------------------------------------------------------------
        */

        const allowedTypes = [

            "VERIFICATION_FOLLOWUP",

            "HIGH_PAYING_SURVEY",

            "WELCOME",

            "GENERAL"

        ];


        if (
            type &&
            !allowedTypes.includes(type)
        ) {

            return res.status(400).json({

                success: false,

                message: "Invalid email template type."

            });

        }


        /*
        |--------------------------------------------------------------------------
        | CREATE TEMPLATE
        |--------------------------------------------------------------------------
        */

        const template =
            await prisma.emailTemplate.create({

                data: {

                    name: name.trim(),

                    subject: subject.trim(),

                    htmlContent: htmlContent.trim(),

                    type: type || "GENERAL",

                    active: true

                }

            });


        return res.status(201).json({

            success: true,

            message: "Email template created successfully.",

            template

        });

    } catch (error) {

        console.error(
            "CREATE EMAIL TEMPLATE ERROR:",
            error
        );


        return res.status(500).json({

            success: false,

            message: "Failed to create email template.",

            error: error.message

        });

    }

};


/*
|--------------------------------------------------------------------------
| UPDATE EMAIL TEMPLATE
|--------------------------------------------------------------------------
*/

export const updateEmailTemplate = async (req, res) => {

    try {

        const { id } = req.params;


        const {

            name,

            subject,

            htmlContent,

            type,

            active

        } = req.body;


        /*
        |--------------------------------------------------------------------------
        | CHECK TEMPLATE
        |--------------------------------------------------------------------------
        */

        const existingTemplate =
            await prisma.emailTemplate.findUnique({

                where: {

                    id

                }

            });


        if (!existingTemplate) {

            return res.status(404).json({

                success: false,

                message: "Email template not found."

            });

        }


        /*
        |--------------------------------------------------------------------------
        | VALIDATE TEMPLATE TYPE
        |--------------------------------------------------------------------------
        */

        const allowedTypes = [

            "VERIFICATION_FOLLOWUP",

            "HIGH_PAYING_SURVEY",

            "WELCOME",

            "GENERAL"

        ];


        if (
            type &&
            !allowedTypes.includes(type)
        ) {

            return res.status(400).json({

                success: false,

                message: "Invalid email template type."

            });

        }


        /*
        |--------------------------------------------------------------------------
        | BUILD UPDATE DATA
        |--------------------------------------------------------------------------
        */

        const data = {};


        if (name !== undefined) {

            if (
                typeof name !== "string" ||
                !name.trim()
            ) {

                return res.status(400).json({

                    success: false,

                    message: "Template name cannot be empty."

                });

            }

            data.name = name.trim();

        }


        if (subject !== undefined) {

            if (
                typeof subject !== "string" ||
                !subject.trim()
            ) {

                return res.status(400).json({

                    success: false,

                    message: "Email subject cannot be empty."

                });

            }

            data.subject = subject.trim();

        }


        if (htmlContent !== undefined) {

            if (
                typeof htmlContent !== "string" ||
                !htmlContent.trim()
            ) {

                return res.status(400).json({

                    success: false,

                    message: "Email content cannot be empty."

                });

            }

            data.htmlContent = htmlContent.trim();

        }


        if (type !== undefined) {

            data.type = type;

        }


        if (active !== undefined) {

            data.active = Boolean(active);

        }


        /*
        |--------------------------------------------------------------------------
        | UPDATE TEMPLATE
        |--------------------------------------------------------------------------
        */

        const template =
            await prisma.emailTemplate.update({

                where: {

                    id

                },

                data

            });


        return res.status(200).json({

            success: true,

            message: "Email template updated successfully.",

            template

        });

    } catch (error) {

        console.error(
            "UPDATE EMAIL TEMPLATE ERROR:",
            error
        );


        return res.status(500).json({

            success: false,

            message: "Failed to update email template.",

            error: error.message

        });

    }

};


/*
|--------------------------------------------------------------------------
| DELETE EMAIL TEMPLATE
|--------------------------------------------------------------------------
|
| We deactivate the template rather than physically deleting it because
| EmailLog records may still reference it.
|
*/

export const deleteEmailTemplate = async (req, res) => {

    try {

        const { id } = req.params;


        /*
        |--------------------------------------------------------------------------
        | CHECK TEMPLATE
        |--------------------------------------------------------------------------
        */

        const template =
            await prisma.emailTemplate.findUnique({

                where: {

                    id

                }

            });


        if (!template) {

            return res.status(404).json({

                success: false,

                message: "Email template not found."

            });

        }


        /*
        |--------------------------------------------------------------------------
        | DEACTIVATE
        |--------------------------------------------------------------------------
        */

        await prisma.emailTemplate.update({

            where: {

                id

            },

            data: {

                active: false

            }

        });


        return res.status(200).json({

            success: true,

            message: "Email template deactivated successfully."

        });

    } catch (error) {

        console.error(
            "DELETE EMAIL TEMPLATE ERROR:",
            error
        );


        return res.status(500).json({

            success: false,

            message: "Failed to delete email template.",

            error: error.message

        });

    }

};


/*
|--------------------------------------------------------------------------
| SEND EMAIL TO USER
|--------------------------------------------------------------------------
|
| Admin can send emails to ANY user regardless of account status.
|
*/

export const sendAdminEmail = async (req, res) => {

    try {

        const {

            userId,

            templateId

        } = req.body;


        /*
        |--------------------------------------------------------------------------
        | VALIDATION
        |--------------------------------------------------------------------------
        */

        if (!userId) {

            return res.status(400).json({

                success: false,

                message: "User ID is required."

            });

        }


        if (!templateId) {

            return res.status(400).json({

                success: false,

                message: "Email template is required."

            });

        }


        /*
        |--------------------------------------------------------------------------
        | GET USER
        |--------------------------------------------------------------------------
        */

        const user =
            await prisma.user.findUnique({

                where: {

                    id: userId

                }

            });


        if (!user) {

            return res.status(404).json({

                success: false,

                message: "User not found."

            });

        }


        /*
        |--------------------------------------------------------------------------
        | CHECK EMAIL ADDRESS
        |--------------------------------------------------------------------------
        */

        if (
            !user.email ||
            typeof user.email !== "string" ||
            !user.email.trim()
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "This user does not have a valid email address."

            });

        }


        /*
        |--------------------------------------------------------------------------
        | GET TEMPLATE
        |--------------------------------------------------------------------------
        */

        const template =
            await prisma.emailTemplate.findUnique({

                where: {

                    id: templateId

                }

            });


        if (!template) {

            return res.status(404).json({

                success: false,

                message: "Email template not found."

            });

        }


        /*
        |--------------------------------------------------------------------------
        | CHECK TEMPLATE STATUS
        |--------------------------------------------------------------------------
        */

        if (!template.active) {

            return res.status(400).json({

                success: false,

                message: "This email template is inactive."

            });

        }


        /*
        |--------------------------------------------------------------------------
        | PERSONALIZATION
        |--------------------------------------------------------------------------
        */

        const fullName =
            `${user.firstName || ""} ${user.lastName || ""}`
                .trim();


        let htmlContent =
            template.htmlContent;


        htmlContent = htmlContent

            .replaceAll(
                "{{firstName}}",
                user.firstName || ""
            )

            .replaceAll(
                "{{lastName}}",
                user.lastName || ""
            )

            .replaceAll(
                "{{fullName}}",
                fullName
            )

            .replaceAll(
                "{{email}}",
                user.email || ""
            );


        let subject =
            template.subject;


        subject = subject

            .replaceAll(
                "{{firstName}}",
                user.firstName || ""
            )

            .replaceAll(
                "{{lastName}}",
                user.lastName || ""
            )

            .replaceAll(
                "{{fullName}}",
                fullName
            )

            .replaceAll(
                "{{email}}",
                user.email || ""
            );


        /*
        |--------------------------------------------------------------------------
        | SEND THROUGH BREVO
        |--------------------------------------------------------------------------
        */

        try {

            await sendBrevoEmail({

                to: user.email.trim(),

                subject,

                htmlContent

            });


            /*
            |--------------------------------------------------------------------------
            | LOG SUCCESS
            |--------------------------------------------------------------------------
            */

            const emailLog =
                await prisma.emailLog.create({

                    data: {

                        userId: user.id,

                        templateId: template.id,

                        email: user.email.trim(),

                        subject,

                        status: "SENT"

                    }

                });


            return res.status(200).json({

                success: true,

                message: "Email sent successfully.",

                log: emailLog

            });

        } catch (brevoError) {

            console.error(
                "BREVO SEND ERROR:",
                brevoError.response?.data ||
                brevoError.message
            );


            /*
            |--------------------------------------------------------------------------
            | LOG FAILED EMAIL
            |--------------------------------------------------------------------------
            */

            try {

                await prisma.emailLog.create({

                    data: {

                        userId: user.id,

                        templateId: template.id,

                        email: user.email.trim(),

                        subject,

                        status: "FAILED",

                        errorMessage:
                            brevoError.response?.data?.message ||
                            brevoError.message ||
                            "Brevo email failed."

                    }

                });

            } catch (logError) {

                console.error(
                    "EMAIL LOG ERROR:",
                    logError
                );

            }


            return res.status(502).json({

                success: false,

                message: "Email could not be sent.",

                error:
                    brevoError.response?.data?.message ||
                    brevoError.message ||
                    "Brevo email failed."

            });

        }

    } catch (error) {

        console.error(
            "SEND ADMIN EMAIL ERROR:",
            error
        );


        return res.status(500).json({

            success: false,

            message: "Failed to send email.",

            error: error.message

        });

    }

};