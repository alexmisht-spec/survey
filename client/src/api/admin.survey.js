import api from "./axios";

export const getSurveys = () =>
    api.get("/admin/surveys");

export const getAdminSurvey = (id) =>
    api.get(`/admin/surveys/${id}`);

export const createSurvey = (data) =>
    api.post("/admin/surveys", data);

export const updateSurvey = (id, data) =>
    api.put(`/admin/surveys/${id}`, data);

export const deleteSurvey = (id) =>
    api.delete(`/admin/surveys/${id}`);

export const activateSurvey = (id) =>
    api.post(`/admin/surveys/${id}/activate`);

export const getSurveyDetails = (id) =>
    api.get(`/admin/surveys/${id}/details`);

export const getVerifiedUsers = () =>
    api.get("/admin/verification/verified");

/*
|--------------------------------------------------------------------------
| ASSIGN SURVEY
|--------------------------------------------------------------------------
| data should already be:
| {
|     userIds: ["id1", "id2"]
| }
*/

export const assignSurvey = (surveyId, data) =>
    api.post(`/admin/surveys/${surveyId}/assign`, data);
export const getAssignments = (surveyId) =>
    api.get(`/admin/surveys/${surveyId}/assignments`);

export const markRewardPaid = (assignmentId) =>
    api.patch(`/admin/assignment/assignments/${assignmentId}/pay`);

export const deleteAssignment = (assignmentId) =>
    api.delete(`/admin/assignment/assignments/${assignmentId}`);