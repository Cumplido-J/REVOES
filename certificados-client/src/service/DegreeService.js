import DegreeApi from "../api/DegreeApi";

import Alerts from "../shared/alerts";

export default {
  studentValidationSearch: async (values) => {
    const response = await DegreeApi.studentValidationSearch(values);
    if (!response.success) Alerts.error("Ha ocurrido un error", response.message);
    return response;
  },
  validateStudents: async (values) => {
    const response = await DegreeApi.validateStudents(values);
    if (!response.success) Alerts.error("Ha ocurrido un error", response.message);
    return response;
  },
  reprobateStudent: async (curp) => {
    const response = await DegreeApi.reprobateStudent(curp);
    if (!response.success) Alerts.error("Ha ocurrido un error", response.message);
    return response;
  },
  editStudent: async (curp, values) => {
    const response = await DegreeApi.editStudent(curp, values);
    if (!response.success) Alerts.error("Ha ocurrido un error", response.message);
    return response;
  },
  getStudentData: async (curp) => {
    const response = await DegreeApi.getStudentData(curp);
    if (!response.success) Alerts.error("Ha ocurrido un error", response.message);
    return response;
  },
  studentUploadSearch: async (values) => {
    const response = await DegreeApi.studentUploadSearch(values);
    if (!response.success) Alerts.error("Ha ocurrido un error", response.message);
    return response;
  },
  degreeStudents: async (values) => {
    const response = await DegreeApi.degreeStudents(values);
    if (!response.success) Alerts.error("Ha ocurrido un error", response.message);
    return response;
  },
  studentQuerySearch: async (values) => {
    const response = await DegreeApi.studentQuerySearch(values);
    if (!response.success) Alerts.error("Ha ocurrido un error", response.message);
    return response;
  },
  getPendientBatches: async (values) => {
    const response = await DegreeApi.getPendientBatches(values);
    if (!response.success) Alerts.error("Ha ocurrido un error", response.message);
    return response;
  },
  sincronizeBatches: async (values) => {
    const response = await DegreeApi.sincronizeBatches(values);
    if (!response.success) Alerts.error("Ha ocurrido un error", response.message);
    return response;
  },
  downloadPdf: async (folioNumber) => {
    const response = await DegreeApi.downloadPdf(folioNumber);
    if (!response.success) Alerts.error("Ha ocurrido un error", response.message);
    return response;
  },
  downloadXml: async (folioNumber) => {
    const response = await DegreeApi.downloadXml(folioNumber);
    if (!response.success) Alerts.error("Ha ocurrido un error", response.message);
    return response;
  },
  downloadMultiplePdf: async (form) => {
    const response = await DegreeApi.downloadMultiplePdf(form);
    if (!response.success) Alerts.error("Ha ocurrido un error", response.message);
    return response;
  },
  cancelDegree: async (curp, values) => {
    const response = await DegreeApi.cancelDegree(curp, values);
    if (!response.success) Alerts.error("Ha ocurrido un error", response.message);
    return response;
  },
  antecedentDegree: async (curp, form) =>{
    const response = await DegreeApi.antecedentDegree(curp, form);
    if (!response.success) Alerts.error("Ha ocurrido un error", response.message);
    return response;
  },
  degreeStudentView: async (curp) => {
    const response = await DegreeApi.degreeStudentView(curp);
    if (!response.success) Alerts.error("Ha ocurrido un error", response.message);
    return response;
  },
  cancelExternalStamps: async (values) => {
    const response = await DegreeApi.cancelExternalStamps(values);
    if (!response.success) Alerts.error("Ha ocurrido un error", response.message);
    return response;
  },
};
