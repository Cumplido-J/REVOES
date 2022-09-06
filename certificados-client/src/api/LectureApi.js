import ApiCall from "../shared/apicall";
import "moment/locale/es";

const controller = "lectures";

export default {
  getLecturesByCareer: async (id) => {
    console.log("getLecturesByCareer("+id+")");
    let response = { success: true };

    const method = `lecturesCareer/${id}`;

    try {
      const apiResponse = await ApiCall.get(controller, method);
      response.data = apiResponse.data;
    } catch (error) {
      response = ApiCall.handleCatch(error);
      response.data = [];
    }
    return response;
  },
  getLecturesByCareer_UAC: async (busqueda, id) => {
    console.log("getLecturesByCareer_UAC("+busqueda+","+id+")");
    let response = { success: true };

    const method = `lecturesCareer/${busqueda}/${id}`;

    try {
      const apiResponse = await ApiCall.get(controller, method);
      response.data = apiResponse.data;
    } catch (error) {
      response = ApiCall.handleCatch(error);
      response.data = [];
    }
    return response;
  },
  deleteLectureAssociationByCU_Id: async (id) => {
    let response = { success: true };
    const method = `lectureCareer/${id}`;
    try {
      const apiResponse = await ApiCall.delete(controller, method);
      console.log(apiResponse);
      response.data = apiResponse.data;

    } catch (error) {
      response = ApiCall.handleCatch(error);
    }
    return response;
  },
  getLectureById: async (id) => {
    console.log("getLectureById("+id+")");
    if (!id) id = 0;
    let response = { success: true };

    const method = `lectures/${id}`;

    try {
      const apiResponse = await ApiCall.get(controller, method);
      response.data = apiResponse.data;
    } catch (error) {
      response = ApiCall.handleCatch(error);
      response.data = [];
    }
    return response;
  },
  updateLectureById: async (id,form) => {
    let response = { success: true };
    const method = `lectures/${id}`;
    try {
      const apiResponse = await ApiCall.put(controller, method, form);
      console.log(apiResponse);
      response.data = apiResponse.data;

    } catch (error) {
      response = ApiCall.handleCatch(error);
    }
    return response;
  },
  getLecturesNotInCarrer: async (busqueda, id) => {
    console.log("getLecturesNotInCarrer("+busqueda+","+id+")");
    if (!id) id = 0;
    let response = { success: true };

    const method = `lecturesNotInCareer/${busqueda}/${id}`;

    try {
      const apiResponse = await ApiCall.get(controller, method);
      response.data = apiResponse.data;
    } catch (error) {
      response = ApiCall.handleCatch(error);
      response.data = [];
    }
    return response;
  },
  insertLectureCareerAssociation: async (form) => {
    let response = { success: true };
    const method = `lectureCareer`;
    try {
      const apiResponse = await ApiCall.post(controller, method, form);
      console.log(apiResponse);
      response.data = apiResponse.data;

    } catch (error) {
      response = ApiCall.handleCatch(error);
    }
    return response;
  },
  insertLecture: async (id,form) => {
    let response = { success: true };
    const method = `lecture/${id}`;
    try {
      const apiResponse = await ApiCall.post(controller, method, form);
      console.log(apiResponse);
      response.data = apiResponse.data;

    } catch (error) {
      response = ApiCall.handleCatch(error);
    }
    return response;
  },
};
