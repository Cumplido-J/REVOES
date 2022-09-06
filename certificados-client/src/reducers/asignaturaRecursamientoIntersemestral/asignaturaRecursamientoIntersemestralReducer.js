import { SET_ASIGNATURAS_RECURSAMIENTO_INTERSEMESTRAL_LIST } from "./actions/setAsignaturasRecursamientoIntersemestralList";
import { SET_ASIGNATURAS_RECURSAMIENTO_SEMESTRAL_LIST } from "./actions/setAsignaturasRecursamientoSemestralList";
import { SET_ASIGNATURA_RECURSAMIENTO_INTERSEMESTRAL_VIEW } from "./actions/setAsignaturasRecursamientoIntersemestralView";

const initialState = {
  asignaturasRecursamientoIntersemestralList: [],
  asignaturasRecursamientoSemestralList: [],
  asignaturaId: null,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_ASIGNATURAS_RECURSAMIENTO_INTERSEMESTRAL_LIST:
      let asignaturas = [];
      action.data.forEach((e) => {
        if (e.carrera_uac.uac) {
          asignaturas.push({
            id: e.id,
            plantel: e.plantel.nombre,
            plantel_id: e.plantel_id,
            plantilla_docente_id: e.plantilla_docente_id,
            carrera_uac_id: e.carrera_uac_id,
            carrera_name: e.carrera_uac.carrera.nombre,
            carrera_description: `${e.carrera_uac.carrera.clave_carrera} - ${e.carrera_uac.carrera.nombre}`,
            carrera_id: e.carrera_uac.carrera.id,
            uac_name: e.carrera_uac.uac.nombre,
            uac_clave: e.carrera_uac.uac.clave_uac,
            uac_description: `${e.carrera_uac.uac.clave_uac} - ${e.carrera_uac.uac.nombre}`,
            carrera_clave: e.carrera_uac.carrera.clave_carrera,
            periodo_name: e.periodo.nombre_con_mes,
            semestre: e.carrera_uac.semestre,
            estatus_asignatura: e.estatus === 1 ? "Activo" : "Inactivo",
            periodo: e.periodo_id,
            grupo: e.grupo_periodo.grupo,
            grupo_recursamiento_intersemestral_id: e.grupo_recursamiento_intersemestral_id
          });
        }
      });
      return {
        ...state,
        asignaturasRecursamientoIntersemestralList: asignaturas,
      };
    case SET_ASIGNATURAS_RECURSAMIENTO_SEMESTRAL_LIST:
      let asignaturasSemestrales = [];
      action.data.forEach((e) => {
        if (e.carrera_uac.uac) {
          asignaturasSemestrales.push({
            ...e,
            id: e.id,
            plantel: e.plantel.nombre,
            plantel_id: e.plantel_id,
            plantilla_docente_id: e.plantilla_docente_id,
            carrera_uac_id: e.carrera_uac_id,
            carrera_name: e.carrera_uac.carrera.nombre,
            carrera_description: `${e.carrera_uac.carrera.clave_carrera} - ${e.carrera_uac.carrera.nombre}`,
            carrera_id: e.carrera_uac.carrera.id,
            uac_name: e.carrera_uac.uac.nombre,
            uac_clave: e.carrera_uac.uac.clave_uac,
            uac_description: `${e.carrera_uac.uac.clave_uac} - ${e.carrera_uac.uac.nombre}`,
            carrera_clave: e.carrera_uac.carrera.clave_carrera,
            periodo_name: e.periodo.nombre_con_mes,
            semestre: e.carrera_uac.semestre,
            estatus_asignatura: e.estatus === 1 ? "Activo" : "Inactivo",
            periodo: e.periodo_id,
            grupo: e.grupo_periodo.grupo,
            grupo_recursamiento_intersemestral_id: e.grupo_recursamiento_intersemestral_id
          });
        }
      });
      return {
        ...state,
        asignaturasRecursamientoSemestralList: asignaturasSemestrales,
      };
    case SET_ASIGNATURA_RECURSAMIENTO_INTERSEMESTRAL_VIEW:
      let DocenteAsignatura = action.docenteAsignaturaId;
      return {
        ...state,
        docenteAsignaturaId: DocenteAsignatura,
      };
    default:
      return state;
  }
}
