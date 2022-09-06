export const SET_STUDENTS_LIST = "INTERSEMESTRAL/SET_STUDENTS_LIST";
/*
 * Registro de accion de redux
 * @param {Array} group Payload de la función
 * @returns {Object} Objecto con tipo y payload
	* */
export function setStudentsList(students) {
	return {
		type: SET_STUDENTS_LIST,
		students	
	}
}

