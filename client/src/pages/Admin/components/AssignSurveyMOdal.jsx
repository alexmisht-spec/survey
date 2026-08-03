import { useState } from "react";
import { assignSurvey } from "../../../api/admin.survey";
import "./AssignSurveyModal.css";

export default function AssignSurveyModal({
    open,
    survey,
    users = [],
    onClose,
    onAssigned,
}) {

    const [selectedUsers, setSelectedUsers] = useState([]);
    const [saving, setSaving] = useState(false);

    if (!open) return null;

    /*
    |--------------------------------------------------------------------------
    | SELECT / UNSELECT USER
    |--------------------------------------------------------------------------
    */

    function toggleUser(id) {

        setSelectedUsers((prev) =>

            prev.includes(id)
                ? prev.filter((userId) => userId !== id)
                : [...prev, id]

        );

    }

    /*
    |--------------------------------------------------------------------------
    | ASSIGN SURVEY
    |--------------------------------------------------------------------------
    */

    async function handleAssign() {

        if (selectedUsers.length === 0) {

            alert("Select at least one user.");
            return;

        }

        const payload = {
            userIds: selectedUsers,
        };

        console.log("Survey ID:", survey.id);
        console.log("Payload:", payload);

        try {

            setSaving(true);

            const response = await assignSurvey(
                survey.id,
                payload
            );

            console.log("Response:", response.data);

            alert("Survey assigned successfully.");

            setSelectedUsers([]);

            onAssigned?.();

            onClose();

        } catch (err) {

            console.error("Assign Error:", err);

            alert(
                err.response?.data?.message ||
                "Assignment failed."
            );

        } finally {

            setSaving(false);

        }

    }

    return (

        <div className="assign-overlay">

            <div className="assign-modal">

                <div className="assign-header">

                    <h2>Assign Survey</h2>

                    <button onClick={onClose}>
                        ✕
                    </button>

                </div>

                <div className="assign-body">

                    <h3>{survey?.title}</h3>

                    <p>Select verified users:</p>

                    {users.length === 0 ? (

                        <p>No verified users available.</p>

                    ) : (

                        users.map((user) => (

                            <label
                                key={user.id}
                                className="user-row"
                            >

                                <input
                                    type="checkbox"
                                    checked={selectedUsers.includes(user.id)}
                                    onChange={() => toggleUser(user.id)}
                                />

                                <div>

                                    <strong>
                                        {user.firstName} {user.lastName}
                                    </strong>

                                    <br />

                                    <small>
                                        {user.email}
                                    </small>

                                </div>

                            </label>

                        ))

                    )}

                </div>

                <div className="assign-footer">

                    <button onClick={onClose}>
                        Cancel
                    </button>

                    <button
                        onClick={handleAssign}
                        disabled={saving}
                    >
                        {saving ? "Assigning..." : "Assign Survey"}
                    </button>

                </div>

            </div>

        </div>

    );

}