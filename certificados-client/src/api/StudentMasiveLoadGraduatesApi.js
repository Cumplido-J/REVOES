import ApiCall from "../shared/apicall";
import "moment/locale/es";

const controller = "masiveLoad";

export default {
  masiveLoad: async (form) => {
    if (!form) form = {};
    let response = { success: true };

    //const method = `addGraduates`;
    const method = `insertGraduates`;
    try {
      const apiResponse = await ApiCall.post(controller, method, form);
      console.log(apiResponse);
      response.data = apiResponse.data;

    } catch (error) {
      response = ApiCall.handleCatch(error);
    }
    return response;
  },
};
