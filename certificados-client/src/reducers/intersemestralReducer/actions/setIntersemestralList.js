export const SET_INTERSEMESTRAL_LIST = "INTERSEMESTRAL/SET_INTERSEMESTRAL_LIST";
/*
 * Registro de accion de redux
 * @param {Array} group Payload de la función
 * @returns {Object} Objecto con tipo y payload
	* */
export function setIntersemestralList(intersemestral) {
	return {
		type: SET_INTERSEMESTRAL_LIST,
		intersemestral	
	}
}

