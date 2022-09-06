import SchoolApi from "../api/SchoolApi";

import Alerts from "../shared/alerts";

export default {
  schoolSearch: async (values) => {
    const response = await SchoolApi.schoolSearch(values);
    if (!response.success) Alerts.error("Ha ocurrido un error", response.message);
    return response;
  },
  getSchoolData: async (cct) => {
    const response = await SchoolApi.getSchoolData(cct);
    if (!response.success) Alerts.error("Ha ocurrido un error", response.message);
    return response;
  },
  addSchool: async (form) => {
    const response = await SchoolApi.addSchool(form);
    if (!response.success) Alerts.error("Ha ocurrido un error", response.message);
    return response;
  },
  editSchool: async (cct, form) => {
    const response = await SchoolApi.editSchool(cct, form);
    if (!response.success) Alerts.error("Ha ocurrido un error", response.message);
    return response;
  },
  addCareerSchool: async (values) => {
    const response = await SchoolApi.addCareerSchool(values);
    if (!response.success) Alerts.error("Ha ocurrido un error", response.message);
    return response;
  },
  deleteCareerSchool: async (values) => {
    const response = await SchoolApi.deleteCareerSchool(values);
    if (!response.success) Alerts.error("Ha ocurrido un error", response.message);
    return response;
  },
  deleteCareerUpdateStudent: async (schoolcareerId, form) => {
    const response = await SchoolApi.deleteCareerUpdateStudent(schoolcareerId, form);
    if (!response.success) Alerts.error("Ha ocurrido un error", response.message);
    return response;
  },
  getTotal: async (schoolcareerId) => {
    const response = await SchoolApi.getTotal(schoolcareerId);
    if (!response.success)
      Alerts.error("Ha ocurrido un error", response.message);
    return response;
  },
  addchoolEquivaalent: async (values) => {
    const response = await SchoolApi.addchoolEquivaalent(values);
    if (!response.success) Alerts.error("Ha ocurrido un error", response.message);
    return response;
  },
  selectSchoolEquivalent: async (schoolId) => {
    const response = await SchoolApi.selectSchoolEquivalent(schoolId);
    if (!response.success) Alerts.error("Ha ocurrido un error", response.message);
    return response;
  },
  updateSchoolEquivalent: async (values) => {
    const response = await SchoolApi.updateSchoolEquivalent(values);
    if (!response.success) Alerts.error("Ha ocurrido un error", response.message);
    return response;
  },
  deleteSchoolEquivalent: async (values) => {
    const response = await SchoolApi.deleteSchoolEquivalent(values);
    if (!response.success) Alerts.error("Ha ocurrido un error", response.message);
    return response;
  },
  schoolEquivalentSearch: async (values) => {
    const response = await SchoolApi.schoolEquivalentSearch(values);
    if (!response.success) Alerts.error("Ha ocurrido un error", response.message);
    return response;
  },
    //consulta eugenio mapa
    schoolByState: async (stateId) => {
      const response = await SchoolApi.schoolByState(stateId);
      if (!response.success) Alerts.error("Ha ocurrido un error", response.message);
      return response;
    }, 
};
