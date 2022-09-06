import ApiCall from "../shared/apicall";
import { dateToReadableDate } from "../shared/functions";
import Moment from "moment";
import "moment/locale/es";

const controller = "persona";
export default {
  personaSearch: async () => {
    //if (!stateId) stateId = 0;

    let response = { success: true };

    const method = `personas`;

    try {
      const apiResponse = await ApiCall.get(controller, method);
      response.personaList = apiResponse.data;
      console.log(response.personaList );
    } catch (error) {
      response = ApiCall.handleCatch(error);
      response.personaList = [];
    }
    return response;
  },  
  addPersona: async (form) => {
    if (!form) form = {};
    if (!form.curp) form.curp.toUpperCase();;
    if (!form.rfc) form.rfc = null;
    if (!form.name) form.name = null;
    if (!form.ape1) form.ape1 = null;
    if (!form.ape2) form.ape2 = null;
    if (!form.stateId) form.stateId = null;
    if (!form.statusId) form.statusId = null;
    let response = { success: true };

    const method = `addPersona`;
    try {
      const apiResponse = await ApiCall.post(controller, method, form);
      response.personaData = apiResponse.data;
    } catch (error) {
      response = ApiCall.handleCatch(error);
    }
    return response;
  },
  editPersona: async (curp, form) => {
    if (!form) form = {};
    if (!form.curp) form.curp.toUpperCase();
    if (!form.rfc) form.rfc.toUpperCase();
    if (!form.name) form.name = null;
    if (!form.ape1) form.ape1 = null;
    if (!form.ape2) form.ape2 = null;
    if (!form.stateId) form.stateId = null;
    if (!form.statusId) form.statusId = 1;

    let response = { success: true };

    const method = `edit/${curp}`;
    try {
      const apiResponse = await ApiCall.post(controller, method, form);
      response.personaData = apiResponse.data;
    } catch (error) {
      response = ApiCall.handleCatch(error);
    }
    return response;
  },     
  getPersonaData: async (curp) => {
    let response = { success: true };
    const method = `${curp}`;
    try {
      const apiResponse = await ApiCall.get(controller, method);
      response.personaData = apiResponse.data;
    } catch (exception) {
      response = ApiCall.handleCatch(exception);
      response.personaData = {};
    }
    return response;
  },
  deleteCurp: async (curp) => {
    let response = { success: true };
    const method = `delete/${curp}`;
    try {
      const apiResponse = await ApiCall.get(controller, method);
      response.message= apiResponse.data;
    } catch (exception) {
      response = ApiCall.handleCatch(exception);
    }
    return response;
  },     
};
