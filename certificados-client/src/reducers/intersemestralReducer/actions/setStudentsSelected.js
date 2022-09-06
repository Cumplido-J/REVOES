export const SET_STUDENTS_SELECTED_LIST = "INTERSEMESTRAL/SET_STUDENTS_SELECTED_LIST";
/*
 * Registro de accion de redux
 * @param {Array} group Payload de la función
 * @returns {Object} Objecto con tipo y payload
	* */
export function setStudentsSelected(studentsSelected) {
	return {
		type: SET_STUDENTS_SELECTED_LIST,
		studentsSelected	
	}
}

