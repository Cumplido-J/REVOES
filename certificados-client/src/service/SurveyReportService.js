import SurveyReportApi from "../api/SurveyReportApi";

import Alerts from "../shared/alerts";

export default {
  getCountryReport: async (surveyType) => {
    const response = await SurveyReportApi.getCountryReport(surveyType);
    if (!response.success) Alerts.error("Ha ocurrido un error", response.message);
    return response;
  },
  getStateReport: async (surveyType, stateId) => {
    const response = await SurveyReportApi.getStateReport(surveyType, stateId);
    if (!response.success) Alerts.error("Ha ocurrido un error", response.message);
    return response;
  },
  getSchoolReport: async (surveyType, schoolId) => {
    const response = await SurveyReportApi.getSchoolReport(surveyType, schoolId);
    if (!response.success) Alerts.error("Ha ocurrido un error", response.message);
    return response;
  },
  getStateReportAnswer: async (surveyType, stateId) => {
    const response = await SurveyReportApi.getStateReportAnswer(surveyType, stateId);
    if (!response.success) Alerts.error("Ha ocurrido un error", response.message);
    return response;
  },
  getStateReportAnswerGraduated: async (surveyType, stateId) => {
    const response = await SurveyReportApi.getStateReportAnswerGraduated(surveyType, stateId);
    if (!response.success) Alerts.error("Ha ocurrido un error", response.message);
    return response;
  }, 
  getAnswerData1: async (curp) => {
    const response = await SurveyReportApi.getAnswerData1(curp);
    if (!response.success) Alerts.error("Ha ocurrido un error", response.message);
    return response;
  }, 
  getAnswerData2: async (curp) => {
    const response = await SurveyReportApi.getAnswerData2(curp);
    if (!response.success) Alerts.error("Ha ocurrido un error", response.message);
    return response;
  },    
  getAnswerData3: async (curp) => {
    const response = await SurveyReportApi.getAnswerData3(curp);
    if (!response.success) Alerts.error("Ha ocurrido un error", response.message);
    return response;
  },   
  getAnswerData4: async (curp) => {
    const response = await SurveyReportApi.getAnswerData4(curp);
    if (!response.success) Alerts.error("Ha ocurrido un error", response.message);
    return response;
  },   
};
