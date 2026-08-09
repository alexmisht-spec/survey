import api from "./axios";

/*
|--------------------------------------------------------------------------
| GET ALL SURVEYS
|--------------------------------------------------------------------------
*/

export const getSurveys = () =>
    api.get("/admin/surveys");

/*
|--------------------------------------------------------------------------
| GET SINGLE SURVEY
|--------------------------------------------------------------------------
*/

export const getAdminSurvey = (id) =>
    api.get(`/admin/surveys/${id}`);

/*
|--------------------------------------------------------------------------
| CREATE SURVEY
|--------------------------------------------------------------------------
*/

export const createSurvey = (data) =>
    api.post("/admin/surveys", data);

/*
|--------------------------------------------------------------------------
| UPDATE SURVEY
|--------------------------------------------------------------------------
*/

export const updateSurvey = (id, data) =>
    api.put(`/admin/surveys/${id}`, data);

/*
|--------------------------------------------------------------------------
| DELETE SURVEY
|--------------------------------------------------------------------------
*/

export const deleteSurvey = (id) =>
    api.delete(`/admin/surveys/${id}`);

/*
|--------------------------------------------------------------------------
| ACTIVATE SURVEY
|--------------------------------------------------------------------------
*/

export const activateSurvey = (id) =>
    api.post(`/admin/surveys/${id}/activate`);

/*
|--------------------------------------------------------------------------
| SET SURVEY STATUS
|--------------------------------------------------------------------------
| Allows admin to explicitly set:
|
| ACTIVE
| COMING_SOON
| LOCKED
| CLOSED
|--------------------------------------------------------------------------
*/

export const setSurveyStatus = (id, status) =>
    api.patch(`/admin/surveys/${id}/status`, {
        status
    });

/*
|--------------------------------------------------------------------------
| GET SURVEY DETAILS
|--------------------------------------------------------------------------
*/

export const getSurveyDetails = (id) =>
    api.get(`/admin/surveys/${id}/details`);

/*
|--------------------------------------------------------------------------
| GET VERIFIED USERS
|--------------------------------------------------------------------------
*/

export const getVerifiedUsers = () =>
    api.get("/admin/verification/verified");

/*
|--------------------------------------------------------------------------
| ASSIGN SURVEY
|--------------------------------------------------------------------------
|
| data:
|
| {
|     userIds: ["id1", "id2"]
| }
|
|--------------------------------------------------------------------------
*/

export const assignSurvey = (surveyId, data) =>
    api.post(`/admin/surveys/${surveyId}/assign`, data);

/*
|--------------------------------------------------------------------------
| GET ASSIGNMENTS
|--------------------------------------------------------------------------
*/

export const getAssignments = (surveyId) =>
    api.get(`/admin/surveys/${surveyId}/assignments`);

/*
|--------------------------------------------------------------------------
| MARK REWARD PAID
|--------------------------------------------------------------------------
*/

export const markRewardPaid = (assignmentId) =>
    api.patch(
        `/admin/assignment/assignments/${assignmentId}/pay`
    );

/*
|--------------------------------------------------------------------------
| DELETE ASSIGNMENT
|--------------------------------------------------------------------------
*/

export const deleteAssignment = (assignmentId) =>
    api.delete(
        `/admin/assignment/assignments/${assignmentId}`
    );