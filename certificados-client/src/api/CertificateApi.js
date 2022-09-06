import ApiCall from "../shared/apicall";
import { dateToReadableDate } from "../shared/functions";
import Moment from "moment";
import "moment/locale/es";

const controller = "certificate";

export default {
  studentValidationSearch: async ({ stateId, schoolId, careerId, generation, searchText, certificateTypeId }) => {
    if (!stateId) stateId = 0;
    if (!schoolId) schoolId = 0;
    if (!careerId) careerId = 0;
    if (!searchText) searchText = "";
    if (!generation) generation = "";
    if (!certificateTypeId) certificateTypeId = 0;

    let response = { success: true };

    const method = `validate/search?stateId=${stateId}&&schoolId=${schoolId}&&careerId=${careerId}&&generation=${generation}&&searchText=${searchText}&&certificateTypeId=${certificateTypeId}`;

    try {
      const apiResponse = await ApiCall.get(controller, method);
      response.students = apiResponse.data.students;
    } catch (error) {
      response = ApiCall.handleCatch(error);
      response.students = [];
    }
    return response;
  },
  validateStudents: async (form) => {
    if (!form) form = {};
    if (!form.curps) form.curps = [];
    if (!form.certificateTypeId) form.certificateTypeId = 0;

    let response = { success: true };

    const method = `validateStudents`;

    try {
      const apiResponse = await ApiCall.post(controller, method, form);
      response.message = apiResponse.data;
    } catch (error) {
      response = ApiCall.handleCatch(error);
    }
    return response;
  },
  reprobateStudent: async (curp) => {
    if (!curp) curp = "";

    let response = { success: true };

    const method = `reprobateStudent/${curp}`;

    try {
      const apiResponse = await ApiCall.get(controller, method);
      response.message = apiResponse.data;
    } catch (error) {
      response = ApiCall.handleCatch(error);
    }
    return response;
  },
  editStudent: async (form) => {
    if (!form) form = {};
    if (!form.modules) form.modules = [];
    if (!form.finalScore) form.finalScore = 0;
    if (!form.enrollmentStartDate) form.enrollmentStartDate = null;
    if (!form.enrollmentEndDate) form.enrollmentEndDate = null;

    let response = { success: true };

    const method = `editStudentModules`;

    try {
      const apiResponse = await ApiCall.post(controller, method, form);
      response.message = apiResponse.data;
    } catch (error) {
      response = ApiCall.handleCatch(error);
    }
    return response;
  },
  getStudentData: async (curp) => {
    if (!curp) curp = "";

    let response = { success: true };

    const method = `getStudentModules/${curp}`;

    try {
      const apiResponse = await ApiCall.get(controller, method);
      response.studentData = apiResponse.data;
      if (response.studentData.enrollmentStartDate) {
        response.studentData.enrollmentStartDate = Moment(response.studentData.enrollmentStartDate, "YYYY/MM/DD");
        response.studentData.enrollmentStartDateReadable = dateToReadableDate(response.studentData.enrollmentStartDate);
      }
      if (response.studentData.enrollmentEndDate) {
        response.studentData.enrollmentEndDate = Moment(response.studentData.enrollmentEndDate, "YYYY/MM/DD");
        response.studentData.enrollmentEndDateReadable = dateToReadableDate(response.studentData.enrollmentEndDate);
      }
    } catch (error) {
      response = ApiCall.handleCatch(error);
      response.studentData = {};
    }
    return response;
  },
  studentUploadSearch: async ({ stateId, schoolId, careerId, generation, searchText, certificateTypeId }) => {
    if (!stateId) stateId = 0;
    if (!schoolId) schoolId = 0;
    if (!careerId) careerId = 0;
    if (!searchText) searchText = "";
    if (!generation) generation = "";
    if (!certificateTypeId) certificateTypeId = 0;

    let response = { success: true };

    const method = `certificate/search?stateId=${stateId}&&schoolId=${schoolId}&&careerId=${careerId}&&generation=${generation}&&searchText=${searchText}&&certificateTypeId=${certificateTypeId}`;

    try {
      const apiResponse = await ApiCall.get(controller, method);
      response.students = apiResponse.data.students;
    } catch (error) {
      response = ApiCall.handleCatch(error);
      response.students = [];
    }
    return response;
  },
  certificateStudents: async (form) => {
    if (!form) form = {};
    if (!form.curps) form.curps = [];
    if (!form.fiel) form.fiel = {};
    if (!form.fiel.cer) form.fiel.cer = null;
    if (!form.fiel.key) form.fiel.key = null;
    if (!form.certificateTypeId) form.certificateTypeId = 0;

    let response = { success: true };

    const method = `certificateStudents`;

    try {
      const apiResponse = await ApiCall.post(controller, method, form);
      response.message = apiResponse.data;
    } catch (error) {
      response = ApiCall.handleCatch(error);
    }
    return response;
  },
  studentQuerySearch: async ({ stateId, schoolId, careerId, generation, searchText, certificateTypeId }) => {
    if (!stateId) stateId = 0;
    if (!schoolId) schoolId = 0;
    if (!careerId) careerId = 0;
    if (!searchText) searchText = "";
    if (!generation) generation = "";
    if (!certificateTypeId) certificateTypeId = 0;

    let response = { success: true };

    const method = `query/search?stateId=${stateId}&&schoolId=${schoolId}&&careerId=${careerId}&&generation=${generation}&&searchText=${searchText}&&certificateTypeId=${certificateTypeId}`;

    try {
      const apiResponse = await ApiCall.get(controller, method);
      response.students = apiResponse.data.students;
    } catch (error) {
      response = ApiCall.handleCatch(error);
      response.students = [];
    }
    return response;
  },
  getPendientBatches: async () => {
    let response = { success: true };

    const method = `getPendientBatches`;

    try {
      const apiResponse = await ApiCall.get(controller, method);
      response.pendientBatches = apiResponse.data;
    } catch (error) {
      response = ApiCall.handleCatch(error);
      response.pendientBatches = false;
    }
    return response;
  },
  sincronizeBatches: async () => {
    let response = { success: true };

    const method = `sincronizeBatches`;

    try {
      const apiResponse = await ApiCall.get(controller, method);
      response.message = apiResponse.data;
    } catch (error) {
      response = ApiCall.handleCatch(error);
    }
    return response;
  },
  downloadXml: async (folioNumber) => {
    if (!folioNumber) folioNumber = "";
    let response = { success: true };

    const method = `downloadXml/?folioNumber=${folioNumber}`;

    try {
      const apiResponse = await ApiCall.get(controller, method);
      response.file = apiResponse.data;
    } catch (error) {
      response = ApiCall.handleCatch(error);
      response.file = {};
    }
    return response;
  },
  downloadPdf: async (folioNumber) => {
    if (!folioNumber) folioNumber = "";
    let response = { success: true };

    const method = `downloadPdf/?folioNumber=${folioNumber}`;

    try {
      const apiResponse = await ApiCall.get(controller, method);
      response.file = apiResponse.data;
    } catch (error) {
      response = ApiCall.handleCatch(error);
      response.file = {};
    }
    return response;
  },
  downloadMultiplePdf: async (form) => {
    if (!form) form = {};
    if (!form.curps) form.curps = [];

    let response = { success: true };

    const method = `downloadMultiplePdf`;

    try {
      const apiResponse = await ApiCall.post(controller, method, form);
      response.file = apiResponse.data;
    } catch (error) {
      response = ApiCall.handleCatch(error);
      response.file = {};
    }
    return response;
  },
  cancelCertificate: async (certificateType, curp) => {
    if (!certificateType) certificateType = 0;
    if (!curp) curp = "";

    let response = { success: true };

    const method = `cancelCertificate?certificateType=${certificateType}&curp=${curp}`;

    try {
      const apiResponse = await ApiCall.get(controller, method);
      response.message = apiResponse.data;
    } catch (error) {
      response = ApiCall.handleCatch(error);
    }
    return response;
  },
  getCertificateLimit: async (curp) => {
    if (!curp) curp = "";

    let response = { success: true };

    const method = `getCertificateLimit/${curp}`;

    try {
      const apiResponse = await ApiCall.get(controller, method);
      response.message = apiResponse.data;
    } catch (error) {
      response = ApiCall.handleCatch(error);
    }
    return response;
  },
  selectDataStudent: async (curp) => {
    if (!curp) curp = "";

    let response = { success: true };

    const method = `selectDataStudent/${curp}`;

    try {
      const apiResponse = await ApiCall.get(controller, method);
      response.studentData = apiResponse.data;
    } catch (error) {
      response = ApiCall.handleCatch(error);
      response.studentData = {};
    }
    return response;
  },
};
