import { SET_ASIGNATURAS_DOCENTE_LIST } from "./actions/setAsignaturasDocenteList";
import { SET_ASIGNATURA_VIEW } from "./actions/setAsignaturaView";

const initialState = {
  asignaturasDocenteList: [],
  asignaturaId: null,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_ASIGNATURAS_DOCENTE_LIST:
      let asignaturas = [];
      action.data.forEach((e) => {
        if(e.carrera_uac.uac){
          asignaturas.push({
            id: e.id,
            plantel: e.plantel.nombre,
            plantel_id: e.plantel_id,
            grupo_periodo_id: e.grupo_periodo_id,
            plantilla_docente_id: e.plantilla_docente_id,
            grupo: e.grupo_periodo.grupo.grupo,
            carrera_uac_id: e.carrera_uac_id,
            carrera_name: e.carrera_uac.carrera.nombre,
            carrera_description: `${e.carrera_uac.carrera.clave_carrera} - ${e.carrera_uac.carrera.nombre}`,
            carrera_id: e.carrera_uac.carrera.id,
            uac_name: e.carrera_uac.uac.nombre,
            uac_description: `${e.carrera_uac.uac.clave_uac} - ${e.carrera_uac.uac.nombre}`,
            uac_clave: e.carrera_uac.uac.clave_uac,
            carrera_clave: e.carrera_uac.carrera.clave_carrera,
            periodo_name: e.periodo.nombre,
            periodo_description: e.periodo.nombre_con_mes,
            semestre: e.grupo_periodo.semestre,
            estatus_asignatura: e.estatus === 1 ? "Activo" : "Inactivo",
            periodo: e.periodo_id,
            horas: e.carrera_uac.uac.creditos / 2,
          });
        }
      });
      return {
        ...state,
        asignaturasDocenteList: asignaturas,
      };
    case SET_ASIGNATURA_VIEW:
      let DocenteAsignatura = action.docenteAsignaturaId;
      return {
        ...state,
        docenteAsignaturaId: DocenteAsignatura,
      };
    default:
      return state;
  }
}
