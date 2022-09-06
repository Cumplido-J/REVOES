import React from "react";
import { Link } from "react-router-dom";

import { Row, Col, Breadcrumb } from "antd";
import { HomeOutlined } from "@ant-design/icons";

import { Title } from "../../../shared/components";
import GraduateCaptureSearch from "./GraduateCaptureSearch";


export default function GraduateCapture(props) {

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
            <span>reportes</span>
          </Link>
        </Breadcrumb.Item>
      </Breadcrumb>

      <Row style={{ marginTop: "1em" }}>
        <Col xs={{ span: 24 }}>
          <Title>Registro de Egresados Titulados</Title>
        </Col>
      </Row>
      <GraduateCaptureSearch/>
    </>
  );
}