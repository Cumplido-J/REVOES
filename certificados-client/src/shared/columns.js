import { stringCompare } from "./functions";

export const columnProps = { width: 200, align: "center" };
export const defaultColumn = (title, name, config = { preSort: false }) => {
  const configuration = {};
  if (config.preSort) configuration.defaultSortOrder = "ascend";
  return {
    title,
    dataIndex: name,
    sorter: (a, b) => stringCompare(a, b, name),
    ...configuration,
    ...columnProps,
  };
};
export const numberColumn = (title, name) => {
  return {
    title,
    dataIndex: name,
    sorter: (a, b) => a[name] > b[name],
    ...columnProps,
  };
};

export default {
  username: defaultColumn("Username", "username"),
  curp: defaultColumn("CURP", "curp"),
  rfc: defaultColumn("RFC", "rfc"),
  name: defaultColumn("Nombre", "name"),
  idschool: defaultColumn("Idschool", "idschool"),
  namecertificate: defaultColumn("Nombre del plantel para el certificado", "finalname"),
  idcatalogs: defaultColumn("Idcatalogs", "id"),
  description1: defaultColumn("Clave", "description1"),
  description2: defaultColumn("Nombre", "description2"),
  statusschool: defaultColumn("Estatus de operación", "status"),
  firstLastName: defaultColumn("Apellido paterno", "firstLastName"),
  secondLastName: defaultColumn("Apellido materno", "secondLastName"),
  enrollmentKey: defaultColumn("Matricula", "enrollmentKey"),
  cct: defaultColumn("CCT", "cct"),
  careerName: defaultColumn("Carrera", "careerName"),
  carrerKey: defaultColumn("Clave carrera", "carrerKey"),
  schoolName: defaultColumn("Plantel", "schoolName"),
  state: defaultColumn("Estado", "state"),
  generation: defaultColumn("Generación", "generation"),
  city: defaultColumn("Municipio", "city"),
  schoolType: defaultColumn("Tipo Plantel", "schoolType"),
  sinemsDate: defaultColumn("Fecha Sinems", "sinemsDate"),
  folioNumber: defaultColumn("Folio", "folioNumber"),
  status: defaultColumn("Estatus", "status"),
  totalSurveys: numberColumn("Total de encuestas", "totalSurveys"),
  totalStudents: numberColumn("Total de alumnos", "totalStudents"),
  typeCertified: numberColumn("Tipo de Certificado", "typeCertified"),
  percentage: {
    ...columnProps,
    title: "Porcentaje",
    sorter: (a, b) => a.percentage > b.percentage,
    render: (row) => {
      return `${row.percentage.toFixed(2)}%`;
    },
  },
  totalFinised: defaultColumn("Total de certificados de termino", "totalFinised"),
  totalPartial: defaultColumn("Total de certificados parciales", "totalPartial"),
  totalAbrogado: defaultColumn("Total de certificados Abrogados", "totalAbrogado"),
  num_plantel: numberColumn("Total de de planteles", "num_plantel"),
  matricula: numberColumn("Matricula Total de alumnos", "matricula"),
  num_m: numberColumn("Número de mujeres", "num_m"),
  num_h: numberColumn("Número de hombres", "num_h"),
  turno: defaultColumn("Turno", "turno"),
  semestre: numberColumn("Semestre", "semestre"),
  num_grupos: numberColumn("Número de grupos", "num_grupos"),
  //reporte egresados titulados
  titulados: numberColumn("Número de titulados", "titulados"),
  egresados: numberColumn("Número de egresados", "egresados"),
  tit_h: numberColumn("Hombres Titulados", "tit_h"),
  tit_m: numberColumn("Mujeres Tituladas", "tit_m"),
  egr_h: numberColumn("Hombres Egresados", "egr_h"),
  egr_m: numberColumn("Mujeres Egresadas", "egr_m"),
  ////////////////////
  careerKey: defaultColumn("Clave carrera", "careerKey"),
  totalCredits:defaultColumn("Total de creditos","totalCredits"),
  perfilType:defaultColumn("Tipo perfil","perfilType"),
  module:defaultColumn("Competencia","module"),
  order:defaultColumn("Orden","order"),
  credits:defaultColumn("Creditos","credits"),
  hours:defaultColumn("Horas","hours"),
  moduleC: defaultColumn("Modulo", "description1"),
  competenceE: defaultColumn("Competencia EMSAD", "description2"),
  descriptionGrup1: defaultColumn("Nombre", "description1"),
  descriptionGrup2: defaultColumn("Fecha de creación", "description2"),
  descriptionGrup3: defaultColumn("Descripción", "description2"),
  descriptionGrup4: defaultColumn("Estado", "description2"),
  descriptionGrup5: defaultColumn("plantel", "description3"),
  descriptionGrup6: defaultColumn("Estatus", "description4"),
  descriptionGrup7: defaultColumn("ID", "id"),
  status : defaultColumn("Estatus", "status"),
  timbrado : defaultColumn("Fecha timbrado", "timbrado"),
  inicio : defaultColumn("Fecha de inicio", "inicio"),
  termino : defaultColumn("Fecha de termino", "termino")
};
