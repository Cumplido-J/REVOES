import EvaluationSettingsApi from "../api/EvaluationSettingsApi";
import alerts from "../shared/alerts";

export const setEvaluationSettings = async (data) => {
  const response = await EvaluationSettingsApi.setEvaluationSettings(data);
  if (!response.success) alerts.error("Ha ocurrido un error", response.message);
  if (response.details) {
    var details = response.details;

    alerts.error("Detalles:", details);
  }
  return response;
};
export const getEvaluationSettings = async (cct) => {
  const response = await EvaluationSettingsApi.getEvaluationSettings(cct);
  if (!response.success) alerts.error("Ha ocurrido un error", response.message);
  return response;
};
export const setPartialSettings = async (data) => {
  const response = await EvaluationSettingsApi.setPartialSettings(data);
  if (!response.success) alerts.error("Ha ocurrido un error", response.message);
  if (response.details) {
    var details = response.details;

    alerts.error("Detalles:", details);
  }
  return response;
};
export const getPartialSettings = async (cct) => {
  const response = await EvaluationSettingsApi.getPartialSettings(cct);
  if (!response.success) alerts.error("Ha ocurrido un error", response.message);
  return response;
};
export const getEvaluationsDates = async (cct) => {
  const response = await EvaluationSettingsApi.getEvaluationsDates(cct);
  if (!response.success) alerts.error("Ha ocurrido un error", response.message);
  return response;
};
export const getSemestralEvaluationsDates = async (cct) => {
  const response = await EvaluationSettingsApi.getSemestralEvaluationsDates(cct);
  if (!response.success) alerts.error("Ha ocurrido un error", response.message);
  return response;
};
export const setEvaluationISemester = async (data) => {
  const response = await EvaluationSettingsApi.setEvaluationISemester(data);
  if (!response.success) alerts.error("Ha ocurrido un error", response.message);
  /* if (response.details) {
    var details = response.details;

    alerts.error("Detalles:", details);
  } */
  return response;
};
export const setEvaluationSemestral = async (data) => {
  const response = await EvaluationSettingsApi.setEvaluationSemestral(data);
  if (response && !response.success) alerts.error("Ha ocurrido un error", response.message);
  if (response.details) {
    var details = response.details[`recursamiento.0.max_alumnos`][0];

    alerts.error("Detalles:", details);
  }
  return response;
};
export const getAcademicRecordSettings = async (cct) => {
  {
    const response = await EvaluationSettingsApi.getAcademicRecordSettings(cct);
    if (!response.success) alerts.error("Ha ocurrido un error", response.message);
    return response;
  }
}
export const setAcademicRecordSettings = async (data) => {
  const response = await EvaluationSettingsApi.setAcademicRecordSettings(data);
  if (!response.success) alerts.error("Ha ocurrido un error", response.message);
  if (response.details) {
    var details = response.details;

    alerts.error("Detalles:", details);
  }
  return response;
};