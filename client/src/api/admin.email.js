import api from "./axios";


/*
|--------------------------------------------------------------------------
| USERS FOR EMAIL CAMPAIGNS
|--------------------------------------------------------------------------
|
| Returns ALL users.
|
*/

export const getEmailUsers = () =>
    api.get("/admin/email/users");


/*
|--------------------------------------------------------------------------
| UNVERIFIED USERS
|--------------------------------------------------------------------------
|
| Returns only users who have not completed verification.
|
*/

export const getUnverifiedUsers = () =>
    api.get("/admin/email/users/unverified");


/*
|--------------------------------------------------------------------------
| EMAIL TEMPLATES
|--------------------------------------------------------------------------
*/

// Get active email templates
export const getEmailTemplates = () =>
    api.get("/admin/email/templates");


// Create email template
export const createEmailTemplate = (data) =>
    api.post("/admin/email/templates", data);


// Update email template
export const updateEmailTemplate = (id, data) =>
    api.put(`/admin/email/templates/${id}`, data);


// Deactivate email template
export const deleteEmailTemplate = (id) =>
    api.delete(`/admin/email/templates/${id}`);


/*
|--------------------------------------------------------------------------
| SEND EMAIL
|--------------------------------------------------------------------------
*/

// Send selected template to selected user
export const sendAdminEmail = (data) =>
    api.post("/admin/email/send", data);

