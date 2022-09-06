import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { Tabs, Row, Col, Breadcrumb, Alert } from "antd";
import { HomeOutlined } from "@ant-design/icons";

import { PageLoading, Title } from "../../shared/components";
import CareerService from "../../service/CareerService";
import CareerForm from "./CareerForm";
import CareerModuleForm from "./CareerModuleForm";
import CareerModuleTable from "./CareerModuleTable";
import alerts from "../../shared/alerts";
//import CatalogService from "../../service/CatalogService";
import { userHasRole } from "../../shared/functions";

export default function CareerEdit(props) {
  const { careerKey } = props.match.params;

  const [careerData, setCareerData] = useState({});
  const [loading, setLoading] = useState(true);
  const { userProfile } = props;

  useEffect(() => {
    const getCareerData = async () => {
      const response = await CareerService.getCareerData(careerKey);
      setCareerData(response.careerData);
      setLoading(false);
    };
    getCareerData();
  }, [careerKey]);

  const editCareer = async (form) => {
    const response = await CareerService.editCareer(careerKey, form);
    if (!response.success) return;
    alerts.success("Carrera guardado", "Carrera actualizado correctamente");
    props.history.push(`/Carreras/Editar/${response.careerData.careerKey}`);
  };

  const addModule = async (form) => {
    const response = await CareerService.addModule(careerData.idcareer, form);
    if (!response.success) return;
    alerts.success("Competencias", "Competencias agregado correctamente");
  }
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
          <span>Editar carrera</span>
        </Breadcrumb.Item>
      </Breadcrumb>

      <Row style={{ marginTop: "1em" }}>
        <Col xs={{ span: 24 }}>
          <Title>Editar carrera</Title>
        </Col>
      </Row>
      <PageLoading loading={loading}>
        {careerData.careerKey && (
          <>
            <Tabs defaultActiveKey="1" type="card">
              <Tabs.TabPane tab="Información de la carrera" key="1">
                <CareerForm {...props} careerData={careerData} onSubmit={editCareer} userProfile={userProfile} />
              </Tabs.TabPane>
              <Tabs.TabPane tab="Agregar Competencia" key="2">
                <CareerModuleForm {...props} onSubmit={addModule} />
              </Tabs.TabPane>
            </Tabs>
          </>
        )}
        {!careerData.careerKey && <CareerNotFound />}
      </PageLoading>
    </>
  );
}

function CareerNotFound() {
  return (
    <Alert
      message={<strong>Atención</strong>}
      description="No se ha encontrado ningún carrera con esta clave. Favor de verificarlo."
      type="warning"
      showIcon
    />
  );
}
