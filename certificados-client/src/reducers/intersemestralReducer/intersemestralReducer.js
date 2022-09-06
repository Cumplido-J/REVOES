import { SET_INTERSEMESTRAL_LIST } from "./actions/setIntersemestralList";
import { SET_TEACHER_SELECTED } from "./actions/setTeacherSelected";
import { SET_STUDENTS_LIST } from "./actions/setStudentsList";
import { SET_STUDENTS_SELECTED_LIST } from "./actions/setStudentsSelected";
import { SET_INTERSEMESTRAL_INFO } from "./actions/setIntersemestralInfo";
import { SET_CURSE_TYPE_SELECTED } from "./actions/setCurseTypeSelected";

const initialState = {
  intersemestralList: [],
  teacherSelectId: null,
  studentSelect: [],
  studentsList: [],
  interInfoData: {},
  curseTypeSelected: {}
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_INTERSEMESTRAL_LIST:
      let lista = [];
      action.intersemestral.forEach((t) => {
        lista.push({
          ...t,
          id: t.id,
          plantel_nombre: (t.plantel) ? t.plantel.nombre : t.plantel_nombre,
          docente_nombre: (t.plantilla_docente) ? t.plantilla_docente.docente.nombre + " " + t.plantilla_docente.docente.primer_apellido : t.docente_nombre,
          asignatura_nombre: (t.carrera_uac) ? t.carrera_uac.uac.nombre + " - " + t.carrera_uac.uac.clave_uac : t.asignatura_nombre,
          carrera_nombre: (t.carrera_uac) ? t.carrera_uac.carrera.nombre + " - " + t.carrera_uac.carrera.clave_carrera : t.carrera_nombre,
          grupo_recursamiento_intersemestral_id: t.grupo_recursamiento_intersemestral_id,
          plantilla_docente_id: t.plantilla_docente_id,
          plantel_id: t.plantel_id,
          carrera_uac_id: t.carrera_uac_id,
          nombre_periodo: t.periodo.nombre_con_mes,
          periodo: t.periodo_id,
          semestre: t.grupo_periodo ? t.grupo_periodo.semestre : t.semestre,
          grupo: (t.grupo_periodo && t.grupo_periodo.semestre) ? t.grupo_periodo.grupo + " - " + t.grupo_periodo.turno : t.grupo
        });
      });
      return {
        ...state,
        intersemestralList: lista,
      };
    case SET_TEACHER_SELECTED:
      return {
        ...state,
        teacherSelectId: action.params
      }
    case SET_STUDENTS_LIST:
      let listaStudents = [];
      action.students.forEach((s) => {
        listaStudents.push({
          ...s,
          /* id: s.usuario_id, */
          nombre: s.usuario.nombre,
          primer_apellido: s.usuario.primer_apellido,
          segundo_apellido: s.usuario.segundo_apellido,
          matricula: s.matricula,
          carrera: s.carrera.nombre + " - " + s.carrera.clave_carrera,
          periodo: s.calificacion_uac ? s.calificacion_uac[0]?.periodo?.nombre_con_mes : null
        });
      });
      return {
        ...state,
        studentsList: listaStudents
      }
    case SET_STUDENTS_SELECTED_LIST:
      let listaStudentsSelected = [];
      action.studentsSelected.forEach((s) => {
        listaStudentsSelected.push(s)
      });
      return {
        ...state,
        studentSelect: listaStudentsSelected
      }
    case SET_INTERSEMESTRAL_INFO:
      let intersemestralInfoData = action.intersemestralInfo;
      if(intersemestralInfoData.tipo_recursamiento === 1){
        intersemestralInfoData.tipo_recursamiento = "semestral";
      } else if(intersemestralInfoData.tipo_recursamiento === 2) {
        intersemestralInfoData.tipo_recursamiento = "intersemestral";
      }
      return {
        ...state,
        interInfoData: intersemestralInfoData
      }
    case SET_CURSE_TYPE_SELECTED:
      return {
        ...state,
        curseTypeSelected: action.data.tipos_recursamiento
      }
    default:
      return state;
  }
}
