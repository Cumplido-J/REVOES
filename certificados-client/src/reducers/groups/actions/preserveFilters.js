export const PRESERVE_FILTERS = "GROUPS/PRESERVE_FILTERS";
export const USE_SAVED_FORM = "GROUPS/USE_SAVED_FORM";
/*
 * Registro de accion de redux
 * @param {Array} group Payload de la función
 * @returns {Object} Objecto con tipo y payload
	* */
export function saveForm(filters) {
	return {
		type: PRESERVE_FILTERS,
		filters
	}
}
export function useSavedForm(useSavedForm) {
	return {
		type: USE_SAVED_FORM,
		useSavedForm
	}
}
