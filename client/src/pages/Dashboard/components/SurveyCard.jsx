import { useNavigate } from "react-router-dom";
import "./SurveyCard.css";

export default function SurveyCard({
    survey,
    verified,
    verificationStatus,
}) {

    const navigate = useNavigate();

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

    const isComingSoon =
        survey.status !== "ACTIVE" || survey.preview === true;

    function renderAction() {

        // Coming Soon survey
        if (isComingSoon) {

            return (

                <button
                    className="coming-soon-btn"
                    disabled
                >
                    🚀 Coming Soon
                </button>

            );

        }

        // User hasn't uploaded KYC
        if (verificationStatus === "NOT_SUBMITTED") {

            return (

                <button
                    className="locked-btn"
                    disabled
                >
                    🔒 Complete Verification
                </button>

            );

        }

        // Waiting approval
        if (verificationStatus === "PENDING") {

            return (

                <button
                    className="locked-btn pending"
                    disabled
                >
                    ⏳ Verification Pending
                </button>

            );

        }

        // Rejected
        if (verificationStatus === "REJECTED") {

            return (

                <button
                    className="locked-btn rejected"
                    disabled
                >
                    ❌ Upload Documents Again
                </button>

            );

        }

        // Extra safety
        if (!verified) {

            return (

                <button
                    className="locked-btn"
                    disabled
                >
                    🔒 Locked
                </button>

            );

        }

        return (

            <button
                className="start-btn"
                onClick={() => navigate(`/surveys/${survey.id}`)}
            >
                Start Survey
            </button>

        );

    }

    return (

        <div className={`survey-card ${isComingSoon ? "coming-soon" : ""}`}>

            {isComingSoon && (

                <div className="coming-overlay">

                    <span>COMING SOON</span>

                </div>

            )}

            <div className="survey-header">

                <span
                    className={`badge ${
                        isComingSoon ? "coming-badge" : ""
                    }`}
                >

                    {isComingSoon
                        ? "Coming Soon"
                        : "Available Survey"}

                </span>

                <h2>{survey.title}</h2>

            </div>

            <div className="survey-details">

                <div>

                    <strong>Reward</strong>

                    <p>KSh {survey.reward}</p>

                </div>

                <div>

                    <strong>Estimated Time</strong>

                    <p>{survey.timeEstimate} Minutes</p>

                </div>

                <div>

                    <strong>Questions</strong>

                    <p>{survey.questions?.length ?? 0}</p>

                </div>

            </div>

            {isComingSoon && (

                <p className="coming-text">

                    This survey isn't available yet.

                    It will become available once activated by the administrator.

                </p>

            )}

            {renderAction()}

        </div>

    );

}