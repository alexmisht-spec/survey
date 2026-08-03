import { useEffect, useState } from "react";
import {
    getAssignments,
    markRewardPaid,
    deleteAssignment,
} from "../../api/admin.survey";

import "./SurveyAssignments.css";

export default function SurveyAssignments({

    survey,
    open,
    onClose,

}) {

    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);

    async function loadAssignments() {

        if (!survey) return;

        try {

            setLoading(true);

            const res = await getAssignments(survey.id);

            setAssignments(res.data.assignments);

        } catch (err) {

            console.error(err);

        } finally {

            setLoading(false);

        }

    }

   useEffect(() => {

    if (!open || !survey) return;

    async function fetchAssignments() {

        try {

            setLoading(true);

            const res = await getAssignments(survey.id);

            setAssignments(res.data.assignments);

        } catch (err) {

            console.error(err);

        } finally {

            setLoading(false);

        }

    }

    fetchAssignments();

}, [open, survey]);

    async function handlePaid(id) {

        try {

            await markRewardPaid(id);

            loadAssignments();

        } catch (err) {

            console.error(err);

        }

    }

    async function handleDelete(id) {

        if (!window.confirm("Remove this assignment?")) {

            return;

        }

        try {

            await deleteAssignment(id);

            loadAssignments();

        } catch (err) {

            console.error(err);

        }

    }

    if (!open) return null;

    return (

        <div className="assignments-overlay">

            <div className="assignments-modal">

                <div className="assignments-header">

                    <h2>

                        {survey.title}

                    </h2>

                    <button onClick={onClose}>

                        ✕

                    </button>

                </div>

                {loading ? (

                    <p>Loading...</p>

                ) : (

                    <table>

                        <thead>

                            <tr>

                                <th>User</th>
                                <th>Email</th>
                                <th>Started</th>
                                <th>Completed</th>
                                <th>Reward</th>
                                <th>Actions</th>

                            </tr>

                        </thead>

                        <tbody>

                            {assignments.map((assignment) => (

                                <tr key={assignment.id}>

                                    <td>

                                        {assignment.user.firstName}{" "}
                                        {assignment.user.lastName}

                                    </td>

                                    <td>

                                        {assignment.user.email}

                                    </td>

                                    <td>

                                        {assignment.started ? "✅" : "❌"}

                                    </td>

                                    <td>

                                        {assignment.completed ? "✅" : "❌"}

                                    </td>

                                    <td>

                                        {assignment.rewardPaid ? "✅ Paid" : "❌"}

                                    </td>

                                    <td>

                                        {!assignment.rewardPaid && (

                                            <button
                                                onClick={() =>
                                                    handlePaid(assignment.id)
                                                }
                                            >

                                                Mark Paid

                                            </button>

                                        )}

                                        <button
                                            onClick={() =>
                                                handleDelete(assignment.id)
                                            }
                                        >

                                            Remove

                                        </button>

                                    </td>

                                </tr>

                            ))}

                        </tbody>

                    </table>

                )}

            </div>

        </div>

    );

}