import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getRewardStatus } from "../../../api/reward";
import "./BonusStatus.css";

export default function BonusStatus() {

    const navigate = useNavigate();

    const [reward, setReward] = useState(null);

    const [loading, setLoading] = useState(true);

    useEffect(() => {

        async function fetchStatus() {

            try {

                const { data } = await getRewardStatus();

                setReward(data.reward);

            } catch (error) {

                alert(
                    error.response?.data?.message ||
                    "Unable to load status."
                );

            } finally {

                setLoading(false);

            }

        }

        fetchStatus();

    }, []);

    if (loading) {

        return (
            <div className="bonus-status-page">
                <div className="bonus-card">
                    Loading...
                </div>
            </div>
        );

    }

    return (

        <div className="bonus-status-page">

            <div className="bonus-card">

                <h1>Reward Bonus Status</h1>

                <p className="subtitle">
                    Your reward application is currently under review.
                </p>

                <div className="status-box">

                    {reward?.adminApproved === null && (
                        <>
                            <h2 className="pending">
                                Pending Review
                            </h2>

                            <p>
                                Your submission has been received successfully.
                                Please wait while our team reviews it.
                            </p>
                        </>
                    )}

                    {reward?.adminApproved === true && (
                        <>
                            <h2 className="approved">
                                Approved
                            </h2>

                            <p>
                                Congratulations! Your reward request has been approved.
                            </p>
                        </>
                    )}

                    {reward?.adminApproved === false && (
                        <>
                            <h2 className="rejected">
                                Rejected
                            </h2>

                            <p>
                                {reward.rejectionReason || "Your submission was rejected."}
                            </p>

                            <button
                                className="retry-btn"
                                onClick={() => navigate("/every-login")}
                            >
                                Submit Again
                            </button>
                        </>
                    )}

                </div>

                <button
                    className="dashboard-btn"
                    onClick={() => navigate("/dashboard")}
                >
                    Continue to Dashboard
                </button>

            </div>

        </div>

    );

}