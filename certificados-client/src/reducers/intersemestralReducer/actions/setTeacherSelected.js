export const SET_TEACHER_SELECTED = "INTERSEMESTRAL/SET_TEACHER_SELECTED";
/*
 * Registro de accion de redux
 * @param {Array} group Payload de la función
 * @returns {Object} Objecto con tipo y payload
	* */
export function setTeacherSelected(params) {
	return {
		type: SET_TEACHER_SELECTED,
		params
	}
}

