import api from "./axios";

export const assignSurvey = (surveyId, data) => {

    console.log("API FILE CALLED");
    console.log(data);

    return api.post(
        `/admin/surveys/${surveyId}/assign`,
        data
    );

};

export const getVerifiedUsers = () => {
    return api.get("/admin/verification/verified");
};