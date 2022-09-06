import ApiCall from "../shared/apicall";
import "moment/locale/es";

const controller = "competencia";
export default {
  addCompetencia: async (form) => {
    if (!form) form = {};
    if (!form.module) form.module=null
    if (!form.emsadCompetence) form.emsadCompetence= null;
    
    let response = { success: true };
    
    const method = `addCompetencia`;
    try {
      const apiResponse = await ApiCall.post(controller, method, form);
      response.competenceData = apiResponse.data;
    } catch (error) {
      response = ApiCall.handleCatch(error);
    }
    return response;
  },

  careerSearch: async ({ searchText}) => {
    if (!searchText) searchText = "";
    let response = { success: true };
    //let response = { success: true, schoolList: [] };
    
    const method = `?searchText=${searchText}`;
    
        try {
          const apiResponse = await ApiCall.get(controller, method);
          response.careerList = apiResponse.data;
        } catch (error) {
          response = ApiCall.handleCatch(error);
          response.careerList = [];
        }
        return response;
      },
  competenceAll: async () => {
    let response = { success: true };
    const method = `competencias`;
    try {
      const apiResponse = await ApiCall.get(controller, method);
      response.lista = apiResponse.data;
      //console.log(response.personaList );
    } catch (error) {
      response = ApiCall.handleCatch(error);
      response.lista = [];
    }
    return response;
  },    
  getCompetenceData: async (id) => {
    if (!id) id = "";
    let response = { success: true };

    const method = `${id}`;
    try {
      const apiResponse = await ApiCall.get(controller, method);
      response.competenceData = apiResponse.data;
    } catch (error) {
      response = ApiCall.handleCatch(error);
      response.competenceData = {};
    }
    return response;
  }, 
  editCompetence: async (id, form) => {
    if (!form) form = {};
    if (!form.module) form.module=null
    if (!form.emsadCompetence) form.emsadCompetence= null;

    let response = { success: true };
 
    const method = `edit/${id}`;
    try {
      const apiResponse = await ApiCall.post(controller, method, form);
      response.competenceData = apiResponse.data;
    } catch (error) {
      response = ApiCall.handleCatch(error);
    }
    return response;
  }, 
  competenceSearch: async ({ searchText}) => {
    if (!searchText) searchText = "";
    let response = { success: true };
    const method = `?searchText=${searchText}`;
        try {
          const apiResponse = await ApiCall.get(controller, method);
          response.lista = apiResponse.data;
        } catch (error) {
          response = ApiCall.handleCatch(error);
          response.lista = [];
        }
        return response;
      }, 
                     
}