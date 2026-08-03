import { useNavigate } from "react-router-dom";
import {
    FaGift,
    FaArrowRight,
    FaUserFriends,
    FaMobileAlt,
    FaLock
} from "react-icons/fa";

import "./Bonus.css";

export default function Bonus() {

    const navigate = useNavigate();

    return (

        <div className="bonus-page">

            <div className="bonus-header">

                <h1>Bonus Tasks</h1>

                <p>
                    Complete bonus tasks and earn extra rewards.
                    New opportunities are added regularly.
                </p>

            </div>

            {/* ACTIVE TASK */}

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

        <div className="instruction-box">

            <h4>Instructions</h4>

            <ol>

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

        </div>

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

    </div>

    <div className="bonus-actions">

        <a
            href="https://everytry.com"
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

            {/* UPCOMING */}

            <div className="coming-title">

                <h2>Coming Soon</h2>

            </div>

            <div className="coming-grid">

                <div className="coming-card">

                    <div className="coming-overlay">

                        <FaLock />

                        <span>Coming Soon</span>

                    </div>

                    <FaUserFriends className="coming-icon"/>

                    <h3>Refer a Friend</h3>

                    <p>

                        Invite friends and earn rewards after
                        their first completed survey.

                    </p>

                    <strong>KSh 100+</strong>

                </div>

                <div className="coming-card">

                    <div className="coming-overlay">

                        <FaLock />

                        <span>Coming Soon</span>

                    </div>

                    <FaMobileAlt className="coming-icon"/>

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

