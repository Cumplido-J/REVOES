import DegreeCatalogApi from "../api/DegreeCatalogApi";

import Alerts from "../shared/alerts";

export default {
  getAntecedents: async () => {
    const response = await DegreeCatalogApi.getAntecedents();
    if (!response.success) Alerts.error("Ha ocurrido un error", response.message);
    return response;
  },
  getReasons: async () => {
    const response = await DegreeCatalogApi.getReasons();
    if (!response.success) Alerts.error("Ha ocurrido un error", response.message);
    return response;
  },
  getAuths: async () => {
    const response = await DegreeCatalogApi.getAuths();
    if (!response.success) Alerts.error("Ha ocurrido un error", response.message);
    return response;
  },
  getModalities: async () => {
    const response = await DegreeCatalogApi.getModalities();
    if (!response.success) Alerts.error("Ha ocurrido un error", response.message);
    return response;
  },
  getSigners: async () => {
    const response = await DegreeCatalogApi.getSigners();
    if (!response.success) Alerts.error("Ha ocurrido un error", response.message);
    return response;
  },
  getSocialService: async () => {
    const response = await DegreeCatalogApi.getSocialService();
    if (!response.success) Alerts.error("Ha ocurrido un error", response.message);
    return response;
  },
  getStates: async () => {
    const response = await DegreeCatalogApi.getStates();
    if (!response.success) Alerts.error("Ha ocurrido un error", response.message);
    return response;
  },
  getCarrer: async (curp) => {
    const response = await DegreeCatalogApi.getCarrer(curp);
    if (!response.success) Alerts.error("Ha ocurrido un error", response.message);
    return response;
  },
  getSchools: async (stateId) => {
    const response = await DegreeCatalogApi.getSchools(stateId);
    if (!response.success) Alerts.error("Ha ocurrido un error", response.message);
    return response;
  }, 
  getCarrers: async (schoolId) => {
    const response = await DegreeCatalogApi.getCarrers(schoolId);
    if (!response.success) Alerts.error("Ha ocurrido un error", response.message);
    return response;
  }, 
  getAllStates: async () => {
    const response = await DegreeCatalogApi.getAllStates();
    if (!response.success) Alerts.error("Ha ocurrido un error", response.message);
    return response;
  },
  schoolsNormalAll: async () => {
    const response = await DegreeCatalogApi.schoolsNormalAll();
    if (!response.success) Alerts.error("Ha ocurrido un error", response.message);
    return response;
  },
  careerAllDgp: async () => {
    const response = await DegreeCatalogApi.careerAllDgp();
    if (!response.success) Alerts.error("Ha ocurrido un error", response.message);
    return response;
  },
  searSchoolDgp: async (schoolId) => {
    const response = await DegreeCatalogApi.searSchoolDgp(schoolId);
    if (!response.success) Alerts.error("Ha ocurrido un error", response.message);
    return response;
  },
  studentPeriodDate: async (curp) => {
    const response = await DegreeCatalogApi.studentPeriodDate(curp);
    if (!response.success) Alerts.error("Ha ocurrido un error", response.message);
    return response;
  },
  stateListAll: async () => {
    const response = await DegreeCatalogApi.stateListAll();
    if (!response.success) Alerts.error("Ha ocurrido un error", response.message);
    return response;
  },
};
