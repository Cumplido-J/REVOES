import TeacherApi from "../api/TeacherApi";

import Alerts from "../shared/alerts";

export const getFilteredTeachers = async (params) => {
  const response = await TeacherApi.getFilteredTeachers(params);
  if (!response.success) Alerts.error("Ha ocurrido un error", response.message);
  return response;
};

export const getFilteredTeachersByUac = async (params) => {
  const response = await TeacherApi.getFilteredTeachersByUac(params);
  if (!response.success) Alerts.error("Ha ocurrido un error", response.message);
  return response;
};

export const disableTeacherById = async (groupId) => {
  const response = await TeacherApi.disableTeacherById(groupId);
  if (!response.success) Alerts.error("Ha ocurrido un error", response.message);
  return response;
};

export const createTeacher = async (data) => {
  const response = await TeacherApi.createTeacher(data);
  if (!response.success) {
    Alerts.error("Ha ocurrido un error", response.message);
    if (response.details) {
      var details = "";
      for (var i in response.details) {
        details += response.details[i] + ", ";
      }
      Alerts.error("Detalles:", details);
    }
  }
  return response;
};

export const getTeacherDetails = async (teacherId) => {
  const response = await TeacherApi.teacherDetails(teacherId);
  if (!response.success) Alerts.error("Ha ocurrido un error", response.message);
  return response;
};

export const updateTeacher = async (teacherId, data) => {
  const response = await TeacherApi.updateTeacher(teacherId, data);
  if (!response.success) {
    Alerts.error("Ha ocurrido un error", response.message);
    if (response.details) {
      var details = "";
      for (var i in response.details) {
        details += response.details[i] + ", ";
      }
      Alerts.error("Detalles:", details);
    }
  }
  return response;
};

export const bajaPermiso = async (docente_id) => {
  const response = await TeacherApi.bajaPermiso(docente_id);
  if (!response.success) Alerts.error("Ha ocurrido un error", response.message);
  return response;
};

export const bajaDocente = async (docente_id) => {
  const response = await TeacherApi.bajaDocente(docente_id);
  if (!response.success) Alerts.error("Ha ocurrido un error", response.message);
  return response;
};

export const altaDocente = async (docente_id) => {
  const response = await TeacherApi.altaDocente(docente_id);
  if (!response.success) Alerts.error("Ha ocurrido un error", response.message);
  return response;
};

//Docente plantilla
export const createAsignacion = async (data) => {
  const response = await TeacherApi.createAsignacion(data);
  if (!response.success) {
    Alerts.error("Ha ocurrido un error", response.message);
    if (response.details) {
      var details = "";
      for (var i in response.details) {
        details += response.details[i] + ", ";
      }
      Alerts.error("Detalles:", details);
    }
  }
  return response;
};

export const updateAsignacion = async (asignacionId, data) => {
  const response = await TeacherApi.updateAsignacion(asignacionId, data);
  if (!response.success) {
    Alerts.error("Ha ocurrido un error", response.message);
    if (response.details) {
      var details = "";
      for (var i in response.details) {
        details += response.details[i] + ", ";
      }
      Alerts.error("Detalles:", details);
    }
  }
  return response;
};

export const deleteAsignacion = async (data) => {
  const response = await TeacherApi.deleteAsignacion(data);
  if (!response.success) Alerts.error("Ha ocurrido un error", response.message);
  return response;
};

export const finishAsignacion = async (param, data) => {
  const response = await TeacherApi.finishAsignacion(param, data);
  if (!response.success) Alerts.error("Ha ocurrido un error", response.message);
  return response;
};

export const addAsignaturaAsignacion = async (data) => {
  const response = await TeacherApi.addAsignaturaAsignacion(data);
  if (!response.success) {
    Alerts.error("Ha ocurrido un error", response.message);
    if (response.details) {
      var details = "";
      for (var i in response.details) {
        details += response.details[i] + ", ";
      }
      Alerts.error("Detalles:", details);
    }
  }
  return response;
};

export const editAsignaturaAsignacion = async (data, asignaturaId) => {
  const response = await TeacherApi.editAsignaturaAsignacion(
    data,
    asignaturaId
  );
  if (!response.success) {
    Alerts.error("Ha ocurrido un error", response.message);
    if (response.details) {
      var details = "";
      for (var i in response.details) {
        details += response.details[i] + ", ";
      }
      Alerts.error("Detalles:", details);
    }
  }
  return response;
};

export const getAsignacionById = async (asignacionId) => {
  const response = await TeacherApi.getAsignacionById(asignacionId);
  if (!response.success) Alerts.error("Ha ocurrido un error", response.message);
  return response;
};

export const deleteAsignaturaAsignacion = async (asignaturaId) => {
  const response = await TeacherApi.deleteAsignaturaAsignacion(asignaturaId);
  if (!response.success) Alerts.error("Ha ocurrido un error", response.message);
  return response;
};

export const getAssignmentsFromLoggedInTeacher = async () => {
  const response = await TeacherApi.getAssignmentsFromLoggedInTeacher();
  if (!response.success) Alerts.error("Ha ocurrido un error", response.message);
  return response;
};

export const getAssignmentsTeacherById = async (id) => {
  const response = await TeacherApi.getAssignmentsTeacherById(id);
  if (!response.success) Alerts.error("Ha ocurrido un error", response.message);
  return response;
};

export const getSubjectsFromAssignments = async (id) => {
  const response = await TeacherApi.getSubjectsFromAssignments(id);
  if (!response.success) Alerts.error("Ha ocurrido un error", response.message);
  return response;
};

export const getRecursamientoFromDocente = async (id) => {
  const response = await TeacherApi.getRecursamientoFromDocente(id);
  if (!response.success) Alerts.error("Ha ocurrido un error", response.message);
  return response;
};

export const setUacGrades = async (data) => {
  const response = await TeacherApi.setUacGrades(data);
  if (!response.success) Alerts.error("Ha ocurrido un error", response.message);
  return response;
};

export const setUacGradesByRubrics = async (data) => {
  const response = await TeacherApi.setUacGradesByRubrics(data);
  if (!response.success) Alerts.error("Ha ocurrido un error", response.message);
  return response;
};

export const setSemestralGradesByRubrics = async (data) => {
  const response = await TeacherApi.setSemestralGradesByRubrics(data);
  if (!response.success) Alerts.error("Ha ocurrido un error", response.message);
  return response;
};

export const setUacGradesInterSemester = async (data) => {
  const response = await TeacherApi.setUacGradesInterSemester(data);
  if (!response.success) Alerts.error("Ha ocurrido un error", response.message);
  return response;
};

export const setUacGradesSemester = async (data) => {
  const response = await TeacherApi.setUacGradesSemester(data);
  if (!response.success) Alerts.error("Ha ocurrido un error", response.message);
  return response;
};

export const setUacGradesInterSemesterDocente = async (data) => {
  const response = await TeacherApi.setUacGradesInterSemesterDocente(data);
  if (!response.success) Alerts.error("Ha ocurrido un error", response.message);
  return response;
};

export const studentGradesList = async (data) => {
  const response = await TeacherApi.studentGradesList(data);
  if (!response.success) Alerts.error("Ha ocurrido un error", response.message);
  return response;
};

export const getEvaluationCriteriaByTeacherSubjectId = async (
  teacherSubjectId
) => {
  const response = await TeacherApi.getEvaluationCriteriaByTeacherSubjectId(
    teacherSubjectId
  );
  if (!response.success) Alerts.error("Ha ocurrido un error", response.message);
  return response;
};

export const createEvaluationCriteriaByTeacherSubjectId = async (data) => {
  const response = await TeacherApi.createEvaluationCriteriaByTeacherSubjectId(
    data
  );
  if (!response.success) Alerts.error("Ha ocurrido un error", response.message);
  return response;
};

export const editEvaluationCriteriaByTeacherSubjectId = async (
  data,
  evaluationCriteriaId
) => {
  const response = await TeacherApi.editEvaluationCriteriaByTeacherSubjectId(
    data,
    evaluationCriteriaId
  );
  if (!response.success) Alerts.error("Ha ocurrido un error", response.message);
  return response;
};

export const deleteEvaluationCriteriaByTeacherSubjectId = async (
  evaluationCriteriaId
) => {
  const response = await TeacherApi.deleteEvaluationCriteriaByTeacherSubjectId(
    evaluationCriteriaId
  );
  if (!response.success) Alerts.error("Ha ocurrido un error", response.message);
  return response;
};
