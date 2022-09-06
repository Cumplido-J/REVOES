import { SET_GROUPS_LIST } from "./actions/setGroups";
import { DISABLE_GROUP } from "./actions/disableGroup";
import { PRESERVE_FILTERS, USE_SAVED_FORM } from "./actions/preserveFilters";
import { UPDATE_GROUP } from "./actions/updateGroup";
import { UPDATE_STUDENTS_TABLE } from "./actions/updateStudentsTables";
import { SET_UNAPPROVED_GROUPS } from "./actions/setUnapprovedGroups";
import { DELETE_GROUP } from "./actions/deleteGroup";
import { DELETE_GROUP_FROM_UNAPPROVED } from "./actions/deleteFromUnapprovedTable";

const initialState = {
  groupsList: [],
  form: {
    stateId: null,
    plantel_id: null,
    carrera_id: null,
    periodo_id: null,
    semestre: null,
  },
  useSavedForm: true,
  currentPeriod: null,
  filteredStudents: [],
  addedStudents: [],
  unapprovedGroups: [],
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_GROUPS_LIST:
      return {
        ...state,
        groupsList: action.groups,
        currentPeriod: action.period ? action.period : state.currentPeriod,
      };
    case DELETE_GROUP:
      return {
        ...state,
        groupsList: state.groupsList.filter((g) => g.id !== action.id),
      };
    case DISABLE_GROUP:
      return {
        ...state,
        groupsList: state.groupsList.map((g) =>
          g.id === action.id ? { ...g, grupo_periodos: [] } : g
        ),
      };
    case PRESERVE_FILTERS:
      return {
        ...state,
        form: action.filters,
      };
    case USE_SAVED_FORM:
      return {
        ...state,
        useSavedForm: action.useSavedForm,
      };
    case UPDATE_GROUP:
      return {
        ...state,
        groupsList: state.groupsList.map((g) =>
          g.id === action.group.id ? { ...g, ...action.group } : g
        ),
      };
    case UPDATE_STUDENTS_TABLE:
      return {
        ...state,
        ...action.filteredStudents,
        ...action.addedStudents,
      };
    case SET_UNAPPROVED_GROUPS:
      return {
        ...state,
        unapprovedGroups: action.unapprovedGroups,
      };
    case DELETE_GROUP_FROM_UNAPPROVED:
      return {
        ...state,
        unapprovedGroups: state.unapprovedGroups.filter((g) => {
          console.log(g, action.group);
          console.log(
            g.id !== action.group.id,
            g.url !== action.group.url,
            g.accion !== action.group.accion
          );
          return !(
            g.id === action.group.id &&
            g.url === action.group.url &&
            g.accion === action.group.accion
          );
        }),
      };
    default:
      return state;
  }
}
