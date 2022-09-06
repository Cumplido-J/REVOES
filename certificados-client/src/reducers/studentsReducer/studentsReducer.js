import { SET_STUDENTS_SEARCH_TABLE } from "./actions/setStudentsSearchTable";
import { UPDATE_STUDENT_SEARCH_TABLE } from "./actions/updateStudent";
import { DELETE_STUDENT_SEARCH_TABLE } from "./actions/deleteStudent";

const initialState = {
  studentsSearchTable: [],
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_STUDENTS_SEARCH_TABLE:
      return {
        ...state,
        studentsSearchTable: action.studentsArray,
      };
    case UPDATE_STUDENT_SEARCH_TABLE:
      return {
        ...state,
        studentsSearchTable: state.studentsSearchTable.map((student) =>
          student.usuario_id === action.student.usuario_id
            ? action.student
            : student
        ),
      };
    case DELETE_STUDENT_SEARCH_TABLE:
      return {
        ...state,
        studentsSearchTable: state.studentsSearchTable.filter(
          (student) => student.usuario_id !== action.student.usuario_id
        ),
      };
    default:
      return state;
  }
}
