import CatalogApi from "../api/CatalogApi";

import Alerts from "../shared/alerts";

export default {
  getStateCatalogs: async () => {
    const response = await CatalogApi.getStateCatalogs();
    if (!response.success)
      Alerts.error("Ha ocurrido un error", response.message);
    return response;
  },
  getSchoolCatalogs: async (stateId) => {
    const response = await CatalogApi.getSchoolCatalogs(stateId);
    if (!response.success)
      Alerts.error("Ha ocurrido un error", response.message);
    return response;
  },
  getStateId: async (plantelId) => {
    const response = await CatalogApi.getStateId(plantelId);
    if (!response.success)
      Alerts.error("Ha ocurrido un error", response.message);
    return response;
  },
  getCareerCatalogs: async (schoolId) => {
    const response = await CatalogApi.getCareerCatalogs(schoolId);
    if (!response.success)
      Alerts.error("Ha ocurrido un error", response.message);
    return response;
  },
  getSchoolCatalogsWithoutPermission: async (schoolId) => {
    const response = await CatalogApi.getSchoolCatalogsWithoutPermission(
      schoolId
    );
    if (!response.success)
      Alerts.error("Ha ocurrido un error", response.message);
    return response;
  },
  getCareerCatalogsByState: async (stateId) => {
    const response = await CatalogApi.getCareerCatalogsByState(stateId);
    if (!response.success)
      Alerts.error("Ha ocurrido un error", response.message);
    return response;
  },
  getCareerCatalogsBySchool: async (stateId) => {
    const response = await CatalogApi.getCareerCatalogsBySchool(stateId);
    if (!response.success)
      Alerts.error("Ha ocurrido un error", response.message);
    return response;
  },
  getCityCatalogs: async (stateId) => {
    const response = await CatalogApi.getCityCatalogs(stateId);
    if (!response.success)
      Alerts.error("Ha ocurrido un error", response.message);
    return response;
  },
  getAllCareersCatalogs: async () => {
    const response = await CatalogApi.getAllCareersCatalogs();
    if (!response.success)
      Alerts.error("Ha ocurrido un error", response.message);
    return response;
  },
  getModulesByCareer: async (careerId) => {
    const response = await CatalogApi.getModulesByCareer(careerId);
    if (!response.success)
      Alerts.error("Ha ocurrido un error", response.message);
    return response;
  },
  getCareerCatalogs2: async (schoolId) => {
    const response = await CatalogApi.getCareerCatalogs2(schoolId);
    if (!response.success)
      Alerts.error("Ha ocurrido un error", response.message);
    return response;
  },
  getAllCareersCatalogs2: async () => {
    const response = await CatalogApi.getAllCareersCatalogs2();
    if (!response.success)
      Alerts.error("Ha ocurrido un error", response.message);
    return response;
  },
  getPrueba: async () => {
    const response = await CatalogApi.getPrueba();
    if (!response.success)
      Alerts.error("Ha ocurrido un error", response.message);
    return response;
  },
  getRoleCatalogs: async () => {
    const response = await CatalogApi.getRoleCatalogs();
    if (!response.success)
      Alerts.error("Ha ocurrido un error", response.message);
    return response;
  },
  getCargoCatalogs: async () => {
    const response = await CatalogApi.getCargoCatalogs();
    if (!response.success)
      Alerts.error("Ha ocurrido un error", response.message);
    return response;
  },
  getRoleUser: async () => {
    const response = await CatalogApi.getRoleUser();
    if (!response.success)
      Alerts.error("Ha ocurrido un error", response.message);
    return response;
  },
  getPersonalRole: async () => {
    const response = await CatalogApi.getPersonalRole();
    if (!response.success)
      Alerts.error("Ha ocurrido un error", response.message);
    return response;
  },
  getCareerCatalogsSelect: async (cct) => {
    const response = await CatalogApi.getCareerCatalogsSelect(cct);
    if (!response.success)
      Alerts.error("Ha ocurrido un error", response.message);
    return response;
  },
  getPerfilCatalogs: async () => {
    const response = await CatalogApi.getPerfilCatalogs();
    if (!response.success)
      Alerts.error("Ha ocurrido un error", response.message);
    return response;
  },
  getEstudioCatalogs: async () => {
    const response = await CatalogApi.getEstudioCatalogs();
    if (!response.success)
      Alerts.error("Ha ocurrido un error", response.message);
    return response;
  },
  getDiciplinarCatalogs: async () => {
    const response = await CatalogApi.getDiciplinarCatalogs();
    if (!response.success)
      Alerts.error("Ha ocurrido un error", response.message);
    return response;
  },
  getSubjectCatalogs: async () => {
    const response = await CatalogApi.getSubjectCatalogs();
    if (!response.success)
      Alerts.error("Ha ocurrido un error", response.message);
    return response;
  },
  getCompetencias: async (careerKey) => {
    const response = await CatalogApi.getCompetencias(careerKey);
    if (!response.success)
      Alerts.error("Ha ocurrido un error", response.message);
    return response;
  },
  getCompetenciasCatalogs: async () => {
    const response = await CatalogApi.getCompetenciasCatalogs();
    if (!response.success)
      Alerts.error("Ha ocurrido un error", response.message);
    return response;
  },
  getSubjectType: async () => {
    const response = await CatalogApi.getSubjectType();
    if (!response.success)
      Alerts.error("Ha ocurrido un error", response.message);
    return response;
  },
  getdiciplinaryCompentence: async () => {
    const response = await CatalogApi.getdiciplinaryCompentence();
    if (!response.success)
      Alerts.error("Ha ocurrido un error", response.message);
    return response;
  },
  getAllGroups:async()=>{
    const response=await CatalogApi.getAllGroups();
    if(!response.success)
    Alerts.error("Ha ocurrido un error", response.message);
    return response;
  },
  getAllPermissions:async()=>{
    const response=await CatalogApi.getAllPermissions();
    if(!response.success)
    Alerts.error("Ha ocurrido un error", response.message);
    return response;
  },
  selectPeriodFinished: async (stateId, generationId) => {
    const response = await CatalogApi.selectPeriodFinished(stateId, generationId);
    if (!response.success) 
    Alerts.error("Ha ocurrido un error", response.message);
    return response;
  },
  /*
   * Get periods: Se obtiene de back de laravel
   * @method GET
   * @return {custom response object}
   */
  getPeriodsCatalog: async () => {
    const response = await CatalogApi.getPeriods();
    if (!response.success)
      Alerts.error("Ha ocurrido un error", response.message);
    return response;
  },
  /* teacher */
  getTypeBlood: async () => {
    const response = await CatalogApi.getTypeBlood();
    if (!response.success)
      Alerts.error("Ha ocurrido un error", response.message);
    return response;
  },
  getDocumentsOptions: async () => {
    const response = await CatalogApi.getDocumentsOptions();
    if (!response.success)
      Alerts.error("Ha ocurrido un error", response.message);
    return response;
  },
  getMaxStudyOptions: async () => {
    const response = await CatalogApi.getMaxStudyOptions();
    if (!response.success)
      Alerts.error("Ha ocurrido un error", response.message);
    return response;
  },
  /* plantilla */
  getTypePlaza: async () => {
    const response = await CatalogApi.getTypePlaza();
    if (!response.success)
      Alerts.error("Ha ocurrido un error", response.message);
    return response;
  },
  /* asignaturas */
  getUacByFilter: async (filter) => {
    const response = await CatalogApi.getUacByFilter(filter);
    if (!response.success)
      Alerts.error("Ha ocurrido un error", response.message);
    return response;
  },

  getUacWithOutGrades: async (filter) => {
    const response = await CatalogApi.getUacWithOutGrades(filter);
    if (!response.success)
      Alerts.warning("Ha ocurrido un error", response.message);
    return response;
  },

  getCertificationPeriodsConfig: async (filter) => {
    const response = await CatalogApi.getCertificationPeriodsConfig(filter);
    if (!response.success)
      Alerts.warning("Ha ocurrido un error", response.message);
    return response;
  },

  getStudentEnrollmentDocuments: async () => {
    const response = await CatalogApi.getStudentEnrollmentDocuments();
    if (!response.success)
      Alerts.error("Ha ocurrido un error", response.message);
    return response;
  },
  getGenerationsCatalogs: async () => {
    const response = await CatalogApi.getGenerationsCatalogs();
    if (!response.success)
      Alerts.error("Ha ocurrido un error", response.message);
    return response;
  },

  getAllStateCatalogs: async () => {
    const response = await CatalogApi.getAllStateCatalogs();
    if (!response.success)
      Alerts.error("Ha ocurrido un error", response.message);
    return response;
  },
  getCargosCatalogs: async () => {
    const response = await CatalogApi.getCargosCatalogs();
    if (!response.success)
      Alerts.error("Ha ocurrido un error", response.message);
    return response;
  },
  getMedicalIntitutions: async () => {
    const response = await CatalogApi.getMedicalIntitutions();
    if (!response.success)
      Alerts.error("Ha ocurrido un error", response.message);
    return response;
  },
  getSchoolCycle: async () => {
    const response = await CatalogApi.getSchoolCycle();
    if (!response.success)
      Alerts.error("Ha ocurrido un error", response.message);
    return response;
  },

};
