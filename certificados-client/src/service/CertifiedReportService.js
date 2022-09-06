import CertifiedReportApi from "../api/CertifiedReportApi";

import Alerts from "../shared/alerts";

export default {
    getCountryReport: async (certifiedType) =>{
        const response = await CertifiedReportApi.getCertifiedCountry(certifiedType);
        if (!response.success) Alerts.error("Ha ocurrido un error", response.message);
        return response;
    },
    getStateReport: async (certifiedType, stateId) => {
        const response = await CertifiedReportApi.getStateReport(certifiedType, stateId);
        if (!response.success) Alerts.error("Ha ocurrido un error", response.message);
        return response;
    },
    getSchoolReport: async (certifiedType, schoolId) => {
        const response = await CertifiedReportApi.getSchoolReport(certifiedType, schoolId);
        if (!response.success) Alerts.error("Ha ocurrido un error", response.message);
        return response;
    }
}