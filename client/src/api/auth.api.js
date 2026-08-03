import api from "./axios";

/*
|--------------------------------------------------------------------------
| REGISTER
|--------------------------------------------------------------------------
*/

export const register = (data) =>
    api.post("/auth/register", data);

/*
|--------------------------------------------------------------------------
| LOGIN
|--------------------------------------------------------------------------
*/

export const login = (data) =>
    api.post("/auth/login", data);

/*
|--------------------------------------------------------------------------
| GET CURRENT USER
|--------------------------------------------------------------------------
*/

export const me = () =>
    api.get("/auth/me");

/*
|--------------------------------------------------------------------------
| LOGOUT
|--------------------------------------------------------------------------
*/

export const logout = () =>
    api.post("/auth/logout");

export const forgotPassword = (email) =>

    api.post("/auth/forgot-password", {

        email,

    });

export const forgotPasswordSendOTP = (email) =>
    api.post("/auth/forgot-password/send-otp", {
        email,
    });

export const forgotPasswordReset = (data) =>
    api.post("/auth/forgot-password/reset", data);