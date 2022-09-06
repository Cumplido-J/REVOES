import apicall from "../shared/apicall";

export default {
  getSignaturesForEnrollmentByCareerSemester: async (data) => {
    let response = { success: true };
    try {
      const apiResponse = await apicall.post(
        "uac-reinscripcion",
        "",
        data,
        true
      );
      response.materias = apiResponse.data.materias;
    } catch (error) {
      response = apicall.handleCatch(error);
    }
    return response;
  },
};
