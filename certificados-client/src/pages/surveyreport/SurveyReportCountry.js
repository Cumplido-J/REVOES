import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { Breadcrumb, Row, Col } from "antd";
import { HomeOutlined } from "@ant-design/icons";

import { Loading, SearchSelect, Title, ButtonExcel } from "../../shared/components";
import { surveyTypeCatalog, SurveyTypes } from "../../shared/catalogs";

import SurveyReportService from "../../service/SurveyReportService";
import SurveyReportCountryTable from "./SurveyReportCountryTable";
import SurveyReportCountryChart from "./SurveyReportCountryChart";

const colProps = {
  xs: { span: 24 },
  md: { span: 8 },
};
const rowProps = {
  style: { marginBottom: "1em" },
};
export default function SurveyReportCountry() {
  const [loading, setLoading] = useState(false);
  const [surveyReport, setSurveyReport] = useState([]);
  const [surveyType, setSurveyType] = useState(SurveyTypes.INTENTIONS2022);

  useEffect(() => {
    const getSurveyReport = async () => {
      setLoading(true);
      const response = await SurveyReportService.getCountryReport(surveyType);
      setLoading(false);
      if (!response.success) return;
      setSurveyReport(response.surveyReport);
    };
    getSurveyReport();
  }, [surveyType]);

  return (
    <>
      <SurveyReportCountryHeader />
      <Loading loading={loading}>
        <Row {...rowProps}>
          <Col {...colProps}>
            <label>Encuesta: </label>{" "}
            <SearchSelect dataset={surveyTypeCatalog} onChange={setSurveyType} value={surveyType} />
          </Col>
          <Col {...colProps}>
            <label>Reporte</label><br></br>
            <ButtonExcel dataset={surveyReport} fileName="Reporte Republica" loading={loading} />
          </Col>
        </Row>


        <SurveyReportCountryTable dataset={surveyReport} surveyTipo={surveyType} />
        <SurveyReportCountryChart dataset={surveyReport} />
      </Loading>
    </>
  );
}

function SurveyReportCountryHeader() {
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
