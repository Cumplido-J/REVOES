import { async } from "q";
import ApiCall from "../shared/apicall";

export default {
  setExtraExam: async (data) => {
    let response = { success: true };
    try {
      const apiResponse = await ApiCall.post(
        "extraordinario",
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
  getExtraExamById: async (id) => {
    let response = { success: true };
    try {
      const apiResponse = await ApiCall.get(
        "extraordinario",
        id,
        true,
      );
      if (apiResponse.data) {
        response.teacherAsignatura = apiResponse.data;
      } else {
        response.teacherAsignatura = [];
      }
    } catch (exception) {
      response = ApiCall.handleCatchWithDetails(exception);
    }
    return response;
  },
  setExtraGrades: async (data) => {
    let response = { success: true };
    try {
      const apiResponse = await ApiCall.post(
        "calificaciones-extraordinario",
        "",
        data,
        true
      );
      response.data = apiResponse.data;
    } catch (error) {
      response = ApiCall.handleCatch(error);
    }
    return response;
  },
  updateExtraExam: async (data, id_extra) => {
    let response = { success: true };
    try {
      const apiResponse = await ApiCall.put(
        "extraordinario",
        id_extra,
        data,
        true
      );
      response.data = apiResponse.data.data;
    } catch (error) {
      response = ApiCall.handleCatch(error);
    }
    return response;
  },
  deleteExtraExam: async (id) => {
    let response = { success: true };
    const method = `extraordinario/${id}`;
    try {
      const apiResponse = await ApiCall.delete(method, "", true);
      response.data = apiResponse.data.data
    } catch (error) {
      response = ApiCall.handleCatch(error);
    }
    return response;
  },
};