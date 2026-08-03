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

        if (!questions || questions.length === 0) {

            return res.status(400).json({

                success: false,

                message: "Please add at least one question."

            });

        }
        console.log({
    reward,
    rewardType: typeof reward,
    timeEstimate,
    timeEstimateType: typeof timeEstimate,
});

        const survey = await prisma.$transaction(async (tx) => {

           const newSurvey = await tx.survey.create({
    data: {
        title,
        description,
        reward: Number(reward),
        timeEstimate: Number(timeEstimate),
        status: status || "COMING_SOON"
    }
});

            await tx.surveyQuestion.createMany({

                data: questions.map((question, index) => ({

                    surveyId: newSurvey.id,

                    question: question.question,

                    questionType: question.questionType,

                    placeholder: question.placeholder || null,

                    required: question.required,

                    options:

                        ["RADIO", "CHECKBOX", "SELECT"].includes(

                            question.questionType

                        )

                            ? question.options

                            : null,

                    order: index + 1

                }))

            });

            return newSurvey;

        });

        res.status(201).json({

            success: true,

            message: "Survey created successfully.",

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

        res.json({

            success: true,

            total: surveys.length,

            surveys

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
| UPDATE SURVEY
|--------------------------------------------------------------------------
*/

export const updateSurvey = async (req, res) => {

    try {

        const {

            title,

            description,

            reward,

            status

        } = req.body;

        const survey = await prisma.survey.update({

            where: {

                id: req.params.id

            },

            data: {

                title,

                description,

                reward,

                status

            }

        });

        res.json({

            success: true,

            message: "Survey updated.",

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

        res.json({

            success: true,

            message: "Survey deleted."

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
| ACTIVATE SURVEY
|--------------------------------------------------------------------------
*/

export const activateSurvey = async (req, res) => {

    try {

        await prisma.$transaction(async (tx) => {

            await tx.survey.updateMany({

                data: {

                    status: "COMING_SOON"

                }

            });

            const survey = await tx.survey.update({

                where: {

                    id: req.params.id

                },

                data: {

                    status: "ACTIVE"

                }

            });

            const users = await tx.user.findMany({

                where: {

                    status: "VERIFIED"

                },

                select: {

                    id: true

                }

            });

            for (const user of users) {

                const exists = await tx.surveyAssignment.findUnique({

                    where: {

                        userId_surveyId: {

                            userId: user.id,

                            surveyId: survey.id

                        }

                    }

                });

                if (!exists) {

                    await tx.surveyAssignment.create({

                        data: {

                            userId: user.id,

                            surveyId: survey.id

                        }

                    });

                }

            }

        });

        res.json({

            success: true,

            message: "Survey activated and assigned."

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
| GET SURVEY DETAILS
|--------------------------------------------------------------------------
*/

export const getSurveyDetails = async (req, res) => {

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

                },

                assignments: {

                    include: {

                        user: {

                            select: {

                                firstName: true,

                                lastName: true,

                                email: true

                            }

                        }

                    }

                },

                responses: {

                    include: {

                        user: {

                            select: {

                                firstName: true,

                                lastName: true,

                                email: true

                            }

                        },

                        answers: {

                            include: {

                                question: true

                            }

                        }

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

        const totalAssigned = survey.assignments.length;

        const totalCompleted = survey.responses.length;

        const completionRate = totalAssigned
            ? ((totalCompleted / totalAssigned) * 100).toFixed(1)
            : 0;

        const totalPaid = survey.responses.reduce(

            (sum, response) =>

                response.rewardPaid

                    ? sum + Number(survey.reward)

                    : sum,

            0

        );

        res.json({

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

        console.error(error);

        res.status(500).json({

            success: false,

            message: "Server Error"

        });

    }

};