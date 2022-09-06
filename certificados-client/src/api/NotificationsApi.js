import ApiCall from "../shared/apicall";

const controllerPhp = "notificaciones";

export default {
  getNotifications: async (params) => {
    let response = { success: true };
    try {
      const apiResponse = await ApiCall.get(controllerPhp, "", true, {
        params,
      });
      response.message = apiResponse.data.message;
      response.data = apiResponse.data;
    } catch (error) {
      response = ApiCall.handleCatch(error);
      response.data = null;
    }
    return response;
  },
  readNotifications: async () => {
    let response = { success: true };
    try {
      const apiResponse = await ApiCall.delete(controllerPhp, "", true);
      response.message = apiResponse.data.message;
    } catch (error) {
      response = ApiCall.handleCatch(error);
      response.data = null;
    }
    return response;
  },
};
