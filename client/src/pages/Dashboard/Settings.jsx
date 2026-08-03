import { useEffect, useState } from "react";
import {
    FaUser,
    FaPhone,
    FaEnvelope,
    FaSave,
    FaMobileAlt,
    FaWallet,
    FaLock,
    FaKey,
    FaBell,
    FaExclamationTriangle
} from "react-icons/fa";
import toast from "react-hot-toast";
import {
    sendPasswordOTP,
    changePassword,
    updateProfile
} from "../../api/settings.api";

import useAuth from "../../hooks/useAuth";
import "./Settings.css";

export default function SettingsPage() {

    const { user } = useAuth();
    const [currentPassword, setCurrentPassword] = useState("");

    const [otp, setOtp] = useState("");

    const [newPassword, setNewPassword] = useState("");

    const [confirmPassword, setConfirmPassword] = useState("");

    const [otpSent, setOtpSent] = useState(false);

    const [loading, setLoading] = useState(false);

    const [profile, setProfile] = useState({

        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        mpesaNumber: "",

    });

    useEffect(() => {

        if (!user) return;

        setProfile({

            firstName: user.firstName || "",
            lastName: user.lastName || "",
            email: user.email || "",
            phone: user.phone || "",
            mpesaNumber:
                user.profile?.mpesaNumber ||
                user.mpesaNumber ||
                "",

        });

    }, [user]);

    const handleChange = (e) => {

        setProfile({

            ...profile,
            [e.target.name]: e.target.value,

        });

    };
    const handleSendOTP = async () => {

    try {

        setLoading(true);

        const res = await sendPasswordOTP(currentPassword);

        toast.success(res.data.message);

        setOtpSent(true);

    }

    catch (err) {

        toast.error(

            err.response?.data?.message ||

            "Failed to send OTP."

        );

    }

    finally {

        setLoading(false);

    }

};
const handleChangePassword = async () => {

    try {

        setLoading(true);

        const res = await changePassword({

            otp,

            newPassword,

            confirmPassword,

        });

        toast.success(res.data.message);

        setCurrentPassword("");

        setOtp("");

        setNewPassword("");

        setConfirmPassword("");

        setOtpSent(false);

    }

    catch (err) {

        toast.error(

            err.response?.data?.message ||

            "Failed to change password."

        );

    }

    finally {

        setLoading(false);

    }

};

    const handleUpdateProfile = async (e) => {

    e.preventDefault();

    try {

        setLoading(true);

        const { data } = await updateProfile({

            firstName: profile.firstName,
            lastName: profile.lastName,
            phone: profile.phone,

        });

        toast.success(data.message);

    }

    catch (err) {

        toast.error(

            err.response?.data?.message ||

            "Failed to update profile."

        );

    }

    finally {

        setLoading(false);

    }

};

    const handleUpdatePayment = (e) => {

    e.preventDefault();

    toast.success(

        "MPESA number is your phone number. Update your phone number above to change it."

    );

};

    return (

        <div className="settings-page">

            <div className="settings-header">

                <h1>

                    Account Settings

                </h1>

                <p>

                    Manage your account information and payment details.

                </p>

            </div>

            {/* ================= PERSONAL INFO ================= */}

            <div className="settings-card">

                <div className="settings-title">

                    <FaUser />

                    <h2>

                        Personal Information

                    </h2>

                </div>

                <form
                    onSubmit={handleUpdateProfile}
                    className="settings-form"
                >

                    <div className="form-grid">

                        <div>

                            <label>

                                First Name

                            </label>

                            <div className="input-icon">

                                <FaUser />

                                <input
                                    name="firstName"
                                    value={profile.firstName}
                                    onChange={handleChange}
                                />

                            </div>

                        </div>

                        <div>

                            <label>

                                Last Name

                            </label>

                            <div className="input-icon">

                                <FaUser />

                                <input
                                    name="lastName"
                                    value={profile.lastName}
                                    onChange={handleChange}
                                />

                            </div>

                        </div>

                    </div>

                    <div className="form-grid">

                        <div>

                            <label>

                                Email Address

                            </label>

                            <div className="input-icon readonly">

                                <FaEnvelope />

                                <input
                                    value={profile.email}
                                    readOnly
                                />

                            </div>

                        </div>

                        <div>

                            <label>

                                Phone Number

                            </label>

                            <div className="input-icon">

                                <FaPhone />

                                <input
                                    name="phone"
                                    value={profile.phone}
                                    onChange={handleChange}
                                />

                            </div>

                        </div>

                    </div>

                    <button
                        className="save-btn"
                        type="submit"
                    >

                        <FaSave />

                        Save Changes

                    </button>

                </form>

            </div>

            {/* ================= PAYMENT ================= */}

            <div className="settings-card">

                <div className="settings-title">

                    <FaWallet />

                    <h2>

                        Payment Method

                    </h2>

                </div>

                <form
                    onSubmit={handleUpdatePayment}
                    className="settings-form"
                >

                    <label>

                        M-Pesa Number

                    </label>

                    <div className="input-icon">

                        <FaMobileAlt />

                        <input
                            name="mpesaNumber"
                            value={profile.mpesaNumber}
                            onChange={handleChange}
                            placeholder="07XXXXXXXX"
                        />

                    </div>

                    <button
                        className="save-btn"
                        type="submit"
                    >

                        <FaSave />

                        Update Payment Method

                    </button>

                </form>

            </div>
            
      {/* ================= SECURITY ================= */}

<div className="settings-card">

    <div className="settings-title">

        <FaLock />

        <h2>Security</h2>

    </div>

    <div className="settings-form">

        {/* STEP 1 */}

        <label>Current Password</label>

        <div className="input-icon">

            <FaKey />

            <input
                type="password"
                value={currentPassword}
                onChange={(e) =>
                    setCurrentPassword(e.target.value)
                }
                placeholder="Current Password"
            />

        </div>

        {!otpSent && (

            <button
                className="save-btn"
                onClick={handleSendOTP}
                disabled={loading}
                type="button"
            >

                {loading
                    ? "Sending OTP..."
                    : "Send Verification Code"}

            </button>

        )}

        {/* STEP 2 */}

        {otpSent && (

            <>

                <label>Email Verification Code</label>

                <div className="input-icon">

                    <FaKey />

                    <input
                        value={otp}
                        onChange={(e) =>
                            setOtp(e.target.value)
                        }
                        placeholder="Enter the 6-digit code"
                    />

                </div>

                <label>New Password</label>

                <div className="input-icon">

                    <FaLock />

                    <input
                        type="password"
                        value={newPassword}
                        onChange={(e) =>
                            setNewPassword(e.target.value)
                        }
                        placeholder="New Password"
                    />

                </div>

                <label>Confirm Password</label>

                <div className="input-icon">

                    <FaLock />

                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) =>
                            setConfirmPassword(e.target.value)
                        }
                        placeholder="Confirm Password"
                    />

                </div>

                <button
                    className="save-btn"
                    onClick={handleChangePassword}
                    disabled={loading}
                    type="button"
                >

                    {loading
                        ? "Updating..."
                        : "Change Password"}

                </button>

            </>

        )}

    </div>

</div>

            {/* ================= NOTIFICATIONS ================= */}

            <div className="settings-card">

    <div className="settings-title">

        <FaBell />

        <h2>

            Notification Preferences

        </h2>

    </div>

    <div className="notification-item">

        <div>

            <h4>Email Notifications</h4>

            <p>
                Receive important updates by email.
            </p>

        </div>

        <label className="switch">

            <input
                type="checkbox"
                defaultChecked
            />

            <span className="slider"></span>

        </label>

    </div>

    <div className="notification-item">

        <div>

            <h4>Survey Alerts</h4>

            <p>
                Notify me when new surveys are assigned.
            </p>

        </div>

        <label className="switch">

            <input
                type="checkbox"
                defaultChecked
            />

            <span className="slider"></span>

        </label>

    </div>

    <div className="notification-item">

        <div>

            <h4>Withdrawal Updates</h4>

            <p>
                Get notified when withdrawals are approved.
            </p>

        </div>

        <label className="switch">

            <input
                type="checkbox"
                defaultChecked
            />

            <span className="slider"></span>

        </label>

    </div>

            </div>

            {/* ================= DANGER ================= */}

             <div className="settings-card danger-card">

    <div className="settings-title">

        <FaExclamationTriangle />

        <h2>

            Danger Zone

        </h2>

    </div>

         <p className="danger-text">
            Logging out will immediately end your current session.
            Account deletion is currently disabled for security reasons.
        </p>

        < div className="danger-actions">



        <button
            className="danger-btn"
        >

            Logout Everywhere

        </button>

        <button
            className="danger-btn"
            disabled
            style={{
                opacity:.5,
                cursor:"not-allowed"
            }}
        >

            Delete Account (Coming Soon)

        </button>

    </div>

             </div>
        </div>

    );

}