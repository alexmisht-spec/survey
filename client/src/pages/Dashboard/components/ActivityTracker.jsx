import { useEffect, useRef } from "react";
import useAuth from "../../../hooks/useAuth";

const INACTIVITY_TIME = 30 * 60 * 1000; // 30 minutes

export default function ActivityTracker() {

    const { logout } = useAuth();

    const timeoutRef = useRef();

    const resetTimer = () => {

        clearTimeout(timeoutRef.current);

        timeoutRef.current = setTimeout(() => {

            logout();

        }, INACTIVITY_TIME);

    };

    useEffect(() => {

        const events = [

            "mousemove",
            "mousedown",
            "click",
            "keydown",
            "scroll",
            "wheel",
            "touchstart",
            "touchmove",
            "pointermove",
            "userActivity",

        ];

        events.forEach(event =>

            window.addEventListener(event, resetTimer)

        );

        resetTimer();

        return () => {

            clearTimeout(timeoutRef.current);

            events.forEach(event =>

                window.removeEventListener(event, resetTimer)

            );

        };

    }, []);

    return null;

}