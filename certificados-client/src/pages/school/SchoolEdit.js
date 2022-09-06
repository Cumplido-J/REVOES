import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Tabs, Row, Col, Breadcrumb, Alert } from "antd";
import { HomeOutlined } from "@ant-design/icons";
import { PageLoading, Title } from "../../shared/components";
import SchoolService from "../../service/SchoolService";
import SchoolForm from "./SchoolForm";
import alerts from "../../shared/alerts";
import SchoolCareers from "./SchoolCareers";
import SchoolCareers2 from "./SchoolCareers2";
import CatalogService from "../../service/CatalogService";

export default function SchoolEdit(props) {
  const { cct } = props.match.params;

  const [schoolData, setSchoolData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSchoolData = async () => {
      const response = await SchoolService.getSchoolData(cct);
      setSchoolData(response.schoolData);
      setLoading(false);
      console.log("<--Mensaje de Spring------->")
      const prueba= await CatalogService.getPrueba();
      console.log(prueba);
      console.log("<-------------------------->")
    };
    getSchoolData();
  }, [cct]);

  const editSchool = async (form) => {
    const response = await SchoolService.editSchool(cct, form);
    if (!response.success) return;
    alerts.success("Plantel guardado", "Plantel actualizado correctamente");
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
          <span>Editar plantel</span>
        </Breadcrumb.Item>
      </Breadcrumb>

      <Row style={{ marginTop: "1em" }}>
        <Col xs={{ span: 24 }}>
          <Title>Editar plantel</Title>
        </Col>
      </Row>
      <PageLoading loading={loading}>
        {schoolData.cct && (
          <>
            <Tabs defaultActiveKey="1" type="card">
              <Tabs.TabPane tab="Información del plantel" key="1">
                <SchoolForm {...props} schoolData={schoolData} onSubmit={editSchool} />
              </Tabs.TabPane>
              <Tabs.TabPane tab="Agregar carreras" key="2">
                <SchoolCareers cct={schoolData.cct} />
              </Tabs.TabPane>
              <Tabs.TabPane tab="Descartar carreras del plantel" key="4" >
                <SchoolCareers2 cct={schoolData.idschool} />
              </Tabs.TabPane>
            </Tabs>
          </>
        )}
        {!schoolData.cct && <SchoolNotFound />}
      </PageLoading>
    </>
  );
}

function SchoolNotFound() {
  return (
    <Alert
      message={<strong>Atención</strong>}
      description="No se ha encontrado ningún plantel con este cct. Favor de verificarlo."
      type="warning"
      showIcon
    />
  );
}
