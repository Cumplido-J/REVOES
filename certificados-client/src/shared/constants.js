export const JWT_TOKEN = "accessToken";
export const BACKEND_URL =
  (process.env.REACT_APP_API_BASE_URL || "http://localhost:8080/api") + "/v1";
export const BACKEND_URL_PHP =
  process.env.REACT_APP_API_BASE_URL_PHP || "http://localhost:8000/api";
export const SURVEY2020DATE = "01/10/2020";

export const Messages = {
  error404: "No se ha encontrado el recurso solicitado.",
};
export function JWT_HEADER() {
  let config = {
    headers: { Authorization: "" },
  };

  if (localStorage.getItem(JWT_TOKEN))
    config.headers.Authorization = `Bearer ${localStorage.getItem(JWT_TOKEN)}`;
  return config;
}

export const chartColors = [
  "#85a392",
  "#f5b971",
  "#fdd998",
  "#588da8",
  "#ffb6b6",
  "#fde2e2",
  "#a4c5c6",
  "#b590ca",
  "#a8d3da",
  "#f5cab3",
  "#f3ecb8",
  "#f4eeff",
  "#dcd6f7",
  "#a6b1e1",
  "#424874",
  "#a8e6cf",
  "#dcedc1",
  "#f8b195",
  "#f67280",
  "#c06c84",
  "#6c567b",
  "#b9cced",
  "#6e5773",
  "#d45d79",
  "#be8abf",
  "#ea9abb",
  "#ffb6b9",
  "#fae3d9",
  "#bbded6",
  "#8ac6d1",
  "#f0cf85",
  "#e6b2c6",
  "#4baea0",
  "#b6e6bd",
  "#b6ffea",
  "#fce2ae",
  "#f5b5fc",
  "#fff1ac",
  "#fee9b2",
  "#60a9a6",
  "#aeeff0",
  "#daa592",
  "#484c7f",
  "#ab93c9",
  "#b0deff",
  "#72d6c9",
  "#305f72",
  "#9fd3c7",
  "#7fe7cc",
  "#a374d5",
];

export const bloodTypes = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];

export const sexEnum = [
  {
    id: "H",
    description: "Hombre",
  },
  {
    id: "M",
    description: "Mujer",
  },
];

export const paymentStatuses = [
  {
    id: "Pagado",
    description: "Pagado",
  },
  {
    id: "No pagado",
    description: "No pagado",
  },
  {
    id: "Convenio",
    description: "Convenio",
  },
];

export const permissionList = {
  // Permisos de alcance
  NACIONAL: "Nacional",
  ESTATAL: "Estatal",
  PLANTEL: "Plantel",

  // Modulo docente
  BUSCAR_DOCENTE: "Buscar docente",
  EDITAR_DOCENTE: "Editar docente",
  CREAR_DOCENTE: "Crear docente",
  DAR_DE_BAJA_POR_PERMISO_A_DOCENTE: "Dar de baja por permiso a docente",
  REINGRESO_DE_DOCENTE: "Reingreso de docente",
  DESACTIVAR_DOCENTE: "Desactivar docente",
  // Asignaciones
  VER_ASIGNACIONES_DE_DOCENTE: "Ver asignaciones de docente",
  EDITAR_ASIGNACION_DE_DOCENTE: "Editar asignacion de docente",
  ELIMINAR_ASIGNACION_DE_DOCENTE: "Eliminar asignacion de docente",
  TERMINAR_ASIGNACION_DE_DOCENTE: "Terminar asignacion de docente",
  VER_DETALLES_DE_ASIGNACION: "Ver detalles de asignacion",
  CREAR_ASIGNACION_DE_DOCENTE: "Crear asignacion de docente",
  // Asignaturas
  EDITAR_ASIGNATURA_DE_DOCENTE: "Editar asignatura de docente",
  ELIMINAR_ASIGNATURA_DE_DOCENTE: "Eliminar asignatura de docente",
  CREAR_ASIGNATURA_DE_DOCENTE: "Crear asignatura de docente",
  VER_ASIGNATURAS_DE_DOCENTE: "Ver asignaturas de docente",
  VER_DETALLES_DE_ASIGNATURA: "Ver detalles de asignatura",
  // Asignaturas recursamiento intersemestral
  CARGAR_CALIFICACIONES_RECURSAMIENTO_INTERSEMESTRAL:
    "Cargar calificaciones recursamiento intersemestral",
  VER_DETALLES_ASIGNATURA_RECURSAMIENTO_INTERSEMESTRAL:
    "Ver detalles de asignatura recursamiento intersemestral",
  VER_ASIGNATURA_RECURSAMIENTO_INTERSEMESTRAL:
    "Ver asignaturas recursamiento intersemestral",
  AGREGAR_ASIGNATURA_RECURSAMIENTO_INTERSEMESTRAL:
    "Agregar asignatura recursamiento intersemestral",
  EDITAR_ASIGNATURA_RECURSAMIENTO_INTERSEMESTRAL:
    "Editar asignatura recursamiento intersemestral",
  ELIMINAR_ASIGNATURA_RECURSAMIENTO_INTERSEMESTRAL:
    "Eliminar asignatura recursamiento intersemestral",
  //asignaturas recursamiento semestral
  VER_RECURSAMIENTOS: "Ver recursamientos",
  VER_ALUMNOS_CANDIDATOS_RECURSAMIENTO:
    "Ver Alumnos candidatos para recursamiento",
  AGREGAR_RECURSAMIENTO_SEMESTRAL: "Agregar recursamiento semestral",
  EDITAR_RECURSAMIENTO_SEMESTRAL: "Editar recursamiento semestral",
  ELIMINAR_RECURSAMIENTO_SEMESTRAL: "Eliminar recursamiento semestral",
  VER_DETALLES_RECURSAMIENTO_SEMESTRAL: "Ver detalles recursamiento semestral",
  CARGAR_CALIFICACIONES_RECURSAMIENTO_SEMESTRAL:
    "Cargar calificaciones recursamiento semestral",
  VER_DETALLES_RECURSAMIENTO_SEMESTRAL:
    "Ver detalles de mi recursamiento semestral",
  CONFIGURACION_RECURSAMIENTO_SEMESTRAL:
    "Configuracion de recursamiento semestral",

  // Modulo de grupo y grupo-periodo
  BUSCAR_GRUPO: "Buscar grupo",
  CREAR_GRUPO: "Crear grupo",
  EDITAR_GRUPO: "Editar grupo",
  ELIMINAR_GRUPO: "Eliminar grupo",
  ACTIVAR_GRUPO: "Activar grupo",
  APROBAR_GRUPOS: "Aprobar grupos",
  BUSCAR_GRUPO_PERIODO: "Buscar grupo periodo",
  EDITAR_GRUPO_PERIODO: "Editar grupo periodo",
  ELIMINAR_GRUPO_PERIODO: "Eliminar grupo periodo",
  CONFIGURAR_FECHA_INSCRIPCION_POR_GRUPO:
    "Configurar fecha inscripcion por grupo",
  CONFIGURAR_FECHA_INSCRIPCION_POR_PLANTEL:
    "Configurar fecha inscripcion por plantel",
  AGREGAR_OPTATIVAS_A_GRUPO_PERIODO: "Agregar optativas a grupo-periodo",
  INSCRIBIR_ALUMNOS_A_GRUPO: "Inscribir alumnos a grupo",

  // Planteles
  CONFIGURACION_DE_EVALUACIONES: "Configuración de evaluaciones",
  CONFIG_EVALUACION_RECURSAMIENTO_INTERSEMESTRAL:
    "Configuracion de recursamiento intersemestral",
  CONFIG_EVALUACION_CORRECCION_PARCIAL: "Configuracion de correccion parcial",
  CONGIG_MODIFICACIONES_CALIFICACIONES_HISTORICAS:
    "Configuracion de modificaciones calificaciones historicas",
  CONFIG_FECHAS_INICIO_FIN_PERIODO_POR_ESTADO: "Configurar fechas de inicio y fin de periodo por estado",

  // Permisos docentes
  VER_MIS_ASIGNACIONES: "Ver mis asignaciones",
  CARGAR_CALIFICACIONES_DOCENTE: "Cargar calificaciones docente",

  // LOL
  SISEC: "SISEC",

  // Certificados
  CERTIFICADO_CANCEL_EXTERNAL: "Certificado cancelacion externa",
  VALIDAR_ALUMNOS: "Validar alumnos",
  CONSULTAR_ALUMNOS: "Consultar alumnos",
  CERTIFICAR_ALUMNOS: "Certificar alumnos",

  // Lista de planteles
  LISTA_PLANTELES: "Lista planteles",
  AGREGAR_PLANTELES: "Agregar planteles",

  // Alumnos
  ACTUALIZAR_DATOS: "Actualizar datos",
  REGISTRAR_ALUMNOS: "Registrar alumnos",

  // Alumnos
  LISTA_DE_ALUMNOS: "Lista de alumnos",
  AGREGAR_ALUMNO: "Agregar alumno",
  DESCARGA_DE_FORMATOS: "Descarga de formatos",
  CARGA_MASIVA: "Carga masiva de alumnos",
  ELIMINAR_ALUMNO: "Eliminar alumnos",
  //carga masiva graduados
  CARGA_MASIVA_6TO: "Carga 6to. semestre",

  //Historico
  VER_CALIFICACIONES_HISTORICAS: "Ver calificaciones historicas",
  EDITAR_CALIFICACIONES_HISTORICAS: "Editar calificaciones historicas",
  AGREGAR_CALIFICACIONES_HISTORICAS: "Agregar calificaciones historicas",
  ELIMINAR_CALIFICACIONES_HISTORICAS: "Eliminar calificaciones historicas",

  //Firmantes
  AGREGAR_PERSONA: "Agregar persona",
  LISTA_FIRMANTE: "Lista firmante",
  //Lista de pruebas
  // Reportes encuestas
  REPORTES: "Reportes",
  REPORTE_ESTATAL: "Reporte estatal",
  REPORTE_PLANTEL: "Reporte plantel",
  REPORTE_ESTATAL_DEPRECADO: "Reporte estatal deprecado",
  REPORTE_PLANTEL_DEPRECADO: "Reporte plantel deprecado",

  // Boletas
  GENERAR_BOLETAS: "Generar boletas",

  //Certificados reporte
  REPORTE_CERTIFICADO_REPUBLICA: "Reporte certificado republica",
  REPORTE_CERTIFICADO_ESTATAL: "Reporte certificado estatal",
  REPORTE_CERTIFICADO_PLANTEL: "Reporte certificado plantel",
  REPORTE_CERTIFICADO_ESTATAL_DEPRECADO:
    "Reporte certificado estatal deprecado",
  REPORTE_CERTIFICADO_PLANTEL_DEPRECADO:
    "Reporte certificado plantel deprecado",

  SINCRONIZAR_CALIFICACIONES_PARA_CERTIFICADOS:
    "Sincronizar calificaciones para certificados",
  REPEALED_CERTIFICATE: "Certificado abrogado",

  //Titulos
  TITULO_CANCEL_EXTERNAL: "Titulo cancelacion externa",
  VALIDAR_ALUMNOS_PRE_TITULAR: "Validar alumnos pre titular",
  CONSULTAR_ALUMNOS_PRE_TITULAR: "Consultar alumnos pre titular",
  TITULAR_ALUMNOS: "Titular alumnos",

  //Info DGP
  INFORMACION_DGP: "Informacion DGP",
  INFORMACION_DGP_SCHOOL: "Informacion DGP planteles",
  //Reportes estadistica
  REPORTE_MATRICULA_ESCOLAR: "Reporte matricula escolar",
  REPORTE_MATRICULA_POR_ENTIDAD: "Reporte matricula por entidad",

  REGISTRO_EGRESADOS_TITULADOS: "Registro egresados y titulados",
  REPORTE_EGRESADOS_TITULADOS: "Consulta egresados y titulados",
  REGISTRO_NIVEL_ESTUDIOS: "Registro nivel estudios",
  REPORTE_NIVEL_ESTUDIOS: "Consulta nivel de estudios",
  LISTA_CARRERAS: "Lista carreras",
  AGREGAR_CARRERAS: "Agregar carreras",
  AGREGAR_COMPETENCIAS: "Agregar competencias",
  LISTA_COMPETENCIAS: "Lista competencias",

  LISTA_PLANTELES_EQUIVALENTE: "Lista planteles equivalentes",

  //usuarios
  GRUPOSYPERMISOS: "Grupos y permisos",
  // Password
  CAMBIAR_CONTRASENA: "Cambiar contraseña",

  LISTA_PLANTELES_EQUIVALENTE: "Lista planteles equivalentes",

  // Aspirantes
  REGISTRAR_ASPIRANTES: "Registrar aspirantes",
  EDITAR_ASPIRANTES: "Editar aspirantes",
  VER_ASPIRANTES: "Ver aspirantes",
  ELIMINAR_ASPIRANTES: "Eliminar aspirantes",
  PROMOVER_ASPIRANTES: "Promover aspirantes",
  IMPRIMIR_COMPROBANTE_DE_INSCRIPCION_ASPIRANTES:
    "Imprimir comprobante de inscripción aspirantes",
  CONFIG_FECHAS_PARA_ASPIRANTES: "Configurar fechas para aspirantes"
};
