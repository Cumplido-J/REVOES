import ApiCall from "../shared/apicall";
import Moment from "moment";
import "moment/locale/es";
import { generationCatalog } from "../shared/catalogs";
import { Suspense } from "react";

const controller = "students";
const phpController = "alumnos";

export default {
  studentSearch: async ({
    stateId,
    schoolId,
    careerId,
    studentStatusId,
    searchText,
    generation,
  }) => {
    if (!stateId) stateId = 0;
    if (!schoolId) schoolId = 0;
    if (!careerId) careerId = 0;
    if (!studentStatusId) studentStatusId = 0;
    if (!searchText) searchText = "";
    if (!generation) generation = "";

    let response = { success: true };

    const method = `?stateId=${stateId}&&schoolId=${schoolId}&&careerId=${careerId}&&studentStatusId=${studentStatusId}&&searchText=${searchText}&&generation=${generation}&&`;

    try {
      const apiResponse = await ApiCall.get(controller, method);
      response.studentList = apiResponse.data;
    } catch (error) {
      response = ApiCall.handleCatch(error);
      response.studentList = [];
    }
    return response;
  },
  getStudentData: async (curp) => {
    if (!curp) curp = "";
    let response = { success: true };

    const method = `${curp}`;
    try {
      const apiResponse = await ApiCall.get(controller, method);
      response.studentData = apiResponse.data;
      response.studentData.enrollmentStartDate = Moment(
        response.studentData.enrollmentStartDate,
        "YYYY/MM/DD"
      );
      response.studentData.enrollmentEndDate = Moment(
        response.studentData.enrollmentEndDate,
        "YYYY/MM/DD"
      );
      response.studentData.studentStatusId =
        response.studentData.studentStatusId === true ? 1 : 2;
    } catch (error) {
      response = ApiCall.handleCatch(error);
      response.studentData = {};
    }
    return response;
  },
  addStudent: async (form) => {
    if (!form) form = {};
    if (!form.curp) form.curp = null;
    else form.curp = form.curp.toUpperCase();
    if (!form.name) form.name = null;
    if (!form.firstLastName) form.firstLastName = null;
    if (!form.secondLastName) form.secondLastName = null;
    if (!form.email) form.email = null;
    if (!form.enrollmentKey) form.enrollmentKey = null;
    if (!form.stateId) form.stateId = null;
    if (!form.schoolId) form.schoolId = null;
    if (!form.careerId) form.careerId = null;
    form.studentStatusId = form.studentStatusId === 1;
    if (!form.generation) form.generation = null;

    let response = { success: true };

    const method = `add`;
    try {
      const apiResponse = await ApiCall.post(controller, method, form);
      response.studentData = apiResponse.data;
    } catch (error) {
      response = ApiCall.handleCatch(error);
    }
    return response;
  },
  editStudent: async (curp, form) => {
    if (!curp) curp = "";
    if (!form) form = {};
    if (!form.curp) form.curp = null;
    else form.curp = form.curp.toUpperCase();
    if (!form.name) form.name = null;
    if (!form.firstLastName) form.firstLastName = null;
    if (!form.secondLastName) form.secondLastName = null;
    if (!form.email) form.email = null;
    if (!form.enrollmentKey) form.enrollmentKey = null;
    if (!form.stateId) form.stateId = null;
    if (!form.schoolId) form.schoolId = null;
    if (!form.careerId) form.careerId = null;
    if (form.studentStatusId == 2) {
      form.studentStatusId = 0;
    } else {
      form.studentStatusId = 1;
    }

    let response = { success: true };

    const method = `edit/${curp}`;
    try {
      const apiResponse = await ApiCall.post(controller, method, form);
      response.studentData = apiResponse.data;
    } catch (error) {
      response = ApiCall.handleCatch(error);
    }
    return response;
  },
  editStudentPassword: async (curp, form) => {
    if (!curp) curp = "";
    if (!form) form = {};
    if (!form.password) form.password = null;

    let response = { success: true };

    const method = `password/${curp}`;

    try {
      const apiResponse = await ApiCall.post(controller, method, form);
      response.studentData = apiResponse.data;
    } catch (error) {
      response = ApiCall.handleCatch(error);
    }
    return response;
  },
  editStudentModules: async (curp, form) => {
    if (!curp) curp = "";
    if (!form) form = {};
    if (!form.modules) form.modules = [];
    form.curp = curp;

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
  getStudentModules: async (curp) => {
    if (!curp) curp = "";

    let response = { success: true, studentModules: {} };

    const method = `getStudentModules/${curp}`;

    try {
      const apiResponse = await ApiCall.get(controller, method);
      response.studentModules = apiResponse.data;
    } catch (error) {
      response = ApiCall.handleCatch(error);
      response.studentModules = {};
    }
    return response;
  },

  getStudentSubjects: async (curp) => {
    if (!curp) curp = "";

    let response = { success: true, studentInfo: {} };

    const method = `subjects/${curp}`;

    try {
      const apiResponse = await ApiCall.get(controller, method);
      response.studentInfo = apiResponse.data;
    } catch (error) {
      response = ApiCall.handleCatch(error);
      response.studentInfo = {};
    }
    return response;
  },
  getAvailableStudentSubjects: async (curp) => {
    if (!curp) curp = "";

    let response = { success: true, studentInfo: {} };

    const method = `availablesubjects/${curp}`;

    try {
      const apiResponse = await ApiCall.get(controller, method);
      response.studentInfo = apiResponse.data;
      response.studentInfo.optionals = response.studentInfo.optionals.map(
        (optional) => ({
          id: optional.id,
          description: optional.description1,
        })
      );
    } catch (error) {
      response = ApiCall.handleCatch(error);
      response.studentInfo = {};
    }
    return response;
  },
  addStudentSubjects: async (curp, form) => {
    if (!curp) curp = "";
    if (!form) form = {};

    let response = { success: true, message: "" };

    const method = `subjects/${curp}`;

    try {
      const apiResponse = await ApiCall.post(controller, method, form);
      response.message = apiResponse.data;
    } catch (error) {
      response = ApiCall.handleCatch(error);
    }
    return response;
  },
  getStudentsByGroupPeriod: async (data) => {
    let response = { success: true };
    const method = "grupo";
    try {
      const apiResponse = await ApiCall.post(phpController, method, data, true);
      response.students = apiResponse.data.data;
    } catch (exception) {
      response = ApiCall.handleCatch(exception);
    }
    return response;
  },
  /**
   *
   * @param data
   * @returns {Promise<{success: boolean}>}
   */
  addStudentToGroupPeriod: async (data) => {
    let response = { success: true };
    const method = "agregar-alumno-grupo-periodo-historico";
    try {
      const apiResponse = await ApiCall.post(method, "", data, true);
      response.students = apiResponse.data.data;
    } catch (exception) {
      response = ApiCall.handleCatch(exception);
    }
    return response;
  },
  getStudentsByGroupFromLastSemester: async (data) => {
    let response = { success: true };
    const method = "grupo/seleccion";
    try {
      const apiResponse = await ApiCall.post(phpController, method, data, true);
      response.students = apiResponse(apiResponse.data.data);
    } catch (exception) {
      response = ApiCall.handleCatch(exception);
    }
    return response;
  },
  getStudentsBySchoolCareerSemester: async (data) => {
    let response = { success: true };
    const method = "filtrar";
    try {
      const apiResponse = await ApiCall.post(phpController, method, data, true);
      response.data = apiResponse.data.data;
    } catch (exception) {
      response = ApiCall.handleCatch(exception);
    }
    return response;
  },
  getStudentsBySchoolGroup: async (data) => {
    let response = { success: true };
    const method = "filtrar/candidato/recursamiento";
    try {
      const apiResponse = await ApiCall.post(phpController, method, data, true);
      response.data = apiResponse.data.data;
    } catch (exception) {
      response = ApiCall.handleCatch(exception);
    }
    return response;
  },
  getStudentsToExtraExam: async (data) => {
    let response = { success: true };
    const method = "filtrar/candidato/extraordinario";
    try {
      const apiResponse = await ApiCall.post(phpController, method, data, true);
      response.data = apiResponse.data.data;
    } catch (exception) {
      response = ApiCall.handleCatch(exception);
    }
    return response;
  },
  getStudentByCurp: async (curp) => {
    let response = { success: true };
    const method = `curp/${curp}`;
    try {
      const apiResponse = await ApiCall.get(phpController, method, true);
      response.student = apiResponse.data.data;
    } catch (exception) {
      response = ApiCall.handleCatch(exception);
    }
    return response;
  },
  studentRegistration: async (data) => {
    let response = { success: true };
    try {
      const apiResponse = await ApiCall.post(phpController, "", data, true);
      response.data = apiResponse.data;
    } catch (error) {
      response = ApiCall.handleCatch(error);
    }
    return response;
  },
  studentEdit: async (studentId, data = new FormData()) => {
    let response = { success: true };
    data.append("_method", "PUT");
    try {
      const apiResponse = await ApiCall.post(
        phpController,
        studentId,
        data,
        true
      );
      response.data = apiResponse.data;
    } catch (error) {
      response = ApiCall.handleCatch(error);
    }
    return response;
  },
  studentWithdraw: async (studentId) => {
    let response = { success: true };
    try {
      const apiResponse = await ApiCall.delete("baja-alumno", studentId, true);
      response.data = apiResponse.data;
    } catch (error) {
      response = ApiCall.handleCatch(error);
    }
    return response;
  },
  deleteStudent: async (studentId) => {
    let response = { success: true };
    try {
      const apiResponse = await ApiCall.delete(phpController, studentId, true);
      response.data = apiResponse.data;
    } catch (error) {
      response = ApiCall.handleCatch(error);
    }
    return response;
  },
  uacSignaturesFromIrregularStudentById: async (id) => {
    let response = { success: true };
    try {
      const apiResponse = await ApiCall.get("uac-alumno-irregular", id, true);
      response.data = apiResponse.data.data;
    } catch (error) {
      response = ApiCall.handleCatch(error);
    }
    return response;
  },
  getAvailableGroupsByStudentIdAndUacId: async (studentId, uacId) => {
    let response = { success: true };
    try {
      const apiResponse = await ApiCall.post(
        "grupos-periodos-por-carrera-uac",
        "",
        {
          alumno_id: studentId,
          carrera_uac_id: uacId,
        },
        true
      );
      response.data = apiResponse.data.data;
    } catch (error) {
      response = ApiCall.handleCatch(error);
    }
    return response;
  },
  enrollStudentToASignature: async (studentId, groupPeriodId, uacId) => {
    let response = { success: true };
    try {
      const apiResponse = await ApiCall.post(
        "inscripcion-alumno-irregular-asignatura",
        "",
        {
          alumno_id: studentId,
          grupo_periodo_id: groupPeriodId,
          carrera_uac_id: uacId,
        },
        true
      );
      response.data = apiResponse.data;
    } catch (error) {
      response = ApiCall.handleCatch(error);
    }
    return response;
  },
  getUacFromIrregularStudents: async (studentId) => {
    let response = { success: true };
    try {
      const apiReponse = await ApiCall.get(
        "uac-inscrito-alumno-irregular",
        studentId,
        true
      );
      response.data = apiReponse.data.data;
      response.message = apiReponse.data.message;
    } catch (error) {
      response = ApiCall.handleCatch(error);
    }
    return response;
  },

  getStudentsToGraduateBySchool: async (schoolId) => {
    let response = { success: true };
    try {
      const apiResponse = await ApiCall.get(
        "alumnos-por-egresar",
        schoolId,
        true
      );
      response.data = apiResponse.data.data;
      response.message = apiResponse.data.message;
    } catch (error) {
      response = ApiCall.handleCatch(error);
    }
    return response;
  },
  addStudentSubjectsRow: async (form, curp) => {
    if (!form) form = {};
    if (!curp) curp = "";
    let response = { success: true };
    const method = `addSubjectRow/${curp}`;
    try {
      const apiReponse = await ApiCall.post(controller, method, form);
      response.message = apiReponse.message;
    } catch (error) {
      response = ApiCall.handleCatch(error);
    }
    return response;
  },
  /**
   *
   * @param {Array} studentsId
   * @returns
   */
  syncStudentsGradesForCertificates: async (studentsId, periods) => {
    let response = { success: true };
    try {
      const apiResponse = await ApiCall.post(
        "sincronizar-calificaciones-para-certificado",
        "",
        { alumnos: studentsId, ...periods },
        true
      );
      response.message = apiResponse.data.message;
    } catch (error) {
      response = ApiCall.handleCatch(error);
    }
    return response;
  },
  studentFormatDownloads: async ({ stateId, schoolId, generation }) => {
    if (!stateId) stateId = 0;
    if (!schoolId) schoolId = 0;
    if (!generationCatalog) generationCatalog = "";

    let response = { success: true };
    let method = `formatdownload`;

    try {
      const apiResponse = await ApiCall.post(controller, method, {
        stateId,
        schoolId,
        generation,
      });
      response.studentFormat = apiResponse.data;
    } catch (error) {
      response = ApiCall.handleCatch(error);
      response.studentFormat = [];
    }
    return response;
  },
  getRevalidationGradesFromStudent: async (studentId) => {
    let response = { success: true };
    try {
      const apiResponse = await ApiCall.get(
        "calificaciones-alumno-revalidacion",
        studentId,
        true
      );
      response.data = apiResponse?.data?.data;
    } catch (error) {
      response = ApiCall.handleCatch(error);
      response.data = [];
    }
    return response;
  },
  getAcademicRecordFromStudent: async (studentId) => {
    let response = { success: true };
    try {
      const apiResponse = await ApiCall.get(
        "calificaciones-alumno",
        studentId,
        true
      );
      response.data = apiResponse?.data?.data;
    } catch (error) {
      response = ApiCall.handleCatch(error);
      response.data = [];
    }
    return response;
  },
  deleteGradeFromAcademicRecord: async (params) => {
    let response = { success: true };
    try {
      const apiResponse = await ApiCall.post(
        "calificaciones-alumno-eliminar",
        "",
        params,
        true
      );
      response.data = apiResponse.data;
    } catch (error) {
      response = ApiCall.handleCatch(error);
    }
    return response;
  },
  deleteGradeFromAcademicRecordById: async (studentId, params) => {
    let response = { success: true };
    try {
      const apiResponse = await ApiCall.post(
        "calificacion-alumno-eliminar",
        studentId,
        params,
        true
      );
      response.data = apiResponse.data;
    } catch (error) {
      response = ApiCall.handleCatch(error);
    }
    return response;
  },
  editAcademicRecordFromStudent: async (studentId, data) => {
    let response = { success: true };
    try {
      const apiResponse = await ApiCall.put(
        "calificaciones-alumno",
        studentId,
        data,
        true
      );
      response.data = apiResponse.data;
    } catch (error) {
      response = ApiCall.handleCatch(error);
    }
    return response;
  },
  addSubjectAcademicRecord: async (studentId, data) => {
    let response = { success: true };
    try {
      const apiResponse = await ApiCall.post(
        "calificaciones-alumno",
        studentId,
        data,
        true
      );
      response.data = apiResponse.data;
    } catch (error) {
      response = ApiCall.handleCatch(error);
    }
    return response;
  },
  editStudentRevalidationGrades: async (grades, studentId) => {
    let response = { success: true };
    try {
      const apiResponse = await ApiCall.post(
        "calificaciones-alumno-revalidacion",
        studentId,
        { calificaciones: grades },
        true
      );
      response.message = apiResponse.data.message;
    } catch (error) {
      response = ApiCall.handleCatch(error);
    }
    return response;
  },
  removeStudentFromGroups: async (studentId, groupPeriodId) => {
    let response = { success: true };
    try {
      const apiResponse = await ApiCall.post(
        "quitar-de-grupo",
        studentId,
        {
          grupo_periodo_id: groupPeriodId,
        },
        true
      );
      response.message = apiResponse.data.message;
    } catch (e) {
      response = ApiCall.handleCatch(e);
    }
    return response;
  },
  generateStudentIdById: async (studentId) => {
    let response = { success: true };
    try {
      const apiResponse = await ApiCall.get(
        "credencial-alumno",
        studentId,
        true,
        {
          responseType: "blob",
          "Content-Type": "application/pdf",
        }
      );
      response.data = apiResponse.data;
    } catch (error) {
      response = ApiCall.handleCatchBlob(error);
    }
    return response;
  },
  generateStudentIdsByGroupPeriod: async (groupPeriodId) => {
    let response = { success: true };
    try {
      const apiResponse = await ApiCall.get(
        "credencial-grupo",
        groupPeriodId,
        true,
        {
          responseType: "blob",
          "Content-Type": "application/pdf",
        }
      );
      response.data = apiResponse.data;
    } catch (error) {
      response = ApiCall.handleCatchBlob(error);
    }
    return response;
  },
  updateScoreStudent: async (form) => {
    if (!form) form = {};
    let response = { success: true, message: "" };
    let method = "updateScoreStudent";
    try {
      const apiReponse = await ApiCall.post(controller, method, form);
      response.message = apiReponse.data;
    } catch (error) {
      response = ApiCall.handleCatch(error);
    }
    return response;
  },
  updateCreditsStudent: async (form) => {
    if (!form) form = {};
    let response = { success: true };
    let method = "updateCreditsStudent";
    try {
      const apiResponse = await ApiCall.post(controller, method, form);
      response.message = apiResponse.data;
    } catch (error) {
      response = ApiCall.handleCatch(error);
    }
    return response;
  },
  /**
   *
   * @param {Object<{ids: number[], fecha_nacimiento: boolean, domicilio: boolean, telefono: boolean, email: boolean, sexo: boolean}>} data
   * @returns {Promise<{success: boolean, data?:Blob}>}
   */
  getStudentReport: async (data) => {
    let response = { success: true };
    try {
      const apiResponse = await ApiCall.post(
        "reporte-alumnos-filtro",
        "",
        data,
        true,
        {
          responseType: "blob",
        }
      );
      response.data = apiResponse.data;
    } catch (e) {
      response = ApiCall.handleCatchBlob(e);
    }
    return response;
  },

  deleteScoreStudent: async (form) => {
    if (!form) form = {};
    if (!form.partialId) form.partialId = 0;
    let response = { success: true };
    let method = `deleteScoreStudent`;
    try {
      const apiResponse = await ApiCall.post(controller, method, form);
      response.message = apiResponse.data;
    } catch (error) {
      response = ApiCall.handleCatch(error);
    }
    return response;
  },
  /**
   * Constancia por alumno
   * @param studentId
   * @returns {Promise<{success: boolean, data?:Blob}>}
   */
  studentDocumentProof: async (studentId, data) => {
    let response = { success: true };
    try {
      const apiResponse = await ApiCall.post("constancia", studentId, data, true, {
        responseType: "blob",
      });
      response.data = apiResponse.data;
    } catch (e) {
      response = ApiCall.handleCatchBlob(e);
    }
    return response;
  },
  /**
   * Boleta por alumno
   * @param studentId
   * @returns {Promise<{success: boolean, data?:Blob}>}
   */
  studentReportCard: async (studentId) => {
    let response = { success: true };
    try {
      const apiResponse = await ApiCall.get(
        "boleta-por-alumno",
        studentId,
        true,
        {
          responseType: "blob",
        }
      );
      response.data = apiResponse.data;
    } catch (error) {
      response = ApiCall.handleCatchBlob(error);
    }
    return response;
  },
  getStudentImage: async (curp) => {
    let response = { success: true };
    try {
      const apiResponse = await ApiCall.get(
        phpController,
        `foto/${curp}`,
        true,
        {
          responseType: "blob",
        }
      );
      response.data = apiResponse.data;
    } catch (e) {
      response = ApiCall.handleCatchBlob(e);
    }
    return response;
  },
  /**
   *
   * @param {Array<number>} studentsIds
   * @returns {Promise<{success: boolean, data?:Blob, message?:string}>}
   */
  studentPopulationReport: async (studentsIds) => {
    let response = { success: true };
    try {
      const apiResponse = await ApiCall.post(
        "reporte-poblacion-alumnos",
        "",
        {
          ids: studentsIds,
        },
        true,
        {
          responseType: "blob",
        }
      );
      response.data = apiResponse.data;
    } catch (e) {
      response = ApiCall.handleCatchBlob(e);
    }
    return response;
  },
  /**
   *
   * @param studentId
   * @returns {Promise<{success: boolean}>}
   */
  studentAllSemestersReportCard: async (studentId) => {
    let response = { success: true };
    try {
      const apiResponse = await ApiCall.get(
        "boletas-por-alumno",
        studentId,
        true,
        {
          responseType: "blob",
          "Content-Type": "application/pdf",
        }
      );
      response.data = apiResponse.data;
    } catch (error) {
      response = ApiCall.handleCatchBlob(error);
    }
    return response;
  },
  studentRecordSelect: async (curp) => {
    if (!curp) curp = "";
    let response = { success: true };
    const method = `studentRecord/${curp}`;
    try {
      const apiResponse = await ApiCall.get(controller, method);
      response.dataRecord = apiResponse.data;
    } catch (error) {
      response = ApiCall.handleCatch(error);
      response.dataRecord = {};
    }
    return response;
  },
  selectRecordCourse: async (recordId) => {
    if (!recordId) recordId = 0;
    let response = { success: true };
    const method = `selectRecordCourse/${recordId}`;
    try {
      const apiResponse = await ApiCall.get(controller, method);
      response.dataCourse = apiResponse.data;
    } catch (error) {
      response = ApiCall.handleCatch(error);
      response.dataCourse = [];
    }
    return response;
  },
  returnCourseRecors: async (subjects, studentId) => {
    if (!subjects) subjects = [];
    if (!studentId) studentId = 0;
    let response = { success: true, message: "" };
    const method = `returnCourseRecors/${studentId}`;
    try {
      const apiResponse = await ApiCall.post(controller, method, subjects);
      response.message = apiResponse.data;
    } catch (error) {
      response = ApiCall.handleCatch(error);
    }
    return response;
  },
  selectIssuedCertificates: async (curp, certificateType) => {
    if (!curp) curp = 0;
    if (!certificateType) certificateType = 0;
    let response = { success: true };
    const method = `selectIssuedCertificates/${curp}/${certificateType}`;
    try {
      const apiResponse = await ApiCall.get(controller, method);
      response.dataStudent = apiResponse.data;
    } catch (error) {
      response = ApiCall.handleCatch(error);
      response.dataStudent = {};
    }
    return response;
  },
  deleteRowRecord: async (subjects, studentId) => {
    if (!subjects) subjects = [];
    if (!studentId) studentId = 0;
    let response = { success: true, message: "" };
    const method = `deleteRowRecord/${studentId}`;
    try {
      const apiReponse = await ApiCall.post(controller, method, subjects);
      response.message = apiReponse.data;
    } catch (error) {
      response = ApiCall.handleCatch(error);
    }
    return response;
  },
  studentSearch1Filter: async (searchText, stateId) => {
    if (!searchText) searchText = "";
    let response = { success: true };

    const method = `searchStudentText/${searchText}/${stateId}`;

    try {
      const apiResponse = await ApiCall.get(controller, method);
      response.studentList = apiResponse.data;
    } catch (error) {
      response = ApiCall.handleCatch(error);
      response.studentList = [];
    }
    return response;
  },
  changeStatus: async (curp,status) => {
    let response = { success: true };
    if(status==1){
      status=status=1;
    }else{
      status=status=0;
    }
    
    const method = `changeStatus/${curp}/${status}`;

    try {
      const apiResponse = await ApiCall.get(controller, method);
      response.studentList = apiResponse.data;
    } catch (error) {
      response = ApiCall.handleCatch(error);
      response.studentList = [];
    }
    return response;
  },  
  studentSearch2: async (stateId, schoolId, careerId, studentStatusId, generation, searchText) => {
    if (!stateId) stateId = 0;
    if (!schoolId) schoolId = 0;
    if (!careerId) careerId = 0;
    if (!studentStatusId) studentStatusId = 0;
    if (!searchText) searchText = ""; 
    if (!generation) generation = "";

    let response = { success: true };

    const method = `?stateId=${stateId}&&schoolId=${schoolId}&&careerId=${careerId}&&studentStatusId=${studentStatusId}&&searchText=${searchText}&&generation=${generation}&&`;

    try {
      const apiResponse = await ApiCall.get(controller, method);
      response.studentList = apiResponse.data;
    } catch (error) {
      response = ApiCall.handleCatch(error);
      response.studentList = [];
    }
    return response;
  },    
};
