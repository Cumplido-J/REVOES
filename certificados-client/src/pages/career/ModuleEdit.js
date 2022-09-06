import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {Row, Col, Breadcrumb, Alert } from "antd";
import { HomeOutlined } from "@ant-design/icons";

import { PageLoading, Title } from "../../shared/components";
import CompetenceService from "../../service/CompetenceService";
import CompetenciaForm from "./CompetenciaForm";
import alerts from "../../shared/alerts";

export default function ModuleEdit(props) {
  const { id } = props.match.params;

  const [competenceData, setCompetenceData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getCompetenceData = async () => {
      const response = await CompetenceService.getCompetenceData(id);
      setCompetenceData(response.competenceData);
      setLoading(false);
    };
    getCompetenceData();
  }, [id]);

  const editModule= async (form) => {
    const response = await CompetenceService.editCompetence(id, form);
    if (!response.success) return;
    alerts.success("Competencia modificado", "Competencia actualizado correctamente");
    props.history.push(`/Competencias/Editar/${id}`);
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
          <Link to="/Competencias/" style={{ color: "black" }}>
            <span>Lista de competencias</span>
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
        {competenceData.module && (
          <>
          <CompetenciaForm {...props} competenceData={competenceData} onSubmit={editModule} />
          </>
        )}
        {!competenceData.module && <CareerNotFound />}
      </PageLoading>
    </>
  );
}

function CareerNotFound() {
  return (
    <Alert
      message={<strong>Atención</strong>}
      description="No se ha encontrado ningún competencia. Favor de verificarlo."
      type="warning"
      showIcon
    />
  );
}
