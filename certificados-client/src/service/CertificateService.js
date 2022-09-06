import { Alert } from "antd";
import CertificateApi from "../api/CertificateApi";

import Alerts from "../shared/alerts";

export default {
  studentValidationSearch: async (values) => {
    const response = await CertificateApi.studentValidationSearch(values);
    if (!response.success) Alerts.error("Ha ocurrido un error", response.message);
    return response;
  },
  validateStudents: async (values) => {
    const response = await CertificateApi.validateStudents(values);
    if (!response.success) Alerts.error("Ha ocurrido un error", response.message);
    return response;
  },
  reprobateStudent: async (curp) => {
    const response = await CertificateApi.reprobateStudent(curp);
    if (!response.success) Alerts.error("Ha ocurrido un error", response.message);
    return response;
  },
  editStudent: async (values) => {
    const response = await CertificateApi.editStudent(values);
    if (!response.success) Alerts.error("Ha ocurrido un error", response.message);
    return response;
  },
  getStudentData: async (curp) => {
    const response = await CertificateApi.getStudentData(curp);
    if (!response.success) Alerts.error("Ha ocurrido un error", response.message);
    return response;
  },
  studentUploadSearch: async (values) => {
    const response = await CertificateApi.studentUploadSearch(values);
    if (!response.success) Alerts.error("Ha ocurrido un error", response.message);
    return response;
  },
  certificateStudents: async (values) => {
    const response = await CertificateApi.certificateStudents(values);
    if (!response.success) Alerts.error("Ha ocurrido un error", response.message);
    return response;
  },
  studentQuerySearch: async (values) => {
    const response = await CertificateApi.studentQuerySearch(values);
    if (!response.success) Alerts.error("Ha ocurrido un error", response.message);
    return response;
  },
  getPendientBatches: async (values) => {
    const response = await CertificateApi.getPendientBatches(values);
    if (!response.success) Alerts.error("Ha ocurrido un error", response.message);
    return response;
  },
  sincronizeBatches: async (values) => {
    const response = await CertificateApi.sincronizeBatches(values);
    if (!response.success) Alerts.error("Ha ocurrido un error", response.message);
    return response;
  },
  downloadPdf: async (folioNumber) => {
    const response = await CertificateApi.downloadPdf(folioNumber);
    if (!response.success) Alerts.error("Ha ocurrido un error", response.message);
    return response;
  },
  downloadXml: async (folioNumber) => {
    const response = await CertificateApi.downloadXml(folioNumber);
    if (!response.success) Alerts.error("Ha ocurrido un error", response.message);
    return response;
  },
  downloadMultiplePdf: async (form) => {
    const response = await CertificateApi.downloadMultiplePdf(form);
    if (!response.success) Alerts.error("Ha ocurrido un error", response.message);
    return response;
  },
  cancelCertificate: async (certificateType, curp) => {
    const response = await CertificateApi.cancelCertificate(certificateType, curp);
    if (!response.success) Alerts.error("Ha ocurrido un error", response.message);
    return response;
  },
  getCertificateLimit: async (curp) => {
    const response = await CertificateApi.getCertificateLimit(curp);
    if (!response.success) Alerts.error("Ha ocurrido un error", response.message);
    return response;
  },
  selectDataStudent: async (curp) => {
    const response = await CertificateApi.selectDataStudent(curp);
    if (!response.success) Alerts.error("Ha ocurrido un error", response.message);
    return response;
  },
};
