export const SET_ASIGNATURAS_RECURSAMIENTO_SEMESTRAL_LIST = "ASIGNATURAS_RECURSAMIENTO_INTERSEMESTRAL/SET_ASIGNATURA_RECURSAMIENTO_SEMESTRAL_LIST";

/*
 * Registro de accion de redux
 * @param {Array} group Payload de la función
 * @returns {Object} Objecto con tipo y payload
	* */

export function setAsignaturasRecursamientoSemestralList(data) {
	return {
		type: SET_ASIGNATURAS_RECURSAMIENTO_SEMESTRAL_LIST,
		data
	}
}
