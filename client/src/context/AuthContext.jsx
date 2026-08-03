import { useEffect, useState } from "react";
import { AuthContext } from "./auth-context";

import {
    login as loginApi,
    register as registerApi,
    logout as logoutApi,
    me,
} from "../api/auth.api";

export function AuthProvider({ children }) {

    const [user, setUser] = useState(null);

    const [loading, setLoading] = useState(true);

    async function checkAuth() {

        try {

            const accessToken = localStorage.getItem("accessToken");

            const cachedUser = localStorage.getItem("user");

            if (cachedUser) {

                setUser(JSON.parse(cachedUser));

            }

            if (!accessToken) {

                setUser(null);

                setLoading(false);

                return;

            }

            const { data } = await me();

            setUser(data.user);

            localStorage.setItem(

                "user",

                JSON.stringify(data.user)

            );

        }

        catch {

            localStorage.removeItem("accessToken");

            localStorage.removeItem("user");

            setUser(null);

        }

        finally {

            setLoading(false);

        }

    }

   useEffect(() => {

    checkAuth();

}, []);
async function register(userData) {

    const { data } = await registerApi(userData);

    console.log(data);

    localStorage.setItem("accessToken", data.accessToken);

    localStorage.setItem(

        "user",

        JSON.stringify(data.user)

    );

    setUser(data.user);

    return data;

}

async function login(credentials) {

    const { data } = await loginApi(credentials);

    localStorage.setItem("accessToken", data.accessToken);

    localStorage.setItem(

        "user",

        JSON.stringify(data.user)

    );

    setUser(data.user);

    return data;

}

async function logout() {

    try {

        await logoutApi();

    } finally {

        localStorage.removeItem("accessToken");

        localStorage.removeItem("user");

        setUser(null);

    }

}

    return (

        <AuthContext.Provider
            value={{
                user,
                loading,
                login,
                logout,
                register,
                checkAuth
            }}
        >

            {children}

        </AuthContext.Provider>

    );

}
