import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import { Row, Col, Breadcrumb, Alert } from "antd";
import { HomeOutlined } from "@ant-design/icons";

import CertificateService from "../../service/CertificateService";
import { Title } from "../../shared/components";

import CertificateQuerySincronize from "./CertificateQuerySincronize";
import CertificateFilter from "./CertificateFilter";
import CertificateQueryTable from "./CertificateQueryTable";

export default function CertificateQuery(props) {
  const [students, setStudents] = useState([]);
  const [certificateTypeId, setCertificateTypeId] = useState(0);
  const [filter, setFilter] = useState({});
  const [pendientBatches, setPendientBatches] = useState(false);
  const [sincronizeResponse, setSincronizeResponse] = useState(null);

  useEffect(() => {
    const getPendientBatches = async () => {
      //const role=(props.userProfile.roles.includes(1)) || (props.userProfile.roles.includes(6));
      
      
      const response = await CertificateService.getPendientBatches();
      if (!response.success) return;
      setPendientBatches(response.pendientBatches);
      
    };
    getPendientBatches();
  }, []);

  const reloadStudents = async () => {
    await searchStudents(filter);
  };
  const searchStudents = async (values) => {
    const response = await CertificateService.studentQuerySearch(values);
    if (!response.success) return;
    setStudents(response.students);
    setFilter(values);
  };
  const changeCertificateType = (certificateTypeId) => {
    setCertificateTypeId(certificateTypeId);
  };
  const sincronizeBatches = async () => {
    let response = await CertificateService.sincronizeBatches();
    if (!response.success) return;
    setSincronizeResponse({ ...response });

    response = await CertificateService.getPendientBatches();
    if (!response.success) return;
    setPendientBatches(response.pendientBatches);
  };
  return (
    <>
      <CertificateQueryHeader />

      <CertificateQuerySincronize
        pendientBatches={pendientBatches}
        sincronizeBatches={sincronizeBatches}
        sincronizeResponse={sincronizeResponse}
      />

      <CertificateFilter onSubmit={searchStudents} changeCertificateType={changeCertificateType} />
      <CertificateQueryTable
        students={students}
        certificateTypeId={certificateTypeId}
        reloadStudents={reloadStudents}
      />
    </>
  );
}
function CertificateQueryHeader() {
  return (
    <>
      <Breadcrumb>
        <Breadcrumb.Item>
          <Link to="/" style={{ color: "black" }}>
            <HomeOutlined />
          </Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item style={{ color: "black" }}>
          <span>Validar alumnos</span>
        </Breadcrumb.Item>
      </Breadcrumb>
      <Row style={{ marginTop: "1em" }}>
        <Col xs={{ span: 24 }}>
          <Title>Validaci??n de alumnos</Title>
        </Col>
      </Row>
      <Alert
        style={{ marginBottom: "1em" }}
        message={<strong>Informaci??n importante</strong>}
        description={
          <>
            <p>
              Si no encuentra a el alumno que busca, puede que no se haya iniciado el proceso de certificaci??n,
              consultar la p??gina de validaci??n de alumnos para poder certificarlo
            </p>
            <p>
              S??lo puede descargar los certificados de los alumnos que aparezcan en la lista, y s??lo puede descargar
              m??ximo 150 certificados al mismo tiempo. El bot??n de "descargar certificados seleccionados" le descargar??
              el certificado tanto en formato pdf como xml, identificando cada archivo con el CURP del alumno. El PDF se
              genera al momento y tardar?? dependiendo el n??mero de alumnos seleccionados.
            </p>
            <p>Si no ve correctamente el certificado favor de descargar las fuentes para visualizarlo correctamente:</p>
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
