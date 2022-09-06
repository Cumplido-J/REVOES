import React, { useState } from "react";
import { Link } from "react-router-dom";

import { Row, Col, Breadcrumb, Alert } from "antd";
import { HomeOutlined } from "@ant-design/icons";

import { Title } from "../../shared/components";
import CertificateService from "../../service/CertificateService";

import CertificateFilter from "./CertificateFilter";
import CertificateValidateTable from "./CertificateValidateTable";

export default function CertificateValidate() {
  const [students, setStudents] = useState([]);
  const [certificateTypeId, setCertificateTypeId] = useState(0);
  const [filter, setFilter] = useState({});

  const reloadStudents = async () => {
    await searchStudents(filter);
  };
  const searchStudents = async (values) => {
    const response = await CertificateService.studentValidationSearch(values);
    if (!response.success) return;
    setStudents(response.students);
    setFilter(values);
  };

  const changeCertificateType = (certificateTypeId) => {
    setCertificateTypeId(certificateTypeId);
  };

  return (
    <>
      <CertificateValidateHeader />
      <CertificateFilter onSubmit={searchStudents} changeCertificateType={changeCertificateType} />
      <CertificateValidateTable
        students={students}
        certificateTypeId={certificateTypeId}
        reloadStudents={reloadStudents}
      />
    </>
  );
}

function CertificateValidateHeader() {
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
          <Title>Validación de alumnos</Title>
        </Col>
      </Row>
      <Row style={{ marginBottom: "1em" }}>
        <Col xs={{ span: 24 }}>
          <Alert
            message={<strong>Certificación de alumnos</strong>}
            description={
              <>
                <p>
                  A continuación se muestra la lista de los alumnos registrados en el estado/plantel/carrera
                  seleccionados. Verificar que los datos sean correctos porque serán los datos que aparezcan en el
                  certificado de término. Si es necesario modificar algún alumno, hacerlo con el botón de editar. Cuando
                  ya esté seguro de que sean correctos seleccionar a los alumnos y dar click en el botón de validar y
                  aceptar. Posteriormente el director general tendrá que entrar para ingresar su FIEL y certificarlos.
                </p>
                <p>
                  Los alumnos subrayados en rojo no pueden ser validados porque no tienen uno o varios de los siguientes
                  datos:
                </p>
                <ul>
                  <li>Fecha de inicio de carrera</li>
                  <li>Fecha de término de carrera</li>
                  <li>Calificaciones completas</li>
                  <li>Promedio general</li>
                </ul>
                Si deseas modificar los datos generales del alumno dirigirse a:{" "}
                <Link to="/Alumnos">Lista de alumnos</Link> y buscar al alumno a editar
              </>
            }
            type="warning"
            showIcon
          />
        </Col>
      </Row>
    </>
  );
}
