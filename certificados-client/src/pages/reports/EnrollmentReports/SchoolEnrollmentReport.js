import React from "react";
import { Link } from "react-router-dom";

import { Row, Col, Breadcrumb } from "antd";
import { HomeOutlined } from "@ant-design/icons";

import { Title } from "../../../shared/components";
import ReportStateSearch from "./ReportStateSearch";


export default function SchoolEnrollmentReport(props) {

  return (
    <>
      <Breadcrumb>
        <Breadcrumb.Item>
          <Link to="/" style={{ color: "black" }}>
            <HomeOutlined />
          </Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <Link to="/Reportes/Matricula/" style={{ color: "black" }}>
            <span>reportes</span>
          </Link>
        </Breadcrumb.Item>
      </Breadcrumb>

      <Row style={{ marginTop: "1em" }}>
        <Col xs={{ span: 24 }}>
          <Title>Reporte matriculación por Estado</Title>
        </Col>
      </Row>
      <ReportStateSearch />
    </>
  );
}

