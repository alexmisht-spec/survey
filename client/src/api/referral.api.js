import api from "./axios.js";

export const getMyReferrals = async () => {
    return api.get("/referrals/me");
};