
import prisma from "../config/prisma.js";

/*
|--------------------------------------------------------------------------
| CREATE SURVEY
|--------------------------------------------------------------------------
*/

export const createSurvey = async (req, res) => {

    try {

        const {
            title,
            description,
            reward,
            timeEstimate,
            status,
            questions
        } = req.body;

        if (!title || !description || !reward) {

            return res.status(400).json({
                success: false,
                message: "Title, description and reward are required."
            });

        }

        if (!questions || !Array.isArray(questions) || questions.length === 0) {

            return res.status(400).json({
                success: false,
                message: "Please add at least one question."
            });

        }

        const surveyStatus = status || "COMING_SOON";

        /*
        |--------------------------------------------------------------------------
        | CREATE SURVEY
        |--------------------------------------------------------------------------
        */

        const survey = await prisma.$transaction(async (tx) => {

            /*
            |--------------------------------------------------------------------------
            | If this survey is being created as ACTIVE,
            | move all other surveys to COMING_SOON.
            |--------------------------------------------------------------------------
            */

            if (surveyStatus === "ACTIVE") {

                await tx.survey.updateMany({

                    where: {
                        status: "ACTIVE"
                    },

                    data: {
                        status: "COMING_SOON"
                    }

                });

            }

            /*
            |--------------------------------------------------------------------------
            | CREATE SURVEY
            |--------------------------------------------------------------------------
            */

            const newSurvey = await tx.survey.create({

                data: {

                    title,

                    description,

                    reward: Number(reward),

                    timeEstimate:
                        Number(timeEstimate) || 10,

                    status: surveyStatus

                }

            });

            /*
            |--------------------------------------------------------------------------
            | CREATE QUESTIONS
            |--------------------------------------------------------------------------
            */

            await tx.surveyQuestion.createMany({

                data: questions.map((question, index) => ({

                    surveyId: newSurvey.id,

                    question: question.question,

                    questionType: question.questionType,

                    placeholder:
                        question.placeholder || null,

                    required:
                        question.required !== false,

                    options:
                        ["RADIO", "CHECKBOX", "SELECT"].includes(
                            question.questionType
                        )
                            ? question.options
                            : null,

                    order: index + 1

                }))

            });

            /*
            |--------------------------------------------------------------------------
            | IF ACTIVE, AUTOMATICALLY ASSIGN TO ALL VERIFIED USERS
            |--------------------------------------------------------------------------
            */

            if (surveyStatus === "ACTIVE") {

                const verifiedUsers =
                    await tx.user.findMany({

                        where: {
                            status: "VERIFIED"
                        },

                        select: {
                            id: true
                        }

                    });

                if (verifiedUsers.length > 0) {

                    await tx.surveyAssignment.createMany({

                        data: verifiedUsers.map(user => ({

                            userId: user.id,

                            surveyId: newSurvey.id

                        })),

                        skipDuplicates: true

                    });

                }

            }

            return newSurvey;

        });

        return res.status(201).json({

            success: true,

            message:
                surveyStatus === "ACTIVE"
                    ? "Survey created, activated and assigned to verified users."
                    : "Survey created successfully.",

            survey

        });

    } catch (error) {

        console.error("CREATE SURVEY ERROR:", error);

        return res.status(500).json({

            success: false,

            message: "Server Error"

        });

    }

};


/*
|--------------------------------------------------------------------------
| GET ALL SURVEYS
|--------------------------------------------------------------------------
*/

export const getAllSurveys = async (req, res) => {

    try {

        const surveys = await prisma.survey.findMany({

            include: {

                questions: true,

                assignments: true

            },

            orderBy: {

                createdAt: "desc"

            }

        });

        return res.json({

            success: true,

            total: surveys.length,

            surveys

        });

    } catch (error) {

        console.error("GET ALL SURVEYS ERROR:", error);

        return res.status(500).json({

            success: false,

            message: "Server Error"

        });

    }

};


/*
|--------------------------------------------------------------------------
| GET SINGLE SURVEY
|--------------------------------------------------------------------------
*/

export const getSurvey = async (req, res) => {

    try {

        const survey = await prisma.survey.findUnique({

            where: {

                id: req.params.id

            },

            include: {

                questions: {

                    orderBy: {

                        order: "asc"

                    }

                }

            }

        });

        if (!survey) {

            return res.status(404).json({

                success: false,

                message: "Survey not found."

            });

        }

        return res.json({

            success: true,

            survey

        });

    } catch (error) {

        console.error("GET SURVEY ERROR:", error);

        return res.status(500).json({

            success: false,

            message: "Server Error"

        });

    }

};


/*
|--------------------------------------------------------------------------
| UPDATE SURVEY
|--------------------------------------------------------------------------
|
| This allows admin to change:
|
| ACTIVE
| COMING_SOON
| LOCKED
| CLOSED
|
| If changed to ACTIVE, users are automatically assigned.
|
|--------------------------------------------------------------------------
*/

export const updateSurvey = async (req, res) => {

    try {

        const {

            title,
            description,
            reward,
            timeEstimate,
            status

        } = req.body;

        const existingSurvey =
            await prisma.survey.findUnique({

                where: {
                    id: req.params.id
                }

            });

        if (!existingSurvey) {

            return res.status(404).json({

                success: false,

                message: "Survey not found."

            });

        }

        const newStatus =
            status || existingSurvey.status;

        const survey =
            await prisma.$transaction(async (tx) => {

                /*
                |--------------------------------------------------------------------------
                | ONLY ONE ACTIVE SURVEY
                |--------------------------------------------------------------------------
                */

                if (
                    newStatus === "ACTIVE" &&
                    existingSurvey.status !== "ACTIVE"
                ) {

                    await tx.survey.updateMany({

                        where: {

                            status: "ACTIVE",

                            id: {
                                not: req.params.id
                            }

                        },

                        data: {

                            status: "COMING_SOON"

                        }

                    });

                }

                /*
                |--------------------------------------------------------------------------
                | UPDATE SURVEY
                |--------------------------------------------------------------------------
                */

                const updatedSurvey =
                    await tx.survey.update({

                        where: {

                            id: req.params.id

                        },

                        data: {

                            ...(title !== undefined && {
                                title
                            }),

                            ...(description !== undefined && {
                                description
                            }),

                            ...(reward !== undefined && {
                                reward: Number(reward)
                            }),

                            ...(timeEstimate !== undefined && {
                                timeEstimate:
                                    Number(timeEstimate)
                            }),

                            status: newStatus

                        }

                    });

                /*
                |--------------------------------------------------------------------------
                | ACTIVATE SURVEY
                |--------------------------------------------------------------------------
                |
                | When admin changes a survey to ACTIVE,
                | automatically assign it to all verified users.
                |
                |--------------------------------------------------------------------------
                */

                if (newStatus === "ACTIVE") {

                    const verifiedUsers =
                        await tx.user.findMany({

                            where: {

                                status: "VERIFIED"

                            },

                            select: {

                                id: true

                            }

                        });

                    if (verifiedUsers.length > 0) {

                        await tx.surveyAssignment.createMany({

                            data: verifiedUsers.map(user => ({

                                userId: user.id,

                                surveyId:
                                    updatedSurvey.id

                            })),

                            skipDuplicates: true

                        });

                    }

                }

                return updatedSurvey;

            });

        return res.json({

            success: true,

            message:
                newStatus === "ACTIVE"
                    ? "Survey activated and assigned to verified users."
                    : newStatus === "COMING_SOON"
                    ? "Survey moved to Coming Soon."
                    : "Survey updated successfully.",

            survey

        });

    } catch (error) {

        console.error("UPDATE SURVEY ERROR:", error);

        return res.status(500).json({

            success: false,

            message: "Server Error"

        });

    }

};


/*
|--------------------------------------------------------------------------
| SET SURVEY STATUS
|--------------------------------------------------------------------------
|
| Dedicated admin endpoint.
|
| Body:
|
| {
|     "status": "ACTIVE"
| }
|
| or
|
| {
|     "status": "COMING_SOON"
| }
|
|--------------------------------------------------------------------------
*/

export const setSurveyStatus = async (req, res) => {

    try {

        const { status } = req.body;

        const allowedStatuses = [

            "ACTIVE",
            "COMING_SOON",
            "LOCKED",
            "CLOSED"

        ];

        if (!allowedStatuses.includes(status)) {

            return res.status(400).json({

                success: false,

                message:
                    "Invalid survey status."

            });

        }

        const survey =
            await prisma.survey.findUnique({

                where: {

                    id: req.params.id

                }

            });

        if (!survey) {

            return res.status(404).json({

                success: false,

                message:
                    "Survey not found."

            });

        }

        const updatedSurvey =
            await prisma.$transaction(async (tx) => {

                /*
                |--------------------------------------------------------------------------
                | IF ACTIVATING
                |--------------------------------------------------------------------------
                */

                if (status === "ACTIVE") {

                    /*
                    |--------------------------------------------------------------
                    | Move current active survey to Coming Soon
                    |--------------------------------------------------------------
                    */

                    await tx.survey.updateMany({

                        where: {

                            status: "ACTIVE",

                            id: {
                                not: survey.id
                            }

                        },

                        data: {

                            status:
                                "COMING_SOON"

                        }

                    });

                }

                /*
                |--------------------------------------------------------------------------
                | UPDATE STATUS
                |--------------------------------------------------------------------------
                */

                const updated =
                    await tx.survey.update({

                        where: {

                            id: survey.id

                        },

                        data: {

                            status

                        }

                    });

                /*
                |--------------------------------------------------------------------------
                | ASSIGN ACTIVE SURVEY
                |--------------------------------------------------------------------------
                */

                if (status === "ACTIVE") {

                    const verifiedUsers =
                        await tx.user.findMany({

                            where: {

                                status:
                                    "VERIFIED"

                            },

                            select: {

                                id: true

                            }

                        });

                    if (verifiedUsers.length > 0) {

                        await tx.surveyAssignment.createMany({

                            data:
                                verifiedUsers.map(
                                    user => ({

                                        userId:
                                            user.id,

                                        surveyId:
                                            survey.id

                                    })
                                ),

                            skipDuplicates: true

                        });

                    }

                }

                return updated;

            });

        return res.json({

            success: true,

            message:
                status === "ACTIVE"
                    ? "Survey activated and assigned to verified users."
                    : status === "COMING_SOON"
                    ? "Survey moved to Coming Soon."
                    : `Survey status changed to ${status}.`,

            survey: updatedSurvey

        });

    } catch (error) {

        console.error(
            "SET SURVEY STATUS ERROR:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Server Error"

        });

    }

};


/*
|--------------------------------------------------------------------------
| ACTIVATE SURVEY
|--------------------------------------------------------------------------
|
| Kept for compatibility with your existing frontend.
|
|--------------------------------------------------------------------------
*/

export const activateSurvey = async (req, res) => {

    try {

        const survey =
            await prisma.survey.findUnique({

                where: {

                    id: req.params.id

                }

            });

        if (!survey) {

            return res.status(404).json({

                success: false,

                message:
                    "Survey not found."

            });

        }

        await prisma.$transaction(async (tx) => {

            /*
            |--------------------------------------------------------------------------
            | MOVE OTHER ACTIVE SURVEYS TO COMING SOON
            |--------------------------------------------------------------------------
            */

            await tx.survey.updateMany({

                where: {

                    status: "ACTIVE",

                    id: {

                        not: survey.id

                    }

                },

                data: {

                    status:
                        "COMING_SOON"

                }

            });

            /*
            |--------------------------------------------------------------------------
            | ACTIVATE SELECTED SURVEY
            |--------------------------------------------------------------------------
            */

            await tx.survey.update({

                where: {

                    id: survey.id

                },

                data: {

                    status:
                        "ACTIVE"

                }

            });

            /*
            |--------------------------------------------------------------------------
            | GET VERIFIED USERS
            |--------------------------------------------------------------------------
            */

            const users =
                await tx.user.findMany({

                    where: {

                        status:
                            "VERIFIED"

                    },

                    select: {

                        id: true

                    }

                });

            /*
            |--------------------------------------------------------------------------
            | ASSIGN SURVEY
            |--------------------------------------------------------------------------
            */

            if (users.length > 0) {

                await tx.surveyAssignment.createMany({

                    data: users.map(user => ({

                        userId:
                            user.id,

                        surveyId:
                            survey.id

                    })),

                    skipDuplicates: true

                });

            }

        });

        return res.json({

            success: true,

            message:
                "Survey activated and assigned to verified users."

        });

    } catch (error) {

        console.error(
            "ACTIVATE SURVEY ERROR:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Server Error"

        });

    }

};


/*
|--------------------------------------------------------------------------
| DELETE SURVEY
|--------------------------------------------------------------------------
*/

export const deleteSurvey = async (req, res) => {

    try {

        await prisma.survey.delete({

            where: {

                id: req.params.id

            }

        });

        return res.json({

            success: true,

            message:
                "Survey deleted."

        });

    } catch (error) {

        console.error(
            "DELETE SURVEY ERROR:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Server Error"

        });

    }

};


/*
|--------------------------------------------------------------------------
| GET SURVEY DETAILS
|--------------------------------------------------------------------------
*/

export const getSurveyDetails = async (req, res) => {

    try {

        const survey =
            await prisma.survey.findUnique({

                where: {

                    id: req.params.id

                },

                include: {

                    questions: {

                        orderBy: {

                            order:
                                "asc"

                        }

                    },

                    assignments: {

                        include: {

                            user: {

                                select: {

                                    firstName:
                                        true,

                                    lastName:
                                        true,

                                    email:
                                        true

                                }

                            }

                        }

                    },

                    responses: {

                        include: {

                            user: {

                                select: {

                                    firstName:
                                        true,

                                    lastName:
                                        true,

                                    email:
                                        true

                                }

                            },

                            answers: {

                                include: {

                                    question:
                                        true

                                }

                            }

                        }

                    }

                }

            });

        if (!survey) {

            return res.status(404).json({

                success: false,

                message:
                    "Survey not found."

            });

        }

        const totalAssigned =
            survey.assignments.length;

        const totalCompleted =
            survey.responses.length;

        const completionRate =
            totalAssigned
                ? (
                    (totalCompleted /
                        totalAssigned) *
                    100
                ).toFixed(1)
                : 0;

        const totalPaid =
            survey.responses.reduce(

                (sum, response) =>

                    response.rewardPaid

                        ? sum +
                          Number(
                              survey.reward
                          )

                        : sum,

                0

            );

        return res.json({

            success: true,

            survey,

            statistics: {

                totalAssigned,

                totalCompleted,

                completionRate,

                totalPaid

            }

        });

    } catch (error) {

        console.error(
            "GET SURVEY DETAILS ERROR:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Server Error"

        });

    }

};

