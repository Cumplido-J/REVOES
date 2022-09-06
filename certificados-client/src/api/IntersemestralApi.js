import ApiCall from "../shared/apicall";

export default {
  getFilteredIntersemestral: async (params) => {
    let response = { success: true };
    try {
      const apiResponse = await ApiCall.post(
        "recursamientos/filtrar",
        "",
        {},
        true,
        {
          params,
        }
      );
      if (apiResponse.data) {
        response.intersemestral = apiResponse.data.data;
      } else {
        response.intersemestral = [];
      }
    } catch (exception) {
      response = ApiCall.handleCatchWithDetails(exception);
      response.intersemestral = [];
    }
    return response;
  },
  setAssignInterSemester: async (data) => {
    let response = { success: true };
    try {
      const apiResponse = await ApiCall.post(
        "asignatura-intersemestral",
        "",
        data,
        true
      );
      response.data = apiResponse.data.data;
    } catch (error) {
      response = ApiCall.handleCatch(error);
    }
    return response;
  },
  updateAssignInterSemester: async (data, id_intersemestral) => {
    let response = { success: true };
    try {
      const apiResponse = await ApiCall.put(
        "asignatura-intersemestral",
        id_intersemestral,
        data,
        true
      );
      response.data = apiResponse.data.data;
    } catch (error) {
      response = ApiCall.handleCatch(error);
    }
    return response;
  },
  setAssignSemester: async (data) => {
    let response = { success: true };
    try {
      const apiResponse = await ApiCall.post(
        "recursamiento-semestral",
        "",
        data,
        true
      );
      response.data = apiResponse.data.data;
    } catch (error) {
      response = ApiCall.handleCatch(error);
    }
    return response;
  },
  updateAssignSemester: async (data, id_semestral) => {
    let response = { success: true };
    try {
      const apiResponse = await ApiCall.put(
        "recursamiento-semestral",
        id_semestral,
        data,
        true
      );
      response.data = apiResponse.data.data;
    } catch (error) {
      response = ApiCall.handleCatch(error);
    }
    return response;
  },
  deleteAssignInterSemester: async (id) => {
    let response = { success: true };
    const method = `asignatura-intersemestral/${id}`;
    try {
      const apiResponse = await ApiCall.delete(method, "", true);
      response.data = apiResponse.data.data
    } catch (error) {
      response = ApiCall.handleCatch(error);
    }
    return response;
  },
  deleteAssignSemestral: async (id) => {
    let response = { success: true };
    const method = `recursamiento-semestral/${id}`;
    try {
      const apiResponse = await ApiCall.delete(method, "", true);
      response.data = apiResponse.data.data
    } catch (error) {
      response = ApiCall.handleCatch(error);
    }
    return response;
  },
};