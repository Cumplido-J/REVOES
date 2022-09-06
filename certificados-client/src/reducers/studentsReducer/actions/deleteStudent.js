export const DELETE_STUDENT_SEARCH_TABLE =
  "STUDENTS/DELETE_STUDENT_SEARCH_TABLE";

export function deleteStudentSearchTable(student) {
  return {
    type: DELETE_STUDENT_SEARCH_TABLE,
    student,
  };
}
