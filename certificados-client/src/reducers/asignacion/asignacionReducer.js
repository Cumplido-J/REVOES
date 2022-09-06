import { SET_ASIGNACION } from "./actions/setAsignacion";
import { SET_ASIGNACION_CAREERS } from "./actions/setAsignacionCareers";
import { SET_ASIGNACIONES_LIST } from "./actions/setAsignacionesList";

const initialState = {
  asignacion: [],
  asignacionesList: [],
  asignaturasList: [],
  careersList: [],
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_ASIGNACIONES_LIST:
      let asignaciones = [];
      let docente_estatus = action.data.docente_estatus;
      action.data.docente_plantilla.forEach((t) => {
        let asignaturas_activas = [];
        /* busqueda de asignaturas activas */
        t.docente_asignatura.forEach((i) => {
          if (i.estatus == 1 && i.periodo_id == action.data.periodo_actual.id) {
            asignaturas_activas.push(i);
          }
        });
        asignaciones.push({
          id: t.id,
          docente_id: t.docente_id,
          docente: action.data.nombre + " " + action.data.primer_apellido + " " + action.data.segundo_apellido,
          tipo_plaza: t.tipo_plaza.nombre,
          tipo_plaza_id: t.cat_tipo_Plaza_id,
          tipo_plantel: t.plantel.tipo_plantel.siglas,
          plantelId: t.plantel_id,
          plantel: t.plantel.nombre,
          estado_plantel_id: t.plantel.municipio.estado_id,
          inicio_contrato: t.fecha_inicio_contrato,
          asignacion_contrato: t.fecha_asignacion,
          fin_contrato:
            t.fecha_fin_contrato != null ? t.fecha_fin_contrato : "En Curso",
          estatus_asignacion:
            t.plantilla_estatus === 1 ? "Activo" : "Terminado",
          horas: t.horas,
          municipio_nombre: t.plantel.municipio.nombre,
          estado_nombre: t.plantel.municipio.estado.nombre,
          docente_asignatura: t.docente_asignatura,
          plantel_carreras: t.plantel.plantel_carreras,
          nombramiento_liga: t.nombramiento_liga,
          docente_estatus: docente_estatus,
          asignaturas_activas: asignaturas_activas,
          asignatura_recursamiento_intersemestral: t.asignatura_recursamiento_intersemestral,
          grupo_recursamiento_semestral: t.grupo_recursamiento_semestral
        });
      });
      return {
        ...state,
        asignacionesList: asignaciones,
      };
    case SET_ASIGNACION:
      return {
        ...state,
        asignacion: action.data,
      };
    case SET_ASIGNACION_CAREERS:
      let careers = [];
      action.data.forEach((e) => {
        careers.push({
          id: e.carrera.id,
          description: `${e.carrera.clave_carrera} - ${e.carrera.nombre}`,
        });
      });
      return {
        ...state,
        careersList: careers,
      };
    default:
      return state;
  }
}
