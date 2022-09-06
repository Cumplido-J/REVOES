export const SET_ACADEMIC_RECORD_LIST = "ACADEMIC_RECORD/SET_ACADEMIC_RECORD_LIST";

/*
 * Registro de accion de redux
 * @param {Array} group Payload de la función
 * @returns {Object} Objecto con tipo y payload
	* */

export function setAcademicRecordList(data) {
	return {
		type: SET_ACADEMIC_RECORD_LIST,
		data
	}
}
