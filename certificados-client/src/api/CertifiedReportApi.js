import apicall from "../shared/apicall";
import ApiCall from "../shared/apicall";

const controller = "certifiedreport";

export default {
    getCertifiedCountry: async (certifiedType) => {

        if (!certifiedType) certifiedType = 0;
        
        let response = {success: true, certifiedReport: []};
        const method =  `country?certifiedType=${certifiedType}`;

        try{
           const apiResponse = await ApiCall.get(controller, method);
           response.certifiedReport = apiResponse.data;
        } catch(error) {
            response = ApiCall.handleCatch(error);
            response.certifiedReport = [];
        }
        return response;
    },
    getStateReport: async (certifiedType, stateId) => {
        if (!certifiedType) certifiedType = 0;
        if (!stateId) stateId = 0;

        let response = {success: true};

        const method = `state?certifiedType=${certifiedType}&stateId=${stateId}`;

        try{
            const apiResponse = await ApiCall.get(controller, method);
            response.certifiedReport = apiResponse.data;
        } catch(error){
            response = ApiCall.handleCatch(error);
        }
        return response;
    },
    getSchoolReport: async (certifiedType, schoolId) =>{
        if (!certifiedType) certifiedType = 0;
        if (!schoolId) schoolId = 0;

        let response = {success: true};

        const method = `school?certifiedType=${certifiedType}&schoolId=${schoolId}`;

        try{
            const apiResponse = await ApiCall.get(controller, method);
            response.certifiedReport = apiResponse.data;
        } catch(error) {
            response = apicall.handleCatch(error);
            response.certifiedReport = []
        }
        return response;
    }
}