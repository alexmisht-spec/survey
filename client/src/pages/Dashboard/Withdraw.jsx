import { useEffect, useState } from "react";
import {
    FaWallet,
    FaArrowCircleDown,
    FaMoneyBillWave,
    FaHistory,
    FaMobileAlt,
    FaBolt,
} from "react-icons/fa";

import { getDashboard } from "../../api/dashboard.api";
import { requestWithdrawal } from "../../api/withdrawal.api";

import "./Withdraw.css";

export default function Withdraw() {

    const [wallet, setWallet] = useState(null);
    const [amount, setAmount] = useState("");
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const loadData = async () => {

        try {

            const res = await getDashboard();

            setWallet(res.data.data);

        } catch (err) {

            console.error(err);

        } finally {

            setLoading(false);

        }

    };

    useEffect(() => {

        loadData();

    }, []);

    const available = Number(wallet?.availableBalance || 0);
    const pending = Number(wallet?.pendingBalance || 0);
    const earned = Number(wallet?.totalEarned || 0);

    const withdrawals = wallet?.withdrawals || [];

    const mpesa =
        wallet?.profile?.mpesaNumber ||
        "No M-Pesa Number";

    const withdrawAll = () => {

        setAmount(available);

    };

    const remaining = Math.max(
        0,
        available - Number(amount || 0)
    );

    const submitWithdrawal = async (e) => {

        e.preventDefault();

        if (!amount) {

            return alert("Enter withdrawal amount.");

        }

        try {

            setSubmitting(true);

            const res = await requestWithdrawal({

                amount: Number(amount),

            });

            alert(res.data.message);

            setAmount("");

            await loadData();

        } catch (err) {

            console.error(err);

            alert(

                err.response?.data?.message ||

                "Withdrawal request failed."

            );

        } finally {

            setSubmitting(false);

        }

    };
function statusBadge(status) {
    const styles = {
        PENDING:    { class: "status-badge status-pending",    text: "Pending Approval" },
        APPROVED:   { class: "status-badge status-processing", text: "Processing Payment" },
        PROCESSING: { class: "status-badge status-processing", text: "Processing Payment" },
        PAID:       { class: "status-badge status-paid",       text: "Paid" },
        FAILED:     { class: "status-badge status-failed",     text: "Payment Failed" },
        REJECTED:   { class: "status-badge status-rejected",   text: "Rejected" },
    };

    const s = styles[status] || { class: "status-badge", text: status };

    return <span className={s.class}>{s.text}</span>;
}
    if (loading) {

        return (

            <div className="withdraw-loading">

                <div className="withdraw-spinner"></div>

                <p>Loading your wallet...</p>

            </div>

        );

    }

    return (

        <div className="withdraw-page">

            <div className="withdraw-header">

                <div>

                    <h1>Withdraw Earnings</h1>

                    <p>

                        Send your survey earnings directly to your registered
                        M-Pesa account.

                    </p>

                </div>

            </div>

            <div className="wallet-summary">

                <div className="wallet-card blue">

                    <FaWallet />

                    <span>Available Balance</span>

                    <h2>

                        KSh {available.toLocaleString()}

                    </h2>

                </div>

                <div className="wallet-card orange">

                    <FaMoneyBillWave />

                    <span>Pending Balance</span>

                    <h2>

                        KSh {pending.toLocaleString()}

                    </h2>

                </div>

                <div className="wallet-card green">

                    <FaBolt />

                    <span>Total Earned</span>

                    <h2>

                        KSh {earned.toLocaleString()}

                    </h2>

                </div>

            </div>

            <div className="withdraw-grid">

                <div className="withdraw-form-card">

                    <div className="card-title">

                        <FaArrowCircleDown />

                        <h2>Request Withdrawal</h2>

                    </div>

                    <form onSubmit={submitWithdrawal}>

                        <label>

                            Registered M-Pesa Number

                        </label>

                        <div className="readonly-input">

                            <FaMobileAlt />

                            <span>{mpesa}</span>

                        </div>

                        <label>

                            Withdrawal Amount

                        </label>

                        <input

                            type="number"

                            value={amount}

                            onChange={(e) =>
                                setAmount(e.target.value)
                            }

                            placeholder="Minimum KSh 100"

                            min={100}

                            max={available}

                        />

                        <div className="withdraw-info">

                            <div>

                                <span>

                                    Available

                                </span>

                                <strong>

                                    KSh {available.toLocaleString()}

                                </strong>

                            </div>

                            <div>

                                <span>

                                    Remaining

                                </span>

                                <strong>

                                    KSh {remaining.toLocaleString()}

                                </strong>

                            </div>

                        </div>

                        <button
                            type="button"
                            className="withdraw-all"
                            onClick={withdrawAll}
                        >

                            Withdraw All

                        </button>

                        <button
                            className="withdraw-btn"
                            type="submit"
                            disabled={submitting}
                        >

                            {submitting
                                ? "Submitting..."
                                : "Request Withdrawal"}

                        </button>

                    </form>

                </div>

                <div className="withdraw-history-card">

                    <div className="card-title">

                        <FaHistory />

                        <h2>Recent Withdrawals</h2>

                    </div>

                    {withdrawals.length === 0 ? (

                        <div className="empty-history">

                            <img
                                src="/images/empty-wallet.svg"
                                alt=""
                            />

                            <h3>No withdrawals yet</h3>

                            <p>

                                Once you request your first withdrawal,
                                it will appear here.

                            </p>

                        </div>

                    ) : (

                        <table className="withdraw-history-table">

                            <thead>

                                <tr>

                                    <th>Date</th>
                                    <th>Amount</th>
                                    <th>Status</th>
                                    <th>Receipt</th>

                                </tr>

                            </thead>

                            <tbody>

                                {withdrawals.map((item) => (

                                    <tr key={item.id}>

                                        <td>

                                            {new Date(
                                                item.createdAt
                                            ).toLocaleDateString()}

                                        </td>

                                        <td>

                                            KSh {Number(item.amount).toLocaleString()}

                                        </td>

                                        <td>

                                            {statusBadge(item.status)}

                                        </td>
<td>

    {item.status === "PAID"
        ? item.transactionId || "-"
        : item.status === "FAILED"
        ? "-"
        : "Awaiting M-Pesa"}

</td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                    )}

                </div>

            </div>

        </div>

    );

}