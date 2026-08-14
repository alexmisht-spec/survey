import { useEffect, useState } from "react";

import { getPendingVerifications } from "../../api/admin.api";

import {
    getEmailUsers,
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
    | LOAD USERS / VERIFICATIONS / EMAIL DATA
    |--------------------------------------------------------------------------
    */

    async function loadUsers() {

        try {

            setLoading(true);


            const [
                verificationResult,
                emailUsersResult,
                templatesResult
            ] = await Promise.allSettled([

                getPendingVerifications(),

                getEmailUsers(),

                getEmailTemplates()

            ]);


            /*
            |--------------------------------------------------------------------------
            | VERIFICATION DATA
            |--------------------------------------------------------------------------
            */

            if (
                verificationResult.status === "fulfilled"
            ) {

                const data =
                    verificationResult.value?.data || {};


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
            | ALL USERS FOR EMAIL CAMPAIGNS
            |--------------------------------------------------------------------------
            */

            if (
                emailUsersResult.status === "fulfilled"
            ) {

                const data =
                    emailUsersResult.value?.data || {};


                setEmailUsers(
                    Array.isArray(data.users)
                        ? data.users
                        : []
                );

            } else {

                console.error(
                    "Failed to load email users:",
                    emailUsersResult.reason
                );


                setEmailUsers([]);

            }


            /*
            |--------------------------------------------------------------------------
            | EMAIL TEMPLATES
            |--------------------------------------------------------------------------
            */

            if (
                templatesResult.status === "fulfilled"
            ) {

                const data =
                    templatesResult.value?.data || {};


                setTemplates(
                    Array.isArray(data.templates)
                        ? data.templates
                        : []
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


    /*
    |--------------------------------------------------------------------------
    | INITIAL LOAD
    |--------------------------------------------------------------------------
    */

    useEffect(() => {

        loadUsers();

    }, []);


    /*
    |--------------------------------------------------------------------------
    | SEND EMAIL
    |--------------------------------------------------------------------------
    */

    async function handleSendEmail() {

        if (!selectedUser) {

            alert("Select a user first.");

            return;

        }


        if (!selectedTemplate) {

            alert("Select an email template.");

            return;

        }


        if (!selectedUser.email) {

            alert(
                "This user does not have a valid email address."
            );

            return;

        }


        const confirmed =
            window.confirm(
                `Send this email to ${selectedUser.email}?`
            );


        if (!confirmed) {

            return;

        }


        try {

            setSending(true);


            const response =
                await sendAdminEmail({

                    userId: selectedUser.id,

                    templateId: selectedTemplate

                });


            alert(
                response?.data?.message ||
                "Email sent successfully."
            );


        } catch (error) {

            console.error(
                "SEND EMAIL ERROR:",
                error
            );


            alert(
                error.response?.data?.message ||
                "Failed to send email."
            );

        } finally {

            setSending(false);

        }

    }


    /*
    |--------------------------------------------------------------------------
    | LOADING
    |--------------------------------------------------------------------------
    */

    if (loading) {

        return (

            <div className="admin-page">

                <h2>Loading...</h2>

            </div>

        );

    }


    /*
    |--------------------------------------------------------------------------
    | RENDER
    |--------------------------------------------------------------------------
    */

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

                                        {item.user?.firstName || ""}{" "}

                                        {item.user?.lastName || ""}

                                    </td>


                                    <td>

                                        {item.user?.email || "-"}

                                    </td>


                                    <td>

                                        {item.user?.phone || "-"}

                                    </td>


                                    <td>

                                        {item.status || "-"}

                                    </td>


                                    <td>

                                        <button
                                            onClick={() =>
                                                setSelectedVerification(
                                                    item.id
                                                )
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

                                        {user.firstName || ""}{" "}

                                        {user.lastName || ""}

                                    </td>


                                    <td>

                                        {user.email || "-"}

                                    </td>


                                    <td>

                                        {user.phone || "-"}

                                    </td>


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
                EMAIL CAMPAIGN
            ========================================================== */}

            <div className="admin-section">

                <h2>Email Campaign</h2>


                <p className="section-description">

                    Select any registered user and send them an email
                    using an active email template.

                </p>


                <div className="email-grid">


                    {/* ======================================================
                        ALL USERS
                    ====================================================== */}

                    <div className="email-card">

                        <h3>

                            Select User

                        </h3>


                        <p>

                            {emailUsers.length} user
                            {emailUsers.length === 1 ? "" : "s"} available

                        </p>


                        <div className="user-list">

                            {emailUsers.length === 0 ? (

                                <p>

                                    No users available.

                                </p>

                            ) : (

                                emailUsers.map((user) => (

                                    <div
                                        key={user.id}

                                        className={
                                            selectedUser?.id === user.id
                                                ? "user-item active"
                                                : "user-item"
                                        }

                                        onClick={() =>
                                            setSelectedUser(user)
                                        }
                                    >

                                        <strong>

                                            {user.firstName || ""}{" "}

                                            {user.lastName || ""}

                                        </strong>


                                        <span>

                                            {user.email}

                                        </span>


                                        <small>

                                            {user.status}

                                        </small>

                                    </div>

                                ))

                            )}

                        </div>

                    </div>


                    {/* ======================================================
                        EMAIL TEMPLATE
                    ====================================================== */}

                    <div className="email-card">

                        <h3>

                            Email Template

                        </h3>


                        <select
                            value={selectedTemplate}

                            onChange={(e) =>
                                setSelectedTemplate(
                                    e.target.value
                                )
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


                        {templates.length === 0 && (

                            <p>

                                No active email templates available.

                            </p>

                        )}


                        {/* ==================================================
                            RECIPIENT
                        ================================================== */}

                        {selectedUser && (

                            <div className="recipient-box">

                                <h4>

                                    Recipient

                                </h4>


                                <p>

                                    <strong>

                                        {selectedUser.firstName || ""}{" "}

                                        {selectedUser.lastName || ""}

                                    </strong>

                                </p>


                                <p>

                                    {selectedUser.email}

                                </p>


                                <p>

                                    Status:{" "}

                                    <strong>

                                        {selectedUser.status}

                                    </strong>

                                </p>

                            </div>

                        )}


                        {/* ==================================================
                            SEND BUTTON
                        ================================================== */}

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
                                : "Send Email"}

                        </button>

                    </div>

                </div>

            </div>


            {/* ==========================================================
                VERIFICATION MODAL
            ========================================================== */}

            {selectedVerification && (

                <UserDetailsModal

                    verificationId={
                        selectedVerification
                    }

                    onClose={() =>
                        setSelectedVerification(null)
                    }

                    refresh={loadUsers}

                />

            )}

        </div>

    );

}