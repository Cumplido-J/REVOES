export const DISABLE_TEACHER = "TEACHERS/DISABLE_TEACHER";

/*
 * Registro de accion de redux
 * @param {Array} group Payload de la función
 * @returns {Object} Objecto con tipo y payload
	* */
export function disableTeacher(id) {
	return {
		type: DISABLE_TEACHER,
		id
	}
}
