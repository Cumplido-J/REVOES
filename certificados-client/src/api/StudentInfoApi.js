import ApiCall from "../shared/apicall";

const controller = "studentInfo";
export default {
  getStudentInfoData: async (curp) => {
    if (!curp) curp = "";
    let response = { success: true };

    const method = `${curp}`;

    try {
      const apiResponse = await ApiCall.get(controller, method);
      response.studentInfo = apiResponse.data;

      let studentInfo = { ...apiResponse.data };

      const checks = {
        disability: studentInfo.disability !== null ? "1" : "0",
        language: studentInfo.language !== null ? "1" : "0",
        ethnicGroup: studentInfo.ethnicGroup !== null ? "1" : "0",
        indigenousLanguage: studentInfo.indigenousLanguage !== null ? "1" : "0",
        entrepreneurship: studentInfo.entrepreneurship === true ? "1" : "0",
        continueStudies: studentInfo.continueStudies === true ? "1" : "0",
      };

      studentInfo.disabilityCheck = checks.disability;
      studentInfo.languageCheck = checks.language;
      studentInfo.ethnicGroupCheck = checks.ethnicGroup;
      studentInfo.indigenousLanguageCheck = checks.indigenousLanguage;
      studentInfo.entrepreneurshipCheck = checks.entrepreneurship;
      studentInfo.continueStudiesCheck = checks.continueStudies;

      studentInfo.shareInformation = studentInfo.shareInformation === true ? "1" : "0";
      studentInfo.continueStudies = studentInfo.continueStudies === true ? "1" : "0";
      studentInfo.entrepreneurship = studentInfo.entrepreneurship === true ? "1" : "0";

      if (studentInfo.entrepreneurship === "1") {
        studentInfo.entrepreneurshipCareer = studentInfo.entrepreneurshipCareer === true ? "1" : "0";
        studentInfo.entrepreneurshipDerivated = studentInfo.entrepreneurshipDerivated === true ? "1" : "0";
      }

      response.studentInfo = { studentInfo, checks };
    } catch (error) {
      response = ApiCall.handleCatch(error);
      response.studentInfo = null;
    }
    return response;
  },
  updateStudentInfoData: async (curp, studentInfo) => {
    if (!curp) curp = "";
    if (!studentInfo) studentInfo = {};
    let form = {
      postalCode: studentInfo.postalCode,
      phoneNumber: studentInfo.phoneNumber,
      home: studentInfo.home,
      program: studentInfo.program,
      email: studentInfo.email,
    };
    form.shareInformation = studentInfo.shareInformation === "1";
    
    form.entrepreneurship = studentInfo.entrepreneurshipCheck === "1";
    form.continueStudies = studentInfo.continueStudiesCheck === "1";

    if (form.entrepreneurship) {
      form.entrepreneurshipCareer = studentInfo.entrepreneurshipCareer === "1";
      form.entrepreneurshipDerivated = studentInfo.entrepreneurshipDerivated === "1";
      form.entrepreneurshipStatus = studentInfo.entrepreneurshipStatus;
    }
    if (form.continueStudies) {
      form.exam = studentInfo.exam;
      form.futureSchool = studentInfo.futureSchool;
    }
    if (studentInfo.disabilityCheck === "1") form.disability = studentInfo.disability;
    if (studentInfo.ethnicGroupCheck === "1") form.ethnicGroup = studentInfo.ethnicGroup;
    if (studentInfo.indigenousLanguageCheck === "1") form.indigenousLanguage = studentInfo.indigenousLanguage;
    if (studentInfo.languageCheck === "1") form.language = studentInfo.language;

    let response = { success: true };

    const method = "";
    try {
      const apiResponse = await ApiCall.post(controller, method, form);
      response.studentInfo = apiResponse.data;
    } catch (error) {
      response = ApiCall.handleCatch(error);
      response.studentInfo = {};
    }
    return response;
  },
};
