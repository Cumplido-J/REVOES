import React from "react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import * as XLSX from 'xlsx';
import { Form, Breadcrumb, Row, Col } from "antd";
import { HomeOutlined } from "@ant-design/icons";

import { Loading, SearchSelect, Title, ButtonCustom } from "../../shared/components";

import CatalogService from "../../service/CatalogService";
import DegreeReportService from "../../service/DegreeReportService";
import DegreeReportStateTable from "./DegreeReportStateTable";
import { DownloadXlsxIcon, XlsxEmptyIcon } from "../../components/CustomIcons";

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

export default function DegreeReportState({ match }) {
    const hoy = new Date();
    const f = (hoy.getDate() > 9 ? hoy.getDate() : '0' + hoy.getDate()) + '-' + ((hoy.getMonth() + 1) > 9 ? (hoy.getMonth() + 1) : '0' + (hoy.getMonth() + 1)) + '-' + hoy.getFullYear();
    const h = (hoy.getHours() > 9 ? hoy.getHours() : '0' + hoy.getHours()) + '-' + (hoy.getMinutes() > 9 ? hoy.getMinutes() : '0' + hoy.getMinutes()) + '-' + (hoy.getSeconds() > 9 ? hoy.getSeconds() : '0' + hoy.getSeconds());
    const gen = "2021-2024";
    const stateId = match.params.stateId;
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
            const response = await DegreeReportService.degreeStateReport(generationSelect, stateId);
            setLoading(false);
            if (!response.success) return;

            const data = response.degreeReport.schools.map((gen) => ({
                Clave_Dgp: gen.cct,
                Plantel_Dgp: gen.schoolName,
                Total_Titulos: gen.totalFinised,
            }));
            const sumaT = response.degreeReport.schools.reduce((prev, next) => prev + next.totalFinised, 0);
            data.push({ Clave_Dgp: "TOTAL", Plantel_Dgp: "", Total_Titulos: sumaT });

            setExportData(data);
            setDegreeReport(response.degreeReport);
        };
        getDegreeReport();
    }, [generationSelect, stateId]);
    return (
        <div>
            <DegreeReportStateHeader />
            <p>
                A continuación se muestran los planteles del estado de <strong>{degreeReport.stateName}</strong>
            </p>

            <Loading loading={loading}>
                <Form layout="vertical">
                    <Row {...rowProps}>
                        <Col {...colProps}>
                            <Form.Item label="Generación:">
                                <SearchSelect dataset={catalogs.generations} onChange={setGenerationSelect} value={generationSelect}></SearchSelect>
                            </Form.Item>
                        </Col>

                        <Col {...colProps}>
                            <Form.Item label="Reporte:">
                                <ExportExcel dataSet={exportData} fileName={`ReporteEstado-${degreeReport.stateName}_${f}_${h}`} loading={loading} />
                            </Form.Item>
                        </Col>

                        <Col {...colProps}>
                            <Form.Item label="Registros:">
                                <div style={{ border: '1px solid #ccc', padding: '4px', borderRadius: '0px', }}>
                                    {`Total de Registros: ${(exportData.length) - 1}`}
                                </div>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
                <DegreeReportStateTable dataset={degreeReport.schools} />
            </Loading>
        </div>
    );
}

function DegreeReportStateHeader() {
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
                    <Title>Reporte de Generación de Titulos</Title>
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
        //console.log(JSON.stringify(sheetData))
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
