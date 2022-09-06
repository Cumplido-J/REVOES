import apicall from "../shared/apicall";
import ApiCall from "../shared/apicall";

const controller = "degreeReport";

export default {
    degreeCountryReport: async (generation) => {

        if (!generation) generation = 0;

        let response = { success: true, degreeReport: [] };
        const method = `country?generation=${generation}`;

        try {
            const apiResponse = await ApiCall.get(controller, method);
            response.degreeReport = apiResponse.data;
        } catch (error) {
            response = ApiCall.handleCatch(error);
            response.degreeReport = [];
        }
        return response;
    },
    degreeStateReport: async (generation, stateId) => {
        if (!generation) generation = 0;
        if (!stateId) stateId = 0;

        let response = { success: true };

        const method = `state?generation=${generation}&stateId=${stateId}`;

        try {
            const apiResponse = await ApiCall.get(controller, method);
            response.degreeReport = apiResponse.data;
        } catch (error) {
            response = ApiCall.handleCatch(error);
            response.degreeReport = [];
        }
        return response;
    },
    degreeSchoolReport: async (generation, schoolId) => {
        if (!generation) generation = 0;
        if (!schoolId) schoolId = 0;

        let response = { success: true };

        const method = `school?generation=${generation}&schoolId=${schoolId}`;

        try {
            const apiResponse = await ApiCall.get(controller, method);
            response.degreeReport = apiResponse.data;
        } catch (error) {
            response = apicall.handleCatch(error);
            response.degreeReport = []
        }
        return response;
    }
}