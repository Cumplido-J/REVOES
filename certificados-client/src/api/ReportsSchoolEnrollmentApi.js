import ApiCall from "../shared/apicall";
import "moment/locale/es";

const controller = "reports";

export default {
  insertSchoolEnrollment: async (form) => {
    if (!form) form = {};
    let response = { success: true };

    const method = `scholarEnrollment`;
    try {
      const apiResponse = await ApiCall.post(controller, method, form);
      console.log(apiResponse);
      response.data = apiResponse.data;

    } catch (error) {
      response = ApiCall.handleCatch(error);
    }
    return response;
  },
  updateSchoolEnrollment: async (form) => {
    if (!form) form = {};
    let response = { success: true };

    const method = `scholarEnrollment`;
    try {
      const apiResponse = await ApiCall.put(controller, method, form);
      console.log(apiResponse);
      response.data = apiResponse.data;

    } catch (error) {
      response = ApiCall.handleCatch(error);
    }
    return response;
  },
  getSchoolEnrollment: async (stateId,schoolId,careerId,cicloId,enrollId) => {
    console.log("getSchoolEnrollment("+stateId+","+schoolId+","+careerId+","+cicloId+","+enrollId+")");
    if (!stateId) stateId = 0;
    let response = { success: true };

    const method = `scholarEnrollment/${schoolId}/${cicloId}/${enrollId}/${careerId}`;

    try {
      const apiResponse = await ApiCall.get(controller, method);
      response.reports = apiResponse.data;
    } catch (error) {
      response = ApiCall.handleCatch(error);
      response.reports = [];
    }
    return response;
  },
  getStateEnrollment: async (schoolType, cicloId, enrollId) => {
    console.log("getStateEnrollment("+schoolType+", "+cicloId+", "+enrollId+")");
    let response = { success: true };
    const method = `stateEnrollment/${schoolType}/${cicloId}/${enrollId}`;
    try {
      const apiResponse = await ApiCall.get(controller, method);
      response.reports = apiResponse.data;
    } catch (error) {
      response = ApiCall.handleCatch(error);
      response.reports = [];
    }
    return response;
  },
  getStateSchoolEnrollment: async (tipoPlantel,cicloId,matricula,estado) => {
    console.log("getStateSchoolEnrollment("+tipoPlantel+", "+cicloId+", "+matricula+", "+estado+")");
    let response = { success: true };
    const method = `stateSchoolsEnrollment/${tipoPlantel}/${cicloId}/${matricula}/${estado}`;
    try {
      const apiResponse = await ApiCall.get(controller, method);
      response.reports = apiResponse.data;
    } catch (error) {
      response = ApiCall.handleCatch(error);
      response.reports = [];
    }
    return response;
  },
  getStateSchoolCareerEnrollment: async (cicloId, enrollId, plantelId) => {
    console.log("getStateSchoolCareerEnrollment("+cicloId+", "+enrollId+", "+plantelId+")");
    let response = { success: true };
    const method = `stateSchoolCareerEnrollment/${cicloId}/${enrollId}/${plantelId}`;
    try {
      const apiResponse = await ApiCall.get(controller, method);
      response.reports = apiResponse.data;
    } catch (error) {
      response = ApiCall.handleCatch(error);
      response.reports = [];
    }
    return response;
  },
  getSchoolCycles: async () => {
    let response = { success: true };
    const method = `schoolCycle`;
    try {
      const apiResponse = await ApiCall.get(controller, method);
      response.reports = apiResponse.data;
    } catch (error) {
      response = ApiCall.handleCatch(error);
      response.reports = [];
    }
    return response;
  },
  ////////////////////////////////////
  //Registro de Egresados Titulados
  ///////////////////////////////////
  getGraduates: async (stateId,schoolId,careerId,cicloId,enrollId) => {
    console.log("getGraduates("+stateId+","+schoolId+","+careerId+","+cicloId+","+enrollId+")");
    if (!stateId) stateId = 0;
    let response = { success: true };

    const method = `graduates/${schoolId}/${cicloId}/${enrollId}/${careerId}`;

    try {
      const apiResponse = await ApiCall.get(controller, method);
      response.reports = apiResponse.data;
    } catch (error) {
      response = ApiCall.handleCatch(error);
      response.reports = [];
    }
    return response;
  },
  insertGraduates: async (form) => {
    if (!form) form = {};
    let response = { success: true };

    const method = `graduates`;
    try {
      const apiResponse = await ApiCall.post(controller, method, form);
      console.log(apiResponse);
      response.data = apiResponse.data;

    } catch (error) {
      response = ApiCall.handleCatch(error);
    }
    return response;
  },
  updateGraduates: async (form) => {
    if (!form) form = {};
    let response = { success: true };

    const method = `graduates`;
    try {
      const apiResponse = await ApiCall.put(controller, method, form);
      console.log(apiResponse);
      response.data = apiResponse.data;

    } catch (error) {
      response = ApiCall.handleCatch(error);
    }
    return response;
  },
  getStateGraduates: async (schoolType, cicloId, enrollId) => {
    console.log("getStateGraduates("+schoolType+", "+cicloId+", "+enrollId+")");
    let response = { success: true };
    const method = `stateGraduates/${schoolType}/${cicloId}/${enrollId}`;
    try {
      const apiResponse = await ApiCall.get(controller, method);
      response.reports = apiResponse.data;
    } catch (error) {
      response = ApiCall.handleCatch(error);
      response.reports = [];
    }
    return response;
  },
  getStateSchoolGraduates: async (schoolType, cicloId, enrollId, idEntidad) => {
    console.log("getStateSchoolGraduates("+schoolType+", "+cicloId+", "+enrollId+", "+idEntidad+")");
    let response = { success: true };
    const method = `stateSchoolGraduates/${schoolType}/${cicloId}/${enrollId}/${idEntidad}`;
    try {
      const apiResponse = await ApiCall.get(controller, method);
      response.reports = apiResponse.data;
    } catch (error) {
      response = ApiCall.handleCatch(error);
      response.reports = [];
    }
    return response;
  },
  getStateSchoolCareerGraduates: async (cicloId, enrollId, plantelId) => {
    console.log("getStateSchoolCareerGraduates("+cicloId+", "+enrollId+", "+plantelId+")");
    let response = { success: true };
    const method = `stateSchoolCareerGraduates/${cicloId}/${enrollId}/${plantelId}`;
    try {
      const apiResponse = await ApiCall.get(controller, method);
      response.reports = apiResponse.data;
    } catch (error) {
      response = ApiCall.handleCatch(error);
      response.reports = [];
    }
    return response;
  },
  ////////////////////////////////////
  //Registro de Nivel educacion
  ///////////////////////////////////
  getEducationLevel: async (stateId,schoolId,cicloId,turn,place) => {
    console.log("getEducationLevel("+stateId+","+schoolId+","+cicloId+","+turn+","+place+")");
    if (!stateId) stateId = 0;
    let response = { success: true };

    const method = `educationLevel/${stateId}/${schoolId}/${cicloId}/${turn}/${place}`;

    try {
      const apiResponse = await ApiCall.get(controller, method);
      response.reports = apiResponse.data;
    } catch (error) {
      response = ApiCall.handleCatch(error);
      response.reports = [];
    }
    return response;
  },
  insertEducationLevel: async (form) => {
    if (!form) form = {};
    let response = { success: true };

    const method = `educationLevel`;
    try {
      const apiResponse = await ApiCall.post(controller, method, form);
      console.log(apiResponse);
      response.data = apiResponse.data;

    } catch (error) {
      response = ApiCall.handleCatch(error);
    }
    return response;
  },
  updateEducationLevel: async (form) => {
    if (!form) form = {};
    let response = { success: true };

    const method = `educationLevel`;
    try {
      const apiResponse = await ApiCall.put(controller, method, form);
      console.log(apiResponse);
      response.data = apiResponse.data;

    } catch (error) {
      response = ApiCall.handleCatch(error);
    }
    return response;
  },
  getStateEducationLevel: async (cicloId) => {
    console.log("getStateEducationLevel("+cicloId+")");
    let response = { success: true };
    const method = `stateEducationLevel/${cicloId}`;
    try {
      const apiResponse = await ApiCall.get(controller, method);
      response.reports = apiResponse.data;
    } catch (error) {
      response = ApiCall.handleCatch(error);
      response.reports = [];
    }
    return response;
  },
  getStateSchoolsEducationLevel: async (cicloId, idEntidad) => {
    console.log("getStateSchoolsEducationLevel("+cicloId+", "+idEntidad+")");
    let response = { success: true };
    const method = `stateSchoolsEducationLevel/${cicloId}/${idEntidad}`;
    try {
      const apiResponse = await ApiCall.get(controller, method);
      response.reports = apiResponse.data;
    } catch (error) {
      response = ApiCall.handleCatch(error);
      response.reports = [];
    }
    return response;
  },
  getStateSchoolEducationLevel: async (cicloId, idEntidad) => {
    console.log("getStateSchoolEducationLevel("+cicloId+", "+idEntidad+")");
    let response = { success: true };
    const method = `stateSchoolEducationLevel/${cicloId}/${idEntidad}`;
    try {
      const apiResponse = await ApiCall.get(controller, method);
      response.reports = apiResponse.data;
    } catch (error) {
      response = ApiCall.handleCatch(error);
      response.reports = [];
    }
    return response;
  }
};
