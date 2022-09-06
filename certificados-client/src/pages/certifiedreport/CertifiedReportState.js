import React from "react";
import { Link } from "react-router-dom";

import { Alert, Breadcrumb, Row, Col } from "antd";
import { HomeOutlined } from "@ant-design/icons";

import { Loading, SearchSelect, Title, ButtonExcel } from "../../shared/components";
import { useEffect, useState } from "react";

import CertifiedReportService from "../../service/CertifiedReportService";
import CertifiedReportStateTable from "./CertifiedReportStateTable";
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

export default function CertifiedReportState({ match }) {
  const hoy = new Date();
  const f = hoy.getDate() + '-' + (hoy.getMonth() + 1 )+ '-' + hoy.getFullYear();
  const h = hoy.getHours()+'-'+hoy.getMinutes()+'-'+hoy.getSeconds();
  const gen = "2021-2024";
  const stateId = match.params.stateId;
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
  const [total, setTotal]=useState({});

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
      const response = await CertifiedReportService.getStateReport(certifiedType, stateId);
      setLoading(false);
      if (!response.success) return;

      const data = response.certifiedReport.schools.map((gen) =>({
        CCT: gen.cct, 
        PLANTEL: gen.schoolName, 
        CERTIFICADOS_TERMINOS: gen.totalFinised, 
        CERTIFICADOS_PARCIALES: gen.totalPartial,
        CERTIFICADOS_ABROGADOS: gen.totalAbrogado
      }));
      const sumaT= response.certifiedReport.schools.reduce((prev, next) => prev + next.totalFinised, 0);
      const sumaP= response.certifiedReport.schools.reduce((prev, next) => prev + next.totalPartial, 0);
      const sumaA= response.certifiedReport.schools.reduce((prev, next) => prev + next.totalAbrogado, 0);
      data.push({CCT:" ", PLANTEL:"TOTAL",CERTIFICADOS_TERMINOS:sumaT,CERTIFICADOS_PARCIALES:sumaP,CERTIFICADOS_ABROGADOS:sumaA});
      setExportData(data);
      setTotal({totalTermino:sumaT,totalParcial:sumaP, totalAbrogado:sumaA});
      setCertifiedReport(response.certifiedReport);
    };
    getCertifiedReport();
  }, [certifiedType, stateId]);
  return (
    <div>
      <CertifiedReportStateHeader />
      <p>
        A continuación se muestran los planteles del estado de <strong>{certifiedReport.stateName}</strong>
      </p>

      <Loading loading={loading}>
        <Row {...rowProps}>
          <Col {...colProps}>
            <label>Generación:</label>
            <SearchSelect dataset={catalogs.generations} onChange={setCertifiedType} value={certifiedType}></SearchSelect>

          </Col>

          <Col {...colProps}>
            <label>Reporte:</label>
            {/*<ButtonExcel
              dataset={exportData}
              filename={`ReporteEstado-${certifiedReport.stateName}_${f}_${h}`}
              loading={loading} />
            */}
            <ExportExcel dataset={exportData} filename={`ReporteEstado-${certifiedReport.stateName}_${f}_${h}`} loading={loading} />
          </Col>
        </Row>

        <CertifiedReportStateTable dataset={certifiedReport.schools} total={total} />
      </Loading>
    </div>
  );
}

function CertifiedReportStateHeader() {
  return (
    <>
      <Breadcrumb>
        <Breadcrumb.Item>
          <Link to="/" style={{ color: "black" }}>
            <HomeOutlined />
          </Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item style={{ color: "black" }}>
          <span>Reporte estatal</span>
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
