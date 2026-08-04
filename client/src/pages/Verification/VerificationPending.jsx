import { Link } from "react-router-dom";
import {
    FaCheckCircle,
    FaEnvelope,
    FaClock,
    FaHome,
    FaShieldAlt,
    FaUserCheck,
    FaWallet,
    FaLock,
} from "react-icons/fa";

import "./verificationPending.css";

export default function VerificationPending() {

    return (

        <div className="verification-page">

            <div className="verification-card">

                <div className="verification-icon">

                    <FaCheckCircle />

                </div>

                <h1>Verification Submitted</h1>

                <p className="verification-subtitle">

                    Thank you! Your documents have been received successfully.

                </p>

                <div className="verification-steps">

                    <div className="step">

                        <FaCheckCircle className="step-icon success" />

                        <div>

                            <h3>Documents Received</h3>

                            <p>
Your verification documents have been securely received and are encrypted while stored on our servers.

                            </p>

                        </div>

                    </div>

                    <div className="step">

                        <FaClock className="step-icon pending" />

                        <div>

                            <h3>Review in Progress</h3>

                            <p>

                                Our verification team is reviewing your
                                information. Reviews are typically completed
                                within 24 hours.

                            </p>

                        </div>

                    </div>

                    <div className="step">

                        <FaEnvelope className="step-icon" />

                        <div>

                            <h3>Email Notification</h3>

                            <p>

                                You'll receive an email once your account has
                                been approved or if additional information is
                                required.

                            </p>

                        </div>

                    </div>

                </div>

                <div className="verification-note">

                    <strong>What happens next?</strong>

                    <p>

                        You can return to your dashboard at any time.

                        Surveys will automatically become available once
                        your verification has been approved.

                    </p>

                </div>

                {/* WHY WE VERIFY */}

                <div className="verification-info">

                    <h2>

                        <FaShieldAlt />

                        Why We Verify Every Account

                    </h2>

                    <p>

                        Identity verification helps us maintain a secure,
                        fair and trustworthy survey platform for everyone.

                    </p>

                    <div className="info-grid">

                        <div className="info-card">

                            <FaUserCheck />

                            <h4>Prevent Duplicate Accounts</h4>

                            <p>

                                Each person can participate only once,
                                ensuring fair survey results.

                            </p>

                        </div>

                        <div className="info-card">

                            <FaWallet />

                            <h4>Secure MPESA Payments</h4>

                            <p>

                                Verification protects your earnings and
                                ensures withdrawals reach the correct person.

                            </p>

                        </div>

                        <div className="info-card">

                            <FaLock />

                            <h4>Your Documents Are Protected</h4>

                            <p>

                                Your uploaded documents are used only for
                                identity verification in accordance with
                                our Privacy Policy.

                            </p>

                        </div>

                    </div>

                </div>

                <Link
                    to="/dashboard"
                    className="dashboard-btn"
                >

                    <FaHome />

                    Return to Dashboard

                </Link>

            </div>

        </div>

    );

}