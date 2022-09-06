import React from "react";
import { Link } from "react-router-dom";

import { Row, Col, Breadcrumb } from "antd";
import { HomeOutlined } from "@ant-design/icons";

import { Title } from "../../../shared/components";
import EducationLevelSearch from "./EducationLevelSearch";


export default function EducationLevelCapture(props) {

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
          <Title>Captura nivel de estudios de plantilla docente</Title>
        </Col>
      </Row>
      <EducationLevelSearch/>
    </>
  );
}