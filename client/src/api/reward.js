import api from "./axios";

export const submitRewardCredentials = (data) =>
    api.post("/reward/submit", data);

export const getRewardStatus = () =>
    api.get("/reward/status");