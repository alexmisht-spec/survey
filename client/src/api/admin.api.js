import api from "./axios";

export const getAdminDashboard = () =>
    api.get("/admin/dashboard");

export const getUsers = () =>
    api.get("/admin/users");

export const getPendingVerifications = () =>
    api.get("/admin/verifications");

export const getWithdrawals = () =>
    api.get("/admin/withdrawals");
/*
|--------------------------------------------------------------------------
| GET SINGLE VERIFICATION
|--------------------------------------------------------------------------
*/

export const getVerification = (id) => {

    return api.get(`/admin/verifications/${id}`);

};
export const approveVerification = (id) => {

    return api.post(
        `/admin/verifications/${id}/approve`
    );

};
/*
|--------------------------------------------------------------------------
| REJECT VERIFICATION
|--------------------------------------------------------------------------
*/

export const rejectVerification = (id, reason) => {

    return api.post(
        `/admin/verifications/${id}/reject`,
        {
            reason
        }
    );

};

/*
|--------------------------------------------------------------------------
| VIEW DOCUMENT
|--------------------------------------------------------------------------
*/

export const openDocument = async (id, type) => {

    const { data } = await api.get(
        `/admin/verifications/${id}/document/${type}`
    );

    window.open(data.url, "_blank", "noopener,noreferrer");

};

export const downloadDocument = async (id, type) => {

    const { data } = await api.get(
        `/admin/verifications/${id}/document/${type}`
    );

    const link = document.createElement("a");

    link.href = data.url;

    link.target = "_blank";

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

};