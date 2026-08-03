import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

import "./ResetPassword.css";

import { forgotPasswordReset } from "../../api/auth.api";

export default function ResetPassword() {

    const navigate = useNavigate();

    const location = useLocation();

    const email = location.state?.email || "";

    const [otp, setOtp] = useState("");

    const [newPassword, setNewPassword] = useState("");

    const [confirmPassword, setConfirmPassword] = useState("");

    const [loading, setLoading] = useState(false);

    const handleResetPassword = async () => {

        if (!email) {

            alert("Email not found. Please start the password reset process again.");

            navigate("/forgot-password");

            return;

        }

        if (newPassword !== confirmPassword) {

            alert("Passwords do not match.");

            return;

        }

        if (newPassword.length < 8) {

            alert("Password must be at least 8 characters.");

            return;

        }

        try {

            setLoading(true);

            await forgotPasswordReset({

                email,

                otp,

                newPassword,

                confirmPassword,

            });

            alert("Password changed successfully.");

            navigate("/login");

        }

        catch (err) {

            alert(

                err.response?.data?.message ||

                "Failed to reset password."

            );

        }

        finally {

            setLoading(false);

        }

    };

    return (

        <div className="reset-container">

            <div className="reset-card">

                <div className="reset-header">

                    <h2>Reset Password</h2>

                    <p>
                        Enter the verification code sent to <strong>{email}</strong> and choose a new password.
                    </p>

                </div>

                <form
                    onSubmit={(e) => {

                        e.preventDefault();

                        handleResetPassword();

                    }}
                >

                    <div className="form-group">

                        <label>Verification Code</label>

                        <input
    type="text"
    name="otp"
    placeholder="123456"
    value={otp}
    onChange={(e) => setOtp(e.target.value)}
    maxLength={6}
    autoComplete="one-time-code"
    required
/>

                    </div>

                    <div className="form-group">

                        <label>New Password</label>

                        <input
                            type="password"
                            placeholder="Enter new password"
                            value={newPassword}
                            onChange={(e) =>
                                setNewPassword(e.target.value)
                            }
                            required
                        />

                    </div>

                    <div className="form-group">

                        <label>Confirm Password</label>

                        <input
                            type="password"
                            placeholder="Confirm new password"
                            value={confirmPassword}
                            onChange={(e) =>
                                setConfirmPassword(e.target.value)
                            }
                            required
                        />

                    </div>

                    <button
                        type="submit"
                        className="reset-btn"
                        disabled={
                            loading ||
                            !otp ||
                            !newPassword ||
                            !confirmPassword
                        }
                    >

                        {
                            loading
                                ? "Resetting..."
                                : "Reset Password"
                        }

                    </button>

                </form>

                <div className="reset-footer">

                    <Link to="/login">

                        ← Back to Login

                    </Link>

                </div>

            </div>

        </div>

    );

}