import axios from "axios";

const api = axios.create({

    baseURL: "http://localhost:5000/api",

    withCredentials: true,

    headers: {

        "Content-Type": "application/json",

    },

});

api.interceptors.request.use((config) => {

    const token = localStorage.getItem("accessToken");

    if (token) {

        config.headers.Authorization = `Bearer ${token}`;

    }

    return config;

});

/*
|--------------------------------------------------------------------------
| GLOBAL RESPONSE INTERCEPTOR
|--------------------------------------------------------------------------
*/

api.interceptors.response.use(

    (response) => response,

    (error) => {

        if (error.response?.status === 401) {

            localStorage.removeItem("accessToken");

            // Prevent infinite redirect loop
            if (window.location.pathname !== "/login") {

                alert("Your session has expired. Please login again.");

                window.location.href = "/login";

            }

        }

        return Promise.reject(error);

    }

);

export default api;