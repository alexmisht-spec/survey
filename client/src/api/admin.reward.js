import api from "./axios";

/*
|--------------------------------------------------------------------------
| REWARDS
|--------------------------------------------------------------------------
*/

export const getPendingRewards = () =>
    api.get("/admin/rewards/pending");

export const approveReward = (assignmentId) =>
    api.post(`/admin/rewards/${assignmentId}/approve`);

export const rejectReward = (assignmentId) =>
    api.post(`/admin/rewards/${assignmentId}/reject`);

/*
|--------------------------------------------------------------------------
| WITHDRAWALS
|--------------------------------------------------------------------------
*/

export const getWithdrawals = () =>
    api.get("/admin/withdrawals");

export const approveWithdrawal = (withdrawalId) =>
    api.put(`/admin/withdrawals/${withdrawalId}/approve`);

export const rejectWithdrawal = (withdrawalId) =>
    api.put(`/admin/withdrawals/${withdrawalId}/reject`);
