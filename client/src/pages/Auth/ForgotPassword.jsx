import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { forgotPasswordSendOTP } from "../../api/auth.api";
import toast from "react-hot-toast";
import "./ForgotPassword.css";

export default function ForgotPassword() {

    const navigate = useNavigate();

    const [email, setEmail] = useState("");

    const [loading, setLoading] = useState(false);

    async function handleSubmit(e) {

        e.preventDefault();

        try {

            setLoading(true);

            await forgotPasswordSendOTP(email);

            toast.success("Verification code sent to your email.");

            navigate("/reset-password", {
                state: {
                    email,
                },
            });

        }

        catch (err) {

            toast.error(
                err.response?.data?.message ||
                "Unable to send verification code."
            );

        }

        finally {

            setLoading(false);

        }

    }

    return (

        <div className="forgot-container">

            <div className="forgot-card">

                <div className="forgot-header">

                    <h2>Forgot Password?</h2>

                    <p>
                        Enter your registered email address and we'll send a verification code to reset your password.
                    </p>

                </div>

                <form
                    className="forgot-form"
                    onSubmit={handleSubmit}
                >

                    <div className="form-group">

                        <label>Email Address</label>

                        <input
                            type="email"
                            placeholder="john@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />

                    </div>

                    <button
                        type="submit"
                        className="forgot-btn"
                        disabled={loading}
                    >

                        {
                            loading
                                ? "Sending..."
                                : "Send Verification Code"
                        }

                    </button>

                </form>

                <div className="forgot-footer">

                    <span>Remember your password? </span>

                    <Link to="/login">
                        Sign In
                    </Link>

                </div>

            </div>

        </div>

    );

}