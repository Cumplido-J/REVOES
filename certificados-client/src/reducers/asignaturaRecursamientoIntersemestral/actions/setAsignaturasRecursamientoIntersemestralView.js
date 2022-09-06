export const SET_ASIGNATURA_RECURSAMIENTO_INTERSEMESTRAL_VIEW = "ASIGNATURAS_RECURSAMIENTO_INTERSEMESTRAL/SET_ASIGNATURA_RECURSAMIENTO_INTERSEMESTRAL_VIEW";

/*
 * Registro de accion de redux
 * @param {Array} group Payload de la función
 * @returns {Object} Objecto con tipo y payload
	* */

export function setAsignaturaRecursamientoIntersemestralView(data) {
	return {
		type: SET_ASIGNATURA_RECURSAMIENTO_INTERSEMESTRAL_VIEW,
		data
	}
}
