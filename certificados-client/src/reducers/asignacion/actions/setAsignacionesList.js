export const SET_ASIGNACIONES_LIST = "ASIGNACION/SET_ASIGNACIONES_LIST";

/*
 * Registro de accion de redux
 * @param {Array} group Payload de la función
 * @returns {Object} Objecto con tipo y payload
	* */

export function setAsignacionesList(data) {
	return {
		type: SET_ASIGNACIONES_LIST,
		data
	}
}
