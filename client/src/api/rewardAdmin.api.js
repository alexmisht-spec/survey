import api from "./axios";

export const getRewardSubmissions = () =>
    api.get("/admin/rewards");

export const approveReward = (id) =>
    api.put(`/admin/rewards/${id}/approve`);

export const rejectReward = (id, reason) =>
    api.put(`/admin/rewards/${id}/reject`, { reason });