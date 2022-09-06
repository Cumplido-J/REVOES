import ApiCall from "../shared/apicall";
const controller = "dgps";
export default {
    selectSchoolDgp: async (schoolId) => {
        if (!schoolId) schoolId = "";

        let response = { success: true };
        const method = `selectSchool/${schoolId}`;

        try {
            const apiResponse = await ApiCall.get(controller, method);
            response.school = apiResponse.data;
        } catch(error) {
            response = ApiCall.handleCatch(error);
            response.school = [];
        }
        return response;
    },
    updateSchoolDgp: async (form) => {    
        if (!form) form = {};
        if (!form.id) form.id = 0;
        if (!form.clave) form.clave = "";
        if (!form.name) form.name = "";
        if (!form.complete) form.complete = "";
        if (!form.state) form.state = 0;
        if (!form.school) form.school = 0;

        let response = { success: true };
        let method = `updateSchoolDgp`;

        try {
            const apiResponse = await ApiCall.post(controller, method, form);
            response.message = apiResponse.data;
        } catch(error) {
            response = ApiCall.handleCatch(error);
        }
        return response;
    },
    addNewSchoolDgp: async (form) => {
        if (!form) form = {};
        if (!form.clave) form.clave = "";
        if (!form.name) form.complete = "";
        if (!form.state) form.state = "";
        if (!form.school) form.school = "";

        let response = { success: true };
        let method = `addNewSchoolDgp`;
        try {
            const apiResponse = await ApiCall.post(controller, method, form);
            response.message = apiResponse.data;
        } catch(error) {
            response = ApiCall.handleCatch(error);
        }
        return response;
    },
    addCombinationCareer: async (form) => {
        if (!form) form = {};
        if (!form.schoolId) form.schoolId = 0;
        if (!form.careerId) form.careerId = 0;

        let response = { success: true };
        const method = `addCombinationCareer`;
        
        try {
            const apiResponse = await ApiCall.post(controller, method, form);
            response.message = apiResponse.data;
        } catch(error) {
            response = ApiCall.handleCatch(error);
        }
        return response;
    },
    deleteCombinationCareer: async (combinationId) => {
        if (!combinationId) combinationId = 0;
        let response = { success: true };
        const method = `deleteCombinationCareer/${combinationId}`;
        try {
            const apiResponse = await ApiCall.get(controller, method);
            response.message = apiResponse.data;
        } catch(error) {
            response = ApiCall.handleCatch(error);
        }
        return response;
    },
    selectAllCareerDgp: async () => {
        let response = { success: true };
        const method = `selectAllCareerDgp`;

        try {
            const apiResponse = await ApiCall.get(controller, method);
            response.careers = apiResponse.data;
        } catch(error) {
            response = ApiCall.handleCatch(error);
            response.careers = [];
        }
        return response;
    },
    addNewCareerDgp: async (form) => {
        if (!form) form = {};
        if (!form.clave) form.clave = "";
        if (!form.carrer) form.carrer = "";
        if (!form.name) form.name = "";
        if (!form.modality) form.modality = "";
        if (!form.level) form.level = "";
        let response = { success: true };
        const method = `addNewCareerDgp`;
        try {
            const apiResponse = await ApiCall.post(controller, method, form);
            response.message = apiResponse.data;
        } catch(error) {
            response = ApiCall.handleCatch(error);
        }
        return response;
    },
    selectAllDecree: async (stateId) => {
        if (!stateId) stateId = 0;
        let response = { success: true };
        const method = `selectAllDecree/${stateId}`;

        try {
            const apiResponse = await ApiCall.get(controller, method);
            response.state = apiResponse.data;
        } catch(error) {
            response = ApiCall.handleCatch(error);
            response.state = [];
        }
        return response;
    },
    updateStateDecree: async (form) => {
        if (!form) form = {};
        if (!form.id) form.id = 0;
        if (!form.name) form.name = "";
        if (!form.abbreviation) form.abbreviation = "";
        if (!form.decreeNumber) form.decreeNumber = 0;
        if (!form.decreeDate) form.decreeDate = "";

        let response = { success: true };
        const method = `updateStateDecree`;
        try {
            const apiResṕonse = await ApiCall.post(controller, method, form);
            response.message = apiResṕonse.data;
        } catch(error) {
            response = ApiCall.handleCatch(error);
        }
        return response;
    },
}