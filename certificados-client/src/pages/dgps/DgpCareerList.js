import React from "react";
import { Link } from "react-router-dom";
import { Row, Col, Breadcrumb } from "antd";
import { HomeOutlined, CheckCircleOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { Loading, Title, PrimaryButton, ButtonCustomLink } from "../../shared/components";
import { useEffect, useState } from "react";

import DgpCareerListTable from "./DgpCareerListTable";
import DgpServices from "../../service/DgpServices";

const colProps = {
  xs: { span: 24 },
  md: { span: 8 },
};
const rowProps = {
  style: { marginBottom: "1em" },
};

const addSchoolButtonProps = {
  link: "/Dgp/Carreras/Add",
  icon: <PlusCircleOutlined />,
  color: "gold",
  fullWidth: false,
};

export default function DgpCareerList() {
  const [careerDgp, setCareerDgp] = useState({ careers: [] });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadCareers() {
      const response = await DgpServices.selectAllCareerDgp();
      const careers = response.careers.map((career) => ({
        id: career.id,
        clave: career.clave,
        carrer: career.carrer,
        name: career.name,
        modality: career.modality,
        level: career.level
      }));
      setCareerDgp({ careers });
    }
    loadCareers();
  }, []);

  return (
    <div>
      <DgpCareersHeader />

      <Loading loading={loading}>
        <Row {...rowProps}>
          <Col {...colProps}>
            <br></br>
            <ButtonCustomLink {...addSchoolButtonProps}>
              Agregar Carrera
            </ButtonCustomLink>
          </Col>
        </Row>
        <hr />
        <DgpCareerListTable dataset={careerDgp.careers} />
      </Loading>

    </div>
  );
}

function DgpCareersHeader() {
  return (
    <>
      <Breadcrumb>
        <Breadcrumb.Item>
          <Link to="/" style={{ color: "black" }}>
            <HomeOutlined />
          </Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item style={{ color: "black" }}>
          <Link to="/Dgp/Carreras/List" style={{ color: "black" }}>
            <span>Carreras en DGP</span>
          </Link>
        </Breadcrumb.Item>

      </Breadcrumb>

      <Row style={{ marginTop: "1em" }}>
        <Col xs={{ span: 24 }}>
          <Title>Carreras en DGP</Title>
        </Col>
      </Row>
    </>
  );
}
