import StudentSettingApi from "../api/StudentSettingApi";
import Alerts from "../shared/alerts";

export default {
    selectUserRole: async (curp) => {
        const response = await StudentSettingApi.selectUserRole(curp);
        if (!response.success) Alerts.error("Ha ocurrido un error", response.message);
        return response;
    },
    assignRole: async (studentId) => {
        const response = await StudentSettingApi.assignRole(studentId);
        if (!response.success) Alerts.error("Ha ocurrido un error", response.message);
        return response;
    },
}
