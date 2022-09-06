export const studentStatusCatalog = [
  { id: 1, description: "Activo" },
  { id: 2, description: "Inactivo" },
];
export const statusSexo = [
  { id: 1, description: "H" },
  { id: 2, description: "M" },
];
export const certificateTypeCatalog = [
  { id: 1, description: "Término" },
  { id: 2, description: "Parcial" },
  { id: 3, description: "Abrogado" },
];
export const adminTypeCatalog = [
  { id: 1, description: "Certificación" },
  { id: 2, description: "Control escolar" },
  { id: 3, description: "Seguimiento de egresados" },
  { id: 4, description: "Desarrollador" },
  { id: 5, description: "Titulación" },
];
export const surveyTypeCatalog = [
  { id: 1, description: "Encuesta de intenciones 2020" },
  { id: 2, description: "Encuesta de egresados 2019" },
  { id: 3, description: "Encuesta de intenciones 2021" },
  { id: 4, description: "Encuesta de egresados 2020" },
  { id: 5, description: "Encuesta de intensiones 2022" },
  //{ id: 6, description: "Encuesta de egresados 2022" },
];
export const AdminTypes = {
  CERTIFICATION: 1,
  SCHOOL_CONTROL: 2,
  TRACING_ADMIN: 3,
  DEV: 4,
  TITULACION: 5,
};
export const TeacherStatus = {
  ELIMINADO: 0,
  ACTIVO: 1,
  BAJA: 2,
  BAJA_PERMISO_ACTIVO: 3,
};
export const schoolTypeCatalog = [
  { id: 18, description: "CECyTE" },
  { id: 19, description: "EMSaD" },
];
export const generationCatalog = [
  { id: "2021-2024", description: "2021-2024" },
  { id: "2020-2023", description: "2020-2023" },
  { id: "2019-2022", description: "2019-2022" },
  { id: "2018-2021", description: "2018-2021" },
  { id: "2017-2020", description: "2017-2020" },
  { id: "2016-2019", description: "2016-2019" },
  { id: "2015-2018", description: "2015-2018" },
  { id: "2014-2017", description: "2014-2017" },
  { id: "2013-2016", description: "2013-2016" },
  { id: "2012-2015", description: "2012-2015" },
  { id: "2011-2014", description: "2011-2014" },
  { id: "2010-2013", description: "2010-2013" },
  { id: "2009-2012", description: "2009-2012" },
  { id: "2008-2011", description: "2008-2011" },
  { id: "2007-2010", description: "2007-2010" },
  { id: "2006-2009", description: "2006-2009" },
  { id: "2005-2008", description: "2005-2008" },
  { id: "2004-2007", description: "2004-2007" },
  { id: "2003-2006", description: "2003-2006" },
  { id: "2002-2005", description: "2002-2005" },
  { id: "2001-2004", description: "2001-2004" },
  { id: "2000-2003", description: "2000-2003" },
  { id: "1999-2002", description: "1999-2002" },
  { id: "1998-2001", description: "1998-2001" },
  { id: "1997-2000", description: "1997-2000" },
  { id: "1996-1999", description: "1996-1999" },
  { id: "1995-1998", description: "1995-1998" },
  { id: "1994-1997", description: "1994-1997" },
  { id: "1993-1996", description: "1993-1996" },
];
export const subjectStatusCatalog = [
  { id: "Cursada", description: "Cursada" },
  { id: "NA", description: "No acreditada" },
  { id: "NP", description: "No presentó evaluación" },
];
export const yesNoCatalog = [
  { id: "Si", description: "Si" },
  { id: "No", description: "No" },
];
export const periodsCatalog = [
  { id: "15-16/1", description: "15-16/1" },
  { id: "15-16/2", description: "15-16/2" },

  { id: "16-17/1", description: "16-17/1" },
  { id: "16-17/2", description: "16-17/2" },

  { id: "17-18/1", description: "17-18/1" },
  { id: "17-18/2", description: "17-18/2" },

  { id: "18-19/1", description: "18-19/1" },
  { id: "18-19/2", description: "18-19/2" },

  { id: "19-20/1", description: "19-20/1" },
  { id: "19-20/2", description: "19-20/2" },

  { id: "20-21/1", description: "20-21/1" },
  { id: "20-21/2", description: "20-21/2" },
];
export const Roles = {
  DEV: 1,
  STUDENT: 3,
  TRACING_ADMIN: 4,
  SCHOOL_CONTROL: 5,
  CERTIFICATION_ADMIN: 6,
  TITULACION_ADMIN: 8,
};
export const SchoolTypes = {
  EMSAD: 19,
  CECYTE: 18,
};
export const StudentStatus = {
  ACTIVE: 1,
  INACTIVE: 2,
};

export const SurveyTypes = {
  INTENTIONS2020: 1,
  GRADUATED2020: 2,
  INTENTIONS2021: 3,
  GRADUATED2021: 4,
  INTENTIONS2022: 5,
  GRADUATED2022: 6,
};

export const EnrollmentTypesGroupsConfig = {
  STUDENT: "Alumno",
  SCHOOL: "Control escolar",
  BOTH: "Ambos",
};

export const EnrollmentTypesGroupsConfigCatalog = [
  {
    id: EnrollmentTypesGroupsConfig.STUDENT.toLowerCase(),
    description: EnrollmentTypesGroupsConfig.STUDENT,
  },
  {
    id: EnrollmentTypesGroupsConfig.SCHOOL.toLowerCase(),
    description: EnrollmentTypesGroupsConfig.SCHOOL,
  },
  {
    id: EnrollmentTypesGroupsConfig.BOTH.toLowerCase(),
    description: "Alumno y control escolar",
  },
];

export const Semesters = Array.from(Array(6).keys()).map((e) => ({
  id: e + 1,
  description: e + 1,
}));

export const StudentsStatuses = [
  "Documentos completos",
  "Documentos incompletos",
];

export const StudentsTrajectory = ["Regular", "Transito"];

export const StudentsTypes = ["Regular", "Irregular"];

export const StudentsEnrollmentTypes = [
  "Nuevo ingreso",
  "Cambio carrera",
  "Cambio subsistema",
];

export const StudentsAllowGroupEnrollment = ["Permitir", "No Permitir"];

export const StudentCareerChange = ["No", "Si"];

export const estatusInscripcionEnums = ["Activo", "Baja", "Egresado"];

export const EstatusInscripcionCombo = ["Activo", "Egresado"];

export const schoolStatusCatalog = [
  { id: 1, description: "En operación" },
  { id: 2, description: "No operando" },
];

export const adminTypeCatalogRoles = [
  //{ id: 6, description: "Certificación" },
  { id: 5, description: "Control escolar" },
  { id: 4, description: "Seguimiento de egresados" },
  { id: 1, description: "Desarrollador" },
];

export const AdminTypesRoles = {
  //CERTIFICATION: 6,
  SCHOOL_CONTROL: 5,
  TRACING_ADMIN: 4,
  DEV: 1,
};

export const checkAdminCatalogNivel = [
  { id: 1, description: "Estatal" },
  { id: 2, description: "Plantel" },
];

export const checkAdminCatalog = [
  { id: 1, description: "Unicamente validación de alumnos" },//22
  { id: 2, description: "Unicamente certificación de alumnos" },//20
  { id: 3, description: "Control escolar y validación de alumnos" },//18
  { id: 4, description: "Director general" },//14
  { id: 5, description: "Unicamente titulación de alumnos" },//25
];
export const checkAdminCatalogUpdate1 = [
  { id: 2, description: "Unicamente certificación de alumnos" },//20
  { id: 5, description: "Unicamente titulación de alumnos" },//25
  { id: 4, description: "Director general" },//14
];
export const checkAdminCatalogUpdate2 = [
  { id: 1, description: "Unicamente validación de alumnos" },//22
  { id: 3, description: "Control escolar y validación de alumnos" },//18
];
export const checkAdminCatalog2 = [
  { id: 1, description: "Unicamente validación de alumnos" },//23
  { id: 2, description: "Control escolar y validación de alumnos" },//19
];

/*export const certificateTypeCatalog2 = [
  { id: 1, description: "Término" },
  { id: 2, description: "Parcial" },
];


*/
export const checkAdminCatalogDegree1 = [
  { id: 5, description: "Unicamente titulación de alumnos" },//25
  { id: 4, description: "Director general" },//14
];