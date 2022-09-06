import ApiCall from "../shared/apicall";
const controller = "admin";

export default {
  countTemporalPasswords: async () => {
    let response = { success: true };

    const method = "countTemporalPasswords";

    try {
      const apiResponse = await ApiCall.get(controller, method);
      response.count = apiResponse.data;
    } catch (error) {
      response = ApiCall.handleCatch(error);
      response.count = null;
    }
    return response;
  },
  updateTemporalPasswords: async () => {
    let response = { success: true };

    const method = `updateTemporalPasswords`;

    try {
      const apiResponse = await ApiCall.get(controller, method);
      response.message = apiResponse.data;
    } catch (error) {
      response = ApiCall.handleCatch(error);
    }
    return response;
  },
};
