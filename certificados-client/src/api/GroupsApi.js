import ApiCall from "../shared/apicall";

const controllerPhp = "grupos";

export default {
  getFilteredGroups: async (params) => {
    let response = { success: true };
    const method = "filtrar";
    try {
      const apiResponse = await ApiCall.post(
        controllerPhp,
        method,
        params,
        true
      );
      if (apiResponse.data.data && apiResponse.data.data.grupos) {
        response.groups = apiResponse.data.data.grupos;
      } else {
        response.groups = [];
      }
    } catch (exception) {
      response = ApiCall.handleCatch(exception);
      response.groups = [];
    }
    return response;
  },
  deleteGroupById: async (groupId) => {
    let response = { success: true };
    const method = `${groupId}`;
    try {
      const apiResponse = await ApiCall.delete(controllerPhp, method, true);
      response.message = apiResponse.data.message;
    } catch (exception) {
      response = ApiCall.handleCatch(exception);
    }
    return response;
  },
  disableGroupById: async (groupId) => {
    let response = { success: true };
    const method = `periodos/${groupId}`;
    try {
      const apiResponse = await ApiCall.delete(controllerPhp, method, true);
      apiResponse.message = apiResponse.data.data.message;
    } catch (exception) {
      response = ApiCall.handleCatch(exception);
    }
    return response;
  },
  createGroup: async (data) => {
    let response = { success: true };
    const method = "";
    try {
      const apiResponse = await ApiCall.post(controllerPhp, method, data, true);
      response.message = apiResponse.data.message;
      response.group = apiResponse.data.data;
    } catch (exception) {
      response = ApiCall.handleCatch(exception);
    }
    return response;
  },
  groupDetails: async (groupId) => {
    let response = { success: true };
    const method = groupId;
    try {
      const apiResponse = await ApiCall.get(controllerPhp, method, true);
      response.group = apiResponse.data.data;
    } catch (exception) {
      response = ApiCall.handleCatch(exception);
    }
    return response;
  },
  updateGroup: async (groupId, dataRaw) => {
    let response = { success: true };
    const method = groupId;
    try {
      const apiResponse = await ApiCall.put(
        controllerPhp,
        method,
        dataRaw,
        true
      );
      response.group = apiResponse.data.data;
      response.message = apiResponse.data.message;
    } catch (exception) {
      response = ApiCall.handleCatch(exception);
    }
    return response;
  },
  setStudentsOnGroup: async (dataRaw, groupId) => {
    let response = { success: true };
    const method = `periodos/asignar-alumnos/${groupId}`;
    try {
      const apiResponse = await ApiCall.put(
        controllerPhp,
        method,
        dataRaw,
        true
      );
      response.group = apiResponse.data.data;
    } catch (exception) {
      response = ApiCall.handleCatch(exception);
    }
    return response;
  },
};
