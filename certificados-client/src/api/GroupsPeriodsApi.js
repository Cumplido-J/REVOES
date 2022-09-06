import ApiCall from "../shared/apicall";

const controllerPhp = "grupos-periodos";

export default {
  getGroupsPeriod: async (params) => {
    let response = { success: true };
    try {
      const apiResponse = await ApiCall.get(controllerPhp, "", true, {
        params,
      });
      if (apiResponse.data.data && apiResponse.data.data.grupos) {
        response.groups = apiResponse.data.data.grupos;
      } else {
        response.groups = [];
      }
    } catch (exception) {
      response = ApiCall.handleCatch(exception);
      response.groups = [];
    }
    return response;
  },
  setPeriodOnGroup: async (data) => {
    let response = { success: true };
    try {
      const apiResponse = await ApiCall.post(controllerPhp, "", data, true);
      response.data = apiResponse.data.data;
      response.message = apiResponse.data.message;
    } catch (exception) {
      response = ApiCall.handleCatch(exception);
      response.data = [];
    }
    return response;
  },
  editPeriodOnGroup: async (id, data) => {
    let response = { success: true };
    try {
      const apiResponse = await ApiCall.put(controllerPhp, id, data, true);
      response.data = apiResponse.data.data;
      response.message = apiResponse.data.message;
    } catch (exception) {
      response = ApiCall.handleCatch(exception);
      response.data = [];
    }
    return response;
  },
  disablePeriodOnGroup: async (id) => {
    let response = { success: true };
    try {
      const apiResponse = await ApiCall.delete(controllerPhp, id, true);
      response.data = apiResponse.data.data;
      response.message = apiResponse.data.message;
    } catch (exception) {
      response = ApiCall.handleCatch(exception);
      response.data = [];
    }
    return response;
  },
  setOptionalSignatures: async (groupId, optativas) => {
    let response = { success: true };
    try {
      const apiResponse = await ApiCall.post(
        "grupos-periodos-optativas",
        groupId,
        { optativas },
        true
      );
      response.data = apiResponse.data.data;
      response.message = apiResponse.data.message;
    } catch (exception) {
      response = ApiCall.handleCatch(exception);
      response.data = null;
    }
    return response;
  },
  getGroupPeriodById: async (groupPeriodId) => {
    let response = { success: true };
    try {
      const apiResponse = await ApiCall.get(controllerPhp, groupPeriodId, true);
      response.data = apiResponse.data.data;
      response.message = apiResponse.data.message;
    } catch (error) {
      response = ApiCall.handleCatch(error);
      response.data = null;
    }
    return response;
  },
  setEnrollmentConfigOnGroup: async ({ groupId, data }) => {
    let response = { success: true };
    try {
      const apiResponse = await ApiCall.post(
        "configuracion-inscripcion-grupo",
        groupId,
        data,
        true
      );
      response.data = apiResponse.data.data;
      response.message = apiResponse.data.message;
    } catch (error) {
      response = ApiCall.handleCatch(error);
      response.data = null;
    }
    return response;
  },
  setSchoolEnrollmentConfigOnGroup: async ({ schoolId, data }) => {
    let response = { success: true };
    try {
      const apiResponse = await ApiCall.post(
        "configuracion-inscripcion-general",
        schoolId,
        data,
        true
      );
      response.data = apiResponse.data.data;
      response.message = apiResponse.data.message;
    } catch (error) {
      response = ApiCall.handleCatch(error);
      response.data = null;
    }
    return response;
  },
  addStudentsToGroupPeriod: async (data) => {
    let response = { success: true };
    try {
      const apiResponse = await ApiCall.post(
        "incripcion-control-escolar",
        "",
        data,
        true
      );
      response.data = apiResponse.data;
      response.message = apiResponse.data.message;
    } catch (error) {
      response = ApiCall.handleCatchWithDetails(error);
      response.data = null;
    }
    return response;
  },
  availableGroupPeriodsFromAGroupPeriod: async (groupPeriodId) => {
    let response = { success: true };
    try {
      const apiResponse = await ApiCall.get(
        "grupos-disponibles-cambio",
        groupPeriodId,
        true
      );
      response.data = apiResponse.data;
      response.message = apiResponse.data.message;
    } catch (error) {
      response = ApiCall.handleCatch(error);
    }
    return response;
  },
  availableGroupPeriodsFromAnStudent: async (studentId) => {
    let response = { success: true };
    try {
      const apiResponse = await ApiCall.get(
        "grupos-disponibles-cambio-alumno",
        studentId,
        true
      );
      response.data = apiResponse.data;
      response.message = apiResponse.data.message;
    } catch (error) {
      response = ApiCall.handleCatch(error);
    }
    return response;
  },
  changeMultipleStudentsToAnotherGroup: async (data) => {
    let response = { success: true };
    try {
      const apiResponse = await ApiCall.post(
        "cambios-de-grupo",
        "",
        data,
        true
      );
      response.data = apiResponse.data;
      response.message = apiResponse.data.message;
    } catch (error) {
      response = ApiCall.handleCatchMultiData(error);
    }
    return response;
  },
  changeStudentToAnotherGroup: async (data) => {
    let response = { success: true };
    try {
      const apiResponse = await ApiCall.post(
        "cambiar-de-grupo",
        "",
        data,
        true
      );
      response.data = apiResponse.data;
      response.message = apiResponse.data.message;
    } catch (error) {
      response = ApiCall.handleCatch(error);
    }
    return response;
  },
  attendanceList: async (groupPeriodId, teacherUacId) => {
    let response = { success: true };
    try {
      const apiResponse = await ApiCall.get(
        "lista-asistencia",
        teacherUacId ? `${groupPeriodId}/${teacherUacId}` : groupPeriodId,
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
  groupPeriodPartialStatistics: async (groupPeriodId, partial) => {
    let response = { success: true };
    try {
      const apiResponse = await ApiCall.post(
        "estadisticas-grupo-parcial",
        groupPeriodId,
        {
          parcial: partial,
        },
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
  academicRecordByGroupPeriod: async (groupPeriodId) => {
    let response = { success: true };
    try {
      const apiResponse = await ApiCall.get(
        "historial-academico-grupo",
        groupPeriodId,
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
  documentProofByGroupPeriod: async (groupPeriodId, data) => {
    let response = { success: true };
    try {
      const apiResponse = await ApiCall.post(
        "constancia-grupo",
        groupPeriodId,
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
  groupPeriodTeacherReport: async (groupPeriodId) => {
    let response = {
      success: true,
    };
    try {
      const apiResponse = await ApiCall.get(
        "docentes-grupo",
        groupPeriodId,
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
  groupPeriodRedi: async (groupPeriodId) => {
    let response = { success: true };
    try {
      const apiResponse = await ApiCall.get(
        "reporte-alumnos",
        groupPeriodId,
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
  /**
   *
   * @param {number} groupPeriodId
   * @param {boolean} onlyFailedStudents
   * @returns {Promise<{success: boolean, message?:string, data?:Blob}>}
   */
  failedStudentsReport: async (groupPeriodId, onlyFailedStudents = false) => {
    let response = { success: true };
    try {
      const apiResponse = await ApiCall.post(
        "reporte-alumnos-reprobados",
        groupPeriodId,
        {
          solo_reprobados: onlyFailedStudents,
        },
        true,
        {
          responseType: "blob",
          "Content-Type": "application/pdf",
        }
      );
      response.data = apiResponse.data;
    } catch (e) {
      response = ApiCall.handleCatchBlob(e);
    }
    return response;
  },
  /**
   *
   * @param {array<string|number>} groupsIds
   * @returns {Promise<{success: boolean, message?:string, data?:Blob}>}
   */
  studentPopulationReportByGroups: async (groupsIds) => {
    let response = { success: true };
    try {
      const apiResponse = await ApiCall.post(
        "reporte-poblacion-alumnos-grupo",
        "",
        {
          ids: groupsIds,
        },
        true,
        {
          responseType: "blob",
        }
      );
      response.data = apiResponse.data;
    } catch (e) {
      response = ApiCall.handleCatchBlob(e);
    }
    return response;
  },
  /**
   *
   * @param {number|string} groupPeriodId
   * @returns {Promise<{success: boolean, message?:string, data?:Blob}>}
   */
  semiannualConcentratedReport: async (groupPeriodId) => {
    let response = { success: true };
    try {
      const apiResponse = await ApiCall.get(
        "reportes",
        `concentrado-semestral/${groupPeriodId}`,
        true,
        {
          responseType: "blob",
        }
      );
      response.data = apiResponse.data;
    } catch (e) {
      response = ApiCall.handleCatchBlob(e);
    }
    return response;
  },
  /**
   *
   * @param {Object<{ids: (number|string)[], fecha_nacimiento: boolean, domicilio: boolean, telefono: boolean, email: boolean, sexo: boolean}>} data
   * @returns {Promise<{success: boolean, message?:string, data?:Blob}>}
   */
  exportStudentsFromGroupSearch: async (data) => {
    let response = { success: true };
    try {
      const apiResponse = await ApiCall.post(
        "reportes",
        "alumnos-por-grupo",
        data,
        true,
        {
          responseType: "blob",
        }
      );
      response.data = apiResponse.data;
    } catch (e) {
      response = ApiCall.handleCatchBlob(e);
    }
    return response;
  },
  /**
   *
   * @param {number|string} groupPeriodId
   * @returns {Promise<{success: boolean, message?:string, data?:Blob}>}
   */ semiannualEvaluationReport: async (groupPeriodId) => {
    let response = { success: true };
    try {
      const apiResponse = await ApiCall.get(
        "reportes",
        `evaluacion-semestral/${groupPeriodId}`,
        true,
        {
          responseType: "blob",
          "Content-Type": "application/pdf",
        }
      );
      response.data = apiResponse.data;
    } catch (e) {
      response = ApiCall.handleCatchBlob(e);
    }
    return response;
  },
};
