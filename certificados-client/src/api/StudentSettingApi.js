import ApiCall from "../shared/apicall";
import "moment/locale/es";

const controller = "setting";

export default {
    selectUserRole: async (curp) => {
        if (!curp) curp = "";
        let response = { success: true };
        const method = `selectUserRole/${curp}`;
        try {
            const apiResponse = await ApiCall.get(controller, method);
            response.roles = apiResponse.data;
        } catch (error) {
            response = ApiCall.handleCatch(error);
            response.roles = [];
        }
        return response;
    },
    assignRole: async (studentId) => {
        if (!studentId) studentId = 0;
        let response = { success: true };
        const method = `assignRole/${studentId}`;
        try {
            const apiResponse = await ApiCall.get(controller, method);
            response.message = apiResponse.data;
        } catch (error) {
            response = ApiCall.handleCatch(error);
        }
        return response;
    },
}