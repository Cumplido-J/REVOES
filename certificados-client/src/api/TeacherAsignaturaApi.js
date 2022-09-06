import ApiCall from "../shared/apicall";

const controllerPhp = "docente-asignaturas";

export default {
  getDocenteAsignatura: async (params) => {
    let response = { success: true };
    const method = params;
    try {
      const apiResponse = await ApiCall.get(
        controllerPhp,
        method,
        true,
      );
      if (apiResponse.data) {
        response.teacherAsignatura = apiResponse.data.data;
      } else {
        response.teacherAsignatura = [];
      }
    } catch (exception) {
      response = ApiCall.handleCatchWithDetails(exception);
    }
    return response;
  },
  getSubjectRecursamientoIntersemestral: async (id) => {
    let response = { success: true };
    try {
      const apiResponse = await ApiCall.get(
        "asignatura-intersemestral",
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
  getSubjectRecursamientoSemestral: async (id) => {
    let response = { success: true };
    try {
      const apiResponse = await ApiCall.get(
        "recursamiento-semestral",
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
  getDocenteAsignaturaRecursamiento: async (id) => {
    let response = { success: true };
    try {
      const apiResponse = await ApiCall.get(
        "asignatura-intersemestral-docente",
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

};
