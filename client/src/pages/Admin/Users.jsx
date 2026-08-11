import { useEffect, useState } from "react";
import { getPendingVerifications } from "../../api/admin.api";
import {
    getUnverifiedUsers,
    getEmailTemplates,
    sendAdminEmail
} from "../../api/admin.email";

import UserDetailsModal from "./components/UserDetailsModal";
import "./Users.css";

export default function Users() {

    const [pendingVerifications, setPendingVerifications] = useState([]);
    const [unverifiedUsers, setUnverifiedUsers] = useState([]);

    const [emailUsers, setEmailUsers] = useState([]);
    const [templates, setTemplates] = useState([]);

    const [selectedVerification, setSelectedVerification] = useState(null);

    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedTemplate, setSelectedTemplate] = useState("");

    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);

    /*
    |--------------------------------------------------------------------------
    | LOAD EVERYTHING
    |--------------------------------------------------------------------------
    */

async function loadUsers() {

    try {

        setLoading(true);

        /*
        |--------------------------------------------------------------------------
        | LOAD ALL DATA INDEPENDENTLY
        |--------------------------------------------------------------------------
        |
        | A failure in email templates must NOT prevent the verification
        | and user lists from loading.
        |
        */

        const [
            verificationResult,
            usersResult,
            templatesResult
        ] = await Promise.allSettled([

            getPendingVerifications(),

            getUnverifiedUsers(),

            getEmailTemplates()

        ]);


        /*
        |--------------------------------------------------------------------------
        | PENDING VERIFICATIONS + USERS WITHOUT DOCUMENTS
        |--------------------------------------------------------------------------
        */

        if (verificationResult.status === "fulfilled") {

            const data = verificationResult.value.data;

            setPendingVerifications(
                data.pendingVerifications || []
            );

            setUnverifiedUsers(
                data.unverifiedUsers || []
            );

        } else {

            console.error(
                "Failed to load verification data:",
                verificationResult.reason
            );

            setPendingVerifications([]);

            setUnverifiedUsers([]);

        }


        /*
        |--------------------------------------------------------------------------
        | EMAIL CAMPAIGN USERS
        |--------------------------------------------------------------------------
        */

        if (usersResult.status === "fulfilled") {

            const data = usersResult.value.data;

            setEmailUsers(
                data.users || []
            );

        } else {

            console.error(
                "Failed to load email users:",
                usersResult.reason
            );

            setEmailUsers([]);

        }


        /*
        |--------------------------------------------------------------------------
        | EMAIL TEMPLATES
        |--------------------------------------------------------------------------
        |
        | If this request returns 500, the rest of the page still works.
        |
        */

        if (templatesResult.status === "fulfilled") {

            const data = templatesResult.value.data;

            setTemplates(
                data.templates || []
            );

        } else {

            console.error(
                "Failed to load email templates:",
                templatesResult.reason
            );

            setTemplates([]);

        }

    } catch (error) {

        console.error(
            "LOAD USERS ERROR:",
            error
        );

    } finally {

        setLoading(false);

    }

}



    useEffect(() => {

        loadUsers();

    }, []);

    /*
    |--------------------------------------------------------------------------
    | SEND FOLLOW-UP EMAIL
    |--------------------------------------------------------------------------
    */

    async function handleSendEmail() {

        if (!selectedUser) {

            return alert("Select a user first.");

        }

        if (!selectedTemplate) {

            return alert("Select an email template.");

        }

        const confirmed = window.confirm(
            `Send this email to ${selectedUser.email}?`
        );

        if (!confirmed) return;

        try {

            setSending(true);

            const { data } = await sendAdminEmail({

                userId: selectedUser.id,

                templateId: selectedTemplate

            });

            alert(data.message);

        } catch (error) {

            alert(
                error.response?.data?.message ||
                "Failed to send email."
            );

        } finally {

            setSending(false);

        }

    }

    if (loading) {

        return <h2>Loading...</h2>;

    }

    return (

        <div className="admin-page">

            <h1>User Verification Management</h1>

            {/* ==========================================================
                PENDING VERIFICATIONS
            ========================================================== */}

            <div className="admin-section">

                <h2>Pending Verification Requests</h2>

                <table className="admin-table">

                    <thead>

                        <tr>

                            <th>Name</th>

                            <th>Email</th>

                            <th>Phone</th>

                            <th>Status</th>

                            <th>Action</th>

                        </tr>

                    </thead>

                    <tbody>

                        {pendingVerifications.length === 0 ? (

                            <tr>

                                <td colSpan="5">

                                    No pending verification requests.

                                </td>

                            </tr>

                        ) : (

                            pendingVerifications.map((item) => (

                                <tr key={item.id}>

                                    <td>

                                        {item.user.firstName}{" "}
                                        {item.user.lastName}

                                    </td>

                                    <td>{item.user.email}</td>

                                    <td>{item.user.phone}</td>

                                    <td>{item.status}</td>

                                    <td>

                                        <button
                                            onClick={() =>
                                                setSelectedVerification(item.id)
                                            }
                                        >
                                            Review
                                        </button>

                                    </td>

                                </tr>

                            ))

                        )}

                    </tbody>

                </table>

            </div>

            {/* ==========================================================
                USERS WITHOUT DOCUMENTS
            ========================================================== */}

            <div className="admin-section">

                <h2>Users Yet To Upload Documents</h2>

                <table className="admin-table">

                    <thead>

                        <tr>

                            <th>Name</th>

                            <th>Email</th>

                            <th>Phone</th>

                            <th>Status</th>

                        </tr>

                    </thead>

                    <tbody>

                        {unverifiedUsers.length === 0 ? (

                            <tr>

                                <td colSpan="4">

                                    All users have submitted documents.

                                </td>

                            </tr>

                        ) : (

                            unverifiedUsers.map((user) => (

                                <tr key={user.id}>

                                    <td>

                                        {user.firstName}{" "}
                                        {user.lastName}

                                    </td>

                                    <td>{user.email}</td>

                                    <td>{user.phone}</td>

                                    <td>

                                        <span className="badge badge-warning">

                                            Documents Not Submitted

                                        </span>

                                    </td>

                                </tr>

                            ))

                        )}

                    </tbody>

                </table>

            </div>

            {/* ==========================================================
                EMAIL FOLLOW-UP
            ========================================================== */}

            <div className="admin-section">

                <h2>Follow-up Email Campaign</h2>

                <p className="section-description">

                    Recover users who registered but never completed verification.

                </p>

                <div className="email-grid">

                    {/* USERS */}

                    <div className="email-card">

                        <h3>Select User</h3>

                        <div className="user-list">

                            {emailUsers.map((user) => (

                                <div
                                    key={user.id}
                                    className={
                                        selectedUser?.id === user.id
                                            ? "user-item active"
                                            : "user-item"
                                    }
                                    onClick={() => setSelectedUser(user)}
                                >

                                    <strong>

                                        {user.firstName} {user.lastName}

                                    </strong>

                                    <span>{user.email}</span>

                                    <small>{user.status}</small>

                                </div>

                            ))}

                        </div>

                    </div>

                    {/* TEMPLATE */}

                    <div className="email-card">

                        <h3>Email Template</h3>

                        <select
                            value={selectedTemplate}
                            onChange={(e) =>
                                setSelectedTemplate(e.target.value)
                            }
                        >

                            <option value="">

                                Select Template

                            </option>

                            {templates.map((template) => (

                                <option
                                    key={template.id}
                                    value={template.id}
                                >

                                    {template.name}

                                </option>

                            ))}

                        </select>

                        {selectedUser && (
                            <div className="recipient-box">

                                <h4>Recipient</h4>

                                <p>

                                    <strong>
                                        {selectedUser.firstName}{" "}
                                        {selectedUser.lastName}
                                    </strong>

                                </p>

                                <p>{selectedUser.email}</p>

                            </div>
                        )}

                        <button
                            className="send-email-btn"
                            disabled={
                                sending ||
                                !selectedUser ||
                                !selectedTemplate
                            }
                            onClick={handleSendEmail}
                        >

                            {sending
                                ? "Sending..."
                                : "Send Follow-up Email"}

                        </button>

                    </div>

                </div>

            </div>

            {selectedVerification && (

                <UserDetailsModal
                    verificationId={selectedVerification}
                    onClose={() =>
                        setSelectedVerification(null)
                    }
                    refresh={loadUsers}
                />

            )}

        </div>

    );

}