import React from "react";
import { Link } from "react-router-dom";

import { Row, Col, Breadcrumb } from "antd";
import { HomeOutlined } from "@ant-design/icons";

import { Title } from "../../shared/components";
import alerts from "../../shared/alerts";

import SchoolService from "../../service/SchoolService";
import SchoolForm from "./SchoolForm";

export default function SchoolAdd(props) {
  const addSchool = async (form) => {
    const response = await SchoolService.addSchool(form);
    if (!response.success) return;
    alerts.success("Plantel guardado", "Plantel insertado correctamente");
    props.history.push(`/Planteles/Editar/${response.schoolData.cct}`);
  };
  return (
    <>
      <Breadcrumb>
        <Breadcrumb.Item>
          <Link to="/" style={{ color: "black" }}>
            <HomeOutlined />
          </Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <Link to="/Planteles/" style={{ color: "black" }}>
            <span>Lista de planteles</span>
          </Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item style={{ color: "black" }}>
          <span>Agregar plantel</span>
        </Breadcrumb.Item>
      </Breadcrumb>

      <Row style={{ marginTop: "1em" }}>
        <Col xs={{ span: 24 }}>
          <Title>Agregar plantel</Title>
        </Col>
      </Row>
      <SchoolForm {...props} onSubmit={addSchool} />
    </>
  );
}
