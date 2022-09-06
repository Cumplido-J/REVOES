export const UPDATE_GROUP = "GROUPS/UPDATE_GROUP";

/*
 * Registro de accion de redux
 * @param {Array} group Payload de la función
 * @returns {Object} Objecto con tipo y payload
	* */
export function updateGroupFromSearch(group) {
	return {
		type: UPDATE_GROUP,
		group
	}
}
