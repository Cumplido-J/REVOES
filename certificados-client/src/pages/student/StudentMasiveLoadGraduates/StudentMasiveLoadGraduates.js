import React from "react";
import { Link } from "react-router-dom";

import { Row, Col, Breadcrumb } from "antd";
import { HomeOutlined } from "@ant-design/icons";

import { Title } from "../../../shared/components";
import StudentMasiveLoadForm from "./StudentMasiveLoadForm";

export default function StudentMasiveLoadGraduates(props) {



  return (
    <>
      <Breadcrumb>
        <Breadcrumb.Item>
          <Link to="/" style={{ color: "black" }}>
            <HomeOutlined />
          </Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <Link to="/Alumnos/" style={{ color: "black" }}>
            <span>Lista de alumnos</span>
          </Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item style={{ color: "black" }}>
          <span>Carga Masiva</span>
        </Breadcrumb.Item>
      </Breadcrumb>

      <Row style={{ marginTop: "1em" }}>
        <Col xs={{ span: 24 }}>
          <Title>Carga masiva de alumnos de 6to. semestre</Title>
        </Col>
      </Row>
     <StudentMasiveLoadForm /> 
    </>
  );
}