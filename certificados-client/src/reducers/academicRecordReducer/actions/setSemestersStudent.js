export const SET_SEMESTERS_STUDENT_LIST = "ACADEMIC_RECORD/SET_SEMESTERS_STUDENT_LIST";

/*
 * Registro de accion de redux
 * @param {Array} group Payload de la función
 * @returns {Object} Objecto con tipo y payload
	* */

export function setSemestersStudentList(data) {
	return {
		type: SET_SEMESTERS_STUDENT_LIST,
		data
	}
}
