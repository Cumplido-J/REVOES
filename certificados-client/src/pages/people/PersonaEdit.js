import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { Tabs, Row, Col, Breadcrumb, Alert } from "antd";
import { HomeOutlined } from "@ant-design/icons";

import { PageLoading, Title } from "../../shared/components";
import PersonaService from "../../service/PersonaService";
import PersonaModal from "./PersonaModal";
import alerts from "../../shared/alerts";

export default function PersonaEdit(props) {
  const { curp } = props.match.params;

  const [personaData, setPersonaData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getPersonaData = async () => {
      const response = await PersonaService.getPersonaData(curp);
      setPersonaData(response.personaData);
      setLoading(false);
    };
    getPersonaData();
  }, [curp]); 

  const editPersona = async (form) => {
    const response = await PersonaService.editPersona(curp, form);
    if (!response.success) return;
    alerts.success("Guardado", "Datos actualizado correctamente");
    props.history.push(`/Persona/Editar/${response.personaData.curp}`);
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
          <Link to="/Persona/" style={{ color: "black" }}>
            <span>Lista de firmante</span>
          </Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item style={{ color: "black" }}>
          <span>Editar Firmante</span>
        </Breadcrumb.Item>
      </Breadcrumb>

      <Row style={{ marginTop: "1em" }}>
        <Col xs={{ span: 24 }}>
          <Title>Editar firmante</Title>
        </Col>
      </Row>
      <PageLoading loading={loading}>
        {personaData.curp && (
          <>
            <Tabs defaultActiveKey="1" type="card">
              <Tabs.TabPane tab="Información del Firmante" key="1">
                <PersonaModal {...props} personaData={personaData} onSubmit={editPersona} />
              </Tabs.TabPane>
            </Tabs>
          </>
        )}
        {!personaData.curp && <PersonaNotFound />}
      </PageLoading>
    </>
  );
}

function PersonaNotFound() {
  return (
    <Alert
      message={<strong>Atención</strong>}
      description="No se ha encontrado ningún datos con este curp. Favor de verificarlo."
      type="warning"
      showIcon
    />
  );
}
