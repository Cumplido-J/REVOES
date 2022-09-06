export const SET_ASIGNACION = "ASIGNACION/SET_ASIGNACION";

/*
 * Registro de accion de redux
 * @param {Array} group Payload de la función
 * @returns {Object} Objecto con tipo y payload
	* */

export function setAsignacionView(data) {
	return {
		type: SET_ASIGNACION,
		data
	}
}
