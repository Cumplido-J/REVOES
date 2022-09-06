import ApiCall from "../shared/apicall";
import Moment from "moment";
import "moment/locale/es";

const controller = "dashboard";
export default {
  getQuestion4: async (question, gender,idestado,idschool,surveyType) => {
    if (!gender) gender = 0;
    if (!question) question = 0;
    if (!idestado) idestado = 0;
    if (!idschool) idschool = 0;
    if (!surveyType) surveyType = 0;
    let response = { success: true };

    const method = `question4/${question}/${gender}/${idestado}/${idschool}/${surveyType}`;
    try {
      const apiResponse = await ApiCall.get(controller, method);
      response.question4 = apiResponse.data;
    } catch (error) {                                           
      response = ApiCall.handleCatch(error);
      response.question4=[];
    }
    return response;
  },
  getMexicoReport: async (surveyType) => {
    if (!surveyType) surveyType = 0;

    let response = { success: true, surveyReport: [] };

    const method = `paismexico/${surveyType}`;

    try {
      const apiResponse = await ApiCall.get(controller, method);
      response.surveyReport = apiResponse.data;
    } catch (error) {
      response = ApiCall.handleCatch(error);
      response.surveyReport = [];
    }
    return response;
  },   
  getNewGeneration: async (idestado,idschool) => {
    if (!idestado) idestado = 0;
    if (!idschool) idschool = 0;
    let response = { success: true};

    const method = `conteoNew/${idestado}/${idschool}`;

    try {
      const apiResponse = await ApiCall.get(controller, method);
      response.newgeneration = apiResponse.data;
    } catch (error) {
      response = ApiCall.handleCatch(error);
      response.newgeneration = [];
    }
    return response;
  },
  getCertified: async (idestado,idschool) => {
    if (!idestado) idestado = 0;
    if (!idschool) idschool = 0;
    let response = { success: true};

    const method = `conteoCertificado/${idestado}/${idschool}`;

    try {
      const apiResponse = await ApiCall.get(controller, method);
      response.tcertified = apiResponse.data;
    } catch (error) {
      response = ApiCall.handleCatch(error);
      response.tcertified = [];
    }
    return response;
  },
  getPlanteles: async (idestado,schoolId) => {
    if (!idestado) idestado = 0;
    if (!schoolId) schoolId = 0;
    let response = { success: true};

    const method = `cecytes/${idestado}/${schoolId}`;

    try {
      const apiResponse = await ApiCall.get(controller, method);
      response.schools = apiResponse.data;
    } catch (error) {
      response = ApiCall.handleCatch(error);
      response.schools = [];
    }
    return response;
  },
  getCertifiedByGenero: async (idestado,idschool) => {
    if (!idestado) idestado = 0;
    if (!idschool) idschool = 0;
    let response = { success: true};

    const method = `certifiedByHM/${idestado}/${idschool}`;

    try {
      const apiResponse = await ApiCall.get(controller, method);
      response.dataCertified = apiResponse.data;
    } catch (error) {
      response = ApiCall.handleCatch(error);
      response.dataCertified = [];
    }
    return response;
  },
  getDegreedByGenero: async (idestado,idschool) => {
    if (!idestado) idestado = 0;
    if (!idschool) idschool = 0;
    let response = { success: true};

    const method = `degreedByHM/${idestado}/${idschool}`;

    try {
      const apiResponse = await ApiCall.get(controller, method);
      response.dataDegreed = apiResponse.data;
    } catch (error) {
      response = ApiCall.handleCatch(error);
      response.dataDegreed = [];
    }
    return response;
  },                       
}