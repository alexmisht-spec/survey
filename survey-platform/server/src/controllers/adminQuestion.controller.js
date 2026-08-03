import prisma from "../config/prisma.js";

/*
|--------------------------------------------------------------------------
| ADD QUESTION
|--------------------------------------------------------------------------
*/

export const addQuestion = async (req, res) => {

    try {

        const {

            question,
            questionType,
            options,
            placeholder,
            required,
            order

        } = req.body;

        const survey = await prisma.survey.findUnique({

            where: {

                id: req.params.id

            }

        });

        if (!survey) {

            return res.status(404).json({

                success: false,

                message: "Survey not found."

            });

        }

        const newQuestion = await prisma.surveyQuestion.create({

            data: {

                surveyId: req.params.id,

                question,

                questionType,

                options,

                placeholder,

                required,

                order

            }

        });

        res.status(201).json({

            success: true,

            question: newQuestion

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
| UPDATE QUESTION
|--------------------------------------------------------------------------
*/

export const updateQuestion = async (req, res) => {

    try {

        const question = await prisma.surveyQuestion.update({

            where: {

                id: req.params.questionId

            },

            data: req.body

        });

        res.json({

            success: true,

            question

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
| DELETE QUESTION
|--------------------------------------------------------------------------
*/

export const deleteQuestion = async (req, res) => {

    try {

        await prisma.surveyQuestion.delete({

            where: {

                id: req.params.questionId

            }

        });

        res.json({

            success: true,

            message: "Question deleted."

        });

    } catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,

            message: "Server Error"

        });

    }

};