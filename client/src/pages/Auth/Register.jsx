import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import toast from "react-hot-toast";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./Register.css";

export default function Register() {

    const navigate = useNavigate();

    const { register } = useAuth();

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {

        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });

    };

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (form.password !== form.confirmPassword) {

        return toast.error("Passwords do not match.");

    }

    try {

        setLoading(true);

        const data = await register({

            firstName: form.firstName,
            lastName: form.lastName,
            email: form.email,
            phone: form.phone,
            password: form.password,

        });

        toast.success("Account created successfully!");

        if (data.user.role === "ADMIN") {

            navigate("/admin/dashboard");

        } else if (data.user.verificationStatus === "NOT_SUBMITTED") {

            navigate("/complete-profile");

        } else {

            navigate("/dashboard");

        }

    } catch (error) {

        toast.error(

            error.response?.data?.message ||

            "Registration failed."

        );

    } finally {

        setLoading(false);

    }

};

    return (

        <div className="register-container">

            <div className="register-card">

                <div className="register-header">

                    <h2>Create Account</h2>

                    <p>
                        Join SurveyPool and start earning from surveys.
                    </p>

                </div>

                <form
                    onSubmit={handleSubmit}
                    className="register-form"
                >

                    <div className="form-grid">

                        <div className="form-group">

                            <label>First Name</label>

                            <input
                                type="text"
                                name="firstName"
                                placeholder="John"
                                value={form.firstName}
                                onChange={handleChange}
                                required
                            />

                        </div>

                        <div className="form-group">

                            <label>Last Name</label>

                            <input
                                type="text"
                                name="lastName"
                                placeholder="Doe"
                                value={form.lastName}
                                onChange={handleChange}
                                required
                            />

                        </div>

                    </div>

                    <div className="form-group">

                        <label>Email Address</label>

                        <input
                            type="email"
                            name="email"
                            placeholder="john@example.com"
                            value={form.email}
                            onChange={handleChange}
                            required
                        />

                    </div>

                    <div className="form-group">

                        <label>Phone Number</label>

                        <input
                            type="tel"
                            name="phone"
                            placeholder="07XXXXXXXX"
                            value={form.phone}
                            onChange={handleChange}
                            required
                        />

                    </div>

                    <div className="form-group">

                        <label>Password</label>

                        <div className="password-field">

                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                placeholder="Enter password"
                                value={form.password}
                                onChange={handleChange}
                                required
                            />

                            <button
                                type="button"
                                className="password-toggle"
                                onClick={() =>
                                    setShowPassword(!showPassword)
                                }
                            >

                                {showPassword ? <FaEyeSlash /> : <FaEye />}

                            </button>

                        </div>

                    </div>

                    <div className="form-group">

                        <label>Confirm Password</label>

                        <div className="password-field">

                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                name="confirmPassword"
                                placeholder="Confirm password"
                                value={form.confirmPassword}
                                onChange={handleChange}
                                required
                            />

                            <button
                                type="button"
                                className="password-toggle"
                                onClick={() =>
                                    setShowConfirmPassword(!showConfirmPassword)
                                }
                            >

                                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}

                            </button>

                        </div>

                    </div>

                    <label className="terms-check">

                        <input
                            type="checkbox"
                            required
                        />

                        <span>

                            I agree to the{" "}
                            <strong>Terms & Conditions</strong>
                            {" "}and{" "}
                            <strong>Privacy Policy</strong>.

                        </span>

                    </label>

                    <button
                        type="submit"
                        className="register-btn"
                        disabled={loading}
                    >

                        {
                            loading
                                ? "Creating Account..."
                                : "Create Account"
                        }

                    </button>

                </form>

                <div className="register-footer">

                    Already have an account?{" "}

                    <Link to="/login">

                        Sign In

                    </Link>

                </div>

            </div>

        </div>

    );

}
