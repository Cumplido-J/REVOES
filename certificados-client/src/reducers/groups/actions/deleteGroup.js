export const DELETE_GROUP = "GROUPS/DELETE_GROUP";

/*
 * Registro de accion de redux
 * @param {Array} group Payload de la función
 * @returns {Object} Objecto con tipo y payload
	* */
export function deleteGroup(id) {
	return {
		type: DELETE_GROUP,
		id
	}
}
