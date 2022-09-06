import React, { useState } from "react";
import { Link } from "react-router-dom";

import { Row, Col, Breadcrumb, Alert } from "antd";
import { HomeOutlined } from "@ant-design/icons";

import { Title } from "../../shared/components";
import DegreeService from "../../service/DegreeService";

import DegreeFilter from "./DegreeFilter";
import DegreeValidateTable from "./DegreeValidateTable";

export default function DegreeValidate() {
  const [students, setStudents] = useState([]);
  const [filter, setFilter] = useState({});

  const reloadStudents = async () => {
    await searchStudents(filter);
  };
  const searchStudents = async (values) => {
    const response = await DegreeService.studentValidationSearch(values);
    if (!response.success) return;
    setStudents(response.students);
    setFilter(values);
  };

  return (
    <>
      <DegreeValidateHeader />
      <DegreeFilter onSubmit={searchStudents} />
      <DegreeValidateTable students={students} reloadStudents={reloadStudents} />
    </>
  );
}

function DegreeValidateHeader() {
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
            message={<strong>Titulación de alumnos</strong>}
            description={
              <p>
                A continuación se muestra la lista de los alumnos registrados en el estado/plantel/carrera
                seleccionados.
              </p>
            }
            type="warning"
            showIcon
          />
        </Col>
      </Row>
    </>
  );
}
