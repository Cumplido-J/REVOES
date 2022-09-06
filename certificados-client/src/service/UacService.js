import UacApi from "../api/UacApi";
import alerts from "../shared/alerts";

export const getSignaturesForEnrollmentByCareerSemester = async (data) => {
  const response = await UacApi.getSignaturesForEnrollmentByCareerSemester(
    data
  );
  if (!response.success)
    alerts.error("Ha ocurrido un error", response.messsage);
  return response;
};
