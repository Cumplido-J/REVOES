import GroupsPeriodApi from "../api/GroupsPeriodsApi";
import Alerts from "../shared/alerts";

export const getGroupsPeriod = async (params) => {
  const response = await GroupsPeriodApi.getGroupsPeriod(params);
  if (!response.success) Alerts.error("Ha ocurrido un error", response.message);
  return response;
};

export const setPeriodOnGroup = async (data) => {
  const response = await GroupsPeriodApi.setPeriodOnGroup(data);
  if (!response.success) Alerts.error("Ha ocurrido un error", response.message);
  return response;
};

export const editPeriodOnGroup = async (id, data) => {
  const response = await GroupsPeriodApi.editPeriodOnGroup(id, data);
  if (!response.success) Alerts.error("Ha ocurrido un error", response.message);
  return response;
};

export const disablePeriodOnGroup = async (id, data) => {
  const response = await GroupsPeriodApi.disablePeriodOnGroup(id);
  if (!response.success) Alerts.error("Ha ocurrido un error", response.message);
  return response;
};

export const setOptionalSignatures = async (groupId, optionalSignaturesIds) => {
  const response = await GroupsPeriodApi.setOptionalSignatures(
    groupId,
    optionalSignaturesIds
  );
  if (!response.success) Alerts.error("Ha ocurrido un error", response.message);
  return response;
};

export const getGroupPeriodById = async (groupPeriodId) => {
  const response = await GroupsPeriodApi.getGroupPeriodById(groupPeriodId);
  if (!response.success) Alerts.error("Ha ocurrido un error", response.message);
  return response;
};

export const setEnrollmentConfigOnGroup = async (groupId, data) => {
  const response = await GroupsPeriodApi.setEnrollmentConfigOnGroup({
    groupId,
    data,
  });
  if (!response.success) Alerts.error("Ha ocurrido un error", response.message);
  return response;
};

export const setSchoolEnrollmentConfigOnGroup = async (schoolId, data) => {
  const response = await GroupsPeriodApi.setSchoolEnrollmentConfigOnGroup({
    schoolId,
    data,
  });
  if (!response.success) Alerts.error("Ha ocurrido un error", response.message);
  return response;
};

export const addStudentsToGroupPeriod = async (data) => {
  const response = await GroupsPeriodApi.addStudentsToGroupPeriod(data);
  if (!response.success) Alerts.error("Ha ocurrido un error", response.message);
  return response;
};

export const availableGroupPeriodsFromAGroupPeriod = async (groupPeriodId) => {
  const response = await GroupsPeriodApi.availableGroupPeriodsFromAGroupPeriod(
    groupPeriodId
  );
  if (!response.success) Alerts.error("Ha ocurrido un error", response.message);
  return response;
};

export const availableGroupPeriodsFromAnStudent = async (studentId) => {
  const response = await GroupsPeriodApi.availableGroupPeriodsFromAnStudent(
    studentId
  );
  if (!response.success) Alerts.error("Ha ocurrido un error", response.message);
  return response;
};

export const changeMultipleStudentsToAnotherGroup = async (data) => {
  const response = await GroupsPeriodApi.changeMultipleStudentsToAnotherGroup(
    data
  );
  if (!response.success && !Array.isArray(response.data))
    Alerts.error("Ha ocurrido un error", response.message);
  return response;
};

export const changeStudentToAnotherGroup = async (data) => {
  const response = await GroupsPeriodApi.changeStudentToAnotherGroup(data);
  if (!response.success && !Array.isArray(response.data))
    Alerts.error("Ha ocurrido un error", response.message);
  return response;
};

export const attendanceList = async (groupPeriodId, teacherUacId) => {
  const response = await GroupsPeriodApi.attendanceList(
    groupPeriodId,
    teacherUacId
  );
  if (!response.success) Alerts.error("Ha ocurrido un error", response.message);
  return response;
};

export const groupPeriodPartialStatistics = async (groupPeriodId, partial) => {
  const response = await GroupsPeriodApi.groupPeriodPartialStatistics(
    groupPeriodId,
    partial
  );
  if (!response.success) Alerts.error("Ha ocurrido un error", response.message);
  return response;
};

export const academicRecordByGroupPeriod = async (groupPeriodId) => {
  const response = await GroupsPeriodApi.academicRecordByGroupPeriod(
    groupPeriodId
  );
  if (!response.success) Alerts.error("Ha ocurrido un error", response.error);
  return response;
};
export const documentProofByGroupPeriod = async (groupPeriodId, data) => {
  const response = await GroupsPeriodApi.documentProofByGroupPeriod(
    groupPeriodId, data
  );
  if (!response.success) Alerts.error("Ha ocurrido un error", response.error);
  return response;
};
export const groupPeriodTeacherReport = async (groupPeriodId) => {
  const response = await GroupsPeriodApi.groupPeriodTeacherReport(
    groupPeriodId
  );
  if (!response.success) Alerts.error("Ha ocurrido un error", response.message);
  return response;
};
export const groupPeriodRedi = async (groupPeriodId) => {
  const response = await GroupsPeriodApi.groupPeriodRedi(groupPeriodId);
  if (!response.success) Alerts.error("Ha ocurrido un error", response.error);
  return response;
};
export const failedStudentsReport = async (
  groupPeriodId,
  onlyFailedStudents
) => {
  const response = await GroupsPeriodApi.failedStudentsReport(
    groupPeriodId,
    onlyFailedStudents
  );
  if (!response?.success)
    Alerts.error("Ha ocurrido un error", response.message);
  return response;
};
/**
 *
 * @param {(string|number)[]} groupsIds
 * @returns {Promise<{success: boolean, message?: string, data?: Blob}>}
 */
export const studentPopulationReportByGroups = async (groupsIds) => {
  const response = await GroupsPeriodApi.studentPopulationReportByGroups(
    groupsIds
  );
  if (!response.success) Alerts.error("Ha ocurrido un error", response.message);
  return response;
};
export const semiannualConcentratedReport = async (groupPeriodId) => {
  const response = await GroupsPeriodApi.semiannualConcentratedReport(
    groupPeriodId
  );
  if (!response.success) Alerts.error("Ha ocurrido un error", response.message);
  return response;
};
/**
 *
 * @param {Object<{ids: (number|string)[], fecha_nacimiento: boolean, domicilio: boolean, telefono: boolean, email: boolean, sexo: boolean}>} data
 * @returns {Promise<{success: boolean, message?:string, data?:Blob}>}
 */
export const exportStudentsFromGroupSearch = async (data) => {
  const response = await GroupsPeriodApi.exportStudentsFromGroupSearch(data);
  if (!response.success) Alerts.error("Ha ocurrido un error", response.message);
  return response;
};
export const semiannualEvaluationReport = async (groupPeriodId) => {
  const response = await GroupsPeriodApi.semiannualEvaluationReport(
    groupPeriodId
  );
  if (!response.success) Alerts.error("Ha ocurrido un error", response.message);
  return response;
};
