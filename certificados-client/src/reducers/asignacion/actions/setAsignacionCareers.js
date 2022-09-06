export const SET_ASIGNACION_CAREERS = "ASIGNACION/SET_ASIGNACION_CAREERS";

/*
 * Registro de accion de redux
 * @param {Array} group Payload de la función
 * @returns {Object} Objecto con tipo y payload
	* */

export function setAsignacionCareers(data) {
	return {
		type: SET_ASIGNACION_CAREERS,
		data
	}
}
