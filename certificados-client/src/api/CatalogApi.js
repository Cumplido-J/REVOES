import ApiCall from "../shared/apicall";
const controller = "catalogs";
const phpController = "catalogos";

export default {
  getStateCatalogs: async () => {
    let response = { success: true };

    const method = "states";

    try {
      const apiResponse = await ApiCall.get(controller, method);
      response.states = apiResponse.data;
    } catch (error) {
      response = ApiCall.handleCatch(error);
      response.states = [];
    }
    return response;
  },
  getSchoolCatalogs: async (stateId) => {
    if (!stateId) stateId = 0;
    let response = { success: true };

    const method = `schools/${stateId}`;

    try {
      const apiResponse = await ApiCall.get(controller, method);
      response.schools = apiResponse.data;
    } catch (error) {
      response = ApiCall.handleCatch(error);
      response.schools = [];
    }
    return response;
  },
  getStateId: async (periodId) => {
    if (!periodId) periodId = 0;
    let response = { success: true };

    const method = `plantel-id/${periodId}`;

    try {
      const apiResponse = await ApiCall.get(phpController, method, true);
      response.states = apiResponse.data;
    } catch (error) {
      response = ApiCall.handleCatch(error);
      response.states = [];
    }
    return response;
  },
  getSchoolCatalogsWithoutPermission: async (stateId = 0) => {
    let response = { success: true };
    const method = `planteles/${stateId}`;
    try {
      const apiResponse = await ApiCall.get(phpController, method, true);
      response.schools = apiResponse.data.data;
    } catch (error) {
      response = ApiCall.handleCatch(error);
      response.schools = [];
    }
    return response;
  },
  getCareerCatalogs: async (schoolId) => {
    if (!schoolId) schoolId = 0;
    let response = { success: true };
    const method = `careers/${schoolId}`;

    try {
      const apiResponse = await ApiCall.get(controller, method);
      response.careers = apiResponse.data;
    } catch (error) {
      response = ApiCall.handleCatch(error);
      response.careers = [];
    }
    return response;
  },
  getCareerCatalogsByState: async (stateId) => {
    if (!stateId) stateId = 0;
    let response = { success: true };
    const method = `careersByState/${stateId}`;

    try {
      const apiResponse = await ApiCall.get(controller, method);
      response.careers = apiResponse.data;
    } catch (error) {
      response = ApiCall.handleCatch(error);
      response.careers = [];
    }
    return response;
  },
  getCareerCatalogsBySchool: async (schoolId) => {
    if (!schoolId) schoolId = 0;
    let response = { success: true };
    const method = `carreras/${schoolId}`;

    try {
      const apiResponse = await ApiCall.get(phpController, method, true);
      response.carreras = apiResponse.data.carreras;
    } catch (error) {
      response = ApiCall.handleCatch(error);
      response.carreras = [];
    }
    return response;
  },
  getAllCareersCatalogs: async () => {
    let response = { success: true };
    const method = `allcareers`;

    try {
      const apiResponse = await ApiCall.get(controller, method);
      response.careers = apiResponse.data;
    } catch (error) {
      response = ApiCall.handleCatch(error);
      response.careers = [];
    }
    return response;
  },
  getModulesByCareer: async (careerId) => {
    if (!careerId) careerId = 0;
    let response = { success: true };
    const method = `modulesbycareer/${careerId}`;

    try {
      const apiResponse = await ApiCall.get(controller, method);
      response.modules = apiResponse.data;
    } catch (error) {
      response = ApiCall.handleCatch(error);
      response.modules = [];
    }
    return response;
  },
  getCityCatalogs: async (stateId) => {
    if (!stateId) stateId = 0;
    let response = { success: true };
    const method = `cities/${stateId}`;

    try {
      const apiResponse = await ApiCall.get(controller, method);
      response.cities = apiResponse.data;
    } catch (error) {
      response = ApiCall.handleCatch(error);
      response.cities = [];
    }
    return response;
  },
  getCareerCatalogs2: async (schoolId) => {
    if (!schoolId) schoolId = 0;
    let response = { success: true, careersList: [] };
    const method = `careers/${schoolId}`;

    try {
      const apiResponse = await ApiCall.get(controller, method);
      response.careersList = apiResponse.data;
    } catch (error) {
      response = ApiCall.handleCatch(error);
      response.careersList = [];
    }
    return response;
  },
  getAllCareersCatalogs2: async () => {
    let response = { success: true, careersList: [] };
    const method = `allcareers`;

    try {
      const apiResponse = await ApiCall.get(controller, method);
      response.careersList = apiResponse.data;
    } catch (error) {
      response = ApiCall.handleCatch(error);
      response.careersList = [];
    }
    return response;
  },
  getPrueba: async () => {
    let response = { success: true };
    const method = "prueba";
    try {
      const apiResponse = await ApiCall.get(controller, method);
      response.mesaje = apiResponse.data;
    } catch (error) {
      response = ApiCall.handleCatch(error);
      response.mesaje = "";
    }
    return response;
  },
  getRoleCatalogs: async () => {
    let response = { success: true };
    const method = "role";
    try {
      const apiResponse = await ApiCall.get(controller, method);
      response.states = apiResponse.data;
    } catch (error) {
      response = ApiCall.handleCatch(error);
      response.states = [];
    }
    return response;
  },
  getCargoCatalogs: async () => {
    let response = { success: true };
    const method = "cargo";
    try {
      const apiResponse = await ApiCall.get(controller, method);
      response.states = apiResponse.data;
    } catch (error) {
      response = ApiCall.handleCatch(error);
      response.states = [];
    }
    return response;
  },
  getRoleUser: async () => {
    let response = { success: true };
    const method = "getRoleUser";
    try {
      const apiResponse = await ApiCall.get(controller, method);
      response.rol = apiResponse.data;
    } catch (error) {
      response = ApiCall.handleCatch(error);
      response.rol = [];
    }
    return response;
  },
  getPersonalRole: async () => {
    let response = { success: true };
    const method = "personalRole";

    try {
      const apiResponse = await ApiCall.get(controller, method);
      response.roles = apiResponse.data;
    } catch (error) {
      response = ApiCall.handleCatch(error);
      response.schools = [];
    }
    return response;
  },
  getCareerCatalogsSelect: async (cct) => {
    let response = { success: true };
    if (!cct) cct = 0;
    const method = `careers/${cct}`;
    try {
      const apiResponse = await ApiCall.get(controller, method);
      response.careers = apiResponse.data;
    } catch (error) {
      response = ApiCall.handleCatch(error);
      response.careers = [];
    }
    return response;
  },
  getPerfilCatalogs: async () => {
    let response = { success: true };

    const method = "perfilTypo";

    try {
      const apiResponse = await ApiCall.get(controller, method);
      response.perfiles = apiResponse.data;
    } catch (error) {
      response = ApiCall.handleCatch(error);
      response.perfiles = [];
    }
    return response;
  },
  getEstudioCatalogs: async () => {
    let response = { success: true };

    const method = "estudioTypo";

    try {
      const apiResponse = await ApiCall.get(controller, method);
      response.estudios = apiResponse.data;
    } catch (error) {
      response = ApiCall.handleCatch(error);
      response.estudios = [];
    }
    return response;
  },
  getDiciplinarCatalogs: async () => {
    let response = { success: true };

    const method = "diciplinar";

    try {
      const apiResponse = await ApiCall.get(controller, method);
      response.diciplinas = apiResponse.data;
    } catch (error) {
      response = ApiCall.handleCatch(error);
      response.diciplinas = [];
    }
    return response;
  },
  getSubjectCatalogs: async () => {
    let response = { success: true };

    const method = "subject";

    try {
      const apiResponse = await ApiCall.get(controller, method);
      response.subjects = apiResponse.data;
    } catch (error) {
      response = ApiCall.handleCatch(error);
      response.subjects = [];
    }
    return response;
  },
  getCompetencias: async (careerKey) => {
    if (!careerKey) careerKey = 0;
    let response = { success: true, competList: [] };
    const method = `competencias/${careerKey}`;

    try {
      const apiResponse = await ApiCall.get(controller, method);
      response.competList = apiResponse.data;
    } catch (error) {
      response = ApiCall.handleCatch(error);
      response.competList = [];
    }
    return response;
  },
  getCompetenciasCatalogs: async () => {
    let response = { success: true };
    const method = `competencias`;

    try {
      const apiResponse = await ApiCall.get(controller, method);
      response.competencias = apiResponse.data;
    } catch (error) {
      response = ApiCall.handleCatch(error);
      response.competencias = [];
    }
    return response;
  },
  getSubjectType: async () => {
    let response = { success: true };
    const method = "subjectType";

    try {
      const apiResponse = await ApiCall.get(controller, method);
      response.subjects = apiResponse.data;
    } catch (error) {
      response = ApiCall.handleCatch(error);
      response.subjects = [];
    }
    return response;
  },

  getdiciplinaryCompentence: async () => {
    let response = { success: true };
    const method = `diciplinaryCompentence`;

    try {
      const apiResponse = await ApiCall.get(controller, method);
      response.competence = apiResponse.data;
    } catch (error) {
      response = ApiCall.handleCatch(error);
      response.competence = [];
    }
    return response;
  },

  getAllGroups: async () => {
    let response = { success: true};
    const method = `getAllGroups`;

    try {
      const apiResponse = await ApiCall.get(controller, method);
      response.groups = apiResponse.data;
    } catch (error) {
      response = ApiCall.handleCatch(error);
      response.groups = [];
    }
    return response; 
  },

  getAllPermissions: async () => {
    let response = { success: true};
    const method = `getAllPermissions`;

    try {
      const apiResponse = await ApiCall.get(controller, method);
      response.permissions = apiResponse.data;
    } catch (error) {
      response = ApiCall.handleCatch(error);
      response.permissions = [];
    }
    return response; 
  },
  selectPeriodFinished: async (stateId, generationId) => {
    if (!stateId) stateId = 0;
    if (!generationId) generationId = "";
    let response = {success: true};
    const method = `selectPeriodFinished/${stateId}/${generationId}`;
    try {
      const apiResponse = await ApiCall.get(controller, method);
      response.fecha = apiResponse.data;
    } catch (error) {
      response = ApiCall.handleCatch(error);
      response.fecha = [];
    }
    return response;
  },
  getSchoolCycle: async () => {
    let response = { success: true};
    const method = `getSchoolCycle`;

    try {
      const apiResponse = await ApiCall.get(controller, method);
      response.cycle = apiResponse.data;
    } catch (error) {
      response = ApiCall.handleCatch(error);
      response.cycle = [];
    }
    return response; 
  },

  /*
   * Get periods: Se obtiene de back de laravel
   * @method GET
   * @return {custom response object}
   */
  getPeriods: async () => {
    let response = { success: true };
    const method = "periodos";

    try {
      const apiResponse = await ApiCall.get(phpController, method, true);
      response.periods = apiResponse.data.periodos;
    } catch (exception) {
      response = ApiCall.handleCatch(exception);
      response.periods = [];
    }
    return response;
  },
  /* teacher */
  getTypeBlood: async () => {
    let response = { success: true };
    const method = "periodos";
    try {
      const apiResponse = await ApiCall.get(phpController, method, true);
      response.periods = apiResponse.data.periodos;
    } catch (exception) {
      response = ApiCall.handleCatch(exception);
      response.periods = [];
    }
    return response;
  },
  getDocumentsOptions: async () => {
    let response = { success: true };
    const method = "documentos-docente";
    try {
      const apiResponse = await ApiCall.get(phpController, method, true);
      response.documentsOptions = apiResponse.data.data;
    } catch (exception) {
      response = ApiCall.handleCatch(exception);
      response.documentsOptions = [];
    }
    return response;
  },
  getMaxStudyOptions: async () => {
    let response = { success: true };
    const method = "grado-estudio";
    try {
      const apiResponse = await ApiCall.get(phpController, method, true);
      response.maxStudyOptions = apiResponse.data.data;
    } catch (exception) {
      response = ApiCall.handleCatch(exception);
      response.maxStudyOptions = [];
    }
    return response;
  },
  /* plantilla */
  getTypePlaza: async () => {
    let response = { success: true };
    const method = "tipo-plaza";
    try {
      const apiResponse = await ApiCall.get(phpController, method, true);
      response.type = apiResponse.data.data;
    } catch (exception) {
      response = ApiCall.handleCatch(exception);
      response.type = [];
    }
    return response;
  },
  /* uac filter cat */
  getUacByFilter: async (filters) => {
    let response = { success: true };
    try {
      const apiResponse = await ApiCall.post(
        "carrera-uac",
        "filtrar",
        filters,
        true
      );
      response.type = apiResponse.data.data;
    } catch (exception) {
      response = ApiCall.handleCatch(exception);
      response.type = [];
    }
    return response;
  },
  getUacWithOutGrades: async (filters) => {
    let response = { success: true };
    try {
      const apiResponse = await ApiCall.post(
        "carrera-uac/sin-calificar",
        "filtrar",
        filters,
        true
      );
      response.type = apiResponse.data.data;
    } catch (exception) {
      response = ApiCall.handleCatch(exception);
      response.type = [];
    }
    return response;
  },
  getCertificationPeriodsConfig: async (filters) => {
    let response = { success: true };
    try {
      const apiResponse = await ApiCall.post(
        phpController,
        "config-periodos-certificacion",
        filters,
        true
      );
      response.type = apiResponse.data;
    } catch (exception) {
      response = ApiCall.handleCatch(exception);
      response.type = [];
    }
    return response;
  },
  getStudentEnrollmentDocuments: async () => {
    let response = { success: true };
    try {
      const apiResponse = await ApiCall.get(
        phpController,
        "documentos-inscripciones",
        true
      );
      response.data = apiResponse.data.data;
    } catch (error) {
      response = ApiCall.handleCatch(error);
    }
    return response;
  },
  getGenerationsCatalogs: async () => {
    let response = { success: true };

    const method = "generations";

    try {
      const apiResponse = await ApiCall.get(controller, method);
      response.generations = apiResponse.data;
    } catch (error) {
      response = ApiCall.handleCatch(error);
      response.generations = [];
    }
    return response;
  },

  getAllStateCatalogs: async () => {
    let response = { success: true };
    const method = "estados";
    try {
      const apiResponse = await ApiCall.get(phpController, method, true);
      response.data = apiResponse.data.data;
    } catch (error) {
      response = ApiCall.handleCatch(error);
      response.data = [];
    }
    return response;
  },
  getCargosCatalogs: async () => {
    let response = { success: true };

    const method = "cargos";

    try {
      const apiResponse = await ApiCall.get(controller, method);
      response.cargos = apiResponse.data;
    } catch (error) {
      response = ApiCall.handleCatch(error);
      response.cargos = [];
    }
    return response;
  },
  getMedicalIntitutions: async () => {
    let response = { success: true };
    const method = "instituciones-seguro";
    try {
      const apiResponse = await ApiCall.get(phpController, method, true);
      response.data = apiResponse?.data?.data;
    } catch (error) {
      response = ApiCall.handleCatch(error);
      response.data = [];
    }
    return response;
  },
};
