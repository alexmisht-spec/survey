import { useEffect, useState } from "react";
import { getMyReferrals } from "../../../api/referral.api";
import "./Referrals.css";

export default function Referrals() {

    const [referral, setReferral] = useState(null);
    const [referrals, setReferrals] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [copied, setCopied] = useState(false);

    useEffect(() => {

        loadReferrals();

    }, []);

    async function loadReferrals() {

        try {

            setLoading(true);
            setError("");

            const { data } = await getMyReferrals();

            if (!data.success) {

                throw new Error(
                    data.message || "Failed to load referrals."
                );

            }

            setReferral(data.referral);
            setReferrals(data.referrals || []);

        } catch (error) {

            console.error(
                "LOAD REFERRALS ERROR:",
                error
            );

            setError(
                error.response?.data?.message ||
                error.message ||
                "Failed to load referral information."
            );

        } finally {

            setLoading(false);

        }

    }

    async function copyReferralLink() {

        if (!referral?.link) return;

        try {

            await navigator.clipboard.writeText(
                referral.link
            );

            setCopied(true);

            setTimeout(() => {
                setCopied(false);
            }, 2000);

        } catch (error) {

            console.error(
                "COPY REFERRAL LINK ERROR:",
                error
            );

        }

    }

    if (loading) {

        return (
            <div className="referrals-page">

                <div className="referrals-loading">
                    Loading referrals...
                </div>

            </div>
        );

    }

    if (error) {

        return (
            <div className="referrals-page">

                <div className="referrals-error">

                    <h2>Unable to load referrals</h2>

                    <p>{error}</p>

                    <button onClick={loadReferrals}>
                        Try Again
                    </button>

                </div>

            </div>
        );

    }

    return (

        <div className="referrals-page">

            <div className="referrals-header">

                <div>

                    <h1>Refer & Earn</h1>

                    <p>
                        Invite friends to SurveyPool and earn
                        rewards when your referrals qualify.
                    </p>

                </div>

            </div>


            {/* ======================================================
                REFERRAL LINK
            ====================================================== */}

            <div className="referral-main-card">

                <div className="referral-main-content">

                    <span className="referral-label">
                        Your Referral Code
                    </span>

                    <div className="referral-code">
                        {referral?.code || "N/A"}
                    </div>

                    <p>
                        Share your referral link with friends,
                        family, colleagues or your social network.
                    </p>

                </div>


                <div className="referral-link-section">

                    <label>
                        Your Referral Link
                    </label>

                    <div className="referral-link-box">

                        <input
                            type="text"
                            value={referral?.link || ""}
                            readOnly
                        />

                        <button
                            onClick={copyReferralLink}
                        >
                            {copied ? "Copied!" : "Copy Link"}
                        </button>

                    </div>

                </div>

            </div>


            {/* ======================================================
                STATISTICS
            ====================================================== */}

            <div className="referral-stats">

                <div className="referral-stat-card">

                    <span>
                        Total Referrals
                    </span>

                    <strong>
                        {referral?.totalReferrals || 0}
                    </strong>

                </div>


                <div className="referral-stat-card">

                    <span>
                        Pending
                    </span>

                    <strong>
                        {referral?.pendingReferrals || 0}
                    </strong>

                </div>


                <div className="referral-stat-card">

                    <span>
                        Approved
                    </span>

                    <strong>
                        {referral?.approvedReferrals || 0}
                    </strong>

                </div>


                <div className="referral-stat-card earnings">

                    <span>
                        Referral Earnings
                    </span>

                    <strong>
                        KSh{" "}
                        {Number(
                            referral?.totalEarned || 0
                        ).toLocaleString()}
                    </strong>

                </div>

            </div>


            {/* ======================================================
                REFERRAL HISTORY
            ====================================================== */}

            <div className="referral-history-card">

                <div className="history-header">

                    <div>

                        <h2>
                            Referral History
                        </h2>

                        <p>
                            Track people who joined using
                            your referral link.
                        </p>

                    </div>

                </div>


                {referrals.length === 0 ? (

                    <div className="empty-referrals">

                        <h3>
                            No referrals yet
                        </h3>

                        <p>
                            Share your referral link to start
                            earning rewards.
                        </p>

                    </div>

                ) : (

                    <div className="referral-table-wrapper">

                        <table className="referral-table">

                            <thead>

                                <tr>

                                    <th>
                                        Name
                                    </th>

                                    <th>
                                        Date Joined
                                    </th>

                                    <th>
                                        Status
                                    </th>

                                    <th>
                                        Reward
                                    </th>

                                </tr>

                            </thead>

                            <tbody>

                                {referrals.map(
                                    (item) => (

                                        <tr
                                            key={item.id}
                                        >

                                            <td>
                                                <strong>
                                                    {item.name}
                                                </strong>
                                            </td>

                                            <td>
                                                {new Date(
                                                    item.joinedAt
                                                ).toLocaleDateString()}
                                            </td>

                                            <td>

                                                <span
                                                    className={`referral-status ${item.status.toLowerCase()}`}
                                                >
                                                    {item.status}
                                                </span>

                                            </td>

                                            <td>
                                                KSh{" "}
                                                {Number(
                                                    item.reward
                                                ).toLocaleString()}
                                            </td>

                                        </tr>

                                    )
                                )}

                            </tbody>

                        </table>

                    </div>

                )}

            </div>

        </div>

    );

}