import { useEffect, useState } from "react";

import CreateSurveyModal from "./components/CreateSurveyModal";
import ViewSurveyModal from "./components/ViewSurveyModal";
import AssignSurveyModal from "./components/AssignSurveyMOdal";
import SurveyAssignments from "./SurveyAssignments";
import "./AdminSurveys.css"

import {
    getSurveys,
    deleteSurvey,
    activateSurvey,
    getVerifiedUsers,

} from "../../api/admin.survey";


export default function Surveys() {

    const [surveys, setSurveys] = useState([]);
    const [loading, setLoading] = useState(true);

    const [openModal, setOpenModal] = useState(false);
    const [viewOpen, setViewOpen] = useState(false);
    const [assignOpen, setAssignOpen] = useState(false);

    const [selectedSurvey, setSelectedSurvey] = useState(null);
    const [verifiedUsers, setVerifiedUsers] = useState([]);
    const [assignmentsOpen, setAssignmentsOpen] = useState(false);


    /*
    |--------------------------------------------------------------------------
    | LOAD SURVEYS
    |--------------------------------------------------------------------------
    */

    async function loadSurveys() {

        try {

            setLoading(true);

            const { data } = await getSurveys();

            setSurveys(data.surveys);

        } catch (error) {

            console.error(error);

        } finally {

            setLoading(false);

        }

    }
    /*
|--------------------------------------------------------------------------
| DELETE SURVEY
|--------------------------------------------------------------------------
*/

async function handleDelete(id) {

    const confirmed = window.confirm(
        "Delete this survey permanently?"
    );

    if (!confirmed) return;

    try {

        await deleteSurvey(id);

        alert("Survey deleted successfully.");

        loadSurveys();

    } catch (error) {

        console.error(error);

        alert(
            error.response?.data?.message ||
            "Failed to delete survey."
        );

    }

}

/*
|--------------------------------------------------------------------------
| ACTIVATE SURVEY
|--------------------------------------------------------------------------
*/

async function handleActivate(id) {

    const confirmed = window.confirm(
        "Activate this survey?\n\nThe currently active survey will automatically become Coming Soon."
    );

    if (!confirmed) return;

    try {

        await activateSurvey(id);

        alert("Survey activated successfully.");

        loadSurveys();

    } catch (error) {

        console.error(error);

        alert(
            error.response?.data?.message ||
            "Failed to activate survey."
        );

    }

}

    /*
    |--------------------------------------------------------------------------
    | INITIAL LOAD
    |--------------------------------------------------------------------------
    */

 useEffect(() => {

    let cancelled = false;

    async function fetchData() {

        try {

            setLoading(true);

            const [surveyRes, userRes] = await Promise.all([
                getSurveys(),
                getVerifiedUsers(),
            ]);

            if (!cancelled) {

                setSurveys(surveyRes.data.surveys);
                setVerifiedUsers(userRes.data.users);

            }

        } catch (error) {

            console.error(error);

        } finally {

            if (!cancelled) {

                setLoading(false);

            }

        }

    }

    fetchData();

    return () => {

        cancelled = true;

    };

}, []);

    if (loading) {

        return <h2>Loading surveys...</h2>;

    }

    return (

        <>

            <CreateSurveyModal

                key={selectedSurvey?.id || "new"}

                open={openModal}

                survey={selectedSurvey}

                onCreated={loadSurveys}

                onClose={() => {

                    setOpenModal(false);

                    setSelectedSurvey(null);

                }}

            />

            <ViewSurveyModal

                open={viewOpen}

                survey={selectedSurvey}

                onClose={() => {

                    setViewOpen(false);

                    setSelectedSurvey(null);

                }}

            />
   <AssignSurveyModal
    open={assignOpen}
    survey={selectedSurvey}
    users={verifiedUsers}
    onClose={() => {
        setAssignOpen(false);
        setSelectedSurvey(null);
    }}
    onAssigned={loadSurveys}
/>
<SurveyAssignments
    open={assignmentsOpen}
    survey={selectedSurvey}
    onClose={() => {
        setAssignmentsOpen(false);
        setSelectedSurvey(null);
    }}
/>

            <div style={{ padding: 30 }}>

                <h1>Survey Management</h1>

                <button

                    onClick={() => {

                        setSelectedSurvey(null);

                        setOpenModal(true);

                    }}

                >

                    + New Survey

                </button>

                <br />
                <br />

                <table

                    width="100%"

                    border="1"

                    cellPadding="10"

                >

                    <thead>

                        <tr>

                            <th>Title</th>

                            <th>Reward</th>

                            <th>Status</th>

                            <th>Questions</th>

                            <th>Actions</th>

                        </tr>

                    </thead>

                    <tbody>

                        {surveys.map((survey) => (

                            <tr key={survey.id}>

                                <td>{survey.title}</td>

                                <td>KSh {survey.reward}</td>

                                <td>{survey.status}</td>

                                <td>{survey.questions.length}</td>

                               <td>

    <button

        onClick={() => {

            setSelectedSurvey(survey);

            setViewOpen(true);

        }}

    >

        View

    </button>

    {" "}

    <button

        onClick={() => {

            setSelectedSurvey(survey);

            setOpenModal(true);

        }}

    >

        Edit

    </button>

    {" "}

    <button

        disabled={survey.status === "ACTIVE"}

        onClick={() => handleActivate(survey.id)}

    >

        {survey.status === "ACTIVE"
            ? "Active"
            : "Activate"}

    </button>

    {" "}

    <button

        onClick={() => handleDelete(survey.id)}

    >

        Delete

    </button>
    {" "}
   <button
    onClick={() => {
        setSelectedSurvey(survey);
        setAssignOpen(true);
    }}
>
    Assign
</button>

{" "}

<button
    onClick={() => {
        setSelectedSurvey(survey);
        setAssignmentsOpen(true);
    }}
>
    View Assignments
</button>

</td>
                            </tr>

                        ))}

                    </tbody>

                </table>

            </div>

        </>

    );

}