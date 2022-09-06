import StudentFunctionsApi from "../api/StudentFunctionsApi";

import Alerts from "../shared/alerts";

export default {
  acceptPrivacy: async () => {
    const response = await StudentFunctionsApi.acceptPrivacy();
    if (!response.success) Alerts.error("Ha ocurrido un error", response.message);
    return response;
  },
  updateStudentCareer: async (values) => {
    const response = await StudentFunctionsApi.updateStudentCareer(values);
    if (!response.success) Alerts.error("Ha ocurrido un error", response.message);
    return response;
  },
  getAvailableSchoolCareers: async () => {
    const response = await StudentFunctionsApi.getAvailableSchoolCareers();
    if (!response.success) Alerts.error("Ha ocurrido un error", response.message);
    return response;
  },
};
