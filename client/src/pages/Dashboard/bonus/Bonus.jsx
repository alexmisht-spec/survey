import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    FaGift,
    FaArrowRight,
    FaUserFriends,
    FaMobileAlt,
    FaLock,
    FaTimes
} from "react-icons/fa";

import "./Bonus.css";

export default function Bonus() {

    const navigate = useNavigate();
    const [showInstructions, setShowInstructions] = useState(false);

    return (
        <div className="bonus-page">

            <div className="bonus-header">
                <h1>Bonus Tasks</h1>

                <p>
                    Complete bonus tasks and earn extra rewards.
                    New opportunities are added regularly.
                </p>
            </div>


            {/* ACTIVE TASK — EVERYTRY */}
            <div className="bonus-card">

                <div className="bonus-icon">
                    <FaGift />
                </div>

                <div className="bonus-content">

                    <h2>Link Your EveryTry Account</h2>

                    <p className="bonus-description">

                        Complete the steps below to qualify for the
                        <strong> KSh 100 welcome reward.</strong>

                        Once your account has been reviewed and approved,
                        the reward will be added to your pending balance.

                    </p>

                    <div className="bonus-meta">

                        <span>
                            Reward
                            <strong>KSh 100</strong>
                        </span>

                        <span>
                            Type
                            <strong>One Time</strong>
                        </span>

                    </div>

                    <button
                        className="read-instructions-btn"
                        onClick={() => setShowInstructions(true)}
                    >
                        Read Instructions
                    </button>

                </div>

            </div>


            {/* INSTRUCTIONS MODAL */}
            {showInstructions && (

                <div
                    className="modal-overlay"
                    onClick={() => setShowInstructions(false)}
                >

                    <div
                        className="modal-card"
                        onClick={e => e.stopPropagation()}
                    >

                        <div className="modal-header">

                            <h3>Instructions</h3>

                            <button
                                className="modal-close"
                                onClick={() => setShowInstructions(false)}
                            >
                                <FaTimes />
                            </button>

                        </div>


                        <ol className="modal-instructions">

                            <li>
                                Click <strong>Open EveryTry</strong>.
                            </li>

                            <li>
                                Download the EveryTry application.
                            </li>

                            <li>
                                Create a new EveryTry account.
                            </li>

                            <li>
                                Complete your KYC verification inside EveryTry.
                            </li>

                            <li>
                                Return here and click
                                <strong> Link Account</strong>.
                            </li>

                            <li>
                                Enter your EveryTry email,
                                password and transaction PIN.
                            </li>

                            <li>
                                Wait for admin approval to receive
                                your KSh 100 reward.
                            </li>

                        </ol>


                        <div className="modal-actions">

                            <a
                                href="https://play.google.com/store/apps/details?id=com.evertry.app&pcampaignid=web_share"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="download-btn"
                            >
                                Open EveryTry
                            </a>

                            <button
                                className="complete-task"
                                onClick={() => navigate("/redirecting")}
                            >
                                Link Account
                                <FaArrowRight />
                            </button>

                        </div>

                    </div>

                </div>

            )}


            {/* BONUS OPPORTUNITIES */}
            <div className="coming-title">
                <h2>Bonus Opportunities</h2>
            </div>


            <div className="coming-grid">


                {/* ================= REFERRALS — ACTIVE ================= */}

                <div
                    className="coming-card active-bonus-card"
                    onClick={() => navigate("/dashboard/referrals")}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                            navigate("/dashboard/referrals");
                        }
                    }}
                >

                    <FaUserFriends className="coming-icon" />

                    <h3>Refer a Friend</h3>

                    <p>
                        Invite friends and earn rewards when
                        they join SurveyPool and complete
                        their qualifying activity.
                    </p>

                    <strong>KSh 50+</strong>

                    <button
                        className="referral-start-btn"
                        onClick={(e) => {
                            e.stopPropagation();
                            navigate("/dashboard/referrals");
                        }}
                    >
                        Start
                        <FaArrowRight />
                    </button>

                </div>


                {/* ================= APP TESTING — COMING SOON ================= */}

                <div className="coming-card">

                    <div className="coming-overlay">

                        <FaLock />

                        <span>Coming Soon</span>

                    </div>

                    <FaMobileAlt className="coming-icon" />

                    <h3>Download & Test App</h3>

                    <p>
                        Download partner applications and
                        complete testing tasks.
                    </p>

                    <strong>KSh 70</strong>

                </div>


            </div>

        </div>
    );
}
