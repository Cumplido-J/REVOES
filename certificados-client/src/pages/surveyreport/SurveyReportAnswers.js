import React from "react";
import { Link } from "react-router-dom";

import { Alert, Breadcrumb, Row, Col } from "antd";
import { HomeOutlined } from "@ant-design/icons";

import { Title } from "../../shared/components";

export default function SurveyReportAnswers() {
  return (
    <div>
      <SurveyReportAnswersHeader />
      <Alert style={{ marginBottom: "2em" }} message={<strong>EN CONSTRUCCIÓN.</strong>} type="info" showIcon />
    </div>
  );
}

function SurveyReportAnswersHeader() {
  return (
    <>
      <Breadcrumb>
        <Breadcrumb.Item>
          <Link to="/" style={{ color: "black" }}>
            <HomeOutlined />
          </Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item style={{ color: "black" }}>
          <span>Respuestas alumno</span>
        </Breadcrumb.Item>
      </Breadcrumb>

      <Row style={{ marginTop: "1em" }}>
        <Col xs={{ span: 24 }}>
          <Title>Respuestas por alumno</Title>
        </Col>
      </Row>
    </>
  );
}
