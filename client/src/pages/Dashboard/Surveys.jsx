
import { useEffect, useState } from "react";
import { getMySurveys } from "../../api/survey.api";
import SurveyCard from "./components/SurveyCard";
import "./Surveys.css";

export default function DashboardSurveys() {

    const [loading, setLoading] = useState(true);

    const [available, setAvailable] = useState([]);
    const [completed, setCompleted] = useState([]);
    const [comingSoon, setComingSoon] = useState([]);

    /*
    |--------------------------------------------------------------------------
    | LOAD SURVEYS
    |--------------------------------------------------------------------------
    */

    const loadSurveys = async () => {

        try {

            setLoading(true);

            const res = await getMySurveys();

            setAvailable(
                res.data.available || []
            );

            setCompleted(
                res.data.completed || []
            );

            setComingSoon(
                res.data.comingSoon || []
            );

        } catch (err) {

            console.error(
                "LOAD SURVEYS ERROR:",
                err
            );

        } finally {

            setLoading(false);

        }

    };

    /*
    |--------------------------------------------------------------------------
    | INITIAL LOAD
    |--------------------------------------------------------------------------
    */

    useEffect(() => {

        loadSurveys();

    }, []);

    /*
    |--------------------------------------------------------------------------
    | LOADING
    |--------------------------------------------------------------------------
    */

    if (loading) {

        return (

            <div className="surveys-loading">

                <div className="loader"></div>

                <p>
                    Loading Surveys...
                </p>

            </div>

        );

    }

    /*
    |--------------------------------------------------------------------------
    | PAGE
    |--------------------------------------------------------------------------
    */

    return (

        <div className="surveys-page">

            {/* -----------------------------------------------------------------
                HEADER
            ----------------------------------------------------------------- */}

            <div className="page-header">

                <h1>
                    My Surveys
                </h1>

                <p>
                    Complete available surveys and keep track
                    of your completed work.
                </p>

            </div>


            {/* -----------------------------------------------------------------
                AVAILABLE SURVEYS
            ----------------------------------------------------------------- */}

            <section className="survey-section">

                <h2>
                    Available Surveys
                </h2>

                {available.length > 0 ? (

                    <div className="survey-grid">

                        {available.map((item) => (

                            <SurveyCard

                                key={item.id}

                                survey={item.survey}

                                verified={true}

                                verificationStatus="APPROVED"

                                completed={false}

                                comingSoon={false}

                                onCompleted={loadSurveys}

                            />

                        ))}

                    </div>

                ) : (

                    <div className="empty-box">

                        No active surveys available
                        at the moment.

                    </div>

                )}

            </section>


            {/* -----------------------------------------------------------------
                COMPLETED SURVEYS
            ----------------------------------------------------------------- */}

            <section className="survey-section">

                <h2>
                    Completed Surveys
                </h2>

                {completed.length > 0 ? (

                    <div className="survey-grid">

                        {completed.map((item) => (

                            <SurveyCard

                                key={item.id}

                                survey={item.survey}

                                completed={true}

                                verified={true}

                                verificationStatus="APPROVED"

                                comingSoon={false}

                            />

                        ))}

                    </div>

                ) : (

                    <div className="empty-box">

                        You haven't completed any
                        surveys yet.

                    </div>

                )}

            </section>


            {/* -----------------------------------------------------------------
                COMING SOON
            ----------------------------------------------------------------- */}

            <section className="survey-section">

                <h2>
                    Coming Soon
                </h2>

                {comingSoon.length > 0 ? (

                    <div className="survey-grid">

                        {comingSoon.map((survey) => (

                            <SurveyCard

                                key={survey.id}

                                survey={survey}

                                completed={false}

                                comingSoon={true}

                                verified={false}

                                verificationStatus="PENDING"

                            />

                        ))}

                    </div>

                ) : (

                    <div className="empty-box">

                        More surveys coming soon.

                    </div>

                )}

            </section>

        </div>

    );

}

