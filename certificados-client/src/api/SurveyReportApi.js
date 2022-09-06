import ApiCall from "../shared/apicall";

const controller = "surveyreport";

export default {
  getCountryReport: async (surveyType) => {
    if (!surveyType) surveyType = 0;

    let response = { success: true, surveyReport: [] };

    const method = `country?surveyType=${surveyType}`;

    try {
      const apiResponse = await ApiCall.get(controller, method);
      response.surveyReport = apiResponse.data;
    } catch (error) {
      response = ApiCall.handleCatch(error);
      response.surveyReport = [];
    }
    return response;
  },
  getStateReport: async (surveyType, stateId) => {
    if (!surveyType) surveyType = 0;
    if (!stateId) stateId = 0;

    let response = { success: true };

    const method = `state?surveyType=${surveyType}&stateId=${stateId}`;

    try {
      const apiResponse = await ApiCall.get(controller, method);
      response.surveyReport = apiResponse.data;
    } catch (error) {
      response = ApiCall.handleCatch(error);
      response.surveyReport = [];
    }
    return response;
  },
  getSchoolReport: async (surveyType, schoolId) => {
    if (!surveyType) surveyType = 0;
    if (!schoolId) schoolId = 0;

    let response = { success: true };

    const method = `school?surveyType=${surveyType}&schoolId=${schoolId}`;

    try {
      const apiResponse = await ApiCall.get(controller, method);
      response.surveyReport = apiResponse.data;
    } catch (error) {
      response = ApiCall.handleCatch(error);
      response.surveyReport = [];
    }
    return response;
  },
  getStateReportAnswer: async (surveyType, stateId) => {
    if (!surveyType) surveyType = 0;
    if (!stateId) stateId = 0;

    let response = { success: true };

    const method = `stateAnswer?surveyType=${surveyType}&stateId=${stateId}`;

    try {
      const apiResponse = await ApiCall.get(controller, method);
      response.surveyReport = apiResponse.data;
    } catch (error) {
      response = ApiCall.handleCatch(error);
      response.surveyReport = [];
    }
    return response;
  },
  getStateReportAnswerGraduated: async (surveyType, stateId) => {
    if (!surveyType) surveyType = 0;
    if (!stateId) stateId = 0;

    let response = { success: true };

    const method = `stateAnswerGraduated?surveyType=${surveyType}&stateId=${stateId}`;

    try {
      const apiResponse = await ApiCall.get(controller, method);
      response.surveyReport = apiResponse.data;
    } catch (error) {
      response = ApiCall.handleCatch(error);
      response.surveyReport = [];
    }
    return response;
  },
  getAnswerData1: async (curp) => {
    if (!curp) curp="";
    let response = { success: true };

    const method = `answerIntentions1/${curp}`;

    try {
      const apiResponse = await ApiCall.get(controller, method);
      response.answerData = apiResponse.data;
    } catch (error) {
      response = ApiCall.handleCatch(error);
      response.answerData = {};
    }
    return response;
  }, 
  getAnswerData2: async (curp) => {
    if (!curp) curp="";
    let response = { success: true };

    const method = `answerGraduated1/${curp}`;

    try {
      const apiResponse = await ApiCall.get(controller, method);
      response.answerData = apiResponse.data;
    } catch (error) {
      response = ApiCall.handleCatch(error);
      response.answerData = {};
    }
    return response;
  },      
  getAnswerData3: async (curp) => {
    if (!curp) curp="";
    let response = { success: true };

    const method = `answerIntentions2/${curp}`;

    try {
      const apiResponse = await ApiCall.get(controller, method);
      response.answerData = apiResponse.data;
    } catch (error) {
      response = ApiCall.handleCatch(error);
      response.answerData = {};
    }
    return response;
  },    
  getAnswerData4: async (curp) => {
    if (!curp) curp="";
    let response = { success: true };

    const method = `answerGraduated2/${curp}`;

    try {
      const apiResponse = await ApiCall.get(controller, method);
      response.answerData = apiResponse.data;
    } catch (error) {
      response = ApiCall.handleCatch(error);
      response.answerData = {};
    }
    return response;
  },   
};
