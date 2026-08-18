import { useEffect, useState } from "react";

import {
    getPendingRewards,
    approveReward,
    rejectReward,
    getWithdrawals,
    markWithdrawalPaid,
    rejectWithdrawal,
} from "../../api/admin.reward";


export default function AdminWithdrawal() {

    const [tab, setTab] = useState("rewards");

    const [rewards, setRewards] = useState([]);

    const [withdrawals, setWithdrawals] = useState([]);

    const [loading, setLoading] = useState(false);


    /*
    |--------------------------------------------------------------------------
    | LOAD REWARDS
    |--------------------------------------------------------------------------
    */

    const loadRewards = async () => {

        try {

            setLoading(true);

            const { data } =
                await getPendingRewards();

            setRewards(
                data.assignments || []
            );

        } catch (err) {

            console.error(
                "LOAD REWARDS ERROR:",
                err
            );

        } finally {

            setLoading(false);

        }

    };


    /*
    |--------------------------------------------------------------------------
    | LOAD WITHDRAWALS
    |--------------------------------------------------------------------------
    */

    const loadWithdrawals = async () => {

        try {

            setLoading(true);

            const { data } =
                await getWithdrawals();

            setWithdrawals(
                data.withdrawals || []
            );

        } catch (err) {

            console.error(
                "LOAD WITHDRAWALS ERROR:",
                err
            );

        } finally {

            setLoading(false);

        }

    };


    /*
    |--------------------------------------------------------------------------
    | INITIAL LOAD
    |--------------------------------------------------------------------------
    */

    useEffect(() => {

        async function init() {

            try {

                setLoading(true);

                const [
                    rewardRes,
                    withdrawalRes
                ] = await Promise.all([

                    getPendingRewards(),

                    getWithdrawals(),

                ]);


                setRewards(
                    rewardRes.data.assignments || []
                );


                setWithdrawals(
                    withdrawalRes.data.withdrawals || []
                );

            } catch (err) {

                console.error(
                    "ADMIN WITHDRAWAL LOAD ERROR:",
                    err
                );

            } finally {

                setLoading(false);

            }

        }

        init();

    }, []);


    /*
    |--------------------------------------------------------------------------
    | APPROVE REWARD
    |--------------------------------------------------------------------------
    */

    const handleApproveReward = async (id) => {

        try {

            await approveReward(id);

            alert(
                "Reward approved."
            );

            loadRewards();

        } catch (err) {

            console.error(err);

            alert(
                err.response?.data?.message ||
                "Approval failed."
            );

        }

    };


    /*
    |--------------------------------------------------------------------------
    | REJECT REWARD
    |--------------------------------------------------------------------------
    */

    const handleRejectReward = async (id) => {

        try {

            await rejectReward(id);

            alert(
                "Reward rejected."
            );

            loadRewards();

        } catch (err) {

            console.error(err);

            alert(
                err.response?.data?.message ||
                "Reject failed."
            );

        }

    };


    /*
    |--------------------------------------------------------------------------
    | MARK WITHDRAWAL AS PAID
    |--------------------------------------------------------------------------
    |
    | Admin manually sends the M-Pesa payment first.
    |
    | Then clicks "Mark as Paid".
    |--------------------------------------------------------------------------
    */

    const handleMarkPaid = async (id) => {

        const confirmed = window.confirm(
            "Confirm that you have already sent this payment to the user's M-Pesa number."
        );


        if (!confirmed) {

            return;

        }


        try {

            await markWithdrawalPaid(id);

            alert(
                "Withdrawal marked as paid successfully."
            );

            loadWithdrawals();

        } catch (err) {

            console.error(
                "MARK WITHDRAWAL PAID ERROR:",
                err
            );

            alert(
                err.response?.data?.message ||
                "Failed to mark withdrawal as paid."
            );

        }

    };


    /*
    |--------------------------------------------------------------------------
    | REJECT WITHDRAWAL
    |--------------------------------------------------------------------------
    */

    const handleRejectWithdrawal = async (id) => {

        const confirmed = window.confirm(
            "Are you sure you want to reject this withdrawal?"
        );


        if (!confirmed) {

            return;

        }


        try {

            await rejectWithdrawal(id);

            alert(
                "Withdrawal rejected."
            );

            loadWithdrawals();

        } catch (err) {

            console.error(
                "REJECT WITHDRAWAL ERROR:",
                err
            );

            alert(
                err.response?.data?.message ||
                "Reject failed."
            );

        }

    };


    return (

        <div
            style={{
                padding: 30
            }}
        >

            <h1>
                Rewards & Withdrawals
            </h1>


            {/* =====================================================
                TABS
            ===================================================== */}

            <div
                style={{
                    display: "flex",
                    gap: 10,
                    marginBottom: 20
                }}
            >

                <button
                    onClick={() =>
                        setTab("rewards")
                    }
                >
                    Pending Rewards
                </button>


                <button
                    onClick={() =>
                        setTab("withdrawals")
                    }
                >
                    Withdrawal Requests
                </button>

            </div>


            {loading && (
                <p>
                    Loading...
                </p>
            )}


            {/* =====================================================
                PENDING REWARDS
            ===================================================== */}

            {!loading &&
                tab === "rewards" && (

                    <table
                        border="1"
                        cellPadding="10"
                        width="100%"
                    >

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

                            {rewards.length === 0 ? (

                                <tr>

                                    <td
                                        colSpan="5"
                                        style={{
                                            textAlign: "center",
                                            padding: 30
                                        }}
                                    >
                                        No pending rewards.
                                    </td>

                                </tr>

                            ) : (

                                rewards.map(
                                    (reward) => (

                                        <tr
                                            key={
                                                reward.id
                                            }
                                        >

                                            <td>

                                                {
                                                    reward.user
                                                        .firstName
                                                }{" "}

                                                {
                                                    reward.user
                                                        .lastName
                                                }

                                            </td>


                                            <td>

                                                {
                                                    reward.survey
                                                        .title
                                                }

                                            </td>


                                            <td>

                                                KSh{" "}

                                                {
                                                    reward.survey
                                                        .reward
                                                }

                                            </td>


                                            <td>

                                                {
                                                    new Date(
                                                        reward.completedAt ||
                                                        reward.assignedAt
                                                    ).toLocaleDateString()
                                                }

                                            </td>


                                            <td>

                                                <button
                                                    onClick={() =>
                                                        handleApproveReward(
                                                            reward.id
                                                        )
                                                    }
                                                >
                                                    Approve
                                                </button>


                                                {" "}


                                                <button
                                                    onClick={() =>
                                                        handleRejectReward(
                                                            reward.id
                                                        )
                                                    }
                                                >
                                                    Reject
                                                </button>

                                            </td>

                                        </tr>

                                    )
                                )

                            )}

                        </tbody>

                    </table>

                )}


            {/* =====================================================
                WITHDRAWALS
            ===================================================== */}

            {!loading &&
                tab === "withdrawals" && (

                    <table
                        border="1"
                        cellPadding="10"
                        width="100%"
                    >

                        <thead>

                            <tr>

                                <th>User</th>

                                <th>Phone</th>

                                <th>Withdrawal</th>

                                <th>Available</th>

                                <th>Pending</th>

                                <th>Total Earned</th>

                                <th>Requested</th>

                                <th>Status</th>

                                <th>Actions</th>

                            </tr>

                        </thead>


                        <tbody>

                            {withdrawals.length === 0 ? (

                                <tr>

                                    <td
                                        colSpan="9"
                                        style={{
                                            textAlign: "center",
                                            padding: 30
                                        }}
                                    >
                                        No withdrawal requests.
                                    </td>

                                </tr>

                            ) : (

                                withdrawals.map(
                                    (withdrawal) => {

                                        const wallet =
                                            withdrawal.user?.wallet;


                                        return (

                                            <tr
                                                key={
                                                    withdrawal.id
                                                }
                                            >

                                                {/* USER */}

                                                <td>

                                                    <strong>

                                                        {
                                                            withdrawal
                                                                .user
                                                                .firstName
                                                        }{" "}

                                                        {
                                                            withdrawal
                                                                .user
                                                                .lastName
                                                        }

                                                    </strong>

                                                    <br />

                                                    <small>

                                                        {
                                                            withdrawal
                                                                .user
                                                                .email
                                                        }

                                                    </small>

                                                </td>


                                                {/* MPESA NUMBER */}

                                                <td>

                                                    <strong>

                                                        {
                                                            withdrawal
                                                                .phoneNumber
                                                        }

                                                    </strong>

                                                </td>


                                                {/* WITHDRAWAL AMOUNT */}

                                                <td>

                                                    <strong>

                                                        KSh{" "}

                                                        {Number(
                                                            withdrawal.amount
                                                        ).toLocaleString()}

                                                    </strong>

                                                </td>


                                                {/* AVAILABLE BALANCE */}

                                                <td>

                                                    KSh{" "}

                                                    {Number(
                                                        wallet?.availableBalance ||
                                                        0
                                                    ).toLocaleString()}

                                                </td>


                                                {/* PENDING BALANCE */}

                                                <td>

                                                    KSh{" "}

                                                    {Number(
                                                        wallet?.pendingBalance ||
                                                        0
                                                    ).toLocaleString()}

                                                </td>


                                                {/* TOTAL EARNED */}

                                                <td>

                                                    KSh{" "}

                                                    {Number(
                                                        wallet?.totalEarned ||
                                                        0
                                                    ).toLocaleString()}

                                                </td>


                                                {/* REQUEST DATE */}

                                                <td>

                                                    {new Date(
                                                        withdrawal.createdAt
                                                    ).toLocaleDateString()}

                                                </td>


                                                {/* STATUS */}

                                                <td>

                                                    <strong>

                                                        {
                                                            withdrawal.status
                                                        }

                                                    </strong>

                                                </td>


                                                {/* ACTIONS */}

                                                <td>

                                                    {withdrawal.status ===
                                                        "PENDING" && (

                                                        <>

                                                            <button
                                                                onClick={() =>
                                                                    handleMarkPaid(
                                                                        withdrawal.id
                                                                    )
                                                                }
                                                            >
                                                                Mark as Paid
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


                                                    {withdrawal.status ===
                                                        "PAID" && (

                                                        <span>

                                                            ✓ Paid

                                                        </span>

                                                    )}


                                                    {withdrawal.status ===
                                                        "REJECTED" && (

                                                        <span>

                                                            Rejected

                                                        </span>

                                                    )}


                                                    {(
                                                        withdrawal.status ===
                                                            "APPROVED" ||

                                                        withdrawal.status ===
                                                            "PROCESSING"

                                                    ) && (

                                                        <span>

                                                            Processing

                                                        </span>

                                                    )}

                                                </td>

                                            </tr>

                                        );

                                    }
                                )

                            )}

                        </tbody>

                    </table>

                )}

        </div>

    );

}