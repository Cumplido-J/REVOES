import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import { Row, Col, Breadcrumb } from "antd";
import { HomeOutlined } from "@ant-design/icons";

import { Title } from "../../../shared/components";
import StudentMasiveLoadForm from "./StudentMasiveLoadForm";
import StudentMasiveCDE from "../StudentMasiveCDE/StudentMasiveCDE";
import { userHasRole } from "../../../shared/functions";
import CatalogService from "../../../service/CatalogService";

async function getStates() {
  const response = await CatalogService.getStateCatalogs();
  return response.states.map((state) => ({ id: state.id, description: state.description1 }));
}

export default function StudentMasiveLoad(props) {
  const { userProfile } = props;
  const [stateId, setStateId] = useState(0);
  // const addMasiveLoad = async (form) => {
  //   const response = await MasiveLoadService.masiveLoad(form);
  //   if (!response.success) return;
  //   alerts.success("Operacón exitosa", "Excel insertado correctamente");
  // };

  useEffect(() => {
    async function loadStates() {
      const states = await getStates();
      console.log('-->' + states[0].id)
      setStateId(states[0].id);
    }
    if (userHasRole.certificationAdmin(userProfile.roles) || userHasRole.schoolControl(userProfile.roles)) {
      loadStates();
    }
  }, [])
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
            <span>Lista de alumnos</span>
          </Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item style={{ color: "black" }}>
          <span>Carga Masiva</span>
        </Breadcrumb.Item>
      </Breadcrumb>

      <Row style={{ marginTop: "1em" }}>
        <Col xs={{ span: 24 }}>
          <Title>Carga masiva de alumnos para Certificados de Término de Estudios</Title>
        </Col>
      </Row>
      {(userHasRole.dev(userProfile.roles) || stateId == 13) && (
        <>
          <Row gutter={[16, 16]}>
            <Col xs={24} md={12} xl={20}></Col>

            <Col xs={24} md={12} xl={4}>
              <StudentMasiveCDE />
            </Col>
          </Row>
          <hr></hr>
        </>
      )}
      <StudentMasiveLoadForm />

    </>
  );
}