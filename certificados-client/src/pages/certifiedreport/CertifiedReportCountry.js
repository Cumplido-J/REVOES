import React from "react";
import { Link } from "react-router-dom";

import { Alert, Breadcrumb, Row, Col } from "antd";
import { HomeOutlined,SearchOutlined } from "@ant-design/icons";

import { Loading, SearchSelect, Title, ButtonExcel, PrimaryButton } from "../../shared/components";
import { useEffect, useState } from "react";

import CertifiedReportService from "../../service/CertifiedReportService";
import CertifiedReportCountryTable from "./CertifiedReportCountryTable";
import CatalogService from "../../service/CatalogService";
import { ExportExcel } from "./ExportExcel";

const colProps = {
  xs: { span: 24 },
  md: { span: 8 },
};
const rowProps = {
  style: { marginBottom: "1em" },
};
async function getGenerations() {
  const response = await CatalogService.getGenerationsCatalogs();
  return response.generations.map((generation) => ({ id: generation.id, description: generation.description }));
}
async function getGenMax() {
  const generation = await getGenerations();
  return JSON.stringify(getGenerations)[0].id;
}
export default function CertifiedReportCountry() {
  const hoy = new Date();
  const f = hoy.getDate() + '-' + (hoy.getMonth() + 1 )+ '-' + hoy.getFullYear();
  const h = hoy.getHours()+'-'+hoy.getMinutes()+'-'+hoy.getSeconds();
  const gen = "";
  const [loading, setLoading] = useState(false);
  const [certifiedReport, setCertifiedReport] = useState([]);
  const [certifiedGeneration, setGenerationSelect] = useState(gen);
  const [catalogs, setCatalogs] = useState({ generations: [] });

  const [exportData, setExportData] = useState({ data: [] });
  const [showButton, setShowButton]=useState(false);
  useEffect(() => {
    async function loadGeneration() {
      setLoading(true);
      const generations = await getGenerations();
      setLoading(false);
      setCatalogs({ generations });
    }
    loadGeneration();
  }, []);

  const onChangeReport = async (certifiedGeneration) => {
    setLoading(true);
    const response = await CertifiedReportService.getCountryReport(certifiedGeneration);
    setLoading(false);
    if (!response.success) return;
    const data = response.certifiedReport.map((gen) => ({
      ESTADOS: gen.stateName,
      CERTIFICADOS_TERMINOS: gen.totalFinised,
      CERTIFICADOS_PARCIALES: gen.totalPartial,
      CERTIFICADOS_ABROGADOS: gen.totalAbrogado
    }));
    const sumaT= response.certifiedReport.reduce((prev, next) => prev + next.totalFinised, 0);
    const sumaP= response.certifiedReport.reduce((prev, next) => prev + next.totalPartial, 0);
    const sumaA= response.certifiedReport.reduce((prev, next) => prev + next.totalAbrogado, 0);
    data.push({ESTADOS:"TOTAL",CERTIFICADOS_TERMINOS:sumaT,CERTIFICADOS_PARCIALES:sumaP,CERTIFICADOS_ABROGADOS:sumaA});
    setExportData(data);
    setCertifiedReport(response.certifiedReport);
    setGenerationSelect(certifiedGeneration);
    setShowButton(true);
  };
  /*useEffect(() => {
    const getCertifiedReport = async () => {
      setLoading(true);
      const response = await CertifiedReportService.getCountryReport(certifiedGeneration);
      setLoading(false);
      if (!response.success) return;

      const data = response.certifiedReport.map((gen) => ({
        ESTADOS: gen.stateName,
        CERTIFICADOS_TERMINOS: gen.totalFinised,
        CERTIFICADOS_PARCIALES: gen.totalPartial,
        CERTIFICADOS_ABROGADOS: gen.totalAbrogado
      }));
      setExportData(data);

      setCertifiedReport(response.certifiedReport);
    };
    getCertifiedReport();
  }, [certifiedGeneration]);
  */


  return (
    <div>
      <SurveyReportCountryHeader />
      <Loading loading={loading}>
        <Row {...rowProps}>
          <Col {...colProps}>
            <label>Generación: </label>{"  "}
            <SearchSelect dataset={catalogs.generations} onChange={onChangeReport} value={certifiedGeneration} />
          </Col>
          <Col {...colProps}>
            {showButton && ( 
              <>
                <label>Reporte</label>
                <ExportExcel dataset={exportData} filename={`Reporte Republica_${f}_${h}`} loading={loading} />
              </>)}
          </Col>
        </Row>
        <CertifiedReportCountryTable dataset={certifiedReport} generation={certifiedGeneration}/>
      </Loading>
    </div>
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
          <Title>Reporte de Generación de Certificados</Title>
        </Col>
      </Row>
    </>
  );
}
