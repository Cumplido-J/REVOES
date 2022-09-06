export const SET_ASIGNATURAS_RECURSAMIENTO_INTERSEMESTRAL_LIST = "ASIGNATURAS_RECURSAMIENTO_INTERSEMESTRAL/SET_ASIGNATURA_RECURSAMIENTO_INTERSEMESTRAL_LIST";

/*
 * Registro de accion de redux
 * @param {Array} group Payload de la función
 * @returns {Object} Objecto con tipo y payload
	* */

export function setAsignaturasRecursamientoIntersemestralList(data) {
	return {
		type: SET_ASIGNATURAS_RECURSAMIENTO_INTERSEMESTRAL_LIST,
		data
	}
}
