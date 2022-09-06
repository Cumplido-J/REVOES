import DegreeReportApi from "../api/DegreeReportApi";

import Alerts from "../shared/alerts";

export default {
    degreeCountryReport: async (generation) => {
        const response = await DegreeReportApi.degreeCountryReport(generation);
        if (!response.success) Alerts.error("Ha ocurrido un error", response.message);
        return response;
    },
    degreeStateReport: async (generation, stateId) => {
        const response = await DegreeReportApi.degreeStateReport(generation, stateId);
        if (!response.success) Alerts.error("Ha ocurrido un error", response.message);
        return response;
    },
    degreeSchoolReport: async (generation, schoolId) => {
        const response = await DegreeReportApi.degreeSchoolReport(generation, schoolId);
        if (!response.success) Alerts.error("Ha ocurrido un error", response.message);
        return response;
    }
}