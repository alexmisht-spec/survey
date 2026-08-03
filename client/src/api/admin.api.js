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
| VIEW/DOWNLOAD DOCUMENT
|--------------------------------------------------------------------------
*/
export const openDocument = async (id, type) => {

    const response = await api.get(

        `/admin/verifications/${id}/document/${type}`,

        {
            responseType: "blob"
        }

    );

    const blob = new Blob(
        [response.data],
        {
            type: response.headers["content-type"]
        }
    );

    const url = URL.createObjectURL(blob);

    window.open(url, "_blank");

};
export const downloadDocument = async (id, type, filename) => {

    const response = await api.get(

        `/admin/verifications/${id}/document/${type}`,

        {
            responseType: "blob"
        }

    );

  const blob = new Blob(
    [response.data],
    {
        type: response.headers["content-type"]
    }
);

    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;

    link.download = filename;

    document.body.appendChild(link);

    link.click();

    link.remove();

    window.URL.revokeObjectURL(url);

};
