export const UPDATE_TEACHER = "TEACHERS/UPDATE_TEACHER";

/*
 * Registro de accion de redux
 * @param {Array} group Payload de la función
 * @returns {Object} Objecto con tipo y payload
	* */
export function updateGroupFromSearch(teacher) {
	return {
		type: UPDATE_TEACHER,
		teacher
	}
}
