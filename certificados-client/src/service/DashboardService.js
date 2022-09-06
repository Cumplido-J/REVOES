import DashboardApi from "../api/DashboardApi";

import Alerts from "../shared/alerts";

export default {

  getQuestion4: async (question, gender,idestado,idschool,surveyType) => {
    const response = await DashboardApi.getQuestion4(question, gender,idestado,idschool,surveyType);
    if (!response.success)
      Alerts.error("Ha ocurrido un error", response.message);
      return response;
  },    
  getMexicoReport: async (surveyType) => {
    const response = await DashboardApi.getMexicoReport(surveyType);
    if (!response.success) Alerts.error("Ha ocurrido un error", response.message);
    return response;
  },  
  getNewGeneration: async (idestado,idschool) => {
    const response = await DashboardApi.getNewGeneration(idestado,idschool);
    if (!response.success) Alerts.error("Ha ocurrido un error", response.message);
    return response;
  },
  getCertified: async (idestado,idschool) => {
    const response = await DashboardApi.getCertified(idestado,idschool);
    if (!response.success) Alerts.error("Ha ocurrido un error", response.message);
    return response;
  },  
  getPlanteles: async (idestado,schoolId) => {
    const response = await DashboardApi.getPlanteles(idestado,schoolId);
    if (!response.success) Alerts.error("Ha ocurrido un error", response.message);
    return response;
  },
  ///consulta de certificados
  getCertifiedByGenero: async (idestado,idschool) => {
    const response = await DashboardApi.getCertifiedByGenero(idestado,idschool);
    if (!response.success) Alerts.error("Ha ocurrido un error", response.message);
    return response;
  }, 
  //titulos
  getDegreedByGenero: async (idestado,idschool) => {
    const response = await DashboardApi.getDegreedByGenero(idestado,idschool);
    if (!response.success) Alerts.error("Ha ocurrido un error", response.message);
    return response;
  },   
}