import api from "./axios";

export function sendPasswordOTP(currentPassword) {

    return api.post("/settings/password/send-otp", {

        currentPassword,

    });

}

export function changePassword(data) {

    return api.post("/settings/password/change", data);

}

export function updateProfile(data) {

    return api.put("/settings/profile", data);

}