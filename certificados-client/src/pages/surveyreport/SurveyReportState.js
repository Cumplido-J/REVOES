import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { Breadcrumb, Row, Col, Alert } from "antd";
import { HomeOutlined, CheckCircleOutlined } from "@ant-design/icons";
import { ButtonExcel, Loading, SearchSelect, Title, ButtonExcelAnswer, ButtonExcelAnswerGraduated, ButtonCustom } from "../../shared/components";
import { surveyTypeCatalog, SurveyTypes } from "../../shared/catalogs";

import SurveyReportService from "../../service/SurveyReportService";
import SurveyReportStateTable from "./SurveyReportStateTable";

const colProps = {
  xs: { span: 24 },
  md: { span: 8 },
};
const rowProps = {
  style: { marginBottom: "1em" },
};

export default function SurveyReportState({ match }) {
  const stateId = match.params.stateId;
  //variable nuevo
  // const tipo = match.params.surveyTipo;
  let tipo = "";
  let tipoSur = "";
  if (match.params.surveyTipo) {
    tipo = match.params.surveyTipo;
    if (tipo == 1) {
      tipoSur = SurveyTypes.INTENTIONS2020;
    }
    else if (tipo == 2) {
      tipoSur = SurveyTypes.GRADUATED2020;
    } else if (tipo == 3) {
      tipoSur = SurveyTypes.INTENTIONS2021;
    }
    else if (tipo == 4) {
      tipoSur = SurveyTypes.GRADUATED2021;
    }
    else if (tipo == 5) {
      tipoSur = SurveyTypes.INTENTIONS2022;
    }
    /*else if (tipo == 6) {
      tipoSur = SurveyTypes.GRADUATED2022;
    }*/

  } else {
    tipoSur = SurveyTypes.INTENTIONS2022;
  }
  const [loading, setLoading] = useState(false);
  const [surveyReport, setSurveyReport] = useState([]);
  const [surveyReportAnswer, setSurveyReportAnswer] = useState([]);
  const [answer, setAnswer] = useState(false);
  const [surveyType, setSurveyType] = useState(tipoSur);


  useEffect(() => {
    const getSurveyReport = async () => {
      setLoading(true);
      const response = await SurveyReportService.getStateReport(surveyType, stateId);
      //const responseAnswer = await SurveyReportService.getStateReportAnswer(surveyType, stateId);
      setLoading(false);
      if (!response.success) return;
      setSurveyReport(response.surveyReport);
      //setSurveyReportAnswer(responseAnswer.surveyReport);
      //console.log(response.surveyReport)
    };
    getSurveyReport();
  }, [surveyType, stateId]);

  const answerCuestion = async () => {
    setLoading(true);
    const responseAnswer = await SurveyReportService.getStateReportAnswer(surveyType, stateId);
    setLoading(false);
    setSurveyReportAnswer(responseAnswer.surveyReport);
    setAnswer(true);
  }
  const answerCuestionGraduated = async () => {
    setLoading(true);
    const response = await SurveyReportService.getStateReportAnswerGraduated(surveyType, stateId);
    const datos = response.surveyReport.schools.map((school) => ({
      CCT: school.cct,
      PLANTEL: school.plantel,
      CURP: school.curp,
      CARRERA: school.carrera,
      NOMBRE: school.nombre,
      PRIMER_APELLIDO: school.apellido_paterno,
      SEGUNDO_PELLIDO: school.apellido_materno,
      GENERO: school.genero,
      CORREO: school.correo,
      TELEFONO: school.numeroTelefonico,
      q1: school.q1,
      q2: school.q2,
      q3: school.q3,
      q4: school.q4,
      q5: school.q5,
      q6: school.q6,
      q7: school.q7,
      q8: school.q8,
      q9: school.q9,
      q10: school.q10,
      q11: school.q11,
      q12: school.q12,
      q13: school.q13,
      q14: school.q14,
      q15: school.q15,
      _16_OTRA_RAZON: school.q16,
      _AUTORIZAS_COMPARTIR_TU_INFORMACION_PARA_ALGUNA_EMPRESA_O_VACANTE: school.shareInformation,
      _AL_EGRESAR_DEL_BACHILLERATO_CONTINUARAS_CON_TUS_ESTUDIOS: school.continua_estudios,
      _TIENES_ALGUNA_DISCAPACIDAD: school.discapacidad,
      _PERTENECES_A_ALGUN_GRUPO_ETNICO: school.grupo_etnico,
      _HABLAS_OTRO_IDIOMA_DIFERENTE_AL_ESPANOL: school.idioma,
      _HABLAS_ALGUNA_LENGUA: school.lengua,
      _HAS_EMPRENDIDO_ALGUN_NEGOCIO: school.emprendimiento,
      _TU_EMPRENDIMIENTO_ESTA_RELACIONADO_CON_TU_CARRERA: school.emprendimiento_carrera,
      _TU_EMPRENDIMIENTO_SE_DERIVO_DE_ALGUN_PROYECTO_ESCOLAR__CONCURSO__PROTOTIPO__EMPRENDEDURISMO: school.emprendimiento_derivado,
      _COMO_VA_TU_EMPRENDIMIENTO: school.emprendimiento_estatus,
      _APROBASTE_EL_EXAMEN_DE_ADMISION: school.examen,
      _CON_QUIEN_VIVES_ACTUALMENTE: school.hogar,
      _PARTICIPASTE_EN_ALGUN_PROGRAMA_ESPECIAL: school.programa,

    }))
    let json = { "schools": datos }
    setLoading(false);
    setSurveyReportAnswer(json);
    setAnswer(true);
  }
  return (
    <>
      <SurveyReportStateHeader />

      <Loading loading={loading}>
        <p>
          A continuación se muestran los planteles del estado de <strong>{surveyReport.stateName}</strong>
        </p>
        <Row align="center" style={{ marginBlockEnd: 5, marginBlockStart: 10 }}>
          <Col style={{ marginInlineEnd: 5 }}>
            <label>Encuesta: </label>
            <SearchSelect dataset={surveyTypeCatalog} onChange={setSurveyType} value={surveyType} />
          </Col>



          <Col style={{ marginInlineEnd: 5 }}>
            <label>Excel: </label><br></br>
            <ButtonExcel
              dataset={surveyReport.schools}
              filename={`ReporteEstado${surveyReport.stateName}`}
              loading={loading}
            />
          </Col>
          <Col style={{ marginInlineEnd: 5 }}>
            <label>Preparar reporte: </label><br></br>
            {!answer && surveyType === 3 && (
              <ButtonCustom
                tooltip="Preparar datos"
                color="gold"
                fullWidth
                onClick={answerCuestion}
                loading={loading}
                icon={<CheckCircleOutlined />}
              >
                Preparar resultado de encuesta por estado
              </ButtonCustom>
            )}
            {!answer && surveyType === 4 && (
              <ButtonCustom
                tooltip="Preparar datos"
                color="gold"
                fullWidth
                onClick={answerCuestionGraduated}
                loading={loading}
                icon={<CheckCircleOutlined />}
              >
                Preparar resultado de encuesta por estado
              </ButtonCustom>
            )}
            {!answer && surveyType === 5 && (
              <ButtonCustom
                tooltip="Preparar datos"
                color="gold"
                fullWidth
                onClick={answerCuestion}
                loading={loading}
                icon={<CheckCircleOutlined />}
              >Preparar resultado de encuesta por estado
              </ButtonCustom>
            )}
            {!answer && surveyType === 6 && (
              <ButtonCustom tooltip="Preparar datos" color="gold" fullWidth
                onClick={answerCuestionGraduated}
                loading={loading}
                icon={<CheckCircleOutlined />} >
                Preparar resultado de encuesta por estado
              </ButtonCustom>
            )}
            {answer && surveyType === 3 && (
              <ButtonExcelAnswer
                dataset={surveyReportAnswer.schools}
                filename={`ReporteRespuestas${surveyReport.stateName}`}
                loading={loading}
              />
            )}
            {answer && surveyType === 4 && (
              <ButtonExcelAnswerGraduated
                dataset={surveyReportAnswer.schools}
                filename={`ReporteRespuestas${surveyReport.stateName}`}
                loading={loading}
              />

            )}
            {answer && surveyType === 5 && (
              <ButtonExcelAnswer
                dataset={surveyReportAnswer.schools}
                filename={`ReporteRespuestas${surveyReport.stateName}`}
                loading={loading}
              />
            )}
            {answer && surveyType === 6 && (
              <ButtonExcelAnswerGraduated
                dataset={surveyReportAnswer.schools}
                filename={`ReporteRespuestas${surveyReport.stateName}`}
                loading={loading} />
            )}
          </Col>
        </Row>
        <SurveyReportStateTable dataset={surveyReport.schools} surveyTipo={surveyType} />
      </Loading>
    </>
  );
}

function SurveyReportStateHeader() {
  return (
    <>
      <Breadcrumb>
        <Breadcrumb.Item>
          <Link to="/" style={{ color: "black" }}>
            <HomeOutlined />
          </Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item style={{ color: "black" }}>
          <span>Reporte república</span>
        </Breadcrumb.Item>
      </Breadcrumb>

      <Row style={{ marginTop: "1em" }}>
        <Col xs={{ span: 24 }}>
          <Title>Reporte de encuestas</Title>
        </Col>
      </Row>
    </>
  );
}
