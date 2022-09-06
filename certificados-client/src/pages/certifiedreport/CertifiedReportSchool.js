import React from "react";
import { Link } from "react-router-dom";

import { Alert, Breadcrumb, Row, Col } from "antd";
import { HomeOutlined } from "@ant-design/icons";

import { Loading, SearchSelect, Title, ButtonExcel } from "../../shared/components";
import { useEffect, useState } from "react";

import CertifiedReportService from "../../service/CertifiedReportService";
import CertifiedReportSchoolTable from "./CertifiedReportSchoolTable";
import CatalogService from "../../service/CatalogService";
import { generationCatalog } from "../../shared/catalogs";
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

export default function CertifiedReportSchool({ match }) {
  const hoy = new Date();
  const f = hoy.getDate() + '-' + (hoy.getMonth() + 1 )+ '-' + hoy.getFullYear();
  const h = hoy.getHours()+'-'+hoy.getMinutes()+'-'+hoy.getSeconds();
  const gen = "2021-2024";
  const schoolId = match.params.schoolId;
  let generation = "";

  if (match.params.generation) {
    generation = match.params.generation;
  } else {
    generation = gen;
  }
  const [loading, setLoading] = useState(false);
  const [certifiedReport, setCertifiedReport] = useState([]);
  const [certifiedType, setCertifiedType] = useState(generation);
  const [catalogs, setCatalogs] = useState({ generations: [] });

  const [exportData, setExportData] = useState({data: []});

  useEffect(() => {
    async function loadGeneration() {
      const generations = await getGenerations();
      setCatalogs({ generations });

    }
    loadGeneration();
  }, []);

  useEffect(() => {
    const getCertifiedReport = async () => {
      setLoading(true);
      const response = await CertifiedReportService.getSchoolReport(certifiedType, schoolId);
      setLoading(false);
      if (!response.success) return;

      const data = response.certifiedReport.students.map((gen) =>({
        //PLANTEL: unescape(encodeURIComponent(gen.schoolName)),
        PLANTEL: gen.schoolName, 
        CARRERA: gen.careerName, 
        CURP: gen.curp, 
        MATRICULA: gen.enrollmentKey,
        NOMBRE: gen.name,
        PRIMER_APELLIDO: gen.firstLastName,
        SEGUNDO_APELLIDO: gen.secondLastName,
        FOLIO: gen.folioNumber,
        TIPO_CERTIFICADO: gen.typeCertified,
        GENERACION: gen.generation,
        FECHA_TIMBRADO:gen.timbrado,
        FECHA_INICIO:gen.inicio,
        FECHA_TERMINO:gen.termino
      }));
      setExportData(data);

      setCertifiedReport(response.certifiedReport);
    }
    getCertifiedReport();
  }, [certifiedType, schoolId]);

  return (
    <div>
      <SurveyReportSchoolHeader />
      <p>
        A continuación se muestran los alumnos del plantel <strong>{certifiedReport.schoolName}</strong>
      </p>
      <Loading loading={loading}>
        <Row {...rowProps}>
          <Col {...colProps}>
            <label>Generación: </label>{""}
            <SearchSelect dataset={catalogs.generations} onChange={setCertifiedType} value={certifiedType} />
          </Col>

          <Col {...colProps}>
            <label>Reporte:</label>
            <br></br> 
            {/*<ButtonExcel 
            dataset={exportData} 
            filename={`ReportePlantel-${certifiedReport.cct}_${f}_${h}`} 
            loading={loading} />*/}
            <ExportExcel dataset={exportData} filename={`ReportePlantel-${certifiedReport.cct}_${f}_${h}`} loading={loading} />
          </Col>
        </Row>
        <CertifiedReportSchoolTable dataset={certifiedReport} />
      </Loading>
    </div>
  );
}

function SurveyReportSchoolHeader() {
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
          <Title>Reporte de Generación de Certificados</Title>
        </Col>
      </Row>
    </>
  );
}
