
import { useEffect, useState } from "react";

import CreateSurveyModal from "./components/CreateSurveyModal";
import ViewSurveyModal from "./components/ViewSurveyModal";
import AssignSurveyModal from "./components/AssignSurveyMOdal";
import SurveyAssignments from "./SurveyAssignments";

import "./AdminSurveys.css";

import {
    getSurveys,
    deleteSurvey,
    activateSurvey,
    setSurveyStatus,
    getVerifiedUsers,
} from "../../api/admin.survey";

export default function Surveys() {

    const [surveys, setSurveys] = useState([]);

    const [loading, setLoading] = useState(true);

    const [openModal, setOpenModal] = useState(false);

    const [viewOpen, setViewOpen] = useState(false);

    const [assignOpen, setAssignOpen] = useState(false);

    const [assignmentsOpen, setAssignmentsOpen] =
        useState(false);

    const [selectedSurvey, setSelectedSurvey] =
        useState(null);

    const [verifiedUsers, setVerifiedUsers] =
        useState([]);


    /*
    |--------------------------------------------------------------------------
    | LOAD SURVEYS
    |--------------------------------------------------------------------------
    */

    async function loadSurveys() {

        try {

            setLoading(true);

            const { data } = await getSurveys();

            setSurveys(data.surveys || []);

        } catch (error) {

            console.error(
                "LOAD SURVEYS ERROR:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Failed to load surveys."
            );

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

            "Delete this survey permanently?\n\n" +
            "This action cannot be undone."

        );

        if (!confirmed) return;

        try {

            await deleteSurvey(id);

            alert(
                "Survey deleted successfully."
            );

            await loadSurveys();

        } catch (error) {

            console.error(
                "DELETE SURVEY ERROR:",
                error
            );

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
    |
    | Kept for compatibility with the existing backend.
    |
    */

    async function handleActivate(id) {

        const confirmed = window.confirm(

            "Activate this survey?\n\n" +

            "The currently active survey will automatically " +
            "be moved to Coming Soon.\n\n" +

            "The survey will be assigned to verified users."

        );

        if (!confirmed) return;

        try {

            await activateSurvey(id);

            alert(
                "Survey activated successfully."
            );

            await loadSurveys();

        } catch (error) {

            console.error(
                "ACTIVATE SURVEY ERROR:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Failed to activate survey."
            );

        }

    }


    /*
    |--------------------------------------------------------------------------
    | CHANGE SURVEY STATUS
    |--------------------------------------------------------------------------
    */

    async function handleStatusChange(
        survey,
        newStatus
    ) {

        if (
            !newStatus ||
            newStatus === survey.status
        ) {

            return;

        }

        /*
        |--------------------------------------------------------------------------
        | CONFIRM ACTIVATION
        |--------------------------------------------------------------------------
        */

        if (newStatus === "ACTIVE") {

            const confirmed =
                window.confirm(

                    `Activate "${survey.title}"?\n\n` +

                    "The currently active survey will " +
                    "automatically move to Coming Soon.\n\n" +

                    "This survey will be assigned to all " +
                    "verified users."

                );

            if (!confirmed) {

                return;

            }

        }


        /*
        |--------------------------------------------------------------------------
        | CONFIRM MOVING TO COMING SOON
        |--------------------------------------------------------------------------
        */

        if (
            newStatus === "COMING_SOON" &&
            survey.status === "ACTIVE"
        ) {

            const confirmed =
                window.confirm(

                    `Move "${survey.title}" to Coming Soon?\n\n` +

                    "Users will no longer be able to start " +
                    "this survey."

                );

            if (!confirmed) {

                return;

            }

        }


        try {

            await setSurveyStatus(

                survey.id,

                newStatus

            );

            alert(

                newStatus === "ACTIVE"

                    ? "Survey activated and assigned to verified users."

                    : newStatus === "COMING_SOON"

                    ? "Survey moved to Coming Soon."

                    : `Survey status changed to ${newStatus}.`

            );

            await loadSurveys();

        } catch (error) {

            console.error(
                "CHANGE SURVEY STATUS ERROR:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Failed to change survey status."
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

                const [
                    surveyRes,
                    userRes
                ] = await Promise.all([

                    getSurveys(),

                    getVerifiedUsers()

                ]);

                if (!cancelled) {

                    setSurveys(
                        surveyRes.data.surveys || []
                    );

                    setVerifiedUsers(
                        userRes.data.users || []
                    );

                }

            } catch (error) {

                console.error(
                    "INITIAL SURVEY LOAD ERROR:",
                    error
                );

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


    /*
    |--------------------------------------------------------------------------
    | STATUS DISPLAY
    |--------------------------------------------------------------------------
    */

    function getStatusClass(status) {

        switch (status) {

            case "ACTIVE":

                return "survey-status active";

            case "COMING_SOON":

                return "survey-status coming-soon";

            case "LOCKED":

                return "survey-status locked";

            case "CLOSED":

                return "survey-status closed";

            default:

                return "survey-status";

        }

    }


    /*
    |--------------------------------------------------------------------------
    | LOADING
    |--------------------------------------------------------------------------
    */

    if (loading) {

        return (

            <div className="admin-surveys-loading">

                <h2>
                    Loading surveys...
                </h2>

            </div>

        );

    }


    /*
    |--------------------------------------------------------------------------
    | RENDER
    |--------------------------------------------------------------------------
    */

    return (

        <>

            {/* -----------------------------------------------------------------
                CREATE / EDIT SURVEY
            ----------------------------------------------------------------- */}

            <CreateSurveyModal

                key={
                    selectedSurvey?.id ||
                    "new"
                }

                open={openModal}

                survey={selectedSurvey}

                onCreated={loadSurveys}

                onClose={() => {

                    setOpenModal(false);

                    setSelectedSurvey(null);

                }}

            />


            {/* -----------------------------------------------------------------
                VIEW SURVEY
            ----------------------------------------------------------------- */}

            <ViewSurveyModal

                open={viewOpen}

                survey={selectedSurvey}

                onClose={() => {

                    setViewOpen(false);

                    setSelectedSurvey(null);

                }}

            />


            {/* -----------------------------------------------------------------
                ASSIGN SURVEY
            ----------------------------------------------------------------- */}

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


            {/* -----------------------------------------------------------------
                VIEW ASSIGNMENTS
            ----------------------------------------------------------------- */}

            <SurveyAssignments

                open={assignmentsOpen}

                survey={selectedSurvey}

                onClose={() => {

                    setAssignmentsOpen(false);

                    setSelectedSurvey(null);

                }}

            />


            {/* -----------------------------------------------------------------
                PAGE
            ----------------------------------------------------------------- */}

            <div
                className="admin-surveys-page"
                style={{
                    padding: 30
                }}
            >

                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: 25
                    }}
                >

                    <div>

                        <h1>
                            Survey Management
                        </h1>

                        <p>
                            Create, manage, activate and control
                            your platform surveys.
                        </p>

                    </div>


                    <button

                        onClick={() => {

                            setSelectedSurvey(null);

                            setOpenModal(true);

                        }}

                    >

                        + New Survey

                    </button>

                </div>


                {/* -----------------------------------------------------------------
                    SURVEY TABLE
                ----------------------------------------------------------------- */}

                <div
                    style={{
                        overflowX: "auto"
                    }}
                >

                    <table
                        width="100%"
                        border="1"
                        cellPadding="10"
                        style={{
                            borderCollapse:
                                "collapse"
                        }}
                    >

                        <thead>

                            <tr>

                                <th>
                                    Title
                                </th>

                                <th>
                                    Reward
                                </th>

                                <th>
                                    Status
                                </th>

                                <th>
                                    Questions
                                </th>

                                <th>
                                    Assigned
                                </th>

                                <th>
                                    Actions
                                </th>

                            </tr>

                        </thead>


                        <tbody>

                            {surveys.length === 0 ? (

                                <tr>

                                    <td
                                        colSpan="6"
                                        style={{
                                            textAlign:
                                                "center",
                                            padding:
                                                30
                                        }}
                                    >

                                        No surveys found.

                                    </td>

                                </tr>

                            ) : (

                                surveys.map(
                                    (survey) => (

                                        <tr
                                            key={
                                                survey.id
                                            }
                                        >

                                            {/* TITLE */}

                                            <td>

                                                <strong>
                                                    {
                                                        survey.title
                                                    }
                                                </strong>

                                                <br />

                                                <small>

                                                    {
                                                        survey.description
                                                    }

                                                </small>

                                            </td>


                                            {/* REWARD */}

                                            <td>

                                                KSh{" "}

                                                {
                                                    Number(
                                                        survey.reward
                                                    ).toLocaleString()
                                                }

                                            </td>


                                            {/* STATUS */}

                                            <td>

                                                <select

                                                    className={
                                                        getStatusClass(
                                                            survey.status
                                                        )
                                                    }

                                                    value={
                                                        survey.status
                                                    }

                                                    onChange={(
                                                        e
                                                    ) =>
                                                        handleStatusChange(

                                                            survey,

                                                            e.target.value

                                                        )
                                                    }

                                                >

                                                    <option value="ACTIVE">

                                                        ACTIVE

                                                    </option>

                                                    <option value="COMING_SOON">

                                                        COMING SOON

                                                    </option>

                                                    <option value="LOCKED">

                                                        LOCKED

                                                    </option>

                                                    <option value="CLOSED">

                                                        CLOSED

                                                    </option>

                                                </select>

                                            </td>


                                            {/* QUESTIONS */}

                                            <td>

                                                {
                                                    survey
                                                        .questions
                                                        ?.length || 0
                                                }

                                            </td>


                                            {/* ASSIGNED */}

                                            <td>

                                                {
                                                    survey
                                                        .assignments
                                                        ?.length || 0
                                                }

                                            </td>


                                            {/* ACTIONS */}

                                            <td>

                                                <div
                                                    style={{
                                                        display:
                                                            "flex",
                                                        gap:
                                                            6,
                                                        flexWrap:
                                                            "wrap"
                                                    }}
                                                >

                                                    {/* VIEW */}

                                                    <button

                                                        onClick={() => {

                                                            setSelectedSurvey(
                                                                survey
                                                            );

                                                            setViewOpen(
                                                                true
                                                            );

                                                        }}

                                                    >

                                                        View

                                                    </button>


                                                    {/* EDIT */}

                                                    <button

                                                        onClick={() => {

                                                            setSelectedSurvey(
                                                                survey
                                                            );

                                                            setOpenModal(
                                                                true
                                                            );

                                                        }}

                                                    >

                                                        Edit

                                                    </button>


                                                    {/* ACTIVATE */}

                                                    {survey.status !==
                                                        "ACTIVE" && (

                                                        <button

                                                            onClick={() =>
                                                                handleActivate(
                                                                    survey.id
                                                                )
                                                            }

                                                        >

                                                            Activate

                                                        </button>

                                                    )}


                                                    {/* ASSIGN */}

                                                    <button

                                                        onClick={() => {

                                                            setSelectedSurvey(
                                                                survey
                                                            );

                                                            setAssignOpen(
                                                                true
                                                            );

                                                        }}

                                                    >

                                                        Assign

                                                    </button>


                                                    {/* VIEW ASSIGNMENTS */}

                                                    <button

                                                        onClick={() => {

                                                            setSelectedSurvey(
                                                                survey
                                                            );

                                                            setAssignmentsOpen(
                                                                true
                                                            );

                                                        }}

                                                    >

                                                        View Assignments

                                                    </button>


                                                    {/* DELETE */}

                                                    <button

                                                        onClick={() =>
                                                            handleDelete(
                                                                survey.id
                                                            )
                                                        }

                                                    >

                                                        Delete

                                                    </button>

                                                </div>

                                            </td>

                                        </tr>

                                    )
                                )

                            )}

                        </tbody>

                    </table>

                </div>

            </div>

        </>

    );

}

