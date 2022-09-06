export const SET_STUDENTS_SEARCH_TABLE = "STUDENTS/SET_STUDENTS_SEARCH_TABLE";

export function setStudentsSearchTable(studentsArray) {
  return {
    type: SET_STUDENTS_SEARCH_TABLE,
    studentsArray: studentsArray.map((s) => ({ ...s, ...s.usuario })),
  };
}
