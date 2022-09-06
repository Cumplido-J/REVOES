import TeacherAsignaturaApi from "../api/TeacherAsignaturaApi";

import Alerts from "../shared/alerts";

export const getDocenteAsignatura = async (params) => {
  const response = await TeacherAsignaturaApi.getDocenteAsignatura(params);
  if (!response.success) Alerts.error("Ha ocurrido un error", response.message);
  return response;
};

export const getSubjectRecursamientoIntersemestral = async (params) => {
  const response = await TeacherAsignaturaApi.getSubjectRecursamientoIntersemestral(params);
  if (!response.success) Alerts.error("Ha ocurrido un error", response.message);
  return response;
};

export const getSubjectRecursamientoSemestral = async (params) => {
  const response = await TeacherAsignaturaApi.getSubjectRecursamientoSemestral(params);
  if (!response.success) Alerts.error("Ha ocurrido un error", response.message);
  return response;
};

export const getDocenteAsignaturaRecursamiento = async (params) => {
  const response = await TeacherAsignaturaApi.getDocenteAsignaturaRecursamiento(params);
  if (!response.success) Alerts.error("Ha ocurrido un error", response.message);
  return response;
};

