import api from "./axios";

export const uploadVerification = (formData) =>
    api.post("/verification", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });