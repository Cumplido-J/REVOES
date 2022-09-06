import ReportsSchoolEnrollmentApi from "../api/ReportsSchoolEnrollmentApi";

import Alerts from "../shared/alerts";

export default {
  insertSchoolEnrollment: async (form) => {
    console.log("en service insert form:"+JSON.stringify(form));
    const response = await ReportsSchoolEnrollmentApi.insertSchoolEnrollment(form);
    if (!response.success)
      Alerts.error("Ha ocurrido un error insertSchoolEnrollment", response.message);
    return response;
  },
  updateSchoolEnrollment: async (form) => {
    console.log("en service update form:"+JSON.stringify(form));
    const response = await ReportsSchoolEnrollmentApi.updateSchoolEnrollment(form);
    if (!response.success)
      Alerts.error("Ha ocurrido un error updateSchoolEnrollment", response.message);
    return response;
  },
  getSchoolEnrollment: async (stateId,schoolId,careerId,cicloId,enrollId) => {
    const response = await ReportsSchoolEnrollmentApi.getSchoolEnrollment(stateId,schoolId,careerId,cicloId,enrollId);
    if (!response.success)
      Alerts.error("Ha ocurrido un error en getSchoolEnrollment", response.message);
    return response;
  },
  getStateEnrollment: async (schoolType, cicloId, enrollId) => {
    const response = await ReportsSchoolEnrollmentApi.getStateEnrollment(schoolType, cicloId, enrollId);
    if (!response.success)
      Alerts.error("Ha ocurrido un error en getStateEnrollment", response.message);
    return response;
  },
  getStateSchoolEnrollment: async (tipoPlantel,cicloId,matricula,estado) => {
    const response = await ReportsSchoolEnrollmentApi.getStateSchoolEnrollment(tipoPlantel,cicloId,matricula,estado);
    if (!response.success)
      Alerts.error("Ha ocurrido un error en getStateSchoolEnrollment", response.message);
    return response;
  },
  getStateSchoolCareerEnrollment: async (cicloId, enrollId, plantelId) => {
    const response = await ReportsSchoolEnrollmentApi. getStateSchoolCareerEnrollment(cicloId, enrollId, plantelId);
    if (!response.success)
      Alerts.error("Ha ocurrido un error en getStateSchoolCareerEnrollment", response.message);
    return response;
  },
  getSchoolCycles: async () => {
    const response = await ReportsSchoolEnrollmentApi.getSchoolCycles();
    if (!response.success)
      Alerts.error("Ha ocurrido un error en getSchoolCycles", response.message);
    return response;
  },
  ///////////////////////////////////
  //Registro Egresados Titulados
  ////////////////////////////////////
  getGraduates: async (stateId,schoolId,careerId,cicloId,enrollId) => {
    const response = await ReportsSchoolEnrollmentApi.getGraduates(stateId,schoolId,careerId,cicloId,enrollId);
    if (!response.success)
      Alerts.error("Ha ocurrido un error en getGraduates", response.message);
    return response;
  },
  insertGraduates: async (form) => {
    console.log("en service insert form:"+JSON.stringify(form));
    const response = await ReportsSchoolEnrollmentApi.insertGraduates(form);
    if (!response.success)
      Alerts.error("Ha ocurrido un error insertGraduates", response.message);
    return response;
  },
  updateGraduates: async (form) => {
    console.log("en service update form:"+JSON.stringify(form));
    const response = await ReportsSchoolEnrollmentApi.updateGraduates(form);
    if (!response.success)
      Alerts.error("Ha ocurrido un error updateGraduates", response.message);
    return response;
  },
  getStateGraduates: async (schoolType, cicloId, enrollId) => {
    const response = await ReportsSchoolEnrollmentApi.getStateGraduates(schoolType, cicloId, enrollId);
    if (!response.success)
      Alerts.error("Ha ocurrido un error en getStateGraduates", response.message);
    return response;
  },
  getStateSchoolGraduates: async (schoolType, cicloId, enrollId, idEntidad) => {
    const response = await ReportsSchoolEnrollmentApi.getStateSchoolGraduates(schoolType, cicloId, enrollId, idEntidad);
    if (!response.success)
      Alerts.error("Ha ocurrido un error en getStateSchoolGraduates", response.message);
    return response;
  },
  getStateSchoolCareerGraduates: async (cicloId, enrollId, plantelId) => {
    const response = await ReportsSchoolEnrollmentApi.getStateSchoolCareerGraduates(cicloId, enrollId, plantelId);
    if (!response.success)
      Alerts.error("Ha ocurrido un error en getStateSchoolCareerGraduates", response.message);
    return response;
  },
  ///////////////////////////////////
  //Nivel de estudios
  ////////////////////////////////////
  getEducationLevel: async (stateId,schoolId,cicloId,turn,place) => {
    const response = await ReportsSchoolEnrollmentApi.getEducationLevel(stateId,schoolId,cicloId,turn,place);
    if (!response.success)
      Alerts.error("Ha ocurrido un error en getEducationLevel", response.message);
    return response;
  },
  insertEducationLevel: async (form) => {
    console.log("en service insertEducationLevel:"+JSON.stringify(form));
    const response = await ReportsSchoolEnrollmentApi.insertEducationLevel(form);
    if (!response.success)
      Alerts.error("Ha ocurrido un error insertEducationLevel", response.message);
    return response;
  },
  updateEducationLevel: async (form) => {
    console.log("en service updateEducationLevel:"+JSON.stringify(form));
    const response = await ReportsSchoolEnrollmentApi.updateEducationLevel(form);
    if (!response.success)
      Alerts.error("Ha ocurrido un error updateGraduates", response.message);
    return response;
  },
  getStateEducationLevel: async (cicloId) => {
    const response = await ReportsSchoolEnrollmentApi.getStateEducationLevel(cicloId);
    if (!response.success)
      Alerts.error("Ha ocurrido un error en getStateEducationLevel", response.message);
    return response;
  },
  getStateSchoolsEducationLevel: async (cicloId, idEntidad) => {
    const response = await ReportsSchoolEnrollmentApi.getStateSchoolsEducationLevel(cicloId, idEntidad);
    if (!response.success)
      Alerts.error("Ha ocurrido un error en getStateSchoolsEducationLevel", response.message);
    return response;
  },
  getStateSchoolEducationLevel: async (cicloId, idEntidad) => {
    const response = await ReportsSchoolEnrollmentApi.getStateSchoolEducationLevel(cicloId, idEntidad);
    if (!response.success)
      Alerts.error("Ha ocurrido un error en getStateSchoolEducationLevel", response.message);
    return response;
  }
}