import ApiCall from "../shared/apicall";
import "moment/locale/es";

const controller = "degree";

export default {
  studentValidationSearch: async ({ stateId, schoolId, careerId, generation, searchText }) => {
    if (!stateId) stateId = 0;
    if (!schoolId) schoolId = 0;
    if (!careerId) careerId = 0;
    if (!searchText) searchText = "";
    if (!generation) generation = "";

    let response = { success: true };

    const method = `validate/search?stateId=${stateId}&&schoolId=${schoolId}&&careerId=${careerId}&&generation=${generation}&&searchText=${searchText}`;

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
  editStudent: async (curp, form) => {
    if (!curp) curp = "";
    if (!form) form = {};
    if (!form.carrerId) form.carrerId = 0;
    if (!form.startDateCareer) form.startDateCareer = "";
    if (!form.endDateCareer) form.endDateCareer = "";
    if (!form.autorizationId) form.autorizationId = 0;
    if (!form.expeditionDate) form.expeditionDate = "";
    if (!form.modalityId) form.modalityId = 0;
    if (!form.examinationDate) form.examinationDate = "";
    if (!form.exemptionDate) form.exemptionDate = "";
    if (!form.legalBasisId) form.legalBasisId = 0;
    if (!form.socialService) form.socialService = "";
    if (!form.federalEntityId) form.federalEntityId = 0;
    if (!form.institutionOrigin) form.institutionOrigin = "";
    if (!form.institutionOriginTypeId) form.institutionOriginTypeId = 0;
    if (!form.federalEntityOriginId) form.federalEntityOriginId = 0;
    if (!form.antecedentStartDate) form.antecedentStartDate = "";
    if (!form.antecedentEndDate) form.antecedentEndDate = "";

    let response = { success: true };

    const method = `editStudentModules/${curp}`;

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
    } catch (error) {
      response = ApiCall.handleCatch(error);
      response.studentData = {};
    }
    return response;
  },
  studentUploadSearch: async ({ stateId, schoolId, careerId, generation, searchText }) => {
    if (!stateId) stateId = 0;
    if (!schoolId) schoolId = 0;
    if (!careerId) careerId = 0;
    if (!searchText) searchText = "";
    if (!generation) generation = "";

    let response = { success: true };

    const method = `degree/search?stateId=${stateId}&&schoolId=${schoolId}&&careerId=${careerId}&&generation=${generation}&&searchText=${searchText}`;

    try {
      const apiResponse = await ApiCall.get(controller, method);
      response.students = apiResponse.data.students;
    } catch (error) {
      response = ApiCall.handleCatch(error);
      response.students = [];
    }
    return response;
  },
  degreeStudents: async (form) => {
    if (!form) form = {};
    if (!form.curps) form.curps = [];
    if (!form.fiel) form.fiel = {};
    if (!form.fiel.cer) form.fiel.cer = null;
    if (!form.fiel.key) form.fiel.key = null;

    let response = { success: true };

    const method = `degreeStudents`;

    try {
      const apiResponse = await ApiCall.post(controller, method, form);
      response.message = apiResponse.data;
    } catch (error) {
      response = ApiCall.handleCatch(error);
    }
    return response;
  },
  studentQuerySearch: async ({ stateId, schoolId, careerId, generation, searchText }) => {
    if (!stateId) stateId = 0;
    if (!schoolId) schoolId = 0;
    if (!careerId) careerId = 0;
    if (!searchText) searchText = "";
    if (!generation) generation = "";

    let response = { success: true };

    const method = `query/search?stateId=${stateId}&&schoolId=${schoolId}&&careerId=${careerId}&&generation=${generation}&&searchText=${searchText}`;

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
  cancelDegree: async (curp, form) => {
    if (!curp) curp = "";
    if (!form.cancelationReason) form.cancelationReason = "";

    let response = { success: true };

    const method = `cancelDegree?curp=${curp}&cancelationReason=${form.cancelationReason}`;

    try {
      const apiResponse = await ApiCall.get(controller, method);
      response.message = apiResponse.data;
    } catch (error) {
      response = ApiCall.handleCatch(error);
    }
    return response;
  },
  //antecedentDegree: async ({examinationDate, modalityId, legalBasisId, socialService, federalEntityId, institutionOrigin, institutionOriginTypeId, federalEntityOriginId, startDate, endData}) => {
  antecedentDegree: async (curp, form) => {
    if (!curp) curp = "";
    if (!form.carrerId) form.carrerId = 0;
    if (!form.startDateCarrer) form.startDateCarrer = "";
    if (!form.endDateCarrer) form.endDateCarrer = "";

    if (!form.expeditionData) form.expeditionData = "";
    if (!form.modalityId) form.modalityId = 0;
    if (!form.examinationDate) form.examinationDate = "";
    if (!form.exemptionDate) form.exemptionDate = "";
    if (!form.legalBasisId) form.legalBasisId = 0;
    if (!form.socialService) form.socialService = "";
    if (!form.federalEntityId) form.federalEntityId = 0;

    if (!form.institutionOrigin) form.institutionOrigin = "";
    if (!form.institutionOriginTypeId) form.institutionOriginTypeId = 0;
    if (!form.federalEntityOriginId) form.federalEntityOriginId = 0;
    if (!form.startDate) form.startDate = "";
    if (!form.endData) form.endData = "";
    let response = { success: true };
    let method = `antecedentsDegree/${curp}`;
    try {
      const apiResponse = await ApiCall.post(controller, method, form);
      response.message = apiResponse.data;
    } catch (error) {
      response = ApiCall.handleCatch(error);
    }
    return response;
  },
  degreeStudentView: async (curp) => {
    if (!curp) curp = "";
    let response = { success: true };
    let method = `degreeView/${curp}`;
    try {
      const apiResponse = await ApiCall.get(controller, method);
      response.degreeView = apiResponse.data;
    } catch (error) {
      response = ApiCall.handleCatch(error);
      response.degreeView = [];
    }
    return response;
  },
  cancelExternalStamps: async (form) => {
    if (!form) form = {};
    if (!form.stampedType) form.stampedType = 0;
    if (!form.stateId) form.stateId = 0;
    if (!form.curp) form.curp = "";
    if (!form.folio) form.folio = "";
    if (!form.motivo) form.motivo = "";
    if (!form.stateServer) form.stateServer = false;
    console.log(JSON.stringify(form))
    let response = {success: true};
    let method = `degreeCancelExternal`;
    try {
      const apiResponse = await ApiCall.post(controller, method, form);
      response.data = apiResponse.data;
    } catch(error) {
      response = ApiCall.handleCatch(error);
      response.data = [];
    }
    return response;
  },
};
