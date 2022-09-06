export const SET_CURSE_TYPE_SELECTED = "INTERSEMESTRAL/SET_CURSE_TYPE_SELECTED";

/*
 * Registro de accion de redux
 * @param {Array} group Payload de la función
 * @returns {Object} Objecto con tipo y payload
	* */

export function setCurseTypeSelected(data) {
	return {
		type: SET_CURSE_TYPE_SELECTED,
		data
	}
}
