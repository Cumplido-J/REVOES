import ApiCall from "../shared/apicall";

const controller = "studentfunctions";
export default {
  acceptPrivacy: async () => {
    let response = { success: true };

    const method = `acceptPrivacy`;

    try {
      const apiResponse = await ApiCall.get(controller, method);
      response.message = apiResponse.data;
    } catch (error) {
      response = ApiCall.handleCatch(error);
    }
    return response;
  },
  updateStudentCareer: async (form) => {
    if (!form) form = {};
    if (!form.schoolCareerId) form.schoolCareerId = 0;
    let response = { success: true };

    const method = `updateStudentCareer/${form.schoolCareerId}`;

    try {
      const apiResponse = await ApiCall.get(controller, method);
      response.message = apiResponse.data;
    } catch (error) {
      response = ApiCall.handleCatch(error);
    }
    return response;
  },
  getAvailableSchoolCareers: async () => {
    let response = { success: true };

    const method = `availableSchoolCareers`;

    try {
      const apiResponse = await ApiCall.get(controller, method);
      response.schoolCareers = apiResponse.data;
    } catch (error) {
      response = ApiCall.handleCatch(error);
      response.schoolCareers = [];
    }
    return response;
  },
};
