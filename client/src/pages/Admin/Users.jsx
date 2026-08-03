import { useEffect, useState } from "react";


import {
    getPendingVerifications
} from "../../api/admin.api";

import UserDetailsModal from "./components/UserDetailsModal";

export default function Users() {

    const [users, setUsers] = useState([]);

    const [loading, setLoading] = useState(true);
    const [selectedVerification, setSelectedVerification] = useState(null);


    async function loadUsers() {

        try {

            const { data } =
                await getPendingVerifications();

            setUsers(data.users);

        } catch (error) {

            console.error(error);

        } finally {

            setLoading(false);

        }

    }

   useEffect(() => {

    let mounted = true;

    async function fetchUsers() {

        try {

            const { data } = await getPendingVerifications();

            if (mounted) {

                setUsers(data.users);

            }

        } catch (error) {

            console.error(error);

        } finally {

            if (mounted) {

                setLoading(false);

            }

        }

    }

    fetchUsers();

    return () => {

        mounted = false;

    };

}, []);

    if (loading) {

        return <h2>Loading...</h2>;

    }

    return (

        <div className="admin-page">

            <h1>Pending Verifications</h1>

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

                    {users.map((item) => (

                        <tr key={item.id}>

                            <td>

                                {item.user.firstName}{" "}
                                {item.user.lastName}

                            </td>

                            <td>

                                {item.user.email}

                            </td>

                            <td>

                                {item.user.phone}

                            </td>

                            <td>

                                {item.status}

                            </td>

                            <td>

                                <button
                                    onClick={() =>
                                        setSelectedVerification(item.id)
                                    }
                                >
                                    View
                                </button>

                            </td>

                        </tr>

                    ))}

                </tbody>

            </table>

            {selectedVerification && (

               <UserDetailsModal
    verificationId={selectedVerification}
    onClose={() => setSelectedVerification(null)}
    refresh={loadUsers}
/>

            )}

        </div>

    );

}