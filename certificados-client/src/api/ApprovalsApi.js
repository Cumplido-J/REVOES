import ApiCall from "../shared/apicall";

export default {
  getUnapprovedGroups: async (filters) => {
    let response = { success: true };
    try {
      const apiResponse = await ApiCall.post(
        "aprobacion-grupos",
        "",
        filters,
        true
      );
      response.groups = apiResponse.data.data;
    } catch (exception) {
      response = ApiCall.handleCatch(exception);
    }
    return response;
  },
  setGroupApprovalStatus: async (id, data, url = false) => {
    let response = { success: true };
    if (url && typeof url === "string" && url[0] === "/") {
      url = url.substr(1);
    }
    try {
      const apiResponse = await ApiCall.post(
        url || "aprobacion-grupos",
        id,
        data,
        true
      );
      response.message = apiResponse.data.message;
    } catch (exception) {
      response = ApiCall.handleCatch(exception);
    }
    return response;
  },
};
