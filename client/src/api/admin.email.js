import api from "./axios";

/*
|--------------------------------------------------------------------------
| GET UNVERIFIED USERS
|--------------------------------------------------------------------------
*/

export const getUnverifiedUsers = () =>
    api.get("/admin/email/unverified-users");


/*
|--------------------------------------------------------------------------
| GET EMAIL TEMPLATES
|--------------------------------------------------------------------------
*/

export const getEmailTemplates = () =>
    api.get("/admin/email/templates");


/*
|--------------------------------------------------------------------------
| SEND EMAIL TO USER
|--------------------------------------------------------------------------
*/

export const sendAdminEmail = (data) =>
    api.post("/admin/email/send", data);