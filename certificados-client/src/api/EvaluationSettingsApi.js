import apicall from "../shared/apicall";

export default {
  setEvaluationSettings: async (data) => {
    let response = { success: true };
    try {
      const apiResponse = await apicall.post(
        "config-evaluacion-ordinaria",
        "",
        data,
        true
      );
      response = {
        ...response,
        ...apiResponse.data,
      };
    } catch (error) {
      response = apicall.handleCatchWithDetails(error);
    }
    return response;
  },
  getEvaluationSettings: async (cct) => {
    let response = { success: true };
    try {
      const apiResponse = await apicall.get(
        `evaluacion-ordinaria-plantel/${cct}`,
        "",
        true
      );
      response.data = apiResponse.data.data[0];
    } catch (error) {
      response = apicall.handleCatchWithDetails(error);
    }
    return response;
  },
  setPartialSettings: async (data) => {
    let response = { success: true };
    try {
      const apiResponse = await apicall.post(
        "config-recuperacion-parcial",
        "",
        data,
        true
      );
      response = {
        ...response,
        ...apiResponse.data,
      };
    } catch (error) {
      response = apicall.handleCatchWithDetails(error);
    }
    return response;
  },
  getPartialSettings: async (cct) => {
    let response = { success: true };
    try {
      const apiResponse = await apicall.get(
        `recuperacion-parcial-plantel/${cct}`,
        "",
        true
      );
      response.data = apiResponse.data.data[0];
    } catch (error) {
      response = apicall.handleCatchWithDetails(error);
    }
    return response;
  },
  getEvaluationsDates: async (cct) => {
    let response = { success: true };
    try {
      const apiResponse = await apicall.get(
        `config-fechas-evaluaciones/${cct}`,
        "",
        true
      );
      response.data = apiResponse.data.data[0];
    } catch (error) {
      response = apicall.handleCatchWithDetails(error);
    }
    return response;
  },
  getSemestralEvaluationsDates: async (cct) => {
    let response = { success: true };
    try {
      const apiResponse = await apicall.get(
        `recursamiento-semestral-plantel/${cct}`,
        "",
        true
      );
      response.data = apiResponse.data.data[0];
    } catch (error) {
      response = apicall.handleCatchWithDetails(error);
    }
    return response;
  },
  setEvaluationISemester: async (data) => {
    let response = { success: true };
    try {
      const apiResponse = await apicall.post(
        "config-recursamiento-intersemestral",
        "",
        data,
        true
      );
      response = {
        ...response,
        ...apiResponse.data,
      };
    } catch (error) {
      response = apicall.handleCatchWithDetails(error);
    }
    return response;
  },
  setEvaluationSemestral: async (data) => {
    let response = { success: true };
    try {
      const apiResponse = await apicall.post(
        "config-recursamiento-semestral",
        "",
        data,
        true
      );
      response = {
        ...response,
        ...apiResponse.data,
      };
    } catch (error) {
      response = apicall.handleCatchWithDetails(error);
    }
    return response;
  },
  getAcademicRecordSettings : async (cct) => {
    let response = {success: true};
    try {
      const apiResponse = await apicall.get(
        `calificar-historico-plantel/${cct}`,
        "",
        true
      );
      response.data = apiResponse.data.data[0];
    } catch (error) {
      response = apicall.handleCatchWithDetails(error);
    }
    return response
  },
  setAcademicRecordSettings : async (data) => {
    let response = {success: true};
    try {
      const apiResponse = await apicall.post(
        `config-calificar-historico`,
        "",
        data,
        true
      );
      response = {
        ...response,
        ...apiResponse.data,
      };
    } catch (error) {
      response = apicall.handleCatchWithDetails(error);
    }
    return response
  }
};
