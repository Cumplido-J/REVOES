import ApiCall from "../shared/apicall";
//const controller = "surveyGraduated2022";
const controller = "surveyIntentions2022";
export default {
  submitSurvey: async (form) => {
    let response = { success: true };

    const method = "";

    try {
      const apiResponse = await ApiCall.post(controller, method, form);
      response.confirmationFolio = apiResponse.data;
    } catch (error) {
      response = ApiCall.handleCatch(error);
    }
    return response;
  },
  getInfoFromFolio: async (folio) => {
    let response = { success: true };

    const method = `${folio}`;

    try {
      const apiResponse = await ApiCall.get(controller, method);
      response.folioInfo = apiResponse.data;
    } catch (error) {
      response = ApiCall.handleCatch(error);
    }
    return response;
  },
};
