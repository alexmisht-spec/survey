import { useEffect, useState } from "react";
import {
    FaWallet,
    FaArrowDown,
    FaArrowUp,
    FaCoins,
} from "react-icons/fa";

import { getDashboard } from "../../api/dashboard.api";

import "./Wallet.css";

export default function Wallet() {

    const [wallet, setWallet] = useState(null);
    const [loading, setLoading] = useState(true);
useEffect(() => {

    const loadWallet = async () => {

        try {

            setLoading(true);

            const res = await getDashboard();

            setWallet(res.data.data);

        } catch (err) {

            console.error(err);

        } finally {

            setLoading(false);

        }

    };

    loadWallet();

}, []);
    if (loading) {

        return (

            <div className="wallet-loading">

                <div className="loader"></div>

                <p>Loading Wallet...</p>

            </div>

        );

    }

    return (

        <div className="wallet-page">

            <div className="wallet-header">

                <h1>Wallet</h1>

                <p>

                    View your balances and earnings.

                </p>

            </div>

            <div className="wallet-grid">

                <div className="wallet-card">

                    <FaWallet className="wallet-icon blue"/>

                    <span>Available Balance</span>

                    <h2>KSh {wallet?.availableBalance ?? 0}</h2>

                </div>

                <div className="wallet-card">

                    <FaArrowDown className="wallet-icon orange"/>

                    <span>Pending Balance</span>

                    <h2>KSh {wallet?.pendingBalance ?? 0}</h2>

                </div>

                <div className="wallet-card">

                    <FaCoins className="wallet-icon green"/>

                    <span>Total Earned</span>

                    <h2>KSh {wallet?.totalEarned ?? 0}</h2>

                </div>

                <div className="wallet-card">

                    <FaArrowUp className="wallet-icon purple"/>

                    <span>Pending Withdrawals</span>

                    <h2>{wallet?.pendingWithdrawals ?? 0}</h2>

                </div>

            </div>

            <div className="wallet-info">

                <h3>Wallet Information</h3>

                <p>

                    • Survey rewards are credited immediately after successful completion.

                </p>

                <p>

                    • Withdrawals are processed to your registered M-Pesa number.

                </p>

                <p>

                    • Minimum withdrawal amount is determined by the administrator.

                </p>

            </div>

        </div>

    );

}