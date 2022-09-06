import React from "react";
import { Link } from "react-router-dom";

import { Tabs, Row, Col, Breadcrumb } from "antd";
import { HomeOutlined } from "@ant-design/icons";

import { Title } from "../../shared/components";
import AdminTemporalPassword from "./AdminTemporalPassword";

export default function Admin(props) {
  return (
    <>
      <Breadcrumb>
        <Breadcrumb.Item>
          <Link to="/" style={{ color: "black" }}>
            <HomeOutlined />
          </Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item style={{ color: "black" }}>
          <span>Funciones de administrador</span>
        </Breadcrumb.Item>
      </Breadcrumb>

      <Row style={{ marginTop: "1em" }}>
        <Col xs={{ span: 24 }}>
          <Title>Funciones de administrador</Title>
        </Col>
      </Row>
      <Tabs defaultActiveKey="1" type="card">
        <Tabs.TabPane tab="Actualizar contraseñas" key="1">
          <AdminTemporalPassword {...props} />
        </Tabs.TabPane>
      </Tabs>
    </>
  );
}
