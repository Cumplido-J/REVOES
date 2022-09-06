import ExtraordinaryExamApi from "../api/ExtraordinaryExamApi";

import Alerts from "../shared/alerts";

export const setExtraExam = async (params) => {
  const response = await ExtraordinaryExamApi.setExtraExam(params);
  if (!response.success) Alerts.error("Ha ocurrido un error", response.message);
  return response;
};

export const getExtraExamById = async (id) => {
  const response = await ExtraordinaryExamApi.getExtraExamById(id);
  if (!response.success) Alerts.error("Ha ocurrido un error", response.message);
  return response;
};

export const setExtraGrades = async (params) => {
  const response = await ExtraordinaryExamApi.setExtraGrades(params);
  if (!response.success) Alerts.error("Ha ocurrido un error", response.message);
  return response;
};

export const updateExtraExam = async (params, id_extra) => {
  const response = await ExtraordinaryExamApi.updateExtraExam(params, id_extra);
  if (!response.success) Alerts.error("Ha ocurrido un error", response.message);
  return response;
};

export const deleteExtraExam = async (id_extra) => {
  const response = await ExtraordinaryExamApi.deleteExtraExam(id_extra);
  if (!response.success) Alerts.error("Ha ocurrido un error", response.message);
  return response;
};