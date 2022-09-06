import IntersemestralApi from "../api/IntersemestralApi";

import Alerts from "../shared/alerts";

export const getFilteredIntersemestral = async (params) => {
  const response = await IntersemestralApi.getFilteredIntersemestral(params);
  if (!response.success) Alerts.error("Ha ocurrido un error", response.message);
  return response;
};

export const setAssignInterSemester = async (params) => {
  const response = await IntersemestralApi.setAssignInterSemester(params);
  if (!response.success) Alerts.error("Ha ocurrido un error", response.message);
  return response;
};

export const setAssignSemester = async (params) => {
  const response = await IntersemestralApi.setAssignSemester(params);
  if (!response.success) Alerts.error("Ha ocurrido un error", response.message);
  return response;
};

export const updateAssignInterSemester = async (params, intersemestralId) => {
  const response = await IntersemestralApi.updateAssignInterSemester(params, intersemestralId);
  if (!response.success) Alerts.error("Ha ocurrido un error", response.message);
  return response;
};

export const updateAssignSemester = async (params, semestralId) => {
  const response = await IntersemestralApi.updateAssignSemester(params, semestralId);
  if (!response.success) Alerts.error("Ha ocurrido un error", response.message);
  return response;
};

export const deleteAssignInterSemester = async (params) => {
  const response = await IntersemestralApi.deleteAssignInterSemester(params);
  if (!response.success) Alerts.error("Ha ocurrido un error", response.message);
  return response;
};

export const deleteAssignSemestral = async (params) => {
  const response = await IntersemestralApi.deleteAssignSemestral(params);
  if (!response.success) Alerts.error("Ha ocurrido un error", response.message);
  return response;
};