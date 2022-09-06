export const SET_GROUPS_LIST = "GROUPS/SET_GROUP_LIST";

/*
 * Registro de accion de redux
 * @param {Array} group Payload de la función
 * @returns {Object} Objecto con tipo y payload
	* */
export function setGroupsList(groups, period) {
	return {
		type: SET_GROUPS_LIST,
		groups,
		period	
	}
}
