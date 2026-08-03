import { useEffect, useState, useCallback} from "react";
import { Link } from "react-router-dom";
import {
    FaWallet,
    FaClock,
    FaCoins,
    FaClipboardList,
    FaCheckCircle,
    FaUniversity,
} from "react-icons/fa";

import { getDashboard } from "../../api/dashboard.api";
import { getMySurveys } from "../../api/survey.api";

import StatCard from "./components/StatCard";
import SurveyCard from "./components/SurveyCard";
import useAuth from "../../hooks/useAuth";


import "./Dashboard.css";

export default function Dashboard() {

  const { user } = useAuth();

    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
const [availableSurveys, setAvailableSurveys] = useState([]);
const [completedSurveys, setCompletedSurveys] = useState([]);
const [comingSoonSurveys, setComingSoonSurveys] = useState([]);

    const [showApprovedBanner, setShowApprovedBanner] = useState(false);

const verificationStatus =
    user?.verificationStatus || "NOT_SUBMITTED";

const verified = verificationStatus === "APPROVED";

const hasSubmittedVerification =
    verificationStatus !== "NOT_SUBMITTED";
    /*
    ---------------------------------------------------
    Show approved banner only for first 6 hours
    ---------------------------------------------------
    */

    useEffect(() => {

        if (!verified) return;

        const KEY = "approvedBannerSeen";

        const stored = localStorage.getItem(KEY);

        if (!stored) {

            localStorage.setItem(KEY, Date.now());

            setShowApprovedBanner(true);

            return;

        }

        const diff = Date.now() - Number(stored);

        const sixHours = 8 * 60 * 60 * 1000;

        if (diff < sixHours) {

            setShowApprovedBanner(true);

        } else {

            setShowApprovedBanner(false);

        }

    }, [verified]);

    /*
    ---------------------------------------------------
    Load Dashboard
    ---------------------------------------------------
    */

   const loadDashboard = useCallback(async () => {
    try {
        setLoading(true);

        const [dashboardRes, surveyRes] = await Promise.all([
            getDashboard(),
            getMySurveys(),
        ]);

        setStats(dashboardRes.data.data);

        
        setAvailableSurveys(surveyRes.data.available || []);
        setCompletedSurveys(surveyRes.data.completed || []);
        setComingSoonSurveys(surveyRes.data.comingSoon || []);

    } catch (error) {

        console.error(error);

    } finally {

        setLoading(false);

    }
}, []);
  useEffect(() => {
    loadDashboard();
}, [loadDashboard]);

    if (loading) {

        return <h2 className="dashboard-loading">Loading Dashboard...</h2>;

    }

    return (

     <>
<div className="dashboard">

                <div className="dashboard-top">

                    <div>

                        <h1>
                            Welcome Back, {user?.firstName} 👋
                        </h1>

                        <p className="dashboard-subtitle">

                            Complete surveys, track your earnings and manage your account.

                        </p>

                    </div>

                </div>

                {/* ================= COMPLETE KYC ================= */}
                {verificationStatus === "NOT_SUBMITTED" && (

                    <div className="kyc-banner">

                        <div className="kyc-content">

                            <span className="kyc-tag">

                                ACTION REQUIRED

                            </span>

                            <h2>

                                Complete your KYC Verification

                            </h2>

                            <p>

                                To protect our survey partners and ensure genuine
                                responses, every participant must verify their
                                identity before accessing paid surveys.

                                <br /><br />

                                Upload:

                                <br />

                                • National ID (Front)

                                <br />

                                • National ID (Back)

                                <br />

                                • KRA PIN Certificate

                                <br /><br />

                                Verification usually takes less than
                                <strong> 24 hours.</strong>

                            </p>

                        </div>

                        <Link
                            to="/upload-verification"
                            className="verify-btn"
                        >

                            Complete Verification

                        </Link>

                    </div>

                )}

                {/* ================= PENDING ================= */}
                {hasSubmittedVerification &&
                    verificationStatus === "PENDING" && (

                    <div className="verification-banner pending">

                        <div>

                            <h2>

                                🕒 Verification Under Review

                            </h2>

                            <p>

                                We've received your KYC documents successfully.

                                <br /><br />

                                Our verification team is reviewing your identity.

                                <br /><br />

                                Once approved, you'll receive an email and your
                                survey dashboard will automatically unlock.

                            </p>

                        </div>

                        <span className="status-pill">

                            Pending Review

                        </span>

                    </div>

                )}

                {/* ================= REJECTED ================= */}
                    {hasSubmittedVerification &&
                        verificationStatus === "REJECTED" && (

                    <div className="verification-banner rejected">

                        <div>

                            <h2>

                                ❌ Verification Rejected

                            </h2>

                            <p>

                                We couldn't verify your submitted documents.

                                <br /><br />

                                Please upload clearer copies to continue.

                            </p>

                        </div>

                        <Link
                            to="/upload-verification"
                            className="verify-btn"
                        >

                            Upload Again

                        </Link>

                    </div>

                )}

                {/* ================= APPROVED ================= */}

                {verified && showApprovedBanner && (

                    <div className="verification-banner approved">

                        <div>

                            <h2>

                                🎉 Congratulations!

                            </h2>

                            <p>

                                Your identity has been verified successfully.

                                <br /><br />

                                You now have full access to surveys, earnings and withdrawals.

                                Happy earning!

                            </p>

                        </div>

                    </div>

                )}

                {/* ================= STATS ================= */}
{/* ================= STATS ================= */}

<div className="stats-grid">
  <StatCard
    title="Available Balance"
    value={`KSh ${stats?.availableBalance ?? 0}`}
    icon={<FaWallet />}
    color="#2563eb"
  />

  <StatCard
    title="Pending Balance"
    value={`KSh ${stats?.pendingBalance ?? 0}`}
    icon={<FaClock />}
    color="#f59e0b"
  />

  <StatCard
    title="Total Earned"
    value={`KSh ${stats?.totalEarned ?? 0}`}
    icon={<FaCoins />}
    color="#16a34a"
  />

  <StatCard
    title="Pending Surveys"
    value={stats?.pendingSurveys ?? 0}
    icon={<FaClipboardList />}
    color="#8b5cf6"
  />

  <StatCard
    title="Completed Surveys"
    value={stats?.completedSurveys ?? 0}
    icon={<FaCheckCircle />}
    color="#0ea5e9"
  />

  <StatCard
    title="Pending Withdrawals"
    value={stats?.pendingWithdrawals ?? 0}
    icon={<FaUniversity />}
    color="#dc2626"
  />
</div>

                {/* ================= SURVEY ================= */}

   <div className="dashboard-section">

    <div className="section-header">

        <h2>Your Surveys</h2>

        <p>
            Complete surveys to earn rewards that can be withdrawn directly to your
            M-Pesa account.
        </p>

    </div>

    {/* ================= AVAILABLE SURVEYS ================= */}

    <div className="survey-category">

        <h3 className="survey-group-title">
            Available Surveys
        </h3>

        {availableSurveys.length > 0 ? (

            <div className="survey-grid">

                {availableSurveys.map((assignment) => (

                    <SurveyCard
                        key={assignment.id}
                        survey={assignment.survey}
                        verified={verified}
                        verificationStatus={verificationStatus}
                        completed={false}
                        comingSoon={false}
                        onCompleted={loadDashboard}
                    />

                ))}

            </div>

        ) : (

            <div className="empty-section">

                <h4>No Active Surveys</h4>

                <p>
                    There are currently no active surveys assigned to your account.
                    Please check back later.
                </p>

            </div>

        )}

    </div>

    {/* ================= COMPLETED SURVEYS ================= */}

    <div className="survey-category">

        <h3 className="survey-group-title">
            Completed Surveys
        </h3>

        {completedSurveys.length > 0 ? (

            <div className="survey-grid">

                {completedSurveys.map((assignment) => (

                    <SurveyCard
                        key={assignment.id}
                        survey={assignment.survey}
                        completed={true}
                        verified={verified}
                        verificationStatus={verificationStatus}
                    />

                ))}

            </div>

        ) : (

            <div className="empty-section">

                <h4>No Completed Surveys</h4>

                <p>
                    Once you complete surveys, they'll appear here for your records.
                </p>

            </div>

        )}

    </div>

    {/* ================= COMING SOON ================= */}

    <div className="survey-category">

        <h3 className="survey-group-title">
            Coming Soon
        </h3>

        {comingSoonSurveys.length > 0 ? (

            <div className="survey-grid">

                {comingSoonSurveys.map((survey) => (

                    <SurveyCard
                        key={survey.id}
                        survey={survey}
                        verified={verified}
                        verificationStatus={verificationStatus}
                        completed={false}
                        comingSoon={true}
                    />

                ))}

            </div>

        ) : (

            <div className="empty-section">

                <h4>More Surveys Coming Soon</h4>

                <p>
                    New survey opportunities will appear here once they're published
                    by the administrator.
                </p>

            </div>

        )}

    </div>

</div>
        </div>
        </>




    );

}