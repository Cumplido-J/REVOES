import ApiCall from "../shared/apicall";
import "moment/locale/es";

const controller = "masiveLoad";

export default {
  masiveLoad: async (form) => {
    if (!form) form = {};
    let response = { success: true };

    //const method = `add`;
    const method = `scoreAddMasiveNew`;
    try {
      const apiResponse = await ApiCall.post(controller, method, form.cargaAlumnos);
      response.data = apiResponse.data;

    } catch (error) {
      response = ApiCall.handleCatch(error);
    }
    return response;
  },
  loadingMasiveDiciplinary: async (form) => {
    if (!form) form = [];
    let response = { success: true };
    const method = `loadingDiciplinary`;
    try {
      const apiResponse = await ApiCall.post(controller, method, form);
      response.data = apiResponse.data;
    } catch(error) {
      response = ApiCall.handleCatch(error);
      response.data = [];
    }
    return response;
  },
};
