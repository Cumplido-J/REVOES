export const SET_ASIGNATURAS_DOCENTE_LIST = "ASIGNATURAS_DOCENTE/SET_ASIGNATURAS_DOCENTE_LIST";

/*
 * Registro de accion de redux
 * @param {Array} group Payload de la función
 * @returns {Object} Objecto con tipo y payload
	* */

export function setAsignaturasDocenteList(data) {
	return {
		type: SET_ASIGNATURAS_DOCENTE_LIST,
		data
	}
}
