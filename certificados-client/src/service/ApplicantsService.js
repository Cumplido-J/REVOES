import Alerts from "../shared/alerts";
import ApplicantsApi from "../api/ApplicantsApi";
import { Alert } from "antd";
/**
 * Obtiene la lista de aplicantes
 * @param {number|undefined} state
 * @param {number|undefined} school
 * @param {string|undefined} cadena
 * @returns {Promise<{success: boolean, data: any}>}
 */
export const getApplicants = async ({ state, school, searchText }) => {
  const response = await ApplicantsApi.getApplicants({
    state,
    school,
    searchText,
  });
  if (!response.success) Alerts.error("Ha ocurrido un error", response.message);
  return response;
};

export const getApplicantById = async ({ id }) => {
  const response = await ApplicantsApi.getApplicantById({ id });
  if (!response.success) Alerts.error("Ha ocurrido un error", response.message);
  return response;
};

export const deleteApplicantById = async ({ id }) => {
  const response = await ApplicantsApi.deleteApplicantById({ id });
  if (!response.success) Alerts.error("Ha ocurrido un error", response.message);
  return response;
};

export const createApplicants = async (props) => {
  const response = await ApplicantsApi.creatApplicant(props);
  if (!response.success) Alerts.error("Ha ocurrido un error", response.message);
  return response;
};

export const dateConfigApplicant = async (props) => {
  const response = await ApplicantsApi.dateConfigApplicant(props);
  if (!response.success) Alerts.error("Ha ocurrido un error", response.message);
  return response;
};

export const getDateConfigApplicant = async (id) => {
  const response = await ApplicantsApi.getDateConfigApplicant(id);
  if (!response.success) Alerts.error("Ha ocurrido un error", response.message);
  return response;
};

export const editApplicant = async (props, applicantId) => {
  const response = await ApplicantsApi.editApplicant(props, applicantId);
  if (!response.success) Alerts.error("Ha ocurrido un error", response.message);
  return response;
};

export const printApplicantReceipt = async (applicantId) => {
  const response = await ApplicantsApi.printReceipt(applicantId);
  if (!response.success) Alerts.error("Ha ocurrido un error", response.message);
  return response;
};

export const printSearchEnrollmentReportService = async (data) => {
  const response = await ApplicantsApi.printSearchEnrollmentReport(data);
  if (!response.success) Alerts.error("Ha ocurrido un error", response.message);
  return response;
};
