import { Roles } from "./catalogs";

import Moment from "moment";
import "moment/locale/es";
import { SURVEY2020DATE } from "./constants";
import store from "../reducers/reducers";
import Questions from "../pages/survey2020/Questions";
import Questionsg from "../pages/survey2021/Questions";

const CURPRegex1 = /^([A-Z][AEIOUX][A-Z]{2}\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])[HMX](?:AS|B[CS]|C[CLMSH]|D[FG]|G[TR]|HG|JC|M[CNS]|N[ETL]|OC|PL|Q[TR]|S[PLR]|T[CSL]|VZ|YN|ZS)[B-DF-HJ-NP-TV-Z]{3}[A-Z\d])(\d)$/;
const CURPRegex2 = /^DIRECTOR_(0[1-9]|[1-2][0-9]|3[0-2])_CER$/;
const CURPRegex3 = /^CONTROL_(0[1-9]|[1-2][0-9]|3[0-2])_CER$/;
const CURPRegex4 = /^CONTROL_.*$/;
const CURPRegex5 = /^EGRESADOS_.*$/;
const CURPRegex6Extranjero = /^([A-Z]{1}[AEIOU]{1}[A-Z]{2}[0-9]{6})$/;
const periodRegex = /^([0-1-2-9][0-9]-[0-1-2-9][0-9]\/[1|2]|[*]{3})$/;
const RfcRegex = /^([A-ZÑ\x26]{3,4}([0-9]{2})(0[1-9]|1[0-2])(0[1-9]|1[0-9]|2[0-9]|3[0-1]))([A-Z\d]{3})?$/;

const CCTRegex = /^[0-9]{2}(ETC|EMS|MMS)[0-9]{4}[A-Z]$/;

export const validateCurp = (curp) => {
  if (curp) curp = curp.toUpperCase();
  return (
    CURPRegex1.test(curp) ||
    CURPRegex2.test(curp) ||
    CURPRegex3.test(curp) ||
    CURPRegex4.test(curp) ||
    CURPRegex5.test(curp) ||
    CURPRegex6Extranjero.test(curp)
  );
};

export const validateCurpExtranjero = (curp) => {
  if (curp) curp = curp.toUpperCase();
  return (
    CURPRegex6Extranjero.test(curp)
  );
};

export const validateRfc = (rfc) => {
  if (rfc) rfc = rfc.toUpperCase();
  return RfcRegex.test(rfc);
};

export const validatePeriod = (period) => {
  if (period) period = period.toUpperCase();
  return periodRegex.test(period);
};
export const validateCCT = (cct) => {
  if (cct) cct = cct.toUpperCase();
  return CCTRegex.test(cct);
};

export const canAnswerSurvey = (studentInfoUpdated) => {
  if (studentInfoUpdated == null) return false;
  const studentDate = Moment(studentInfoUpdated);
  const surveyDate = Moment(SURVEY2020DATE, "DD/MM/YYYY");
  return studentDate.isAfter(surveyDate);
};

export const getFullName = (name, firstLastName, secondFirstLastName) => {
  if (!secondFirstLastName) secondFirstLastName = "";
  else secondFirstLastName = ` ${secondFirstLastName}`;

  return `${name} ${firstLastName}${secondFirstLastName}`;
};
export const dateToReadableDate = (date) => {
  if (!date) return "";
  date = Moment(date);
  return Moment(date, "DD/MM/YYYY").locale("es").format("LL");
};

export const userHasRole = {
  dev: (roles) => roles.includes(Roles.DEV),
  student: (roles) => roles.includes(Roles.STUDENT),
  tracingAdmin: (roles) => roles.includes(Roles.TRACING_ADMIN),
  schoolControl: (roles) => roles.includes(Roles.SCHOOL_CONTROL),
  certificationAdmin: (roles) => roles.includes(Roles.CERTIFICATION_ADMIN),
  titulacionAdmin: (roles) => roles.includes(Roles.TITULACION_ADMIN),
};

export const stringCompare = (a, b, name) => {
  if (typeof a[name] !== "string") a[name] = "" + a[name];
  if (typeof b[name] !== "string") b[name] = "" + b[name];
  if (!a[name]) a[name] = "";
  if (!b[name]) b[name] = "";
  return a[name].localeCompare(b[name]);
};
export const boolCompare = (a, b, name) => {
  return a[name].toString().localeCompare(b[name].toString());
};

export function downloadCsv(dataset, fileName) {
  const ShowLabel = true;
  var arrData = typeof dataset != "object" ? JSON.parse(dataset) : dataset;
  if (arrData.length > 0 && arrData[0].key) {
    arrData.forEach((element) => {
      delete element.key;
    });
  }
  // eslint-disable-next-line
  var CSV = "sep=," + "\r\n\n";

  var row = "";
  var index;
  if (ShowLabel) {
    for (index in arrData[0]) {
      row += index + ",";
    }

    row = row.slice(0, -1);

    CSV += row + "\r\n";
  }

  for (var i = 0; i < arrData.length; i++) {
    row = "";

    for (index in arrData[i]) {
      if (arrData[i][index] == null) arrData[i][index] = "";
      row += `"${arrData[i][index]
        .toString()
        .replace('"', "")
        .replace('"', "")
        .replace('"', "")
        .replace('"', "")}",`;
    }

    row.slice(0, row.length - 1);

    CSV += row + "\r\n";
  }

  if (CSV === "") {
    alert("Invalid data");
    return;
  }

  var uri = "data:text/csv;charset=utf-8," + escape(CSV);

  var link = document.createElement("a");
  link.href = uri;

  link.style = "visibility:hidden";
  link.download = fileName + ".csv";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function getFilenameExtension(filename) {
  return filename.split(".").pop();
}

export async function fileInputToBase64(file) {
  try {
    const arrayBuffer = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsArrayBuffer(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
    return btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
  } catch (error) {
    throw error;
  }
}

export function downloadBase64(fileName, base64) {
  const data = `data:application/pdf;base64,${base64}`;
  var link = document.createElement("a");
  link.href = data;

  link.style = "visibility:hidden";
  link.download = `${fileName}`;

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export const getSemesterByPeriod = (period) =>
  period === 1
    ? [
        { id: 1, description: 1 },
        { id: 3, description: 3 },
        { id: 5, description: 5 },
      ]
    : [
        { id: 2, description: 2 },
        { id: 4, description: 4 },
        { id: 6, description: 6 },
      ];

export const createAlphabet = () => {
  let from = "A".charCodeAt(0);
  let to = "Z".charCodeAt(0);
  const alphabet = [];
  for (; from <= to; from++)
    alphabet.push({
      id: String.fromCharCode(from),
      description: String.fromCharCode(from),
    });
  return alphabet;
};

export const PermissionValidatorFn = (permissions, allPermissions = true) => {
  const state = store.getState(); // Obtiene el estado desde redux
  const currentPermissions = state.permissionsReducer.permissions; // Obtiene los permisos desde redux
  return allPermissions
    ? permissions.every((p) => currentPermissions.includes(p))
    : permissions.some((p) => currentPermissions.includes(p));
};

export function downloadCsvAnswer(dataset, fileName) {
  const ShowLabel = true;
  var arrData = typeof dataset != "object" ? JSON.parse(dataset) : dataset;
  if (arrData.length > 0 && arrData[0].key) {
    arrData.forEach((element) => {
      delete element.key;
    });
  }
  // eslint-disable-next-line
  var CSV = "sep=," + "\r\n\n";

  var row = "";
  var index;

  if (ShowLabel) {
    /*for (index in arrData[0]) {
      row += index + ",";
    }*/
    /*row =['id','cct','plantel','curp','carrera','nombre','apellido paterno','apellido materno','genero',
  Questions.q1.question,Questions.q2.question,Questions.q3.question,Questions.q4.question,Questions.q5.question,Questions.q6.question,Questions.q7.question,Questions.q8.question,Questions.q9.question,Questions.q10.question,Questions.q11.question,Questions.q12.question,Questions.q13.question,Questions.q14.question,Questions.q15.question,Questions.q16.question
  ,Questions.q17.question,Questions.q18.question,Questions.q19.question,Questions.q20.question,Questions.q21.question,Questions.q22.question,Questions.q23.question,Questions.q24.question,Questions.q25.question,Questions.q26.question,Questions.q27.question,Questions.q28.question
  ,'continua estudiando','discapacidad','grupo etnico','idioma','lengua','emprendimiento','emprendimiento carrera','emprendimiento derivado','emprendimiento estatus','examen','con quien vive','programa',''
  ]*/
  row = [
      
      'CCT',
      'PLANTEL',
      'CURP',
      'CARRERA',
      'NOMBRE',
      'PRIMER_APELLIDO',
      'SEGUNDO_PELLIDO',
      'GENERO',
      '_EN_QUE_FRECUENCIA_USAS_TUS_CONOCIMIENTOS_Y_HABILIDADES_QUE_ADQUIRISTE_EN_EL_BACHILLERATO?',
      '_QUE_CONOCIMIENTOS_TECNICOS_CONSIDERAS_QUE_TE_HICIERON_FALTA_DURANTE_TU_BACHILLERATO?',
      '_QUE_HABILIDADES_CONSIDERAS_QUE_TE_HICIERON_FALTA_DURANTE_TU_BACHILLERATO?',
      '_A_QUE_ACTIVIDAD_TE_INCORPORARAS_AL_EGRESAR?',
      '_QUE_CARRERA_DESEAS_ESTUDIAR_AL_EGRESAR?',
      '_ES_UNA_CARRERA_AFIN_A_TU_BACHILLERATO?',
      '_PLANEAS_EMIGRAR_DE_TU_COMUNIDAD_Y/O_CIUDAD_PARA_ESTUDIAR?',
      '_PLANEAS_EMIGRAR_DE_TU_COMUNIDAD_Y/O_CIUDAD_PARA_TRABAJAR?',
      '_CUAL_DE_ESTAS_FRASES_DESCRIBE_MEJOR_TU_INTERES_EN_TRABAJAR?',
      '_CUALES_SON_LAS_CAUSAS_POR_LAS_QUE_PLANEAS_TRABAJAR_AL_CONCLUIR_EL_BACHILLERARTO?',
      '_CUAL_ES_LA_RAZON_POR_LA_CUAL_NO_TE_HAS_DECIDIDO?',
      'SERVICIOS_ESCOLARES',
      'LABORATORIOS',
      'TALLERES',
      'VINCULACION',
      'DOCENTES',
      'TAREAS_RECREATIVAS_Y_DEPORTIVAS',
      'PERSONAL_ADMINISTRATIVAS',
      'PERSONAL_DIRECTIVO',
      'SANITARIAS',
      'AULAS',
      'ESPACIOS_PARA_COMER',
      'EVENTOS_CULTURALES',
      'EVENTOS_DEPORTIVOS',
      'EVENTOS_TECNOLOGICOS',
      'EVENTOS_DE_EMPRENDIMIENTO',
      '_DE_TU_EXPERIENCIA_EN_EL_PLANTEL_QUE_FUE_LO_QUE_MAS_TE_GUSTO?',
      '_DE_TU_EXPERIENCIA_EN_EL_PLANTEL_QUE_ES_LO_QUE_MEJORARIAS?',
      '_AL_EGRESAR_DEL_BACHILLERATO_CONTINUARAS_CON_TUS_ESTUDIOS?',
      '_TIENES_ALGUNA_DISCAPACIDAD?',
      '_PERTENECES_A_ALGUN_GRUPO_ETNICO?',
      '_HABLAS_OTRO_IDIOMA_DIFERENTE_AL_ESPANOL?',
      '_HABLAS_ALGUNA_LENGUA?',
      '_HAS_EMPRENDIDO_ALGUN_NEGOCIO?',
      '_TU_EMPRENDIMIENTO_ESTA_RELACIONADO_CON_TU_CARRERA?',
      '_TU_EMPRENDIMIENTO_SE_DERIVO_DE_ALGUN_PROYECTO_ESCOLAR__CONCURSO__PROTOTIPO__EMPRENDEDURISMO?',
      '_COMO_VA_TU_EMPRENDIMIENTO?',
      '_APROBASTE_EL_EXAMEN_DE_ADMISION?',
      '_CON_QUIEN_VIVES_ACTUALMENTE?',
      '_PARTICIPASTE_EN_ALGUN_PROGRAMA_ESPECIAL?',
      ''
  ];
    row = row.slice(0, -1);

    CSV += row + "\r\n";
  }

  for (var i = 0; i < arrData.length; i++) {
    row = "";

    for (index in arrData[i]) {
      if (arrData[i][index] == null) arrData[i][index] = "";
      row += `"${arrData[i][index]
        .toString()
        .replace('"', "")
        .replace('"', "")
        .replace('"', "")
        .replace('"', "")}",`;
    }

    row.slice(0, row.length - 1);

    CSV += row + "\r\n";
  }

  if (CSV === "") {
    alert("Invalid data");
    return;
  }

  var uri = "data:text/csv;charset=utf-8," + escape(CSV);

  var link = document.createElement("a");
  link.href = uri;

  link.style = "visibility:hidden";
  link.download = fileName + ".csv";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
 
export function downloadCsvAnswerGraduated(dataset, fileName) {
  const ShowLabel = true;
  var arrData = typeof dataset != "object" ? JSON.parse(dataset) : dataset;
  if (arrData.length > 0 && arrData[0].key) {
    arrData.forEach((element) => {
      delete element.key;
    });
  }
  // eslint-disable-next-line
  var CSV = "sep=," + "\r\n\n";

  var row = "";
  var index;

  if (ShowLabel) {
    /*for (index in arrData[0]) {
      row += index + ",";
    }*/
    /*row =['id','cct','plantel','curp','carrera','nombre','apellido paterno','apellido materno','genero',
  Questionsg.q1.question,Questionsg.q2.question,Questionsg.q3.question,Questionsg.q4.question,Questionsg.q5.question,Questionsg.q6.question,Questionsg.q7.question,Questionsg.q8.question,Questionsg.q9.question,Questionsg.q10.question,Questionsg.q11.question,Questionsg.q12.question,Questionsg.q13.question,Questionsg.q14.question,Questionsg.q15.question,Questionsg.q16.question,
  ,'continua estudiando','discapacidad','grupo etnico','idioma','lengua','emprendimiento','emprendimiento carrera','emprendimiento derivado','emprendimiento estatus','examen','con quien vive','programa',''
  ]*/

  row= [    
      'CCT',
      'PLANTEL',
      'CURP',
      'CARRERA',
      'NOMBRE',
      'PRIMER_APELLIDO',
      'SEGUNDO_PELLIDO',
      'GENERO',
      'CORREO_ELECTRONICO',
      'NUMERO_TELEFONICO',
      "_1_EN_QUE_FRECUENCIA_USAS_TUS_CONOCIMIENTOS_Y_HABILIDADES_QUE_ADQUIRISTE_EN_EL_BACHILLERATO?",
      '_2_QUE_CONOCIMIENTOS_TECNICOS_CONSIDERAS_QUE_TE_HICIERON_FALTA_DURANTE_TU_BACHILLERATO?',
      '_3_QUE_HABILIDADES_CONSIDERAS_QUE_TE_HICIERON_FALTA_DURANTE_TU_BACHILLERATO?',
      '_4_ACTIVIDAD_A_LA_QUE_TE_ESTAS_DEDICANDO?',
      '_5_NOMBRE_DE_LA_INSTITUCION_DONDE_ESTAS_ESTUDIANDO_ACTUALMENTE:',
      '_6_ESTADO_DE_LA_UBICACION_DE_LA_INSTITUCION_DONDE_ESTAS_ESTUDIANDO',
      '_7_QUE_TIPO_DE_INSTITUCION_ES?',
      '_8_NOMBRE_DE_LA_CARRERA_EN_LA_QUE_ESTAS_ESTUDIANDO',
      '_9_LA_CARRERA_QUE_ESTAS_ESTUDIANDO_ACTUALMENTE_ES_AFIN_A_LA_QUE_ESTUDIASTE_EN_EL_BACHILLERATO?',
      '_10_NOMBRE_DE_LA_EMPRESA_DONDE_ESTAS_TRABAJANDO',
      '_11_GIRO_DE_LA_EMPRESA',
      '_12_CUAL_ES_TU_PUESTO_O_LA_ACTIVIDAD_PRINCIPAL_QUE_REALIZAS_EN_TU_TRABAJO?',
      '_13_ESTA_ACTIVIDAD_O_PUESTO_¿_TIENE_RELACION_CON_LA_CARRERA_QUE_ESTUDIASTE_EN_EL_BACHILLERATO?',
      '_14_CUANTO_GANAS_APROXIMADAMENTE_MENSUALMENTE?',
      '_15_CUALES_SON_LAS_CAUSAS_POR_LAS_QUE_ACTUALMENTE_NO_ESTAS_ESTUDIANDO_O_TRABAJANDO?',
      '_16_OTRA_RAZON',
      '_AUTORIZAS_COMPARTIR_TU_INFORMACION_PARA_ALGUNA_EMPRESA_O_VACANTE',
      '_AL_EGRESAR_DEL_BACHILLERATO_CONTINUARAS_CON_TUS_ESTUDIOS?',
      '_TIENES_ALGUNA_DISCAPACIDAD?',
      '_PERTENECES_A_ALGUN_GRUPO_ETNICO?',
      '_HABLAS_OTRO_IDIOMA_DIFERENTE_AL_ESPANOL?',
      '_HABLAS_ALGUNA_LENGUA?',
      '_HAS_EMPRENDIDO_ALGUN_NEGOCIO?',
      '_TU_EMPRENDIMIENTO_ESTA_RELACIONADO_CON_TU_CARRERA?',
      '_TU_EMPRENDIMIENTO_SE_DERIVO_DE_ALGUN_PROYECTO_ESCOLAR__CONCURSO__PROTOTIPO__EMPRENDEDURISMO?',
      '_COMO_VA_TU_EMPRENDIMIENTO?',
      '_APROBASTE_EL_EXAMEN_DE_ADMISION?',
      '_CON_QUIEN_VIVES_ACTUALMENTE?',
      '_PARTICIPASTE_EN_ALGUN_PROGRAMA_ESPECIAL?',
      '', 
  ]

    row = row.slice(0, -1);

    CSV += row + "\r\n";
  }

  for (var i = 0; i < arrData.length; i++) {
    row = "";

    for (index in arrData[i]) {
      if (arrData[i][index] == null) arrData[i][index] = "";
      row += `"${arrData[i][index]
        .toString()
        .replace('"', "")
        .replace('"', "")
        .replace('"', "")
        .replace('"', "")}",`;
    }

    row.slice(0, row.length - 1);

    CSV += row + "\r\n";
  }

  if (CSV === "") {
    alert("Invalid data");
    return;
  }

  var uri = "data:text/csv;charset=utf-8," + escape(CSV);

  var link = document.createElement("a");
  link.href = uri;

  link.style = "visibility:hidden";
  link.download = fileName + ".csv";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
export const roundToOneDecimal = (number) =>
  +(Math.round(number + "e+1") + "e-1");

  ////////////////////////////////////////////////////////
  ////////////////////excel reporte egredsados titulados
  ///////////////////////////////////////////////////////
export function downloadCsvGraduatedState(dataset, fileName) {
  const ShowLabel = true;
  var arrData = typeof dataset != "object" ? JSON.parse(dataset) : dataset;
  if (arrData.length > 0 && arrData[0].key) {
    arrData.forEach((element) => {
      delete element.key;
    });
  }
  var CSV = "";
  var row = "";
  if (ShowLabel) {
    row =['Entidad','Total de de planteles','Número de titulados','Número de egresados']
    CSV += row + "\r\n";
  }
  for (var i = 0; i < arrData.length; i++) {
    row = "";
    row += `"${arrData[i]['entidad'].toString().replace('"', "").replace('"', "").replace('"', "").replace('"', "")}",`;
    row += `"${arrData[i]['num_plantel'].toString().replace('"', "").replace('"', "").replace('"', "").replace('"', "")}",`;
    row += `"${arrData[i]['titulados'].toString().replace('"', "").replace('"', "").replace('"', "").replace('"', "")}",`;
    row += `"${arrData[i]['egresados'].toString().replace('"', "").replace('"', "").replace('"', "").replace('"', "")}"`;
    CSV += row + "\r\n";
  }

  if (CSV === "") {
    alert("Invalid data");
    return;
  }
  var uri = "data:text/csv;charset=utf-8," + escape(CSV);
  var link = document.createElement("a");
  link.href = uri;
  link.style = "visibility:hidden";
  link.download = fileName + ".csv";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function downloadCsvGraduatedSchool(dataset, fileName) {
  const ShowLabel = true;
  var arrData = typeof dataset != "object" ? JSON.parse(dataset) : dataset;
  if (arrData.length > 0 && arrData[0].key) {
    arrData.forEach((element) => {
      delete element.key;
    });
  }
  var CSV = "";
  var row = "";
  if (ShowLabel) {
    row =['Plantel','Suma Tituladas','Suma Egresados']
    CSV += row + "\r\n";
  }
  for (var i = 0; i < arrData.length; i++) {
    row = "";
    row += `"${arrData[i]['nombre'].toString().replace('"', "").replace('"', "").replace('"', "").replace('"', "")}",`;
    row += `"${arrData[i]['suma_titulados'].toString().replace('"', "").replace('"', "").replace('"', "").replace('"', "")}",`;
    row += `"${arrData[i]['suma_egresados'].toString().replace('"', "").replace('"', "").replace('"', "").replace('"', "")}"`;
    CSV += row + "\r\n";
  }

  if (CSV === "") {
    alert("Invalid data");
    return;
  }
  var uri = "data:text/csv;charset=utf-8," + escape(CSV);
  var link = document.createElement("a");
  link.href = uri;
  link.style = "visibility:hidden";
  link.download = fileName + ".csv";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function downloadCsvGraduatedSchoolCareer(dataset, fileName) {
  const ShowLabel = true;
  var arrData = typeof dataset != "object" ? JSON.parse(dataset) : dataset;
  if (arrData.length > 0 && arrData[0].key) {
    arrData.forEach((element) => {
      delete element.key;
    });
  }
  var CSV = "";
  var row = "";
  if (ShowLabel) {
    row =['Carrera','Mujeres Titulados','Hombres Titulados','Mujeres Egresadas','Hombres Egresados']
    CSV += row + "\r\n";
  }
  for (var i = 0; i < arrData.length; i++) {
    row = "";
    row += `"${arrData[i]['nombre'].toString().replace('"', "").replace('"', "").replace('"', "").replace('"', "")}",`;
    row += `"${arrData[i]['tit_m'].toString().replace('"', "").replace('"', "").replace('"', "").replace('"', "")}",`;
    row += `"${arrData[i]['tit_h'].toString().replace('"', "").replace('"', "").replace('"', "").replace('"', "")}",`;
    row += `"${arrData[i]['egr_m'].toString().replace('"', "").replace('"', "").replace('"', "").replace('"', "")}",`;
    row += `"${arrData[i]['egr_h'].toString().replace('"', "").replace('"', "").replace('"', "").replace('"', "")}"`;
    CSV += row + "\r\n";
  }

  if (CSV === "") {
    alert("Invalid data");
    return;
  }
  var uri = "data:text/csv;charset=utf-8," + escape(CSV);
  var link = document.createElement("a");
  link.href = uri;
  link.style = "visibility:hidden";
  link.download = fileName + ".csv";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

//////////para reporte matricula por plantel
export function downloadCsvEnrollmentSchool(dataset, fileName) {
  const ShowLabel = true;
  var arrData = typeof dataset != "object" ? JSON.parse(dataset) : dataset;
  if (arrData.length > 0 && arrData[0].key) {
    arrData.forEach((element) => {
      delete element.key;
    });
  }
  var CSV = "";
  var row = "";
  if (ShowLabel) {
    row =['Plantel','Número de grupos','Número de mujeres','Número de hombres']
    CSV += row + "\r\n";
  }
  for (var i = 0; i < arrData.length; i++) {
    row = "";
    row += `"${arrData[i]['nombre'].toString().replace('"', "").replace('"', "").replace('"', "").replace('"', "")}",`;
    row += `"${arrData[i]['num_grupos'].toString().replace('"', "").replace('"', "").replace('"', "").replace('"', "")}",`;
    row += `"${arrData[i]['num_m'].toString().replace('"', "").replace('"', "").replace('"', "").replace('"', "")}",`;
    row += `"${arrData[i]['num_h'].toString().replace('"', "").replace('"', "").replace('"', "").replace('"', "")}"`;
    CSV += row + "\r\n";
  }

  if (CSV === "") {
    alert("Invalid data");
    return;
  }
  var uri = "data:text/csv;charset=utf-8," + escape(CSV);
  var link = document.createElement("a");
  link.href = uri;
  link.style = "visibility:hidden";
  link.download = fileName + ".csv";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

//////////para reporte matricula por Carrera
export function downloadCsvEnrollmentSchoolCareer(dataset, fileName) {
  const ShowLabel = true;
  var arrData = typeof dataset != "object" ? JSON.parse(dataset) : dataset;
  if (arrData.length > 0 && arrData[0].key) {
    arrData.forEach((element) => {
      delete element.key;
    });
  }
  var CSV = "";
  var row = "";
  if (ShowLabel) {
    row =['Plantel','Número de grupos','Semestre','Número de mujeres','Número de hombres','Turno']
    CSV += row + "\r\n";
  }
  for (var i = 0; i < arrData.length; i++) {
    row = "";
    row += `"${arrData[i]['nombre'].toString().replace('"', "").replace('"', "").replace('"', "").replace('"', "")}",`;
    row += `"${arrData[i]['num_grupos'].toString().replace('"', "").replace('"', "").replace('"', "").replace('"', "")}",`;
    row += `"${arrData[i]['semestre'].toString().replace('"', "").replace('"', "").replace('"', "").replace('"', "")}",`;
    row += `"${arrData[i]['num_m'].toString().replace('"', "").replace('"', "").replace('"', "").replace('"', "")}",`;
    row += `"${arrData[i]['num_h'].toString().replace('"', "").replace('"', "").replace('"', "").replace('"', "")}",`;
    row += `"${arrData[i]['turno'].toString().replace('"', "").replace('"', "").replace('"', "").replace('"', "")}"`;
    CSV += row + "\r\n";
  }

  if (CSV === "") {
    alert("Invalid data");
    return;
  }
  var uri = "data:text/csv;charset=utf-8," + escape(CSV);
  var link = document.createElement("a");
  link.href = uri;
  link.style = "visibility:hidden";
  link.download = fileName + ".csv";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
 ////////////////////////////////////////////////////////
  ////////////////////excel reporte Nivel de estudios
  ///////////////////////////////////////////////////////
  export function downloadCsvStudyLevelState(dataset, fileName) {
    const ShowLabel = true;
    var arrData = typeof dataset != "object" ? JSON.parse(dataset) : dataset;
    if (arrData.length > 0 && arrData[0].key) {
      arrData.forEach((element) => {
        delete element.key;
      });
    }
    var CSV = "";
    var row = "";
    if (ShowLabel) {
      row =['Entidad','Total de de planteles','Total Doctorado','Total Maestría','Total Especialización','Total Licenciatura','Total Superior','Total de Maestro','Total Bachillerato','Total Técnico','Total Comercial','Total Secundaria','Total Primaria']
      CSV += row + "\r\n";
    }
    for (var i = 0; i < arrData.length; i++) {
      row = "";
      row += `"${arrData[i]['entidad'].toString().replace('"', "").replace('"', "").replace('"', "").replace('"', "")}",`;
      row += `"${arrData[i]['num_plantel'].toString().replace('"', "").replace('"', "").replace('"', "").replace('"', "")}",`;
      row += `"${arrData[i]['sumDoc'].toString().replace('"', "").replace('"', "").replace('"', "").replace('"', "")}",`;
      row += `"${arrData[i]['sumMia'].toString().replace('"', "").replace('"', "").replace('"', "").replace('"', "")}",`;
      row += `"${arrData[i]['sumEsp'].toString().replace('"', "").replace('"', "").replace('"', "").replace('"', "")}",`;
      row += `"${arrData[i]['sumLic'].toString().replace('"', "").replace('"', "").replace('"', "").replace('"', "")}",`;
      row += `"${arrData[i]['sumSup'].toString().replace('"', "").replace('"', "").replace('"', "").replace('"', "")}",`;
      row += `"${arrData[i]['sumMto'].toString().replace('"', "").replace('"', "").replace('"', "").replace('"', "")}",`;
      row += `"${arrData[i]['sumBac'].toString().replace('"', "").replace('"', "").replace('"', "").replace('"', "")}",`;
      row += `"${arrData[i]['sumTec'].toString().replace('"', "").replace('"', "").replace('"', "").replace('"', "")}",`;
      row += `"${arrData[i]['sumCom'].toString().replace('"', "").replace('"', "").replace('"', "").replace('"', "")}",`;
      row += `"${arrData[i]['sumSec'].toString().replace('"', "").replace('"', "").replace('"', "").replace('"', "")}",`;
      row += `"${arrData[i]['sumPia'].toString().replace('"', "").replace('"', "").replace('"', "").replace('"', "")}"`;
      CSV += row + "\r\n";
    }
  
    if (CSV === "") {
      alert("Invalid data");
      return;
    }
    var uri = "data:text/csv;charset=utf-8," + escape(CSV);
    var link = document.createElement("a");
    link.href = uri;
    link.style = "visibility:hidden";
    link.download = fileName + ".csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  export function downloadCsvStudyLevelSchools(dataset, fileName) {
    const ShowLabel = true;
    var arrData = typeof dataset != "object" ? JSON.parse(dataset) : dataset;
    if (arrData.length > 0 && arrData[0].key) {
      arrData.forEach((element) => {
        delete element.key;
      });
    }
    var CSV = "";
    var row = "";
    if (ShowLabel) {
      row =['plantel_id','plantel','cct','ciclo',"doctorado mujeres",			
      "doctorado hombres",			
      "maestría mujeres",			
      "maestría hombres",			
      "especialización mujeres",	
      "especialización hombres",	
      "licenciatura mujeres",	
      "licenciatura hombres",	
      "superior mujeres",		
      "superior hombres",		
      "de maestro mujeres",	
      "de maestro hombres",	
      "bachillerato mujeres",	
      "bachillerato hombres",	
      "técnico mujeres",		
      "técnico hombres",		
      "comercial mujeres",		
      "comercial hombres",		
      "secundaria mujeres",	
      "secundaria hombres",	
      "primaria mujeres",		
      "primaria hombres"]
      CSV += row + "\r\n";
    }
    for (var i = 0; i < arrData.length; i++) {
      row = "";
      row += `"${arrData[i]['plantel_id'].toString().replace('"', "").replace('"', "").replace('"', "").replace('"', "")}",`;
      row += `"${arrData[i]['plantel'].toString().replace('"', "").replace('"', "").replace('"', "").replace('"', "")}",`;
      row += `"${arrData[i]['cct'].toString().replace('"', "").replace('"', "").replace('"', "").replace('"', "")}",`;
      row += `"${arrData[i]['ciclo'].toString().replace('"', "").replace('"', "").replace('"', "").replace('"', "")}",`;
      row += `"${arrData[i]['doc_m'].toString().replace('"', "").replace('"', "").replace('"', "").replace('"', "")}",`;
      row += `"${arrData[i]['doc_h'].toString().replace('"', "").replace('"', "").replace('"', "").replace('"', "")}",`;
      row += `"${arrData[i]['mia_m'].toString().replace('"', "").replace('"', "").replace('"', "").replace('"', "")}",`;
      row += `"${arrData[i]['mia_h'].toString().replace('"', "").replace('"', "").replace('"', "").replace('"', "")}",`;
      row += `"${arrData[i]['esp_m'].toString().replace('"', "").replace('"', "").replace('"', "").replace('"', "")}",`;
      row += `"${arrData[i]['esp_h'].toString().replace('"', "").replace('"', "").replace('"', "").replace('"', "")}",`;
      row += `"${arrData[i]['lic_m'].toString().replace('"', "").replace('"', "").replace('"', "").replace('"', "")}",`;
      row += `"${arrData[i]['lic_h'].toString().replace('"', "").replace('"', "").replace('"', "").replace('"', "")}",`;
      row += `"${arrData[i]['sup_m'].toString().replace('"', "").replace('"', "").replace('"', "").replace('"', "")}",`;
      row += `"${arrData[i]['sup_h'].toString().replace('"', "").replace('"', "").replace('"', "").replace('"', "")}",`;
      row += `"${arrData[i]['mto_m'].toString().replace('"', "").replace('"', "").replace('"', "").replace('"', "")}",`;
      row += `"${arrData[i]['mto_h'].toString().replace('"', "").replace('"', "").replace('"', "").replace('"', "")}",`;
      row += `"${arrData[i]['bac_m'].toString().replace('"', "").replace('"', "").replace('"', "").replace('"', "")}",`;
      row += `"${arrData[i]['bac_h'].toString().replace('"', "").replace('"', "").replace('"', "").replace('"', "")}",`;
      row += `"${arrData[i]['tec_m'].toString().replace('"', "").replace('"', "").replace('"', "").replace('"', "")}",`;
      row += `"${arrData[i]['tec_h'].toString().replace('"', "").replace('"', "").replace('"', "").replace('"', "")}",`;
      row += `"${arrData[i]['com_m'].toString().replace('"', "").replace('"', "").replace('"', "").replace('"', "")}",`;
      row += `"${arrData[i]['com_h'].toString().replace('"', "").replace('"', "").replace('"', "").replace('"', "")}",`;
      row += `"${arrData[i]['sec_m'].toString().replace('"', "").replace('"', "").replace('"', "").replace('"', "")}",`;
      row += `"${arrData[i]['sec_h'].toString().replace('"', "").replace('"', "").replace('"', "").replace('"', "")}",`;
      row += `"${arrData[i]['pia_m'].toString().replace('"', "").replace('"', "").replace('"', "").replace('"', "")}",`;
      row += `"${arrData[i]['pia_h'].toString().replace('"', "").replace('"', "").replace('"', "").replace('"', "")}"`;  
      CSV += row + "\r\n";
    }
  
    if (CSV === "") {
      alert("Invalid data");
      return;
    }
    var uri = "data:text/csv;charset=utf-8," + escape(CSV);
    var link = document.createElement("a");
    link.href = uri;
    link.style = "visibility:hidden";
    link.download = fileName + ".csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
  
  export function downloadCsvStudyLevelSchool(dataset, fileName) {
    const ShowLabel = true;
    var arrData = typeof dataset != "object" ? JSON.parse(dataset) : dataset;
    if (arrData.length > 0 && arrData[0].key) {
      arrData.forEach((element) => {
        delete element.key;
      });
    }
    var CSV = "";
    var row = "";
    if (ShowLabel) {
      row =['cct','Plantel','Plaza','Turno','doctorado titulado mujeres','doctorado estudios concluidos mujeres','doctorado estudios sin concluir mujeres','doctorado titulado hombres','doctorado estudios concluidos hombres','doctorado estudios sin concluir hombres','maestría titulado mujeres','maestría estudios concluidos mujeres','maestría estudios sin concluir mujeres','maestría titulado hombres',
      'maestría estudios concluidos hombres','maestría estudios sin concluir hombres','especialización titulado mujeres','especialización estudios concluidos mujeres','especialización estudios sin concluir mujeres','especialización titulado hombres','especialización estudios concluidos hombres','especialización estudios sin concluir hombres','licenciatura titulado mujeres','licenciatura estudios concluidos mujeres','licenciatura estudios sin concluir mujeres','licenciatura titulado hombres','licenciatura estudios concluidos hombres','licenciatura estudios sin concluir hombres','superior titulado mujeres',
      'superior estudios concluidos mujeres','superior estudios sin concluir mujeres','superior titulado hombres','superior estudios concluidos hombres','superior estudios sin concluir hombres','de maestro titulado mujeres','de maestro estudios concluidos mujeres','de maestro estudios sin concluir mujeres','de maestro titulado hombres','de maestro estudios concluidos hombres','de maestro estudios sin concluir hombres','bachillerato titulado mujeres','bachillerato estudios concluidos mujeres','bachillerato estudios sin concluir mujeres',
      'bachillerato titulado hombres','bachillerato estudios concluidos hombres','bachillerato estudios sin concluir hombres','técnico titulado mujeres','técnico estudios concluidos mujeres','técnico estudios sin concluir mujeres','técnico titulado hombres','técnico estudios concluidos hombres','técnico estudios sin concluir hombres','comercial titulado mujeres','comercial estudios concluidos mujeres','comercial estudios sin concluir mujeres','comercial titulado hombres','comercial estudios concluidos hombres','comercial estudios sin concluir hombres',
      'secundaria titulado mujeres','secundaria estudios concluidos mujeres','secundaria estudios sin concluir mujeres','secundaria titulado hombres','secundaria estudios concluidos hombres','secundaria estudios sin concluir hombres','primaria titulado mujeres','primaria estudios concluidos mujeres','primaria estudios sin concluir mujeres','primaria titulado hombres','primaria estudios concluidos hombres','primaria estudios sin concluir hombres']
      CSV += row + "\r\n";
    }
    for (var i = 0; i < arrData.length; i++) {
      row = "";
      row += `"${arrData[i]['cct'].toString().replace('"', "").replace('"', "").replace('"', "").replace('"', "")}",`;
      row += `"${arrData[i]['plantel'].toString().replace('"', "").replace('"', "").replace('"', "").replace('"', "")}",`;
      row += `"${arrData[i]['plaza'].toString().replace('"', "").replace('"', "").replace('"', "").replace('"', "")}",`;
      row += `"${arrData[i]['turno'].toString().replace('"', "").replace('"', "").replace('"', "").replace('"', "")}",`;
      row += `"${arrData[i]['doc_t_m'].toString().replace('"', "").replace('"', "").replace('"', "").replace('"', "")}",`;
      row += `"${arrData[i]['doc_ec_m'].toString().replace('"', "").replace('"', "").replace('"', "").replace('"', "")}",`;
      row += `"${arrData[i]['doc_es_m'].toString().replace('"', "").replace('"', "").replace('"', "").replace('"', "")}",`;
      row += `"${arrData[i]['doc_t'].toString().replace('"', "").replace('"', "").replace('"', "").replace('"', "")}",`;
      row += `"${arrData[i]['doc_ec'].toString().replace('"', "").replace('"', "").replace('"', "").replace('"', "")}",`;
      row += `"${arrData[i]['doc_es'].toString().replace('"', "").replace('"', "").replace('"', "").replace('"', "")}",`;
      row += `"${arrData[i]['mia_t_m'].toString().replace('"', "").replace('"', "").replace('"', "").replace('"', "")}",`;
      row += `"${arrData[i]['mia_ec_m'].toString().replace('"', "").replace('"', "").replace('"', "").replace('"', "")}",`;
      row += `"${arrData[i]['mia_es_m'].toString().replace('"', "").replace('"', "").replace('"', "").replace('"', "")}",`;
      row += `"${arrData[i]['mia_t'].toString().replace('"', "").replace('"', "").replace('"', "").replace('"', "")}",`;
      row += `"${arrData[i]['mia_ec'].toString().replace('"', "").replace('"', "").replace('"', "").replace('"', "")}",`;
      row += `"${arrData[i]['mia_es'].toString().replace('"', "").replace('"', "").replace('"', "").replace('"', "")}",`;
      row += `"${arrData[i]['esp_t_m'].toString().replace('"', "").replace('"', "").replace('"', "").replace('"', "")}",`;
      row += `"${arrData[i]['esp_ec_m'].toString().replace('"', "").replace('"', "").replace('"', "").replace('"', "")}",`;
      row += `"${arrData[i]['esp_es_m'].toString().replace('"', "").replace('"', "").replace('"', "").replace('"', "")}",`;
      row += `"${arrData[i]['esp_t'].toString().replace('"', "").replace('"', "").replace('"', "").replace('"', "")}",`;
      row += `"${arrData[i]['esp_ec'].toString().replace('"', "").replace('"', "").replace('"', "").replace('"', "")}",`;
      row += `"${arrData[i]['esp_es'].toString().replace('"', "").replace('"', "").replace('"', "").replace('"', "")}",`;
      row += `"${arrData[i]['lic_t_m'].toString().replace('"', "").replace('"', "").replace('"', "").replace('"', "")}",`;
      row += `"${arrData[i]['lic_ec_m'].toString().replace('"', "").replace('"', "").replace('"', "").replace('"', "")}",`;
      row += `"${arrData[i]['lic_es_m'].toString().replace('"', "").replace('"', "").replace('"', "").replace('"', "")}",`;
      row += `"${arrData[i]['lic_t'].toString().replace('"', "").replace('"', "").replace('"', "").replace('"', "")}",`;
      row += `"${arrData[i]['lic_ec'].toString().replace('"', "").replace('"', "").replace('"', "").replace('"', "")}",`;
      row += `"${arrData[i]['lic_es'].toString().replace('"', "").replace('"', "").replace('"', "").replace('"', "")}",`;
      row += `"${arrData[i]['sup_t_m'].toString().replace('"', "").replace('"', "").replace('"', "").replace('"', "")}",`;
      row += `"${arrData[i]['sup_ec_m'].toString().replace('"', "").replace('"', "").replace('"', "").replace('"', "")}",`;
      row += `"${arrData[i]['sup_es_m'].toString().replace('"', "").replace('"', "").replace('"', "").replace('"', "")}",`;
      row += `"${arrData[i]['sup_t'].toString().replace('"', "").replace('"', "").replace('"', "").replace('"', "")}",`;
      row += `"${arrData[i]['sup_ec'].toString().replace('"', "").replace('"', "").replace('"', "").replace('"', "")}",`;
      row += `"${arrData[i]['sup_es'].toString().replace('"', "").replace('"', "").replace('"', "").replace('"', "")}",`;
      row += `"${arrData[i]['mto_t_m'].toString().replace('"', "").replace('"', "").replace('"', "").replace('"', "")}",`;
      row += `"${arrData[i]['mto_ec_m'].toString().replace('"', "").replace('"', "").replace('"', "").replace('"', "")}",`;
      row += `"${arrData[i]['mto_es_m'].toString().replace('"', "").replace('"', "").replace('"', "").replace('"', "")}",`;
      row += `"${arrData[i]['mto_t'].toString().replace('"', "").replace('"', "").replace('"', "").replace('"', "")}",`;
      row += `"${arrData[i]['mto_ec'].toString().replace('"', "").replace('"', "").replace('"', "").replace('"', "")}",`;
      row += `"${arrData[i]['mto_es'].toString().replace('"', "").replace('"', "").replace('"', "").replace('"', "")}",`;
      row += `"${arrData[i]['bac_t_m'].toString().replace('"', "").replace('"', "").replace('"', "").replace('"', "")}",`;
      row += `"${arrData[i]['bac_ec_m'].toString().replace('"', "").replace('"', "").replace('"', "").replace('"', "")}",`;
      row += `"${arrData[i]['bac_es_m'].toString().replace('"', "").replace('"', "").replace('"', "").replace('"', "")}",`;
      row += `"${arrData[i]['bac_t'].toString().replace('"', "").replace('"', "").replace('"', "").replace('"', "")}",`;
      row += `"${arrData[i]['bac_ec'].toString().replace('"', "").replace('"', "").replace('"', "").replace('"', "")}",`;
      row += `"${arrData[i]['bac_es'].toString().replace('"', "").replace('"', "").replace('"', "").replace('"', "")}",`;
      row += `"${arrData[i]['tec_t_m'].toString().replace('"', "").replace('"', "").replace('"', "").replace('"', "")}",`;
      row += `"${arrData[i]['tec_ec_m'].toString().replace('"', "").replace('"', "").replace('"', "").replace('"', "")}",`;
      row += `"${arrData[i]['tec_es_m'].toString().replace('"', "").replace('"', "").replace('"', "").replace('"', "")}",`;
      row += `"${arrData[i]['tec_t'].toString().replace('"', "").replace('"', "").replace('"', "").replace('"', "")}",`;
      row += `"${arrData[i]['tec_ec'].toString().replace('"', "").replace('"', "").replace('"', "").replace('"', "")}",`;
      row += `"${arrData[i]['tec_es'].toString().replace('"', "").replace('"', "").replace('"', "").replace('"', "")}",`;
      row += `"${arrData[i]['com_t_m'].toString().replace('"', "").replace('"', "").replace('"', "").replace('"', "")}",`;
      row += `"${arrData[i]['com_ec_m'].toString().replace('"', "").replace('"', "").replace('"', "").replace('"', "")}",`;
      row += `"${arrData[i]['com_es_m'].toString().replace('"', "").replace('"', "").replace('"', "").replace('"', "")}",`;
      row += `"${arrData[i]['com_t'].toString().replace('"', "").replace('"', "").replace('"', "").replace('"', "")}",`;
      row += `"${arrData[i]['com_ec'].toString().replace('"', "").replace('"', "").replace('"', "").replace('"', "")}",`;
      row += `"${arrData[i]['com_es'].toString().replace('"', "").replace('"', "").replace('"', "").replace('"', "")}",`;
      row += `"${arrData[i]['sec_t_m'].toString().replace('"', "").replace('"', "").replace('"', "").replace('"', "")}",`;
      row += `"${arrData[i]['sec_ec_m'].toString().replace('"', "").replace('"', "").replace('"', "").replace('"', "")}",`;
      row += `"${arrData[i]['sec_es_m'].toString().replace('"', "").replace('"', "").replace('"', "").replace('"', "")}",`;
      row += `"${arrData[i]['sec_t'].toString().replace('"', "").replace('"', "").replace('"', "").replace('"', "")}",`;
      row += `"${arrData[i]['sec_ec'].toString().replace('"', "").replace('"', "").replace('"', "").replace('"', "")}",`;
      row += `"${arrData[i]['sec_es'].toString().replace('"', "").replace('"', "").replace('"', "").replace('"', "")}",`;
      row += `"${arrData[i]['pia_t_m'].toString().replace('"', "").replace('"', "").replace('"', "").replace('"', "")}",`;
      row += `"${arrData[i]['pia_ec_m'].toString().replace('"', "").replace('"', "").replace('"', "").replace('"', "")}",`;
      row += `"${arrData[i]['pia_es_m'].toString().replace('"', "").replace('"', "").replace('"', "").replace('"', "")}",`;
      row += `"${arrData[i]['pia_t'].toString().replace('"', "").replace('"', "").replace('"', "").replace('"', "")}",`;
      row += `"${arrData[i]['pia_ec'].toString().replace('"', "").replace('"', "").replace('"', "").replace('"', "")}",`;
      row += `"${arrData[i]['pia_es'].toString().replace('"', "").replace('"', "").replace('"', "").replace('"', "")}"`;  
      CSV += row + "\r\n";
    }
  
    if (CSV === "") {
      alert("Invalid data");
      return;
    }
    var uri = "data:text/csv;charset=utf-8," + escape(CSV);
    var link = document.createElement("a");
    link.href = uri;
    link.style = "visibility:hidden";
    link.download = fileName + ".csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  //////////para carga masiva alumnos egresados
export function downloadCsvMasiveLoadGraduates(fileName) {
  const ShowLabel = true;
  var CSV = "";
  var row = "";
  if (ShowLabel) {
    row =['colegio','cct','nombre_plantel','turno','cve_carrera','nombre_carrera','matricula',
    'nombre','ap_paterno','ap_materno','curp','genero','correo','grupo']
    CSV += row + "\r\n";
  }
  var uri = "data:text/csv;charset=utf-8," + escape(CSV);
  var link = document.createElement("a");
  link.href = uri;
  link.style = "visibility:hidden";
  link.download = fileName + ".csv";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function downloadXlsxMasiveGraduates(fileName) { 
  const ShowLabel = true;
  var XLSX = "";
  var row = "";
  if (ShowLabel) {
    row =['colegio','cct','nombre_plantel','turno','cve_carrera','nombre_carrera','matricula',
    'nombre','ap_paterno','ap_materno','curp','genero','correo','grupo']
    XLSX += row + "\r\n";
  }
  var uri = "data:text/xlsx;charset=utf-8," + escape(XLSX);
  var link = document.createElement("a");
  link.href = uri;
  link.style = "visibility:hidden";
  link.download = fileName + ".xlsx";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export const getLetrasNumero = (v1, v2) => {
  let letra;
  let letra2;
  switch(v1){
    case "1":
      letra="Uno";
    break;
    case "2":
      letra="Dos";
    break;
    case "3":
      letra="Tres";
    break;
    case "4":
      letra="Cuatro";
    break;
    case "5": 
      letra="Cinco";
    break;
    case "6":
      letra="Seis";
    break;
    case "7":
      letra="Siete";
    break;
    case "8":
      letra="Ocho";
    break;
    case "9": 
      letra="Nueve";
    break;
    case "0":
      letra="Cero";
    break;      
  }
  switch(v2){
    case "1":
      letra2="uno";
    break;
    case "2":
      letra2="dos";
    break;
    case "3":
      letra2="tres";
    break;
    case "4":
      letra2="cuatro";
    break;
    case "5": 
      letra2="cinco";
    break;
    case "6":
      letra2="seis";
    break;
    case "7":
      letra2="siete";
    break;
    case "8":
      letra2="ocho";
    break;
    case "9": 
      letra2="nueve";
    break;
    case "0":
      letra2="cero";
    break;      
  }  
  return letra +" punto "+letra2;
};