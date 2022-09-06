import StudentApi from "../api/StudentApi";

import Alerts from "../shared/alerts";

export default {
  studentSearch: async (values) => {
    const response = await StudentApi.studentSearch(values);
    if (!response.success)
      Alerts.error("Ha ocurrido un error", response.message);
    return response;
  },
  getStudentData: async (curp) => {
    const response = await StudentApi.getStudentData(curp);
    if (!response.success)
      Alerts.error("Ha ocurrido un error", response.message);
    return response;
  },
  addStudent: async (form) => {
    const response = await StudentApi.addStudent(form);
    if (!response.success)
      Alerts.error("Ha ocurrido un error", response.message);
    return response;
  },
  addStudentToGroupPeriod: async (form) => {
    const response = await StudentApi.addStudentToGroupPeriod(form);
    if (!response.success)
      Alerts.error("Ha ocurrido un error", response.message);
    return response;
  },
  editStudent: async (curp, form) => {
    const response = await StudentApi.editStudent(curp, form);
    if (!response.success)
      Alerts.error("Ha ocurrido un error", response.message);
    return response;
  },
  editStudentPassword: async (curp, form) => {
    const response = await StudentApi.editStudentPassword(curp, form);
    if (!response.success)
      Alerts.error("Ha ocurrido un error", response.message);
    return response;
  },
  editStudentModules: async (curp, form) => {
    const response = await StudentApi.editStudentModules(curp, form);
    if (!response.success)
      Alerts.error("Ha ocurrido un error", response.message);
    return response;
  },
  getStudentModules: async (curp) => {
    const response = await StudentApi.getStudentModules(curp);
    if (!response.success)
      Alerts.error("Ha ocurrido un error", response.message);
    return response;
  },
  getStudentSubjects: async (curp) => {
    const response = await StudentApi.getStudentSubjects(curp);
    if (!response.success)
      Alerts.error("Ha ocurrido un error", response.message);
    return response;
  },
  getAvailableStudentSubjects: async (curp) => {
    const response = await StudentApi.getAvailableStudentSubjects(curp);
    if (!response.success)
      Alerts.error("Ha ocurrido un error", response.message);
    return response;
  },
  addStudentSubjects: async (curp, form) => {
    const response = await StudentApi.addStudentSubjects(curp, form);
    if (!response.success)
      Alerts.error("Ha ocurrido un error", response.message);
    return response;
  },
  getStudentsByGroupPeriod: async (data) => {
    const response = await StudentApi.getStudentsByGroupPeriod(data);
    if (!response || !response.success)
      Alerts.error("Ha ocurrido un error", response.message);
    return response;
  },
  getStudentsByGroupFromLastSemester: async (data) => {
    const response = await StudentApi.getStudentsByGroupFromLastSemester(data);
    if (!response || !response.success)
      Alerts.error("Ha ocurrido un error", response.message);
    return response;
  },
  getStudentsBySchoolCareerSemester: async (data) => {
    const response = await StudentApi.getStudentsBySchoolCareerSemester(data);
    if (!response || !response.success)
      Alerts.error("Ha ocurrido un error", response.message);
    return response;
  },
  getStudentsBySchoolGroup: async (data) => {
    const response = await StudentApi.getStudentsBySchoolGroup(data);
    if (!response || !response.success)
      Alerts.error("Ha ocurrido un error", response.message);
    return response;
  },
  getStudentsToExtraExam: async (data) => {
    const response = await StudentApi.getStudentsToExtraExam(data);
    if (!response || !response.success)
      Alerts.error("Ha ocurrido un error", response.message);
    return response;
  },
  getStudentByCurp: async (curp) => {
    const response = await StudentApi.getStudentByCurp(curp);
    if (!response || !response.success)
      Alerts.error("Ha ocurrido un error", response.message);
    return response;
  },
  studentRegistration: async (data) => {
    const response = await StudentApi.studentRegistration(data);
    if (!response || !response.success)
      Alerts.error("Ha ocurrido un error", response.message);
    return response;
  },
  studentEdit: async (studentId, data) => {
    const response = await StudentApi.studentEdit(studentId, data);
    if (!response || !response.success)
      Alerts.error("Ha ocurrido un error", response.message);
    return response;
  },
  studentWithdraw: async (studentId) => {
    const response = await StudentApi.studentWithdraw(studentId);
    if (!response || !response.success)
      Alerts.error("Ha ocurrido un error", response.message);
    return response;
  },
  deleteStudent: async (studentId) => {
    const response = await StudentApi.deleteStudent(studentId);
    if (!response || !response.success)
      Alerts.error("Ha ocurrido un error", response.message);
    return response;
  },
  uacSignaturesFromIrregularStudentById: async (id) => {
    const response = await StudentApi.uacSignaturesFromIrregularStudentById(id);
    if (!response || !response.success)
      Alerts.error("Ha ocurrido un error", response.message);
    return response;
  },
  getAvailableGroupsByStudentIdAndUacId: async (studentId, uacId) => {
    const response = await StudentApi.getAvailableGroupsByStudentIdAndUacId(
      studentId,
      uacId
    );
    if (!response || !response.success)
      Alerts.error("Ha ocurrido un error", response.message);
    return response;
  },
  enrollStudentToASignature: async (studentId, groupPeriodId, uacId) => {
    const response = await StudentApi.enrollStudentToASignature(
      studentId,
      groupPeriodId,
      uacId
    );
    if (!response || !response.success)
      Alerts.error("Ha ocurrido un error", response.message);
    return response;
  },
  getUacFromIrregularStudents: async (studentId) => {
    const response = await StudentApi.getUacFromIrregularStudents(studentId);
    if (!response || !response.success)
      Alerts.error("Ha ocurrido un error", response.message);
    return response;
  },

  getStudentsToGraduateBySchool: async (schoolId) => {
    const response = await StudentApi.getStudentsToGraduateBySchool(schoolId);
    if (!response || !response.success) {
      Alerts.error("Ha ocurrido un error", response.message);
    }
    return response;
  },
  addStudentSubjectsRow: async (values, curp) => {
    const response = await StudentApi.addStudentSubjectsRow(values, curp);
    if (!response.success)
      Alerts.error("has ocurrido un error", response.message);
    return response;
  },
  /**
   *
   * @param {Array} studentsId
   * @returns
   */
  syncStudentsGradesForCertificates: async (studentsId, periods) => {
    const response = await StudentApi.syncStudentsGradesForCertificates(
      studentsId,
      periods
    );
    if (!response || !response.success)
      Alerts.error("Ha ocurrido un error", response.message);
    return response;
  },

  studentFormatDownload: async (values) => {
    const response = await StudentApi.studentFormatDownloads(values);
    if (!response.success)
      Alerts.error("Ha ocurrido un error", response.message);
    return response;
  },
  getRevalidationGradesFromStudent: async (studentId) => {
    const response = await StudentApi.getRevalidationGradesFromStudent(
      studentId
    );
    if (!response.success)
      Alerts.error("Ha ocurrido un error", response.message);
    return response;
  },
  getAcademicRecordFromStudent: async (studentId) => {
    const response = await StudentApi.getAcademicRecordFromStudent(studentId);
    if (!response.success)
      Alerts.error("Ha ocurrido un error", response.message);
    return response;
  },
  editAcademicRecordFromStudent: async (studentId, data) => {
    const response = await StudentApi.editAcademicRecordFromStudent(
      studentId,
      data
    );
    if (!response.success)
      Alerts.error("Ha ocurrido un error", response.message);
    return response;
  },
  deleteGradeFromAcademicRecord: async (data) => {
    const response = await StudentApi.deleteGradeFromAcademicRecord(
      data
    );
    if (!response.success)
      Alerts.error("Ha ocurrido un error", response.message);
    return response;
  },
  deleteGradeFromAcademicRecordById: async (studentId, data) => {
    const response = await StudentApi.deleteGradeFromAcademicRecordById(
      studentId,
      data
    );
    if (!response.success)
      Alerts.error("Ha ocurrido un error", response.message);
    return response;
  },
  addSubjectAcademicRecord: async (studentId, data) => {
    const response = await StudentApi.addSubjectAcademicRecord(studentId, data);
    if (!response.success)
      Alerts.error("Ha ocurrido un error", response.message);
    return response;
  },
  editStudentRevalidationGrades: async (grades, studentId) => {
    const response = await StudentApi.editStudentRevalidationGrades(
      grades,
      studentId
    );
    if (!response.success)
      Alerts.error("Ha ocurrido un error", response.message);
    return response;
  },
  removeStudentFromGroups: async (studentId, groupPeriodId) => {
    const response = await StudentApi.removeStudentFromGroups(
      studentId,
      groupPeriodId
    );
    if (!response.success)
      Alerts.error("Ha ocurrido un error", response.message);
    return response;
  },
  generateStudentIdById: async (studentId) => {
    const response = await StudentApi.generateStudentIdById(studentId);
    if (!response.success)
      Alerts.error("Ha ocurrido un error", response.message);
    return response;
  },
  generateStudentIdsByGroupPeriod: async (groupPeriodId) => {
    const response = await StudentApi.generateStudentIdsByGroupPeriod(
      groupPeriodId
    );
    if (!response.success)
      Alerts.error("Ha ocurrido un error", response.message);
    return response;
  },
  updateScoreStudent: async (values) => {
    const response = await StudentApi.updateScoreStudent(values);
    if (!response.success)
      Alerts.error("Ha ocurrido un error", response.message);
    return response;
  },
  updateCreditsStudent: async (values) => {
    const response = await StudentApi.updateCreditsStudent(values);
    if (!response.success)
      Alerts.error("Ha ocurrido un error", response.message);
    return response;
  },
  /**
   *
   * @param {Object<{ids: number[], fecha_nacimiento: boolean, domicilio: boolean, telefono: boolean, email: boolean, sexo: boolean}>} data
   * @returns {Promise<{success: boolean, data?: Blob}>}
   */
  getStudentReport: async (data) => {
    let response = await StudentApi.getStudentReport(data);
    if (!response.success)
      Alerts.error("Ha ocurrido un error", response.message);
    return response;
  },
  deleteScoreStudent: async (values) => {
    const response = await StudentApi.deleteScoreStudent(values);
    if (!response.success)
      Alerts.error("Ha ocurrido un error", response.message);
    return response;
  },
  studentDocumentProof: async (studentId, data) => {
    const response = await StudentApi.studentDocumentProof(studentId, data);
    if (!response.success)
      Alerts.error("Ha ocurrido un error", response.message);
    return response;
  },
  studentReportCard: async (studentId) => {
    const response = await StudentApi.studentReportCard(studentId);
    if (!response.success)
      Alerts.error("Ha ocurrido un error", response.message);
    return response;
  },
  getStudentImage: async (curp) => {
    const response = await StudentApi.getStudentImage(curp);
    if (!response.success)
      console.error("Ha ocurrido un error", response.message);
    return response;
  },
  /**
   *
   * @param {Array<number>} studentsIds
   * @returns {Promise<{success: boolean, data?: Blob, message?: string}>}
   */
  studentPopulationReport: async (studentsIds) => {
    const response = await StudentApi.studentPopulationReport(studentsIds);
    if (!response.success)
      Alerts.error("Ha ocurrido un error", response.message);
    return response;
  },
  studentAllSemestersReportCard: async (studentsIds) => {
    const response = await StudentApi.studentAllSemestersReportCard(
      studentsIds
    );
    if (!response.success)
      Alerts.error("Ha ocurrido un error", response.message);
    return response;
  },
  studentRecordSelect: async (curp) => {
    const response = await StudentApi.studentRecordSelect(curp);
    if (!response.success) Alerts.error("Ha ocurrido un error", response.message);
    return response;
  },
  selectRecordCourse: async (recordId) => {
    const response = await StudentApi.selectRecordCourse(recordId);
    if (!response.success) Alerts.error("Ha ocurrido un error", response.message);
    return response;
  },
  returnCourseRecors: async (subjects, studentId) => {
    const response = await StudentApi.returnCourseRecors(subjects, studentId);
    if (!response.success) Alerts.error("Ha ocurrido un error", response.message);
    return response;
  },
  selectIssuedCertificates: async (curp, certificateType) => {
    const response = await StudentApi.selectIssuedCertificates(curp, certificateType);
    if (!response.success) Alerts.error("Ha ocurrido un error", response.message);
    return response;
  },
  deleteRowRecord: async (subjects, studentId) => {
    const response = await StudentApi.deleteRowRecord(subjects, studentId);
    if (!response.success) Alerts.error("Ha ocurrido un error", response.message);
    return response;
  },
  studentSearch1Filter: async (values, stateId) => {
    const response = await StudentApi.studentSearch1Filter(values, stateId);
    if (!response.success)
      Alerts.error("Ha ocurrido un error", response.message);
    return response;
  },
  changeStatus: async (curp, status) => {
    const response = await StudentApi.changeStatus(curp, status);
    if (!response.success)
      Alerts.error("Ha ocurrido un error", response.message);
    return response;
  },  
  studentSearch2: async (stateId, schoolId, careerId, studentStatusId, generation, searchText) => {
    const response = await StudentApi.studentSearch2(stateId, schoolId, careerId, studentStatusId, generation, searchText);
    if (!response.success)
      Alerts.error("Ha ocurrido un error", response.message);
    return response;
  },  
};
