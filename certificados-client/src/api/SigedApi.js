import axios from "axios";
import ApiCall from "../shared/apicall";
const controller = "siged";


export default {
  searchFolioData: async (folio) => {
    let response = { success: true, folioData2: null };
    const method = `certificado/${folio}`;
    try {
      const apiResponse = await ApiCall.get(controller, method);
      response.folioData2 = apiResponse.data;
    } catch (error) {
      response = ApiCall.handleCatch(error);
    }
    return response;
  },

  searchFolioDataApi: async (folio) => {
    let response = { success: true, folioData: null };
    try {
      const apiResponse = await axios.get(`https://api.siged.sep.gob.mx/servicios//certificado/consultaCertificado/?folios=${folio}`);
      response.folioData = apiResponse.data.datos;
    } catch (error) {
      response = ApiCall.handleCatch(error);
      response.folioData = [];
    }
    return response;
  },
  //codigo eug
  getFolioData: async (folio) => {
    if (!folio) folio = "";
    let response = { success: true};
    const method = `consulta/${folio}`;
    try {
      const apiResponse = await ApiCall.get(controller, method);
      response.datoFolio = apiResponse.data;
    } catch (error) {
      response = ApiCall.handleCatch(error);
      response.datoFolio = [];
    }
    return response;
  },
  searchFolioDataDegree: async (folio) => {
    if (!folio) folio = "";
    let response = {success: true};
    const method = `searchFolioDegree/${folio}`;
    try {
      const apiResponse = await ApiCall.get(controller, method);
      response.datoFolio = apiResponse.data;
    } catch(error) {
      response = ApiCall.handleCatch(error);
      response.datoFolio = [];
    }
    return response;
  },
};
