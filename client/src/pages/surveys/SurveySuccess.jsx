import { FaCheckCircle, FaWallet } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./SurveySuccess.css";

export default function SurveySuccess() {

    const navigate = useNavigate();

    return (

        <div className="success-container">

            <FaCheckCircle className="success-icon" />

            <h1>Survey Completed!</h1>

            <p>

                Thank you for completing the survey.

            </p>

            <div className="reward-card">

                <FaWallet />

                <span>KSh 100 has been credited to your wallet.</span>

            </div>

            <button
                onClick={() => navigate("/dashboard")}
                className="dashboard-btn"
            >
                Return to Dashboard
            </button>

        </div>

    );

}