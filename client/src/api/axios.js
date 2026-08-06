import axios from "axios";

const api = axios.create({

    baseURL: import.meta.env.VITE_API_URL,

    withCredentials: true,

    headers: {

        "Content-Type": "application/json",

    },

});

let isRefreshing = false;

let failedQueue = [];

const processQueue = (error, token = null) => {

    failedQueue.forEach((promise) => {

        if (error) {

            promise.reject(error);

        } else {

            promise.resolve(token);

        }

    });

    failedQueue = [];

};

api.interceptors.request.use((config) => {

    const token = localStorage.getItem("accessToken");

    if (token) {

        config.headers.Authorization = `Bearer ${token}`;

    }

    return config;

});

api.interceptors.response.use(

    (response) => response,

    async (error) => {

        const originalRequest = error.config;

        if (

            error.response?.status === 401 &&

            !originalRequest._retry

        ) {

            originalRequest._retry = true;

            if (isRefreshing) {

                return new Promise((resolve, reject) => {

                    failedQueue.push({

                        resolve,

                        reject,

                    });

                }).then((token) => {

                    originalRequest.headers.Authorization = `Bearer ${token}`;

                    return api(originalRequest);

                });

            }

            isRefreshing = true;

            try {

                const response = await axios.post(

                    `${import.meta.env.VITE_API_URL}/auth/refresh`,

                    {},

                    {

                        withCredentials: true,

                    }

                );

                const newToken = response.data.accessToken;

                localStorage.setItem(

                    "accessToken",

                    newToken

                );

                api.defaults.headers.common.Authorization =

                    `Bearer ${newToken}`;

                processQueue(null, newToken);

                originalRequest.headers.Authorization =

                    `Bearer ${newToken}`;

                return api(originalRequest);

            }

            catch (err) {

                processQueue(err, null);

                localStorage.removeItem("accessToken");

                window.location.href = "/login";

                return Promise.reject(err);

            }

            finally {

                isRefreshing = false;

            }

        }

        return Promise.reject(error);

    }

);

export default api;