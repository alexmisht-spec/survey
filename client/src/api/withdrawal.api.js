import api from "./axios";

/*
|--------------------------------------------------------------------------
| REQUEST WITHDRAWAL
|--------------------------------------------------------------------------
*/

export const requestWithdrawal = (data) => {
    return api.post("/withdrawals", data);
};

/*
|--------------------------------------------------------------------------
| GET MY WITHDRAWALS
|--------------------------------------------------------------------------
*/

export const getWithdrawals = () => {
    return api.get("/withdrawals");
};