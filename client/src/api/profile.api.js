import api from "./axios";

export const createProfile = (data) => api.post("/profile", data);

export const getProfile = () => api.get("/profile");