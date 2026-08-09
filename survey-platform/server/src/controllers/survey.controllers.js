
import prisma from "../config/prisma.js";
import { Prisma } from "@prisma/client";


/*
|--------------------------------------------------------------------------
| GET MY SURVEYS
|--------------------------------------------------------------------------
|
| SURVEY DISPLAY LOGIC
|
| 1. Assigned ACTIVE surveys are available.
|
| 2. If the user has no available assigned survey, the first ACTIVE
|    survey that the user has not completed becomes available automatically.
|
| 3. All remaining surveys are shown as Coming Soon.
|
| 4. Once the user completes the available survey, the next survey
|    automatically becomes available.
|
|--------------------------------------------------------------------------
*/


export const getMySurveys = async (req, res) => {

    try {

        const userId = req.user.id;


        /*
        |--------------------------------------------------------------------------
        | GET USER ASSIGNMENTS
        |--------------------------------------------------------------------------
        */

        const assignments =
            await prisma.surveyAssignment.findMany({

                where: {

                    userId

                },

                include: {

                    survey: {

                        include: {

                            questions: {

                                orderBy: {

                                    order: "asc"

                                }

                            }

                        }

                    }

                },

                orderBy: {

                    assignedAt: "desc"

                }

            });


        /*
        |--------------------------------------------------------------------------
        | GET COMPLETED SURVEYS
        |--------------------------------------------------------------------------
        |
        | We use SurveyResponse as the permanent record of completion.
        |
        */

        const completedResponses =
            await prisma.surveyResponse.findMany({

                where: {

                    userId,

                    completed: true

                },

                select: {

                    surveyId: true

                }

            });


        const completedSurveyIds =
            new Set(

                completedResponses.map(
                    response => response.surveyId
                )

            );


        /*
        |--------------------------------------------------------------------------
        | GET ALL ACTIVE SURVEYS
        |--------------------------------------------------------------------------
        |
        | These are ordered oldest-first so the first survey becomes
        | the primary survey.
        |
        */

        const activeSurveys =
            await prisma.survey.findMany({

                where: {

                    status: "ACTIVE"

                },

                include: {

                    questions: {

                        orderBy: {

                            order: "asc"

                        }

                    }

                },

                orderBy: {

                    createdAt: "asc"

                }

            });


        /*
        |--------------------------------------------------------------------------
        | ASSIGNED ACTIVE SURVEYS
        |--------------------------------------------------------------------------
        */

        const assignedAvailable =
            assignments.filter(

                assignment =>

                    !assignment.completed &&

                    assignment.survey.status === "ACTIVE" &&

                    !completedSurveyIds.has(
                        assignment.surveyId
                    )

            );


        /*
        |--------------------------------------------------------------------------
        | AUTOMATIC SURVEY
        |--------------------------------------------------------------------------
        |
        | Find the first ACTIVE survey that:
        |
        | - has not been completed
        | - is not already assigned as available
        |
        */

        const assignedSurveyIds =
            new Set(

                assignedAvailable.map(
                    assignment => assignment.surveyId
                )

            );


        const automaticSurvey =
            activeSurveys.find(

                survey =>

                    !completedSurveyIds.has(
                        survey.id
                    ) &&

                    !assignedSurveyIds.has(
                        survey.id
                    )

            );


        /*
        |--------------------------------------------------------------------------
        | BUILD AVAILABLE LIST
        |--------------------------------------------------------------------------
        */

        let available = [];


        /*
        |--------------------------------------------------------------------------
        | FIRST PRIORITY:
        | ASSIGNED SURVEYS
        |--------------------------------------------------------------------------
        */

        if (assignedAvailable.length > 0) {

            available = assignedAvailable;

        }


        /*
        |--------------------------------------------------------------------------
        | SECOND PRIORITY:
        | AUTOMATIC SURVEY
        |--------------------------------------------------------------------------
        |
        | If there is no assigned survey, automatically expose ONE survey.
        |
        */

        else if (automaticSurvey) {

            available = [

                {

                    id: `auto-${automaticSurvey.id}`,

                    userId,

                    surveyId:
                        automaticSurvey.id,

                    assignedAt:
                        automaticSurvey.createdAt,

                    started: false,

                    completed: false,

                    rewardApproved: false,

                    rewardPaid: false,

                    survey:
                        automaticSurvey,

                    automatic: true

                }

            ];

        }


        /*
        |--------------------------------------------------------------------------
        | AVAILABLE SURVEY IDS
        |--------------------------------------------------------------------------
        */

        const availableSurveyIds =
            new Set(

                available.map(
                    item => item.survey.id
                )

            );


        /*
        |--------------------------------------------------------------------------
        | COMPLETED
        |--------------------------------------------------------------------------
        */

        const completed =
            assignments.filter(

                assignment =>

                    assignment.completed ||

                    completedSurveyIds.has(
                        assignment.surveyId
                    )

            );


        /*
        |--------------------------------------------------------------------------
        | COMING SOON
        |--------------------------------------------------------------------------
        |
        | IMPORTANT:
        |
        | ALL remaining surveys appear here.
        |
        | They do NOT need to have COMING_SOON status.
        |
        | This is what gives you:
        |
        | ACTIVE survey #1 -> Available
        |
        | ACTIVE survey #2 -> Coming Soon
        |
        | ACTIVE survey #3 -> Coming Soon
        |
        | etc.
        |
        */

        const comingSoon =
            activeSurveys.filter(

                survey =>

                    !availableSurveyIds.has(
                        survey.id
                    ) &&

                    !completedSurveyIds.has(
                        survey.id
                    )

            );


        /*
        |--------------------------------------------------------------------------
        | ALSO INCLUDE DATABASE COMING_SOON SURVEYS
        |--------------------------------------------------------------------------
        */

        const databaseComingSoon =
            await prisma.survey.findMany({

                where: {

                    status: "COMING_SOON"

                },

                include: {

                    questions: {

                        orderBy: {

                            order: "asc"

                        }

                    }

                },

                orderBy: {

                    createdAt: "desc"

                }

            });


        /*
        |--------------------------------------------------------------------------
        | MERGE COMING SOON SURVEYS
        |--------------------------------------------------------------------------
        */

        const existingComingSoonIds =
            new Set(

                comingSoon.map(
                    survey => survey.id
                )

            );


        for (
            const survey
            of databaseComingSoon
        ) {

            if (
                !existingComingSoonIds.has(
                    survey.id
                ) &&

                !completedSurveyIds.has(
                    survey.id
                )
            ) {

                comingSoon.push(survey);

            }

        }


        /*
        |--------------------------------------------------------------------------
        | RESPONSE
        |--------------------------------------------------------------------------
        */

        return res.json({

            success: true,

            available,

            completed,

            comingSoon

        });

    }

    catch (error) {

        console.error(
            "GET MY SURVEYS ERROR"
        );

        console.error(error);

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};



/*
|--------------------------------------------------------------------------
| GET SINGLE SURVEY
|--------------------------------------------------------------------------
|
| A user can open:
|
| 1. An assigned ACTIVE survey
| 2. The automatically available ACTIVE survey
|
| Coming Soon surveys cannot be opened.
|
|--------------------------------------------------------------------------
*/


export const getSurvey = async (req, res) => {

    try {

        const userId = req.user.id;

        const surveyId =
            req.params.id;


        /*
        |--------------------------------------------------------------------------
        | GET SURVEY
        |--------------------------------------------------------------------------
        */

        const survey =
            await prisma.survey.findUnique({

                where: {

                    id: surveyId

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

                message:
                    "Survey not found."

            });

        }


        /*
        |--------------------------------------------------------------------------
        | SURVEY MUST BE ACTIVE
        |--------------------------------------------------------------------------
        */

        if (
            survey.status !== "ACTIVE"
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "This survey is coming soon."

            });

        }


        /*
        |--------------------------------------------------------------------------
        | CHECK IF ALREADY COMPLETED
        |--------------------------------------------------------------------------
        */

        const existingResponse =
            await prisma.surveyResponse.findFirst({

                where: {

                    surveyId,

                    userId,

                    completed: true

                }

            });


        if (existingResponse) {

            return res.status(403).json({

                success: false,

                message:
                    "You have already completed this survey."

            });

        }


        /*
        |--------------------------------------------------------------------------
        | CHECK ASSIGNMENT
        |--------------------------------------------------------------------------
        */

        const assignment =
            await prisma.surveyAssignment.findFirst({

                where: {

                    surveyId,

                    userId,

                    completed: false

                }

            });


        /*
        |--------------------------------------------------------------------------
        | IF ASSIGNED -> ALLOW
        |--------------------------------------------------------------------------
        */

        if (assignment) {

            return res.json({

                success: true,

                survey

            });

        }


        /*
        |--------------------------------------------------------------------------
        | AUTOMATIC SURVEY
        |--------------------------------------------------------------------------
        |
        | Determine which ACTIVE survey is currently the user's
        | automatic available survey.
        |
        */

        const activeSurveys =
            await prisma.survey.findMany({

                where: {

                    status: "ACTIVE"

                },

                orderBy: {

                    createdAt: "asc"

                },

                select: {

                    id: true

                }

            });


        /*
        |--------------------------------------------------------------------------
        | FIND FIRST UNCOMPLETED ACTIVE SURVEY
        |--------------------------------------------------------------------------
        */

        const completedSurveys =
            await prisma.surveyResponse.findMany({

                where: {

                    userId,

                    completed: true

                },

                select: {

                    surveyId: true

                }

            });


        const completedIds =
            new Set(

                completedSurveys.map(
                    item => item.surveyId
                )

            );


        const firstAvailable =
            activeSurveys.find(

                item =>
                    !completedIds.has(
                        item.id
                    )

            );


        /*
        |--------------------------------------------------------------------------
        | ONLY THE FIRST AVAILABLE SURVEY CAN BE OPENED
        |--------------------------------------------------------------------------
        */

        if (
            !firstAvailable ||
            firstAvailable.id !== surveyId
        ) {

            return res.status(403).json({

                success: false,

                message:
                    "This survey is coming soon. Complete the available survey first."

            });

        }


        /*
        |--------------------------------------------------------------------------
        | RETURN SURVEY
        |--------------------------------------------------------------------------
        */

        return res.json({

            success: true,

            survey

        });

    }

    catch (error) {

        console.error(
            "GET SINGLE SURVEY ERROR:",
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
| SUBMIT SURVEY
|--------------------------------------------------------------------------
*/

export const submitSurvey = async (req, res) => {

    try {

        const {
            answers
        } = req.body;

        const userId =
            req.user.id;

        const surveyId =
            req.params.id;


        /*
        |--------------------------------------------------------------------------
        | VALIDATE ANSWERS
        |--------------------------------------------------------------------------
        */

        if (
            !answers ||
            !Array.isArray(answers) ||
            answers.length === 0
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Survey answers are required."

            });

        }


        /*
        |--------------------------------------------------------------------------
        | GET SURVEY
        |--------------------------------------------------------------------------
        */

        const survey =
            await prisma.survey.findUnique({

                where: {

                    id: surveyId

                },

                include: {

                    questions: true

                }

            });


        if (!survey) {

            return res.status(404).json({

                success: false,

                message:
                    "Survey not found."

            });

        }


        /*
        |--------------------------------------------------------------------------
        | MUST BE ACTIVE
        |--------------------------------------------------------------------------
        */

        if (
            survey.status !== "ACTIVE"
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "This survey is no longer active."

            });

        }


        /*
        |--------------------------------------------------------------------------
        | PREVENT DUPLICATE SUBMISSION
        |--------------------------------------------------------------------------
        */

        const existingResponse =
            await prisma.surveyResponse.findFirst({

                where: {

                    surveyId,

                    userId

                }

            });


        if (existingResponse) {

            return res.status(400).json({

                success: false,

                message:
                    "Survey already submitted."

            });

        }


        /*
        |--------------------------------------------------------------------------
        | CHECK ASSIGNMENT
        |--------------------------------------------------------------------------
        */

        const assignment =
            await prisma.surveyAssignment.findFirst({

                where: {

                    surveyId,

                    userId,

                    completed: false

                },

                include: {

                    survey: true

                }

            });


        /*
        |--------------------------------------------------------------------------
        | DETERMINE WHETHER USER IS ALLOWED
        |--------------------------------------------------------------------------
        |
        | Either:
        |
        | 1. Survey is assigned
        |
        | OR
        |
        | 2. Survey is the user's current automatic survey.
        |
        */

        let allowed = false;


        if (assignment) {

            allowed = true;

        }


        else {

            /*
            |--------------------------------------------------------------------------
            | FIND FIRST UNCOMPLETED ACTIVE SURVEY
            |--------------------------------------------------------------------------
            */

            const activeSurveys =
                await prisma.survey.findMany({

                    where: {

                        status: "ACTIVE"

                    },

                    orderBy: {

                        createdAt: "asc"

                    },

                    select: {

                        id: true

                    }

                });


            const completedSurveys =
                await prisma.surveyResponse.findMany({

                    where: {

                        userId,

                        completed: true

                    },

                    select: {

                        surveyId: true

                    }

                });


            const completedIds =
                new Set(

                    completedSurveys.map(
                        item => item.surveyId
                    )

                );


            const firstAvailable =
                activeSurveys.find(

                    item =>
                        !completedIds.has(
                            item.id
                        )

                );


            if (
                firstAvailable &&
                firstAvailable.id === surveyId
            ) {

                allowed = true;

            }

        }


        /*
        |--------------------------------------------------------------------------
        | BLOCK COMING SOON SURVEYS
        |--------------------------------------------------------------------------
        */

        if (!allowed) {

            return res.status(403).json({

                success: false,

                message:
                    "This survey is not currently available."

            });

        }


        /*
        |--------------------------------------------------------------------------
        | SUBMIT EVERYTHING IN ONE TRANSACTION
        |--------------------------------------------------------------------------
        */

        await prisma.$transaction(
            async (tx) => {

                /*
                |--------------------------------------------------------------------------
                | CREATE RESPONSE
                |--------------------------------------------------------------------------
                */

                const response =
                    await tx.surveyResponse.create({

                        data: {

                            surveyId,

                            userId,

                            completed: true,

                            rewardPaid: true,

                            submittedAt:
                                new Date()

                        }

                    });


                /*
                |--------------------------------------------------------------------------
                | SAVE ANSWERS
                |--------------------------------------------------------------------------
                */

                for (
                    const item
                    of answers
                ) {

                    await tx.surveyAnswer.create({

                        data: {

                            responseId:
                                response.id,

                            questionId:
                                item.questionId,

                            answer:
                                item.answer

                        }

                    });

                }


                /*
                |--------------------------------------------------------------------------
                | COMPLETE ASSIGNMENT IF ONE EXISTS
                |--------------------------------------------------------------------------
                */

                if (assignment) {

                    await tx.surveyAssignment.update({

                        where: {

                            id:
                                assignment.id

                        },

                        data: {

                            completed:
                                true,

                            completedAt:
                                new Date(),

                            rewardPaid:
                                true,

                            paidAt:
                                new Date()

                        }

                    });

                }


                /*
                |--------------------------------------------------------------------------
                | WALLET
                |--------------------------------------------------------------------------
                */

                const wallet =
                    await tx.wallet.findUnique({

                        where: {

                            userId

                        }

                    });


                if (!wallet) {

                    throw new Error(
                        "Wallet not found."
                    );

                }


                /*
                |--------------------------------------------------------------------------
                | REWARD
                |--------------------------------------------------------------------------
                */

                const reward =
                    new Prisma.Decimal(
                        survey.reward
                    );


                /*
                |--------------------------------------------------------------------------
                | CREDIT USER
                |--------------------------------------------------------------------------
                */

                await tx.wallet.update({

                    where: {

                        id:
                            wallet.id

                    },

                    data: {

                        availableBalance: {

                            increment:
                                reward

                        },

                        totalEarned: {

                            increment:
                                reward

                        }

                    }

                });


                /*
                |--------------------------------------------------------------------------
                | TRANSACTION
                |--------------------------------------------------------------------------
                */

                await tx.walletTransaction.create({

                    data: {

                        walletId:
                            wallet.id,

                        amount:
                            reward,

                        type:
                            "SURVEY_REWARD",

                        status:
                            "SUCCESS",

                        description:
                            `Reward for completing "${survey.title}"`

                    }

                });

            }

        );


        /*
        |--------------------------------------------------------------------------
        | SUCCESS
        |--------------------------------------------------------------------------
        */

        return res.json({

            success: true,

            message:
                "Survey submitted successfully. Reward credited."

        });

    }

    catch (error) {

        console.error(
            "SUBMIT SURVEY ERROR:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                error.message ||
                "Server Error"

        });

    }

};

