import { useNavigate } from "react-router-dom";
import "./CompleteProfile.css";

export default function CompleteProfile() {

    const navigate = useNavigate();

    return (

        <div className="complete-profile-page">

            <div className="complete-profile-card">

                <h1>Complete Your Verification</h1>

                <p>
                    Before you can access paid surveys and withdraw your earnings,
                    please verify your identity.
                </p>

                <div className="benefits">

                    <div className="benefit">
                        Participate in paid surveys
                    </div>

                    <div className="benefit">
                        Earn survey rewards
                    </div>

                    <div className="benefit">
                        Withdraw your earnings
                    </div>

                </div>

                <button
                    className="complete-btn"
                    onClick={() => navigate("/upload-verification")}
                >
                    Complete Verification
                </button>

                <button
                    className="skip-btn"
                    onClick={() => navigate("/dashboard")}
                >
                    Skip for Now
                </button>

            </div>

        </div>

    );

}