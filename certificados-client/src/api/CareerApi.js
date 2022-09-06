import ApiCall from "../shared/apicall";
import "moment/locale/es";

const controller = "career";
export default {
  addCareer: async (form) => {
    if (!form) form = {};
    if (!form.name) form.name=null
    if (!form.careerKey) form.careerKey= null;
    if (!form.totalCredits) form.totalCredits = null;
    if (!form.profileType) form.profileType = null;
    if (!form.studyType) form.studyType= null;
    if (!form.disciplinaryField) form.disciplinaryField= null;
    if (!form.subjectType) form.subjectType= null;
    if (!form.statusId) form.statusId = null;
    
    let response = { success: true };
    
    const method = `addCareer`;
    try {
      const apiResponse = await ApiCall.post(controller, method, form);
      response.careerData = apiResponse.data;
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
  careerAll: async () => {
    let response = { success: true };
    const method = `careers`;
    try {
      const apiResponse = await ApiCall.get(controller, method);
      response.careerList = apiResponse.data;
    } catch (error) {
      response = ApiCall.handleCatch(error);
      response.careerList = [];
    }
    return response;
  },    
  getCareerData: async (careerKey) => {
    if (!careerKey) careerKey = "";
    let response = { success: true };

    const method = `${careerKey}`;
    try {
      const apiResponse = await ApiCall.get(controller, method);
      response.careerData = apiResponse.data;
    } catch (error) {
      response = ApiCall.handleCatch(error);
      response.careerData = {};
    }
    return response;
  }, 
  editCareer: async (careerKey, form) => {
    if (!form) form = {};
    if (!form.name) form.name=null
    if (!form.careerKey) form.careerKey= null;
    if (!form.totalCredits) form.totalCredits = null;
    if (!form.profileType) form.profileType = null;
    if (!form.studyType) form.studyType= null;
    if (!form.disciplinaryField) form.disciplinaryField= null;
    if (!form.subjectType) form.subjectType= null;
    if (!form.statusId) form.statusId = null;

    let response = { success: true };

    const method = `edit/${careerKey}`;
    try {
      const apiResponse = await ApiCall.post(controller, method, form);
      response.careerData = apiResponse.data;
    } catch (error) {
      response = ApiCall.handleCatch(error);
    }
    return response;
  }, 
  addModule: async (career, form) => {
    if (!form) form = {};
    if (!form.career) form.career=null
    if (!form.module) form.module= null;
    if (!form.credits) form.credits = null;
    if (!form.order) form.order = null;
    if (!form.hours) form.hours = null;
    let response = { success: true };

    const method = `addModule/${career}`;
    try {
      const apiResponse = await ApiCall.post(controller, method, form);
      response.moduleData = apiResponse.data;
    } catch (error) {
      response = ApiCall.handleCatch(error);
    }
    return response;
  },
  getCareerModuleData: async (idcareerModule) => {
    if (!idcareerModule) idcareerModule = "";
    let response = { success: true };

    const method = `getModule/${idcareerModule}`;
    try {
      const apiResponse = await ApiCall.get(controller, method);
      response.moduleData = apiResponse.data;
    } catch (error) {
      response = ApiCall.handleCatch(error);
      response.moduleData = {};
    }
    return response;
  },
  editCareerModule: async (idcareerModule,career, form) => {
    if (!form) form = {};
    //if (!form.careerKey) form.careerKey= null;
    if (!form.career) form.career=null
    if (!form.module) form.module= null;
    if (!form.credits) form.credits = null;
    if (!form.order) form.order = null;
    if (!form.hours) form.hours = null;
    let response = { success: true };

    const method = `editModule/${idcareerModule}/${career}`;
    try {
      const apiResponse = await ApiCall.post(controller, method, form);
      response.moduleData = apiResponse.data;
    } catch (error) {
      response = ApiCall.handleCatch(error);
    }
    return response;
  },
  deleteCompetences: async (form) => {
    if (!form) form = {};
    //if (!form.idCareer) form.idCareer= {};
    if (!form.careerModuleId) form.careerModuleId= [];
    
    let response = { success: true };
    const method = `deleteCompetences`;
    try {
      const apiResponse = await ApiCall.post(controller, method, form);
      response.message = apiResponse.data;
    } catch (error) {
      response = ApiCall.handleCatch(error);
    }
    return response;
  },                            
}