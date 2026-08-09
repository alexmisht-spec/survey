
import { useNavigate } from "react-router-dom";
import "./SurveyCard.css";

export default function SurveyCard({
    survey,
    verified,
    verificationStatus,
}) {

    const navigate = useNavigate();

    /*
    |--------------------------------------------------------------------------
    | EMPTY SURVEY
    |--------------------------------------------------------------------------
    */

    if (!survey) {

        return (

            <div className="survey-card empty">

                <h2>No Surveys Available</h2>

                <p>
                    New surveys will appear here once published.
                </p>

            </div>

        );

    }

    /*
    |--------------------------------------------------------------------------
    | COMING SOON
    |--------------------------------------------------------------------------
    |
    | A survey is Coming Soon when:
    |
    | - Its status is not ACTIVE
    | - OR preview is explicitly true
    |
    */

    const isComingSoon =
        survey.status !== "ACTIVE" ||
        survey.preview === true;


    /*
    |--------------------------------------------------------------------------
    | ACTION BUTTON
    |--------------------------------------------------------------------------
    */

    function renderAction() {

        /*
        |----------------------------------------------------------------------
        | COMING SOON
        |----------------------------------------------------------------------
        */

        if (isComingSoon) {

            return (

                <button
                    type="button"
                    className="coming-soon-btn"
                    disabled
                >
                    🚀 Coming Soon
                </button>

            );

        }


        /*
        |----------------------------------------------------------------------
        | USER HAS NOT SUBMITTED VERIFICATION
        |----------------------------------------------------------------------
        */

        if (verificationStatus === "NOT_SUBMITTED") {

            return (

                <button
                    type="button"
                    className="locked-btn"
                    disabled
                >
                    🔒 Complete Verification
                </button>

            );

        }


        /*
        |----------------------------------------------------------------------
        | VERIFICATION PENDING
        |----------------------------------------------------------------------
        */

        if (verificationStatus === "PENDING") {

            return (

                <button
                    type="button"
                    className="locked-btn pending"
                    disabled
                >
                    ⏳ Verification Pending
                </button>

            );

        }


        /*
        |----------------------------------------------------------------------
        | VERIFICATION REJECTED
        |----------------------------------------------------------------------
        */

        if (verificationStatus === "REJECTED") {

            return (

                <button
                    type="button"
                    className="locked-btn rejected"
                    disabled
                >
                    ❌ Upload Documents Again
                </button>

            );

        }


        /*
        |----------------------------------------------------------------------
        | EXTRA SECURITY CHECK
        |----------------------------------------------------------------------
        */

        if (!verified) {

            return (

                <button
                    type="button"
                    className="locked-btn"
                    disabled
                >
                    🔒 Locked
                </button>

            );

        }


        /*
        |----------------------------------------------------------------------
        | ACTIVE SURVEY
        |----------------------------------------------------------------------
        */

        return (

            <button
                type="button"
                className="start-btn"
                onClick={() =>
                    navigate(`/surveys/${survey.id}`)
                }
            >
                Start Survey
            </button>

        );

    }


    /*
    |--------------------------------------------------------------------------
    | CARD
    |--------------------------------------------------------------------------
    */

    return (

        <div
            className={`survey-card ${
                isComingSoon ? "coming-soon" : ""
            }`}
        >

            {/* 
            |--------------------------------------------------------------------------
            | HEADER
            |--------------------------------------------------------------------------
            */}

            <div className="survey-header">

                <span
                    className={`badge ${
                        isComingSoon
                            ? "coming-badge"
                            : ""
                    }`}
                >

                    {isComingSoon
                        ? "Coming Soon"
                        : "Available Survey"}

                </span>

                <h2>
                    {survey.title}
                </h2>

            </div>


            {/*
            |--------------------------------------------------------------------------
            | DESCRIPTION
            |--------------------------------------------------------------------------
            */}

            {survey.description && (

                <div className="survey-description">

                    <p>
                        {survey.description}
                    </p>

                </div>

            )}


            {/*
            |--------------------------------------------------------------------------
            | SURVEY DETAILS
            |--------------------------------------------------------------------------
            */}

            <div className="survey-details">

                <div>

                    <strong>
                        Reward
                    </strong>

                    <p>
                        KSh {survey.reward}
                    </p>

                </div>


                <div>

                    <strong>
                        Estimated Time
                    </strong>

                    <p>
                        {survey.timeEstimate} Minutes
                    </p>

                </div>


                <div>

                    <strong>
                        Questions
                    </strong>

                    <p>
                        {survey.questions?.length ?? 0}
                    </p>

                </div>

            </div>


            {/*
            |--------------------------------------------------------------------------
            | COMING SOON MESSAGE
            |--------------------------------------------------------------------------
            */}

            {isComingSoon && (

                <div className="coming-text">

                    <strong>
                        🚀 This survey is coming soon
                    </strong>

                    <p>
                        The survey is currently being prepared.
                        You can view all its details now, and the
                        Start Survey button will become available
                        once the survey is activated.
                    </p>

                </div>

            )}


            {/*
            |--------------------------------------------------------------------------
            | ACTION
            |--------------------------------------------------------------------------
            */}

            <div className="survey-action">

                {renderAction()}

            </div>

        </div>

    );

}

