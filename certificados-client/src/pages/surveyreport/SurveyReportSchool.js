import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { Breadcrumb, Row, Col } from "antd";
import { HomeOutlined } from "@ant-design/icons";

import { ButtonExcel, Loading, SearchSelect, Title } from "../../shared/components";
import { surveyTypeCatalog, SurveyTypes } from "../../shared/catalogs";

import SurveyReportService from "../../service/SurveyReportService";
import SurveyReportSchoolTable from "./SurveyReportSchoolTable";

const colProps = {
  xs: { span: 24 },
  md: { span: 8 },
};
const rowProps = {
  style: { marginBottom: "1em" },
};

export default function SurveyReportSchool({ match }) {
  const schoolId = match.params.schoolId;

  //const tipo=match.params.surveyTipo;
  let tipo = "";
  let tipoSur = "";
  if (match.params.surveyTipo) {
    tipo = match.params.surveyTipo;
    if(tipo==1){
      tipoSur = SurveyTypes.INTENTIONS2020;
    }
    else if(tipo==2){
      tipoSur = SurveyTypes.GRADUATED2020;
    }else if(tipo==3){
      tipoSur = SurveyTypes.INTENTIONS2021;
    }
    else if(tipo==4){
      tipoSur = SurveyTypes.GRADUATED2021;
    }
    else if (tipo==5) {
      tipoSur = SurveyTypes.INTENTIONS2022;
    }
    /*else if(tipo==6) {
      tipoSur = SurveyTypes.GRADUATED2022;
    }*/

  } else {
    tipoSur = SurveyTypes.INTENTIONS2022;
  }

  const [loading, setLoading] = useState(false);
  const [surveyReport, setSurveyReport] = useState([]);
  const [surveyType, setSurveyType] = useState(tipoSur);
  //const [surveyType, setSurveyType] = useState([]);
  useEffect(() => {
    const getSurveyReport = async () => {
      setLoading(true);
      const response = await SurveyReportService.getSchoolReport(surveyType, schoolId);
      setLoading(false);
      if (!response.success) return;
      setSurveyReport(response.surveyReport);
    };
    getSurveyReport();
  }, [surveyType, schoolId]);

  return (
    <>
      <SurveyReportStateHeader />

      <Loading loading={loading}>
        <p>
          A continuación se muestran los alumnos del plantel <strong>{surveyReport.schoolName}</strong>
        </p>
        <Row {...rowProps}>
          <Col {...colProps}>
            <label>Encuesta: </label>
            <SearchSelect dataset={surveyTypeCatalog} onChange={setSurveyType} value={surveyType} />
          </Col>
          <Col {...colProps}>
            <label>&nbsp;</label>
            <br></br>
            <ButtonExcel dataset={surveyReport.students} filename={`ReportePlantel${surveyReport.cct}`} loading={loading} />
          </Col>
        </Row>
        <SurveyReportSchoolTable dataset={surveyReport.students}  surveyType={surveyType}/>
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
          <span>Reporte plantel</span>
        </Breadcrumb.Item>
      </Breadcrumb>

      <Row style={{ marginTop: "1em" }}>
        <Col xs={{ span: 24 }}>
          <Title>Reporte por plantel</Title>
        </Col>
      </Row>
    </>
  );
}
