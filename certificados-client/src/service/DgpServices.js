import DgpApi from "../api/DgpApi";

import Alerts from "../shared/alerts";
export default {
    selectSchoolDgp: async (schoolId) => {
        const response = await DgpApi.selectSchoolDgp(schoolId);
        if (!response.success) Alerts.error("Ha ocurrido un error", response.message);
        return response;
    },
    updateSchoolDgp: async (values) => {
        const response = await DgpApi.updateSchoolDgp(values);
        if (!response.success) Alerts.error("Ha ocurrido un error", response.message);
        return response;
    },
    addNewSchoolDgp: async (values) => {
        const response = await DgpApi.addNewSchoolDgp(values);
        if (!response.success) Alerts.error("Ha ocurrido un error", response.message);
        return response;
    },
    addCombinationCareer: async (values) => {
        const response = await DgpApi.addCombinationCareer(values);
        if (!response.success) Alerts.error("Ha ocurrido un error", response.message);
        return response;
    },
    deleteCombinationCareer: async (values) => {
        const response = await DgpApi.deleteCombinationCareer(values);
        if (!response.success) Alerts.error("Ha ocurrido un error", response.message);
        return response;
    },
    addNewCareerDgp: async (values) => {
        const response = await DgpApi.addNewCareerDgp(values);
        if (!response.success) Alerts.error("Ha ocurrido un error", response.message);
        return response;
    },
    selectAllCareerDgp: async () => {
        const response = await DgpApi.selectAllCareerDgp();
        if (!response.success) Alerts.error("Ha ocurrido un error", response.message);
        return response;
    },
    selectAllDecree: async (stateId) => {
        const response = await DgpApi.selectAllDecree(stateId);
        if (!response.success) Alerts.error("Ha ocurrido un error", response.message);
        return response;
    },
    updateStateDecree: async (values) => {
        const response = await DgpApi.updateStateDecree(values);
        if (!response.success) Alerts.error("Ha ocurrido un error", response.message);
        return response;
    },
}