import { SET_TEACHERS_LIST } from "./actions/setTeachers";
import { VIEW_TEACHER_ID } from "./actions/setTeacherView";
import { VIEW_TEACHER } from "./actions/setTeacherView";
import { DISABLE_TEACHER } from "./actions/disableTeacher";
import { PRESERVE_FILTERS, USE_SAVED_FORM } from "./actions/preserveFilters";
import { UPDATE_TEACHER } from "./actions/updateTeacher";

const initialState = {
  teacherId: null,
  teacherInfo: null,
  teachersList: [],
  teachersPlantillaList: [],
  form: {
    stateId: null,
    plantel_id: null,
    carrera_id: null,
    periodo_id: null,
    semestre: null,
  },
  useSavedForm: true,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_TEACHERS_LIST:
      let lista = [];
      action.teachers.forEach((t) => {
        lista.push({
          id: t.id,
          docente_asignacion_id: t.docente_plantilla ? t.docente_plantilla[0].id : null,
          nombre: t.nombre,
          primer_apellido: t.primer_apellido,
          segundo_apellido: t.segundo_apellido ? t.segundo_apellido : "",
          fecha_ingreso: t.fecha_ingreso,
          telefono: t.telefono,
          curp: t.curp,
          cedula: t.cedula ? t.cedula : "No disponible",
          docente_estatus: t.docente_estatus,
          estatus: t.docente_estatus === 1 ? "Activo" : "Inactivo",
        });
      });
      return {
        ...state,
        teachersList: lista,
      };
    case VIEW_TEACHER_ID:
      let teacher = action.teacher;
      return {
        ...state,
        teacherId: teacher,
      };
    case VIEW_TEACHER:
      let teacherInf = action.teacher;
      return {
        ...state,
        teacherInfo: teacherInf,
      };
    case DISABLE_TEACHER:
      return {
        ...state,
        teachersList: state.teachersList.map((t) =>
          t.id === action.id ? { ...t, profesor: [] } : t
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
    case UPDATE_TEACHER:
      return {
        ...state,
        teachersList: state.teachersList.map((teacher) =>
          teacher.id === action.teacher.id
            ? { ...teacher, ...action.teacher }
            : teacher
        ),
      };
    default:
      return state;
  }
}
