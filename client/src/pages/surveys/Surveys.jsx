import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./survey.css"

import {
    getSurvey,
    submitSurvey
} from "../../api/survey.api";

import QuestionRenderer from "./components/QuestionRenderer";

export default function TakeSurvey() {

    const { id } = useParams();

    const [survey, setSurvey] = useState(null);
    const [loading, setLoading] = useState(true);

    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState([]);
    const [submitting, setSubmitting] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {

        async function loadSurvey() {

            try {

                const { data } = await getSurvey(id);

                setSurvey(data.survey);

            } catch (error) {

                console.error(error);

            } finally {

                setLoading(false);

            }

        }

        loadSurvey();

    }, [id]);

    if (loading) return <h2>Loading Survey...</h2>;

    if (!survey) return <h2>Survey not found.</h2>;

    const question = survey.questions[currentQuestion];

    const progress =
        ((currentQuestion + 1) / survey.questions.length) * 100;

   function nextQuestion() {

    const currentAnswer = answers.find(
        (a) => a.questionId === question.id
    );

    if (question.required) {

        const value = currentAnswer?.answer;

        const empty =
            value === undefined ||
            value === null ||
            value === "" ||
            (Array.isArray(value) && value.length === 0);

        if (empty) {

            alert("Please answer this question before continuing.");

            return;

        }

    }

    if (currentQuestion < survey.questions.length - 1) {

        setCurrentQuestion((prev) => prev + 1);

    }

}

    function previousQuestion() {

        if (currentQuestion > 0) {

            setCurrentQuestion((prev) => prev - 1);

        }

    }

    function saveAnswer(questionId, value) {

        if (Array.isArray(value)) {

            value = JSON.stringify(value);

        }

        setAnswers((prev) => {

            const existing = prev.find(
                (answer) => answer.questionId === questionId
            );

            if (existing) {

                return prev.map((answer) =>
                    answer.questionId === questionId
                        ? {
                              ...answer,
                              answer: value,
                          }
                        : answer
                );

            }

            return [
                ...prev,
                {
                    questionId,
                    answer: value,
                },
            ];

        });

    }

   async function handleSubmit() {

    for (const q of survey.questions) {

        if (!q.required) continue;

        const answer = answers.find(
            (a) => a.questionId === q.id
        );

        const value = answer?.answer;

        const empty =
            value === undefined ||
            value === null ||
            value === "" ||
            (Array.isArray(value) && value.length === 0);

        if (empty) {

            alert(`Please answer: "${q.question}"`);

            return;

        }

    }

    try {

        setSubmitting(true);

        await submitSurvey(id, {

            answers

        });

        alert("Survey submitted successfully!");

        navigate("/dashboard");

    }

    catch (error) {

        console.error(error);

        alert(

            error.response?.data?.message ||

            "Failed to submit survey."

        );

    }

    finally {

        setSubmitting(false);

    }

}

    return (

        <div className="survey-container">

           <div className="survey-header">

    <div>

        <h1 className="survey-title">
            {survey.title}
        </h1>

        <p className="survey-description">
            {survey.description}
        </p>

    </div>

    <div className="survey-badges">

        <div className="survey-badge reward">

            <span className="badge-label">
                Reward
            </span>

            <strong>
                KSh {survey.reward}
            </strong>

        </div>

        <div className="survey-badge time">

            <span className="badge-label">
                Estimated Time
            </span>

            <strong>
                {survey.timeEstimate} mins
            </strong>

        </div>

    </div>

</div>

      <div className="survey-progress">

    <div className="progress-header">

        <div>

            <span className="progress-label">
                Progress
            </span>

            <h3>
                Question {currentQuestion + 1} of {survey.questions.length}
            </h3>

        </div>

        <strong>
            {Math.round(progress)}%
        </strong>

    </div>

    <div className="progress-bar">

        <div
            className="progress-fill"
            style={{
                width: `${progress}%`,
            }}
        />

    </div>

</div>

   <div className="question-card">

    <div className="question-header">

        <span className="question-number">
            Question {currentQuestion + 1}
        </span>

        {question.required && (
            <span className="required-badge">
                Required
            </span>
        )}

    </div>

    <h2 className="question-title">
        {question.question}
    </h2>

    <QuestionRenderer
        question={question}
        value={
            answers.find(
                (a) => a.questionId === question.id
            )?.answer
        }
        onChange={(value) =>
            saveAnswer(question.id, value)
        }
    />

    <div className="answer-status">

        {answers.find(
            (a) => a.questionId === question.id
        ) ? (
            <span className="saved-answer">
                ✓ Answer Saved
            </span>
        ) : (
            <span className="pending-answer">
                Waiting for answer...
            </span>
        )}

    </div>

</div>

            <div className="navigation"
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: 40,
                }}
            >

                <button
                className="previous-btn"
                    onClick={previousQuestion}
                    disabled={currentQuestion === 0}
                >
                    Previous
                </button>

                {currentQuestion === survey.questions.length - 1 ? (

                    <button
                        className="submit-btn"
                        onClick={handleSubmit}
                        disabled={submitting}
                    >
                        {submitting
                            ? "Submitting..."
                            : "Submit Survey"}
                    </button>

                ) : (

                    <button onClick={nextQuestion} className="next-btn">
                    
                        Next
                    </button>

                )}

            </div>

        </div>

    );

}