import React from "react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import * as XLSX from 'xlsx';
import { Form, Breadcrumb, Row, Col } from "antd";
import { HomeOutlined, FileExcelOutlined } from "@ant-design/icons";
import { Loading, SearchSelect, Title, ButtonIcon, ButtonCustom } from "../../shared/components";
import CatalogService from "../../service/CatalogService";
import DegreeReportService from "../../service/DegreeReportService";
import { DownloadXlsxIcon, XlsxEmptyIcon } from "../../components/CustomIcons";
import DegreeReportSchoolTable from "./DegreeReportSchoolTable";

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

export default function DegreeReportSchool({ match }) {
  const hoy = new Date();
  const f = (hoy.getDate() > 9 ? hoy.getDate() : '0' + hoy.getDate()) + '-' + ((hoy.getMonth() + 1) > 9 ? (hoy.getMonth() + 1) : '0' + (hoy.getMonth() + 1)) + '-' + hoy.getFullYear();
  const h = (hoy.getHours() > 9 ? hoy.getHours() : '0' + hoy.getHours()) + '-' + (hoy.getMinutes() > 9 ? hoy.getMinutes() : '0' + hoy.getMinutes()) + '-' + (hoy.getSeconds() > 9 ? hoy.getSeconds() : '0' + hoy.getSeconds());
  const gen = "2021-2024";
  const schoolId = match.params.schoolId;
  let generation = "";

  if (match.params.generation) {
    generation = match.params.generation;
  } else {
    generation = gen;
  }
  const [loading, setLoading] = useState(false);
  const [degreeReport, setDegreeReport] = useState([]);
  const [generationSelect, setGenerationSelect] = useState(generation);
  const [catalogs, setCatalogs] = useState({ generations: [] });

  const [exportData, setExportData] = useState({ data: [] });

  useEffect(() => {
    async function loadGeneration() {
      const generations = await getGenerations();
      setCatalogs({ generations });

    }
    loadGeneration();
  }, []);

  useEffect(() => {
    const getDegreeReport = async () => {
      setLoading(true);
      const response = await DegreeReportService.degreeSchoolReport(generationSelect, schoolId);
      setLoading(false);
      if (!response.success) return;

      const data = response.degreeReport.students.map((gen) => ({
        Plantel_en_Dgp: gen.schoolName,
        Carrera_en_Dgp: gen.careerName,
        CURP: gen.curp,
        Matricula: gen.enrollmentKey,
        Nombre: gen.name,
        Primer_apellido: gen.firstLastName,
        Segundo_apellido: gen.secondLastName,
        Folio: gen.folioNumber,
        Generacion: gen.generation,
        Fecha_de_timbrado: gen.timbrado,
        Fecha_de_inicio: gen.inicio,
        Fecha_de_termino: gen.termino
      }));
      setExportData(data);

      setDegreeReport(response.degreeReport);
    }
    getDegreeReport();
  }, [generationSelect, schoolId]);

  return (
    <div>
      <SurveyReportSchoolHeader />
      <p>
        A continuación se muestran los alumnos del plantel <strong>{degreeReport.schoolName}</strong>
      </p>
      <Loading loading={loading}>
        <Form layout="vertical">
          <Row {...rowProps}>
            <Col {...colProps}>
              <Form.Item label="Generación:">
                <SearchSelect dataset={catalogs.generations} onChange={setGenerationSelect} value={generationSelect} />
              </Form.Item>
            </Col>

            <Col {...colProps}>
              <Form.Item label="Reporte:">
                <ExportExcel dataSet={exportData} fileName={`ReportePlantel-${degreeReport.cct}_${f}_${h}`} loading={loading} />
              </Form.Item>
            </Col>
            <Col {...colProps}>
              <Form.Item label="Registros:">
                <div style={{ border: '1px solid #ccc', padding: '4px', borderRadius: '0px', }}>
                  {`Total de Registros: ${exportData.length}`}
                </div>
              </Form.Item>
            </Col>
          </Row>
        </Form>
        <DegreeReportSchoolTable dataset={degreeReport} />
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
          <Title>Reporte de Generación de Títulos</Title>
        </Col>
      </Row>
    </>
  );
}


export const ExportExcel = ({ fileName, dataSet }) => {
  const [sheetData, setSheetData] = useState(null);

  useEffect(() => {
    setSheetData(dataSet);
  }, [dataSet]);
  const hanldleOnExport = () => {
    console.log(JSON.stringify(sheetData))
    var wb = XLSX.utils.book_new(),
      ws = XLSX.utils.json_to_sheet(sheetData);

    XLSX.utils.book_append_sheet(wb, ws, "myFile");
    XLSX.writeFile(wb, fileName + ".xlsx");
  }

  return (
    <>
      <ButtonCustom
        disabled={!sheetData || sheetData.length === 0}
        onClick={hanldleOnExport}
        size="lager"
        type="success"
        transparent={true}
        tooltip={!sheetData || sheetData.length === 0 ? 'Sin Registros' : 'Descargar Formato'}
        icon={!sheetData || sheetData.length === 0 ? <XlsxEmptyIcon /> : <DownloadXlsxIcon />} block
      >{!sheetData || sheetData.length === 0 ? 'Sin Registros' : 'Descargar Reporte'}</ButtonCustom>
    </>
  );
}
