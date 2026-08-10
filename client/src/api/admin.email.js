
import api from "./axios";

/*
|--------------------------------------------------------------------------
| UNVERIFIED USERS
|--------------------------------------------------------------------------
*/

export const getUnverifiedUsers = () =>
    api.get("/admin/email/users/unverified");


/*
|--------------------------------------------------------------------------
| EMAIL TEMPLATES
|--------------------------------------------------------------------------
*/

export const getEmailTemplates = () =>
    api.get("/admin/email/templates");

export const createEmailTemplate = (data) =>
    api.post("/admin/email/templates", data);

export const updateEmailTemplate = (id, data) =>
    api.put(`/admin/email/templates/${id}`, data);

export const deleteEmailTemplate = (id) =>
    api.delete(`/admin/email/templates/${id}`);


/*
|--------------------------------------------------------------------------
| SEND EMAIL
|--------------------------------------------------------------------------
*/

export const sendAdminEmail = (data) =>
    api.post("/admin/email/send", data);

