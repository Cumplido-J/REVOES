import ApiCall from "../shared/apicall";
const controller = "degreeCatalogs";

export default {
  getAntecedents: async () => {
    let response = { success: true };

    const method = "antecedents";

    try {
      const apiResponse = await ApiCall.get(controller, method);
      response.antecedents = apiResponse.data;
    } catch (error) {
      response = ApiCall.handleCatch(error);
      response.antecedents = [];
    }
    return response;
  },
  getReasons: async () => {
    let response = { success: true };

    const method = "reasons";

    try {
      const apiResponse = await ApiCall.get(controller, method);
      response.reasons = apiResponse.data;
    } catch (error) {
      response = ApiCall.handleCatch(error);
      response.reasons = [];
    }
    return response;
  },
  getAuths: async () => {
    let response = { success: true };

    const method = "auths";

    try {
      const apiResponse = await ApiCall.get(controller, method);
      response.auths = apiResponse.data;
    } catch (error) {
      response = ApiCall.handleCatch(error);
      response.auths = [];
    }
    return response;
  },
  getModalities: async () => {
    let response = { success: true };

    const method = "modalities";

    try {
      const apiResponse = await ApiCall.get(controller, method);
      response.modalities = apiResponse.data;
    } catch (error) {
      response = ApiCall.handleCatch(error);
      response.modalities = [];
    }
    return response;
  },
  getSigners: async () => {
    let response = { success: true };

    const method = "signers";

    try {
      const apiResponse = await ApiCall.get(controller, method);
      response.signers = apiResponse.data;
    } catch (error) {
      response = ApiCall.handleCatch(error);
      response.signers = [];
    }
    return response;
  },
  getSocialService: async () => {
    let response = { success: true };

    const method = "socialService";

    try {
      const apiResponse = await ApiCall.get(controller, method);
      response.socialService = apiResponse.data;
    } catch (error) {
      response = ApiCall.handleCatch(error);
      response.socialService = [];
    }
    return response;
  },
  getStates: async () => {
    let response = { success: true };
    const method = "degreeStates";
    try {
      const apiResponse = await ApiCall.get(controller, method);
      response.degreeStates = apiResponse.data;
    } catch (error) {
      response = ApiCall.handleCatch(error);
      response.degreeStates = [];
    }
    return response;
  },
  getCarrer: async (curp) => {
    if (!curp) curp = "";

    let response = { success: true };

    const method = `degreeCarrer/${curp}`;

    try {
      const apiResponse = await ApiCall.get(controller, method);
      response.degreeCarrers = apiResponse.data;
    } catch (error) {
      response = ApiCall.handleCatch(error);
      response.degreeCarrers = [];
    }
    return response;
  },

  getSchools: async (stateId) => {
    if (!stateId) stateId = 0;

    let response = { success: true };

    const method = `degreSchools/${stateId}`;

    try {
      const apiResponse = await ApiCall.get(controller, method);
      response.schools = apiResponse.data;
    } catch (error) {
      response = ApiCall.handleCatch(error);
      response.schools = [];
    }
    return response;
  },
  getCarrers: async (schoolId) => {
    if (!schoolId) schoolId = 0;

    let response = { success: true };

    const method = `degreeCarrers/${schoolId}`;

    try {
      const apiResponse = await ApiCall.get(controller, method);
      response.careers = apiResponse.data;
    } catch (error) {
      response = ApiCall.handleCatch(error);
      response.careers = [];
    }
    return response;
  },
  getAllStates: async () => {
    let response = { success: true };
    const method = `degreeAllStates`;
    try {
      const apiResponse = await ApiCall.get(controller, method);
      response.states = apiResponse.data;
    } catch (error) {
      response = ApiCall.handleCatch(error);
      response.states = [];
    }
    return response;
  },
  schoolsNormalAll: async () => {
    let response = { success: true };
    const method = `schoolsNormalAll`;
    try {
      const apiResponse = await ApiCall.get(controller, method);
      response.school = apiResponse.data;
    } catch(error) {
      response = ApiCall.handleCatch(error);
      response.school = [];
    }
    return response;
  },
  careerAllDgp: async () => {
    let response = { success: true };
    const method = `careerAllDgp`;
    try {
      const apiResponse = await ApiCall.get(controller, method);
      response.careers = apiResponse.data;
    } catch(error) {
      response = ApiCall.handleCatch(error);
      response.careers = [];
    }
    return response;
  },
  searSchoolDgp: async (schoolId) => {
    let response = { success: true };
    const method = `searSchoolDgp/${schoolId}`;
    try {
      const apiResponse = await ApiCall.get(controller, method);
      response.school = apiResponse.data;
    } catch(error) {
      response = ApiCall.handleCatch(error);
      response.school = [];
    }
    return response;
  },
  studentPeriodDate: async (curp) => {
    if (!curp) curp = "";
    let response = { success: true };
    const method = `studentPeriodDate/${curp}`;
    try {
      const apiResponse = await ApiCall.get(controller, method);
      response.period = apiResponse.data;
    } catch(error) {
      response = ApiCall.handleCatch(error);
      response.period = [];
    }
    return response;
  },
  stateListAll: async () => {
    let response = { success: true };
    const method = `stateListAll`;
    try {
      const apiResponse = await ApiCall.get(controller, method);
      response.states = apiResponse.data;
    } catch(error) {
      response = ApiCall.handleCatch(error);
      response.states = [];
    }
    return response;
  },
};
