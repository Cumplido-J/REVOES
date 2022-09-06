import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import { Row, Col, Breadcrumb, Alert } from "antd";
import { HomeOutlined } from "@ant-design/icons";

import DegreeService from "../../service/DegreeService";
import DegreeCatalogService from "../../service/DegreeCatalogService";
import { Title } from "../../shared/components";

import DegreeQuerySincronize from "./DegreeQuerySincronize";
import DegreeFilter from "./DegreeFilter";
import DegreeQueryTable from "./DegreeQueryTable";

async function getReasons() {
  const response = await DegreeCatalogService.getReasons();
  return response.reasons.map((reason) => ({ id: reason.description1, description: reason.description1 + "-" + reason.description2 }));
}

export default function DegreeQuery() {
  const [students, setStudents] = useState([]);
  const [filter, setFilter] = useState({});
  const [pendientBatches, setPendientBatches] = useState(false);
  const [sincronizeResponse, setSincronizeResponse] = useState(null);
  const [reasons, setReasons] = useState({ reasons: [] });

  useEffect(() => {
    const getPendientBatches = async () => {
      const response = await DegreeService.getPendientBatches();
      if (!response.success) return;
      setPendientBatches(response.pendientBatches);
    };
    getPendientBatches();
  }, []);

  const reloadStudents = async () => {
    await searchStudents(filter);
  };
  const searchStudents = async (values) => {
    const response = await DegreeService.studentQuerySearch(values);
    if (!response.success) return;
    setStudents(response.students);
    setFilter(values);
  };
  const sincronizeBatches = async () => {
    let response = await DegreeService.sincronizeBatches();
    if (!response.success) return;
    setSincronizeResponse({ ...response });

    response = await DegreeService.getPendientBatches();
    if (!response.success) return;
    setPendientBatches(response.pendientBatches);
  };
  useEffect(() => {
    async function LoadReasons(){
      const reasons = await getReasons();
      setReasons({ reasons });
    }
    LoadReasons();
  }, []);

  return (
    <>
      <DegreeQueryHeader />

      <DegreeQuerySincronize
        pendientBatches={pendientBatches}
        sincronizeBatches={sincronizeBatches}
        sincronizeResponse={sincronizeResponse}
      />

      <DegreeFilter onSubmit={searchStudents} />
      <DegreeQueryTable reasons={reasons} students={students} reloadStudents={reloadStudents} />
    </>
  );
}
function DegreeQueryHeader() {
  return (
    <>
      <Breadcrumb>
        <Breadcrumb.Item>
          <Link to="/" style={{ color: "black" }}>
            <HomeOutlined />
          </Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item style={{ color: "black" }}>
          <span>Consultar alumnos</span>
        </Breadcrumb.Item>
      </Breadcrumb>
      <Row style={{ marginTop: "1em" }}>
        <Col xs={{ span: 24 }}>
          <Title>Consulta de alumnos</Title>
        </Col>
      </Row>
      <Alert
        style={{ marginBottom: "1em" }}
        message={<strong>Información importante</strong>}
        description={
          <>
            <p>
              Si no encuentra a el alumno que busca, puede que no se haya iniciado el proceso de titulación, consultar
              la página de validación de alumnos para poder titularlo
            </p>
            <p>
              Sólo puede descargar los títulos de los alumnos que aparezcan en la lista, y sólo puede descargar máximo
              150 titulos al mismo tiempo. El botón de "descargar titulos seleccionados" le descargará el título en
              formato pdf, identificando cada archivo con el CURP del alumno. El PDF se genera al momento y tardará
              dependiendo el número de alumnos seleccionados.
            </p>
            <p>Si no ve correctamente el título favor de descargar las fuentes para visualizarlo correctamente:</p>
            
            <ul>
              <li>
                <a href="/fonts/Montserrat.ttf">Montserrat.ttf</a>
              </li>
              <li>
                <a href="/fonts/MontserratBold.ttf">Montserrat-bold.ttf</a>
              </li>
            </ul>
          </>
        }
        type="info"
      />
    </>
  );
}
