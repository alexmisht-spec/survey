import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { useSearchParams } from "react-router-dom";
import "./Login.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function Login() {

    const navigate = useNavigate();

    const { login } = useAuth();

    const [email, setEmail] = useState("");

    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [searchParams] = useSearchParams();
    const [showPassword, setShowPassword] = useState(false);

    const expired = searchParams.get("expired");

   const handleSubmit = async (e) => {

    e.preventDefault();

    try {

        setLoading(true);

        const data = await login({

            email,
            password

        });

        // Admin goes to admin dashboard
        if (data.user.role === "ADMIN") {

            navigate("/admin/dashboard");
            return;

        }

        // User has never uploaded verification
        if (data.user.verificationStatus === "NOT_SUBMITTED") {

            navigate("/complete-profile");
            return;

        }

        // Verification submitted/approved/rejected
        navigate("/dashboard");

    } catch (error) {

        alert(

            error.response?.data?.message ||

            "Login failed."

        );

    } finally {

        setLoading(false);

    }

};
return (

  <>
    {expired && (
        <div className="session-expired">
            Your session expired. Please sign in again.
        </div>
    )}

    <div className="login-page">

        <div className="login-card">

            <div className="login-header">

                <h1>Welcome Back</h1>

                <p>
                    Sign in to continue to SurveyPool.
                </p>

            </div>

            <form
                onSubmit={handleSubmit}
                className="login-form"
            >

                <div className="input-group">

                    <label>Email Address</label>

                    <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) =>
                            setEmail(e.target.value)
                        }
                        required
                    />

                </div>

                <div className="input-group">

                    <label>Password</label>

                    <div className="password-wrapper">

                        <input
                            type={
                                showPassword
                                    ? "text"
                                    : "password"
                            }
                            placeholder="Enter password"
                            value={password}
                            onChange={(e) =>
                                setPassword(e.target.value)
                            }
                            required
                        />

                        <button
                            type="button"
                            className="show-password"
                            onClick={() =>
                                setShowPassword(!showPassword)
                            }
                        >
                            {showPassword
                                ? <FaEyeSlash />
                                : <FaEye />}
                        </button>

                    </div>

                </div>

                <div className="forgot-row">

                    <button
                        type="button"
                        className="forgot-password"
                        onClick={() =>
                            navigate("/forgot-password")
                        }
                    >
                        Forgot Password?
                    </button>

                </div>

                <button
                    className="login-btn"
                    disabled={loading}
                    type="submit"
                >
                    {loading
                        ? "Signing In..."
                        : "Login"}
                </button>

            </form>

            <div className="login-footer">

                Don't have an account?

                <button
                    type="button"
                    onClick={() => navigate("/register")}
                >
                    Register
                </button>

            </div>

        </div>

    </div>
</>

);
}