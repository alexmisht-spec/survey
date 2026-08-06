import { useEffect, useState } from "react";
import { getPendingVerifications } from "../../api/admin.api";
import UserDetailsModal from "./components/UserDetailsModal";
import "./Users.css"

export default function Users() {

    const [pendingVerifications, setPendingVerifications] = useState([]);
    const [unverifiedUsers, setUnverifiedUsers] = useState([]);

    const [loading, setLoading] = useState(true);

    const [selectedVerification, setSelectedVerification] = useState(null);

    async function loadUsers() {

        try {

            const { data } = await getPendingVerifications();

            setPendingVerifications(data.pendingVerifications || []);

            setUnverifiedUsers(data.unverifiedUsers || []);

        }

        catch (error) {

            console.error(error);

        }

        finally {

            setLoading(false);

        }

    }

    useEffect(() => {

        loadUsers();

    }, []);

    if (loading) {

        return <h2>Loading...</h2>;

    }

    return (

        <div className="admin-page">

            <h1>User Verification Management</h1>

            {/* Pending Verification */}

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

            {/* Users Without Verification */}

            <div className="admin-section">

                <h2>Users Yet To Upload Documents</h2>

                <table className="admin-table">

                    <thead>

                        <tr>

                            <th>Name</th>

                            <th>Email</th>

                            <th>Phone</th>

                            <th>Account Status</th>

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