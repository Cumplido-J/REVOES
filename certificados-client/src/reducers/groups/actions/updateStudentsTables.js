export const UPDATE_STUDENTS_TABLE = "GROUPS/UPDATE_STUDENTS_TABLE";

/*
 * Registro de accion de redux
 * @param {Array} group Payload de la función
 * @returns {Object} Objecto con tipo y payload
 * */
export function updateStudentsTable(filteredStudents, addedStudents) {
  return {
    type: UPDATE_STUDENTS_TABLE,
    filteredStudents,
    addedStudents
  };
}
