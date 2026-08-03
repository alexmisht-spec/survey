import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Redirecting.css";

export default function Redirecting() {

    const navigate = useNavigate();

    useEffect(() => {

        const timer = setTimeout(() => {

            navigate("/every-login");

        }, 2500);

        return () => clearTimeout(timer);

    }, [navigate]);

    return (

        <div className="redirect-page">

            <div className="redirect-card">

                <div className="loader"></div>

                <h2>Redirecting to EveryTry</h2>

                <p>

                    Please wait while we securely redirect you
                    to EveryTry...

                </p>

            </div>

        </div>

    );

}