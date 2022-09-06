import StudentInfoApi from "../api/StudentInfoApi";
import Alerts from "../shared/alerts";

export default {
  getStudentInfoData: async (curp) => {
    const response = await StudentInfoApi.getStudentInfoData(curp);
    if (!response.success) Alerts.error("Ha ocurrido un error", response.message);
    return response;
  },
  updateStudentInfoData: async (curp, values) => {
    const response = await StudentInfoApi.updateStudentInfoData(curp, values);
    if (!response.success) Alerts.error("Ha ocurrido un error", response.message);
    return response;
  },
};
