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


/*
|--------------------------------------------------------------------------
| MARK WITHDRAWAL AS PAID
|--------------------------------------------------------------------------
|
| Admin manually sends the M-Pesa payment first,
| then clicks "Mark as Paid".
|--------------------------------------------------------------------------
*/

export const markWithdrawalPaid = (withdrawalId) =>
    api.put(`/admin/withdrawals/${withdrawalId}/paid`);


export const rejectWithdrawal = (withdrawalId) =>
    api.put(`/admin/withdrawals/${withdrawalId}/reject`);