import ApiCall from "../shared/apicall";

export default {
  getUacOptionals: async (groupPeriodId) => {
    let response = { success: true };
    try {
      const apiResponse = await ApiCall.get(
        "uac-optativas",
        groupPeriodId,
        true
      );
      response.message = apiResponse.data.message;
      response.data = apiResponse.data.data;
    } catch (error) {
      response = ApiCall.handleCatch(error);
      response.data = null;
    }
    return response;
  },
};
