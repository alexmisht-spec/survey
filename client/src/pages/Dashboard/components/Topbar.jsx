import { useState, useEffect, useRef } from "react";
import {
    FaBell,
    FaBars,
    FaChevronDown
} from "react-icons/fa";

import useAuth from "../../../hooks/useAuth";

import {
    getNotifications,
    markAllNotificationsRead
} from "../../../api/notification";

import "./Topbar.css";

export default function Topbar({ onMenuToggle }) {

    const { user, logout } = useAuth();

    const [profileOpen, setProfileOpen] = useState(false);

    const [notificationOpen, setNotificationOpen] = useState(false);

    const [notifications, setNotifications] = useState([]);

    const profileRef = useRef(null);

    const notificationRef = useRef(null);

    async function loadNotifications() {

        try {

            const { data } = await getNotifications();

            setNotifications(data.notifications || []);

        }

        catch (err) {

            console.error(err);

        }

    }

    useEffect(() => {

        loadNotifications();

        const interval = setInterval(() => {

            loadNotifications();

        }, 30000);

        return () => clearInterval(interval);

    }, []);

    useEffect(() => {

        function handleOutside(e) {

            if (
                notificationRef.current &&
                !notificationRef.current.contains(e.target)
            ) {

                setNotificationOpen(false);

            }

            if (
                profileRef.current &&
                !profileRef.current.contains(e.target)
            ) {

                setProfileOpen(false);

            }

        }

        document.addEventListener("mousedown", handleOutside);

        return () => {

            document.removeEventListener(
                "mousedown",
                handleOutside
            );

        };

    }, []);

    const unread = notifications.filter(

        n => !n.read

    ).length;

    async function handleReadAll() {

        try {

            await markAllNotificationsRead();

            await loadNotifications();

        }

        catch (err) {

            console.error(err);

        }

    }

    return (

        <header className="topbar">

            <button
                className="mobile-menu-btn"
                onClick={onMenuToggle}
            >

                <FaBars />

            </button>

            <div className="topbar-title">

                <h2>Dashboard</h2>

            </div>

            <div className="topbar-actions">

                {/* ================= NOTIFICATIONS ================= */}

                <div
                    className="notification-wrapper"
                    ref={notificationRef}
                >

                    <button
                        className="notification-btn"
                        onClick={() =>
                            setNotificationOpen(prev => !prev)
                        }
                    >

                        <FaBell />

                        {unread > 0 && (

                            <span className="notification-count">

                                {unread}

                            </span>

                        )}

                    </button>

                    {notificationOpen && (

                        <div className="notification-dropdown">

                            <div className="notification-header">

                                <h4>

                                    Notifications

                                </h4>

                                {notifications.length > 0 && (

                                    <button
                                        onClick={handleReadAll}
                                    >

                                        Mark all read

                                    </button>

                                )}

                            </div>

                            {notifications.length === 0 ? (

                                <div className="notification-empty">

                                    No notifications.

                                </div>

                            ) : (

                                notifications
                                    .slice(0, 5)
                                    .map(notification => (

                                        <div
                                            key={notification.id}
                                            className={`notification-item ${!notification.read ? "unread" : ""}`}
                                        >

                                            <strong>

                                                {notification.title}

                                            </strong>

                                            <p>

                                                {notification.message}

                                            </p>

                                        </div>

                                    ))

                            )}

                        </div>

                    )}

                </div>

                {/* ================= PROFILE ================= */}

                <div
                    className="profile-menu"
                    ref={profileRef}
                >

                    <button
                        className="profile-trigger"
                        onClick={() =>
                            setProfileOpen(prev => !prev)
                        }
                    >

                        <div className="profile-avatar">

                            {user?.firstName?.charAt(0)}

                        </div>

                        <span>

                            {user?.firstName}

                        </span>

                        <FaChevronDown />

                    </button>

                    {profileOpen && (

                        <div className="profile-dropdown">

                            <button>

                                Profile

                            </button>

                            <button>

                                Settings

                            </button>

                            <button
                                onClick={logout}
                            >

                                Logout

                            </button>

                        </div>

                    )}

                </div>

            </div>

        </header>

    );

}