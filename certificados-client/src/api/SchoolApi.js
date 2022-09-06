import ApiCall from "../shared/apicall";
import { dateToReadableDate } from "../shared/functions";
import Moment from "moment";
import "moment/locale/es";

const controller = "school";
export default {
  schoolSearch: async ({ stateId, careerId, schoolTypeId, cct }) => {
    if (!stateId) stateId = 0;
    if (!careerId) careerId = 0;
    if (!schoolTypeId) schoolTypeId = 0;
    if (!cct) cct = "";

    let response = { success: true, schoolList: [] };

    const method = `?stateId=${stateId}&&careerId=${careerId}&&schoolTypeId=${schoolTypeId}&&cct=${cct}`;

    try {
      const apiResponse = await ApiCall.get(controller, method);
      response.schoolList = apiResponse.data;
      response.schoolList.forEach((school) => {
        if (school.sinemsDate) school.sinemsDate = dateToReadableDate(school.sinemsDate);
        else school.sinemsDate = "";
      });
    } catch (error) {
      response = ApiCall.handleCatch(error);
      response.schoolList = [];
    }
    return response;
  },
  getSchoolData: async (cct) => {
    if (!cct) cct = "";
    let response = { success: true };

    const method = `${cct}`;
    try {
      const apiResponse = await ApiCall.get(controller, method);
      response.schoolData = apiResponse.data;
      if (response.schoolData.sinemsDate) response.schoolData.sinemsDate = Moment(response.schoolData.sinemsDate);
    } catch (error) {
      response = ApiCall.handleCatch(error);
      response.schoolData = {};
    }
    return response;
  },
  addSchool: async (form) => {
    if (!form) form = {};
    if (!form.cct) form.cct = null;
    else form.cct = form.cct.toUpperCase();
    if (!form.name) form.name = null;
    if (!form.stateId) form.stateId = null;
    if (!form.schoolTypeId) form.schoolTypeId = null;
    if (!form.status) form.status = 1;

    let response = { success: true };

    const method = `add`;
    try {
      const apiResponse = await ApiCall.post(controller, method, form);
      response.schoolData = apiResponse.data;
    } catch (error) {
      response = ApiCall.handleCatch(error);
    }
    return response;
  },
  editSchool: async (cct, form) => {
    if (!form) form = {};
    if (!form.cct) form.cct = null;
    else form.cct = form.cct.toUpperCase();
    if (!form.name) form.name = null;
    if (!form.stateId) form.stateId = null;
    if (!form.schoolTypeId) form.schoolTypeId = null;
    if (!form.status) form.status = 1;

    let response = { success: true };

    const method = `edit/${cct}`;
    try {
      const apiResponse = await ApiCall.post(controller, method, form);
      response.schoolData = apiResponse.data;
    } catch (error) {
      response = ApiCall.handleCatch(error);
    }
    return response;
  },
  addCareerSchool: async (form) => {
    if (!form) form = {};
    if (!form.cct) form.cct = {};
    if (!form.careerTypeId) form.careerTypeId = [];

    let response = { success: true };
    const method = `addCareerSchool`;
    try {
      const apiResponse = await ApiCall.post(controller, method, form);
      response.message = apiResponse.data;
    } catch (error) {
      response = ApiCall.handleCatch(error);
    }
    return response;
  },
  deleteCareerSchool: async (form) => {
    if (!form) form = {};
    if (!form.cct) form.cct = {};
    if (!form.careerTypeId) form.careerTypeId = [];

    let response = { success: true };
    const method = `deleteCareerSchool`;
    try {
      const apiResponse = await ApiCall.post(controller, method, form);
      response.message = apiResponse.data;
    } catch (error) {
      response = ApiCall.handleCatch(error);
    }
    return response;
  },
  deleteCareerUpdateStudent: async (schoolcareerId, form) => {
    if (!form) form = {};
    if (!form.schoolcareerId) form.schoolcareerId = null;
    if (!form.careerId) form.careerId = null;
    let response = { success: true };

    const method = `deleteCareer/${schoolcareerId}`;
    try {
      const apiResponse = await ApiCall.post(controller, method, form);
      response.schoolData = apiResponse.data;
    } catch (error) {
      response = ApiCall.handleCatch(error);
    }
    return response;
  },
  getTotal: async (schoolcareerId) => {
    if (!schoolcareerId) schoolcareerId = 0;

    let response = { success: true };
    const method = `show/${schoolcareerId}`;
    try {
      const apiResponse = await ApiCall.get(controller, method);
      response.resultado = apiResponse.data;
    } catch (error) {
      response = ApiCall.handleCatch(error);
      response.resultado = [];
    }
    return response;
  },
  addchoolEquivaalent: async (form) => {
    if (!form) form = {};
    if (!form.cct) form.cct = "";
    if (!form.pdfName) form.pdfName = "";
    if (!form.schoolId) form.schoolId = 0;
    if (!form.cityId) form.cityId = 0;
    if (!form.gender) form.gender = 0;
    let response = { success: true };
    const method = `addchoolEquivaalent`;
    try {
      const apiResponse = await ApiCall.post(controller, method, form);
      response.schoolData = apiResponse.data;
    } catch(error) {
      response = ApiCall.handleCatch(error);
    }
    return response;
  },
  selectSchoolEquivalent: async (schoolId) => {
    if (!schoolId) schoolId = 0;
    let response = { success: true };
    const method = `selectSchoolEquivalent/${schoolId}`;
    try {
      const apiResponse = await ApiCall.get(controller, method);
      response.schoolData = apiResponse.data;
    } catch(error) {
      response = ApiCall.handleCatch(error);
      response.schoolData = [];
    }
    return response;
  },
  updateSchoolEquivalent: async (form) => {
    if (!form) form = {};
    if (!form.cct) form.cct = "";
    if (!form.pdfName) form.pdfName = "";
    if (!form.schoolId) form.schoolId = 0;
    if (!form.cityId) form.cityId = 0;
    if (!form.gender) form.gender = 0;
    let response = { success: true };
    const method = `updateSchoolEquivalent`;
    try {
      const apiResponse = await ApiCall.post(controller, method, form);
      response.message = apiResponse.data;
    } catch(error) {
      response = ApiCall.handleCatch(error);
    }
    return response;
  },
  deleteSchoolEquivalent: async (form) => {
    if (!form) form = {};
    if (!form.schoolId) form.schoolId = 0;
    let response = { success: true };
    const method = `deleteSchoolEquivalent/${form.schoolId}`;
    try {
      const apiResponse = await ApiCall.post(controller, method);
      response.message = apiResponse.data;
    } catch(error) {
      response = ApiCall.handleCatch(error);
    }
    return response;
  },
  schoolEquivalentSearch: async ({ stateId, careerId, schoolTypeId, cct }) => {
    if (!stateId) stateId = 0;
    if (!careerId) careerId = 0;
    if (!schoolTypeId) schoolTypeId = 0;
    if (!cct) cct = "";
    let response = { success: true };
    const method = `schoolEquivalentSearch?stateId=${stateId}&&careerId=${careerId}&&schoolTypeId=${schoolTypeId}&&cct=${cct}`;
    try {
      const apiResponse = await ApiCall.get(controller, method);
      response.schoolList = apiResponse.data;
      response.schoolList.forEach((school) => {
        if (school.sinemsDate) school.sinemsDate = dateToReadableDate(school.sinemsDate);
        else school.sinemsDate = "";
      });
    } catch(error) {
      response = ApiCall.handleCatch(error);
      response.schoolList = [];
    }
    return response;
  },
  schoolByState: async (stateId) => {
    if (!stateId) stateId = 0;
    let response = { success: true};

    const method = `schoolByState/${stateId}`;

    try {
      const apiResponse = await ApiCall.get(controller, method);
      response.schoolList = apiResponse.data;
      response.schoolList.forEach((school) => {
        if (school.sinemsDate) school.sinemsDate = dateToReadableDate(school.sinemsDate);
        else school.sinemsDate = "";
      });
    } catch (error) {
      response = ApiCall.handleCatch(error);
      response.schoolList = [];
    }
    return response;
  },  
};
