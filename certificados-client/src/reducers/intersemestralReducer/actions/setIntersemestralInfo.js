export const SET_INTERSEMESTRAL_INFO = "INTERSEMESTRAL/SET_INTERSEMESTRAL_INFO";
/*
 * Registro de accion de redux
 * @param {Array} group Payload de la función
 * @returns {Object} Objecto con tipo y payload
	* */
export function setIntersemestralInfo(intersemestralInfo) {
	return {
		type: SET_INTERSEMESTRAL_INFO,
		intersemestralInfo	
	}
}

