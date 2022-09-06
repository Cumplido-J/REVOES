import ApiCall from "../shared/apicall";

const controllerPhp = "docentes";
const controllerPlantilla = "docentes-plantilla";
const controllerPlantillaAsignatura = "docente-asignaturas";

export default {
  getFilteredTeachers: async (params) => {
    let response = { success: true };
    try {
      const apiResponse = await ApiCall.post(
        controllerPhp + "/filtrar",
        "",
        {},
        true,
        {
          params,
        }
      );
      if (apiResponse.data) {
        response.teachers = apiResponse.data.data;
      } else {
        response.teachers = [];
      }
    } catch (exception) {
      response = ApiCall.handleCatchWithDetails(exception);
      response.teachers = [];
    }
    return response;
  },

  getFilteredTeachersByUac: async (params) => {
    let response = { success: true };
    try {
      const apiResponse = await ApiCall.post(
        "docente/para-calificacion",
        "",
        {},
        true,
        {
          params,
        }
      );
      if (apiResponse.data) {
        response.teachers = apiResponse.data.data;
      } else {
        response.teachers = [];
      }
    } catch (exception) {
      response = ApiCall.handleCatchWithDetails(exception);
      response.teachers = [];
    }
    return response;
  },

  disableTeacherById: async (groupId) => {
    let response = { success: true };
    const method = `periodos/${groupId}`;
    try {
      const apiResponse = await ApiCall.delete(controllerPhp, method, true);
      apiResponse.message = apiResponse.data.data.message;
    } catch (exception) {
      response = ApiCall.handleCatchWithDetails(exception);
    }
    return response;
  },

  teacherDetails: async (teacherId) => {
    let response = { success: true };
    const method = teacherId;
    try {
      const apiResponse = await ApiCall.get(controllerPhp, method, true);
      response.teacher = apiResponse.data.data[0];
    } catch (exception) {
      response = ApiCall.handleCatchWithDetails(exception);
    }
    return response;
  },

  createTeacher: async (data) => {
    let response = { success: true };
    const method = "";
    try {
      const apiResponse = await ApiCall.post(controllerPhp, method, data, true);
      if (apiResponse.data.code === 200) {
        response.message = apiResponse.data.message;
        response.teacher = apiResponse.data.data;
      } else {
        response.error = apiResponse.data.error;
      }
    } catch (exception) {
      response = ApiCall.handleCatchWithDetails(exception);
    }
    return response;
  },

  updateTeacher: async (teacherId, dataRaw) => {
    let response = { success: true };
    const method = teacherId;
    try {
      const apiResponse = await ApiCall.put(
        controllerPhp,
        method,
        dataRaw,
        true
      );
      if (apiResponse.data.code === 200) {
        response.message = apiResponse.data.message;
        response.teacher = apiResponse.data.data;
      } else {
        response.error = apiResponse.data.error;
      }
    } catch (exception) {
      response = ApiCall.handleCatchWithDetails(exception);
    }
    return response;
  },

  bajaPermiso: async (params) => {
    let response = { success: true };
    const method = params;
    try {
      const apiResponse = await ApiCall.post(
        "docentePermiso",
        method,
        "",
        true
      );
      if (apiResponse.data.code === 200) {
        response.message = apiResponse.data.message;
        response.teacher = apiResponse.data.data;
      } else {
        response.error = apiResponse.data.error;
      }
    } catch (exception) {
      response = ApiCall.handleCatchWithDetails(exception);
    }
    return response;
  },

  bajaDocente: async (params) => {
    let response = { success: true };
    const method = params;
    try {
      const apiResponse = await ApiCall.post("docenteBaja", method, "", true);
      if (apiResponse.data.code === 200) {
        response.message = apiResponse.data.message;
        response.teacher = apiResponse.data.data;
      } else {
        response.error = apiResponse.data.error;
      }
    } catch (exception) {
      response = ApiCall.handleCatchWithDetails(exception);
    }
    return response;
  },

  altaDocente: async (params) => {
    let response = { success: true };
    const method = params;
    try {
      const apiResponse = await ApiCall.post("docenteAlta", method, "", true);
      if (apiResponse.data.code === 200) {
        response.message = apiResponse.data.message;
        response.teacher = apiResponse.data.data;
      } else {
        response.error = apiResponse.data.error;
      }
    } catch (exception) {
      response = ApiCall.handleCatchWithDetails(exception);
    }
    return response;
  },

  //Docente planilla
  createAsignacion: async (data) => {
    let response = { success: true, message: "" };
    const method = "";
    try {
      const apiResponse = await ApiCall.post(
        controllerPlantilla,
        method,
        data,
        true
      );
      if (apiResponse.data.code === 200) {
        response.message = apiResponse.data.message;
        response.teacher = apiResponse.data.data;
      } else {
        response.error = apiResponse.data.error;
      }
    } catch (exception) {
      response = ApiCall.handleCatchWithDetails(exception);
    }
    return response;
  },

  updateAsignacion: async (asignacionId, data) => {
    let response = { success: true, message: "" };
    const method = asignacionId;
    try {
      const apiResponse = await ApiCall.put(
        controllerPlantilla,
        method,
        data,
        true
      );
      if (apiResponse.data.code === 200) {
        response.message = apiResponse.data.message;
        response.teacher = apiResponse.data.data;
      } else {
        response.error = apiResponse.data.error;
      }
    } catch (exception) {
      response = ApiCall.handleCatchWithDetails(exception);
    }
    return response;
  },

  deleteAsignacion: async (data) => {
    let response = { success: true, message: "" };
    const method = data;
    try {
      const apiResponse = await ApiCall.delete(
        controllerPlantilla,
        method,
        true
      );
      if (apiResponse.data.code === 200) {
        response.message = apiResponse.data.message;
        response.teacher = apiResponse.data.data;
      } else {
        response.success = false;
        response.message = apiResponse.data.error.details[0];
      }
    } catch (exception) {
      response = ApiCall.handleCatchWithDetails(exception);
    }
    return response;
  },

  finishAsignacion: async (param, data) => {
    let response = { success: true, message: "" };
    let mensaje = "";
    const method = param;
    try {
      const apiResponse = await ApiCall.post(
        controllerPlantilla + "-terminacion",
        method,
        data,
        true
      );
      if (apiResponse.data.code === 200) {
        response.message = apiResponse.data.message;
        response.teacher = apiResponse.data.data;
      } else {
        response.success = false;
        mensaje = apiResponse.data.error.details[0];
      }
    } catch (exception) {
      response = ApiCall.handleCatch(exception, mensaje);
    }
    return response;
  },

  addAsignaturaAsignacion: async (data) => {
    let response = { success: true, message: "" };
    const method = "";
    try {
      const apiResponse = await ApiCall.post(
        controllerPlantillaAsignatura,
        method,
        data,
        true
      );
      if (apiResponse.data.code === 200) {
        response.message = apiResponse.data.message;
        response.teacher = apiResponse.data.data;
      } else {
        response.error = apiResponse.data.error;
      }
    } catch (exception) {
      response = ApiCall.handleCatchWithDetails(exception);
    }
    return response;
  },

  editAsignaturaAsignacion: async (data, asignaturaId) => {
    let response = { success: true, message: "" };
    const method = asignaturaId;
    try {
      const apiResponse = await ApiCall.put(
        controllerPlantillaAsignatura,
        method,
        data,
        true
      );
      if (apiResponse.data.code === 200) {
        response.message = apiResponse.data.message;
        response.teacher = apiResponse.data.data;
      } else {
        response.error = apiResponse.data.error;
      }
    } catch (exception) {
      response = ApiCall.handleCatchWithDetails(exception);
    }
    return response;
  },

  getAsignacionById: async (asignacionId) => {
    let response = { success: true };
    const method = asignacionId;
    try {
      const apiResponse = await ApiCall.get(controllerPlantilla, method, true);
      response.teacher = apiResponse.data.data[0];
    } catch (exception) {
      response = ApiCall.handleCatchWithDetails(exception);
    }
    return response;
  },

  deleteAsignaturaAsignacion: async (asignautraId) => {
    let response = { success: true, message: "" };
    const method = asignautraId;
    try {
      const apiResponse = await ApiCall.delete(
        controllerPlantillaAsignatura,
        method,
        true
      );
      if (apiResponse.data.code === 200) {
        response.message = apiResponse.data.message;
        response.teacher = apiResponse.data.data;
      } else {
        response.success = false;
        response.message = apiResponse.data.error.details[0];
      }
    } catch (exception) {
      response = ApiCall.handleCatchWithDetails(exception);
    }
    return response;
  },
  getAssignmentsFromLoggedInTeacher: async () => {
    let response = { success: true };
    // asignaciones-docente
    try {
      const apiResponse = await ApiCall.get("asignaciones-docente", "", true);
      response.data = apiResponse.data.data;
    } catch (error) {
      response = ApiCall.handleCatch(error);
    }
    return response;
  },
  getAssignmentsTeacherById: async (id) => {
    let response = { success: true };
    // asignaciones-docente
    try {
      const apiResponse = await ApiCall.get("asignaciones-docente", id, true);
      response.data = apiResponse.data.data;
    } catch (error) {
      response = ApiCall.handleCatch(error);
    }
    return response;
  },
  getSubjectsFromAssignments: async (id) => {
    let response = { success: true };
    try {
      const apiResponse = await ApiCall.get(
        "asignaturas-from-docente",
        id,
        true
      );
      response.data = apiResponse.data.data;
    } catch (error) {
      response = ApiCall.handleCatch(error);
    }
    return response;
  },
  getRecursamientoFromDocente: async (id) => {
    let response = { success: true };
    try {
      const apiResponse = await ApiCall.get(
        "recursamiento-semestral-docente",
        id,
        true
      );
      response.data = apiResponse.data.data;
    } catch (error) {
      response = ApiCall.handleCatch(error);
    }
    return response;
  },
  setUacGrades: async (data) => {
    let respose = { success: true };
    try {
      const apiResponse = await ApiCall.post(
        "calificaciones-uac",
        "",
        data,
        true,
        {
          responseType: "blob",
        }
      );
      respose.data = apiResponse.data;
    } catch (error) {
      respose = ApiCall.handleCatchBlob(error);
    }
    return respose;
  },

  setUacGradesByRubrics: async (data) => {
    let respose = { success: true };
    try {
      const apiResponse = await ApiCall.post(
        "bitacora-evaluacion",
        "",
        data,
        true,
        {
          responseType: "blob",
        }
      );
      respose.data = apiResponse.data;
    } catch (error) {
      respose = ApiCall.handleCatchBlob(error);
    }
    return respose;
  },
  setSemestralGradesByRubrics: async (data) => {
    let respose = { success: true };
    try {
      const apiResponse = await ApiCall.post(
        "bitacora-evaluacion-recursamiento-semestral",
        "",
        data,
        true,
        {
          responseType: "blob",
        }
      );
      respose.data = apiResponse.data;
    } catch (error) {
      respose = ApiCall.handleCatchBlob(error);
    }
    return respose;
  },
  setUacGradesInterSemester: async (data) => {
    let respose = { success: true };
    try {
      const apiResponse = await ApiCall.post(
        "calificaciones-asignatura-intersemestral",
        "",
        data,
        true,
      );
      respose.data = apiResponse.data;
    } catch (error) {
      respose = ApiCall.handleCatch(error);
    }
    return respose;
  },
  setUacGradesSemester: async (data) => {
    let respose = { success: true };
    try {
      const apiResponse = await ApiCall.post(
        "calificaciones-uac-recursamiento-semestral",
        "",
        data,
        true,
      );
      respose.data = apiResponse.data;
    } catch (error) {
      respose = ApiCall.handleCatch(error);
    }
    return respose;
  },
  setUacGradesInterSemesterDocente: async (data) => {
    let respose = { success: true };
    try {
      const apiResponse = await ApiCall.post(
        "calificaciones-asignatura-intersemestral-docente",
        "",
        data,
        true,
        {
          responseType: "blob",
        }
      );
      respose.data = apiResponse.data;
    } catch (error) {
      respose = ApiCall.handleCatchBlob(error);
    }
    return respose;
  },
  studentGradesList: async (data) => {
    let response = { success: true };
    try {
      const apiResponse = await ApiCall.post(
        "acta-calificacion",
        "",
        data,
        true,
        {
          responseType: "blob",
          "Content-Type": "application/pdf",
        }
      );
      response.data = apiResponse.data;
    } catch (error) {
      response = ApiCall.handleCatchBlob(error);
    }
    return response;
  
  },
  getEvaluationCriteriaByTeacherSubjectId: async (teacherSubjectId) => {
    let response = { success: true };
    try {
      const apiResponse = await ApiCall.get(
        "rubricas-evaluacion-asignatura",
        teacherSubjectId,
        true
      );
      response.data = apiResponse.data.data;
    } catch (error) {
      response = ApiCall.handleCatch(error);
    }
    return response;
  },
  createEvaluationCriteriaByTeacherSubjectId: async (data) => {
    let response = { success: true };
    try {
      const apiResponse = await ApiCall.post(
        "rubricas-evaluacion",
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
  editEvaluationCriteriaByTeacherSubjectId: async (
    data,
    evaluationCriteriaId
  ) => {
    let response = { success: true };
    try {
      const apiResponse = await ApiCall.put(
        "rubricas-evaluacion",
        evaluationCriteriaId,
        data,
        true
      );
      response.data = apiResponse.data.data;
    } catch (error) {
      response = ApiCall.handleCatch(error);
    }
    return response;
  },
  deleteEvaluationCriteriaByTeacherSubjectId: async (evaluationCriteriaId) => {
    let response = { success: true };
    try {
      const apiResponse = await ApiCall.delete(
        "rubricas-evaluacion",
        evaluationCriteriaId,
        true
      );
      response.data = apiResponse.data.data;
    } catch (error) {
      response = ApiCall.handleCatch(error);
    }
    return response;
  },
};
