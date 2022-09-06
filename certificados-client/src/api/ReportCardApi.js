import apicall from "../shared/apicall";

export default {
  getReportCardBySemester: async (data) => {
    let response = { success: true };
    try {
      const apiResponse = await apicall.post(
        "boletas-por-semestre",
        "",
        data,
        true,
        {
          responseType: "blob",
        }
      );
      response.data = apiResponse.data;
    } catch (error) {
      response = apicall.handleCatchBlob(error);
    }
    return response;
  },
  getReportCardByGroupPeriod: async (groupPeriodId) => {
    let response = { success: true };
    try {
      const apiResponse = await apicall.post(
        "boletas-por-grupo",
        groupPeriodId,
        {},
        true,
        {
          responseType: "blob",
        }
      );
      response.data = apiResponse.data;
    } catch (error) {
      response = await apicall.handleCatchBlob(error);
    }
    return response;
  },
  getAcademicRecord: async (studentId) => {
    let response = { success: true };
    try {
      const apiResponse = await apicall.get(
        "historial-academico",
        studentId,
        true,
        {
          responseType: "blob",
        }
      );
      response.data = apiResponse.data;
    } catch (error) {
      response = await apicall.handleCatchBlob(error);
    }
    return response;
  },
};
