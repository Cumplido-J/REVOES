export const SET_TEACHERS_LIST = "TEACHERS/SET_TEACHERS_LIST";
/*
 * Registro de accion de redux
 * @param {Array} group Payload de la función
 * @returns {Object} Objecto con tipo y payload
	* */
export function setTeachersList(teachers) {
	return {
		type: SET_TEACHERS_LIST,
		teachers	
	}
}

