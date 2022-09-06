import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { Tabs, Row, Col, Breadcrumb, Alert } from "antd";
import { HomeOutlined } from "@ant-design/icons";

import { PageLoading, Title } from "../../shared/components";
import CareerService from "../../service/CareerService";
import CareerModuleForm from "./CareerModuleForm";
import alerts from "../../shared/alerts";

export default function CareerModuleEdit(props) {
  const { id } = props.match.params;
  const { career } = props.match.params;
  const [moduleData, setModuleData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getCareerModuleData = async () => {
      const response = await CareerService.getCareerModuleData(id);
      setModuleData(response.moduleData);
      setLoading(false);
    };
    getCareerModuleData();
  }, [id]);

  const editCareerModule = async (form) => {
    const response = await CareerService.editCareerModule(id,career, form);
    if (!response.success) return;
    alerts.success("Competencia guardado", "Competencia actualizado correctamente");
    props.history.push(`/Carreras/EditarModule/${response.moduleData.id}/${career}`);
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
          <Link to="/Carreras/" style={{ color: "black" }}>
            <span>Lista de carreras</span>
          </Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item style={{ color: "black" }}>
          <span>Editar competencia</span>
        </Breadcrumb.Item>
      </Breadcrumb>

      <Row style={{ marginTop: "1em" }}>
        <Col xs={{ span: 24 }}>
          <Title>Editar competencia</Title>
        </Col>
      </Row>
      <PageLoading loading={loading}>
        {moduleData.id && (
          <>
            <CareerModuleForm {...props} moduleData={moduleData} onSubmit={editCareerModule} />
          </>
        )}
        {!moduleData.id && <CareerNotFound />}
      </PageLoading>
    </>
  );
}

function CareerNotFound() {
  return (
    <Alert
      message={<strong>Atención</strong>}
      description="No se ha encontrado ningún competencia con esta clave. Favor de verificarlo."
      type="warning"
      showIcon
    />
  );
}
