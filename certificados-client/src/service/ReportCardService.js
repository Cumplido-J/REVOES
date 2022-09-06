import ReportCardApi from "../api/ReportCardApi";
import alerts from "../shared/alerts";

export const getReportCardBySemester = async (data) => {
  const response = await ReportCardApi.getReportCardBySemester(data);
  if (!response.success) alerts.error("Ha ocurrido un error", response.message);
  return response;
};

export const getReportCardByGroupPeriod = async (groupPeriodId) => {
  const response = await ReportCardApi.getReportCardByGroupPeriod(
    groupPeriodId
  );
  if (!response.success) alerts.error("Ha ocurrido un error", response.message);
  return response;
};

export const getAcademicRecord = async (studentId) => {
  const response = await ReportCardApi.getAcademicRecord(studentId);
  if (!response.success) alerts.error("Ha ocurrido un error", response.message);
  return response;
};
