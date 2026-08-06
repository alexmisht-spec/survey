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

export const openDocument = (id, type) => {

    window.open(

        `${import.meta.env.VITE_API_URL}/admin/verifications/${id}/document/${type}`,

        "_blank",

        "noopener,noreferrer"

    );

};

/*
|--------------------------------------------------------------------------
| DOWNLOAD DOCUMENT
|--------------------------------------------------------------------------
*/

export const downloadDocument = (id, type) => {

    const link = document.createElement("a");

    link.href =
        `${import.meta.env.VITE_API_URL}/admin/verifications/${id}/document/${type}`;

    link.target = "_blank";

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

};