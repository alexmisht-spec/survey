import api from "./axios";

/*
|--------------------------------------------------------------------------
| USER SURVEYS
|--------------------------------------------------------------------------
*/

export const getMySurveys = () =>
    api.get("/surveys/my");

export const getSurvey = (id) =>
    api.get(`/surveys/${id}`);

export const submitSurvey = (id, data) =>
    api.post(`/surveys/${id}/submit`, data);