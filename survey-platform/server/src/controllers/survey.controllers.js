import prisma from "../config/prisma.js";
import { Prisma } from "@prisma/client";



/*
|--------------------------------------------------------------------------
| GET MY SURVEYS
|--------------------------------------------------------------------------
*/

export const getMySurveys = async (req, res) => {

    try {

        /*
        |--------------------------------------------------------------------------
        | Assigned Surveys
        |--------------------------------------------------------------------------
        */

        const assignments = await prisma.surveyAssignment.findMany({

            where: {
                userId: req.user.id
            },

            include: {

                survey: {

                    include: {
                        questions: true
                    }

                }

            },

            orderBy: {
                assignedAt: "desc"
            }

        });

        /*
        |--------------------------------------------------------------------------
        | Coming Soon Surveys
        |--------------------------------------------------------------------------
        */

        const comingSoon = await prisma.survey.findMany({

            where: {
                status: "COMING_SOON"
            },

            include: {
                questions: true
            },

            orderBy: {
                createdAt: "desc"
            }

        });

        /*
        |--------------------------------------------------------------------------
        | Available Surveys
        |--------------------------------------------------------------------------
        */

        const available = assignments.filter(

            assignment =>
                !assignment.completed &&
                assignment.survey.status === "ACTIVE"

        );

        /*
        |--------------------------------------------------------------------------
        | Completed Surveys
        |--------------------------------------------------------------------------
        */

        const completed = assignments.filter(

            assignment => assignment.completed

        );

        /*
        |--------------------------------------------------------------------------
        | Response
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

        console.error("GET MY SURVEYS ERROR");
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
*/

export const getSurvey = async (req, res) => {

    try {

        const assignment = await prisma.surveyAssignment.findFirst({

            where: {

                surveyId: req.params.id,

                userId: req.user.id,

                completed: false

            }

        });

        if (!assignment) {

            return res.status(403).json({

                success: false,

                message: "This survey is not assigned to you or has already been completed."

            });

        }

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

        if (survey.status !== "ACTIVE") {

            return res.status(400).json({

                success: false,

                message: "This survey is no longer active."

            });

        }

        res.json({

            success: true,

            survey

        });

    } catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,

            message: "Server Error"

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

        const { answers } = req.body;

        if (!answers || !Array.isArray(answers) || answers.length === 0) {

            return res.status(400).json({

                success: false,

                message: "Survey answers are required."

            });

        }

        const assignment = await prisma.surveyAssignment.findFirst({

            where: {

                surveyId: req.params.id,

                userId: req.user.id,

                completed: false

            },

            include: {

                survey: true

            }

        });

        if (!assignment) {

            return res.status(403).json({

                success: false,

                message: "Survey not assigned or already completed."

            });

        }

        if (assignment.survey.status !== "ACTIVE") {

            return res.status(400).json({

                success: false,

                message: "This survey is no longer active."

            });

        }

        await prisma.$transaction(async (tx) => {

            const existingResponse = await tx.surveyResponse.findFirst({

                where: {

                    surveyId: req.params.id,

                    userId: req.user.id

                }

            });

            if (existingResponse) {

                throw new Error("Survey already submitted.");

            }

            const response = await tx.surveyResponse.create({

                data: {

                    surveyId: req.params.id,

                    userId: req.user.id,

                    completed: true,

                    rewardPaid: true,

                    submittedAt: new Date()

                }

            });

            for (const item of answers) {

                await tx.surveyAnswer.create({

                    data: {

                        responseId: response.id,

                        questionId: item.questionId,

                        answer: item.answer

                    }

                });

            }

            await tx.surveyAssignment.update({

                where: {

                    id: assignment.id

                },

                data: {

                    completed: true,

                    rewardPaid: true

                }

            });

            const wallet = await tx.wallet.findUnique({

                where: {

                    userId: req.user.id

                }

            });

            if (!wallet) {

                throw new Error("Wallet not found.");

            }

            const reward = new Prisma.Decimal(assignment.survey.reward);

            await tx.wallet.update({

                where: {

                    id: wallet.id

                },

                data: {

                    availableBalance: {

                        increment: reward

                    },

                    totalEarned: {

                        increment: reward

                    }

                }

            });

            await tx.walletTransaction.create({

                data: {

                    walletId: wallet.id,

                    amount: reward,

                    type: "SURVEY_REWARD",

                    description: `Reward for completing "${assignment.survey.title}"`

                }

            });

        });

        res.json({

            success: true,

            message: "Survey submitted successfully. Reward credited."

        });

    } catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,

            message: error.message || "Server Error"

        });

    }

};