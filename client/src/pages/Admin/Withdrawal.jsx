import { useEffect, useState } from "react";
import {
    getPendingRewards,
    approveReward,
    rejectReward,
    getWithdrawals,
    approveWithdrawal,
    rejectWithdrawal,
} from "../../api/admin.reward";

export default function AdminWithdrawal() {

    const [tab, setTab] = useState("rewards");

    const [rewards, setRewards] = useState([]);
    const [withdrawals, setWithdrawals] = useState([]);

    const [loading, setLoading] = useState(false);

    const loadRewards = async () => {
        try {

            setLoading(true);

            const { data } = await getPendingRewards();

            setRewards(data.assignments || []);

        } catch (err) {

            console.error(err);

        } finally {

            setLoading(false);

        }
    };

    const loadWithdrawals = async () => {

        try {

            setLoading(true);

            const { data } = await getWithdrawals();

            setWithdrawals(data.withdrawals || []);

        } catch (err) {

            console.error(err);

        } finally {

            setLoading(false);

        }

    };

    useEffect(() => {

        async function init() {

            try {

                setLoading(true);

                const [rewardRes, withdrawalRes] = await Promise.all([
                    getPendingRewards(),
                    getWithdrawals(),
                ]);

                setRewards(rewardRes.data.assignments || []);
                setWithdrawals(withdrawalRes.data.withdrawals || []);

            } catch (err) {

                console.error(err);

            } finally {

                setLoading(false);

            }

        }

        init();

    }, []);

    const handleApproveReward = async (id) => {

        try {

            await approveReward(id);

            alert("Reward approved.");

            loadRewards();

        } catch (err) {

            console.error(err);

            alert(err.response?.data?.message || "Approval failed.");

        }

    };

    const handleRejectReward = async (id) => {

        try {

            await rejectReward(id);

            alert("Reward rejected.");

            loadRewards();

        } catch (err) {

            console.error(err);

            alert(err.response?.data?.message || "Reject failed.");

        }

    };

    const handleApproveWithdrawal = async (id) => {

        try {

            await approveWithdrawal(id);

            alert("Withdrawal approved.");

            loadWithdrawals();

        } catch (err) {

            console.error(err);

            alert(err.response?.data?.message || "Approval failed.");

        }

    };

    const handleRejectWithdrawal = async (id) => {

        try {

            await rejectWithdrawal(id);

            alert("Withdrawal rejected.");

            loadWithdrawals();

        } catch (err) {

            console.error(err);

            alert(err.response?.data?.message || "Reject failed.");

        }

    };

    return (

        <div style={{ padding: 30 }}>

            <h1>Rewards & Withdrawals</h1>

            <div style={{
                display: "flex",
                gap: 10,
                marginBottom: 20
            }}>

                <button onClick={() => setTab("rewards")}>
                    Pending Rewards
                </button>

                <button onClick={() => setTab("withdrawals")}>
                    Withdrawal Requests
                </button>

            </div>

            {loading && <p>Loading...</p>}

            {!loading && tab === "rewards" && (

                <table border="1" cellPadding="10" width="100%">

                    <thead>

                        <tr>

                            <th>User</th>
                            <th>Survey</th>
                            <th>Reward</th>
                            <th>Completed</th>
                            <th>Actions</th>

                        </tr>

                    </thead>

                    <tbody>

                        {rewards.map((reward) => (

                            <tr key={reward.id}>

                                <td>

                                    {reward.user.firstName}{" "}
                                    {reward.user.lastName}

                                </td>

                                <td>

                                    {reward.survey.title}

                                </td>

                                <td>

                                    KSh {reward.survey.reward}

                                </td>

                                <td>

                                    {new Date(
                                        reward.completedAt || reward.assignedAt
                                    ).toLocaleDateString()}

                                </td>

                                <td>

                                    <button
                                        onClick={() =>
                                            handleApproveReward(reward.id)
                                        }
                                    >
                                        Approve
                                    </button>

                                    {" "}

                                    <button
                                        onClick={() =>
                                            handleRejectReward(reward.id)
                                        }
                                    >
                                        Reject
                                    </button>

                                </td>

                            </tr>

                        ))}

                    </tbody>

                </table>

            )}

            {!loading && tab === "withdrawals" && (

                <table border="1" cellPadding="10" width="100%">

                    <thead>

                        <tr>

                            <th>User</th>
                            <th>Phone</th>
                            <th>Amount</th>
                            <th>Requested</th>
                            <th>Status</th>
                            <th>Actions</th>

                        </tr>

                    </thead>

                    <tbody>

                        {withdrawals.map((withdrawal) => (

                            <tr key={withdrawal.id}>

                                <td>

                                    {withdrawal.user.firstName}{" "}
                                    {withdrawal.user.lastName}

                                </td>

                                <td>

                                    {withdrawal.phoneNumber}

                                </td>

                                <td>

                                    KSh {withdrawal.amount}

                                </td>

                                <td>

                                    {new Date(
                                        withdrawal.createdAt
                                    ).toLocaleDateString()}

                                </td>

                                <td>

                                    {withdrawal.status}

                                </td>

                                <td>

                                    {withdrawal.status === "PENDING" && (

                                        <>

                                            <button
                                                onClick={() =>
                                                    handleApproveWithdrawal(
                                                        withdrawal.id
                                                    )
                                                }
                                            >
                                                Approve
                                            </button>

                                            {" "}

                                            <button
                                                onClick={() =>
                                                    handleRejectWithdrawal(
                                                        withdrawal.id
                                                    )
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

            )}

        </div>

    );

}