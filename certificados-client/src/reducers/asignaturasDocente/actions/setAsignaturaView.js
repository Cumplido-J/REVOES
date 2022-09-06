export const SET_ASIGNATURA_VIEW = "ASIGNATURAS_DOCENTE/SET_ASIGNATURA_VIEW";

/*
 * Registro de accion de redux
 * @param {Array} group Payload de la función
 * @returns {Object} Objecto con tipo y payload
	* */

export function setAsignaturaView(data) {
	return {
		type: SET_ASIGNATURA_VIEW,
		data
	}
}
