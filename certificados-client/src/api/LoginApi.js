import ApiCall from "../shared/apicall";
import { dateToReadableDate } from "../shared/functions";

const controller = "auth";

export default {
  login: async (values) => {
    let response = { success: true };

    const method = "";

    try {
      const apiResponse = await ApiCall.post(controller, method, values);
      response.jwt = apiResponse.data;
    } catch (error) {
      response = ApiCall.handleCatch(error);
    }

    return response;
  },
  getUserProfile: async () => {
    let response = { success: true };

    const method = "userProfile";

    try {
      const apiResponse = await ApiCall.get(controller, method);
      response.userProfile = apiResponse.data;
      if (response.userProfile.surveys) {
        response.userProfile.surveys.forEach((survey) => {
          survey.startDate = dateToReadableDate(survey.startDate);
          survey.endDate = dateToReadableDate(survey.endDate);
        });
      }
    } catch (error) {
      response = ApiCall.handleCatch(error);
      response.userProfile = { userProfile: null };
    }
    return response;
  },
  getPermissions: async () => {
    let response = { success: true };
    try {
      const apiResponse = await ApiCall.get("permisos-usuario", "", true);
      response.permissions = apiResponse.data.permisos;
      response.periodo = apiResponse.data.periodo;
      response.stateId = apiResponse.data.estados.map(({ id, nombre }) => ({
        id,
        description: nombre,
      }));
      response.schoolId = apiResponse.data.planteles.map(({ id, nombre }) => ({
        id,
        description: nombre,
      }));
    } catch (error) {
      response = ApiCall.handleCatch(error);
    }
    return response;
  },
};
