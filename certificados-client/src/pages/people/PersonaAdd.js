///Archivo creado el 24 de junio
import React from "react";
import { Link } from "react-router-dom";

import { Row, Col, Breadcrumb } from "antd";
import { HomeOutlined } from "@ant-design/icons";

import { Title } from "../../shared/components";
import alerts from "../../shared/alerts";

import PersonaService from "../../service/PersonaService";
import PersonaForm from "./PersonaForm";

export default function PersonaAdd(props) {
  const addPersona = async (form) => { 
    const response = await PersonaService.addPersona(form);
    if (!response.success) return;
    alerts.success("Persona guardado", "Persona insertado correctamente");
    //props.history.push(`/Planteles/Editar/${response.schoolData.cct}`);
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
            <span>Lista de Firmante Titulacion</span>
          </Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item style={{ color: "black" }}>
          <span>Agregar Firmante Titulacion</span>
        </Breadcrumb.Item>
      </Breadcrumb>

      <Row style={{ marginTop: "1em" }}>
        <Col xs={{ span: 24 }}>
          <Title>Agregar Firmante Titulacion</Title>
        </Col>
      </Row>
      <PersonaForm {...props} onSubmit={addPersona} />
    </>
  );
}
