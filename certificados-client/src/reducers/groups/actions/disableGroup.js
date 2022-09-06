export const DISABLE_GROUP = "GROUPS/DISABLE_GROUP";

/*
 * Registro de accion de redux
 * @param {Array} group Payload de la función
 * @returns {Object} Objecto con tipo y payload
	* */
export function disableGroup(id) {
	return {
		type: DISABLE_GROUP,
		id
	}
}
