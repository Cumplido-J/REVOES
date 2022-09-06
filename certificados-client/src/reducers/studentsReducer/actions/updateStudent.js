export const UPDATE_STUDENT_SEARCH_TABLE =
  "STUDENTS/UPDATE_STUDENT_SEARCH_TABLE";

export function updateStudentSearchTable(student) {
  return {
    type: UPDATE_STUDENT_SEARCH_TABLE,
    student,
  };
}
