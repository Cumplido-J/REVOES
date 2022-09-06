import React, { useEffect, useState } from "react";

import { Form, Row, Col, Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";

import { Loading, PrimaryButton, SearchSelect } from "../../shared/components";
import { generationCatalog } from "../../shared/catalogs";
import Alerts from "../../shared/alerts";

import CatalogService from "../../service/CatalogService";
import DegreeCatalogService from "../../service/DegreeCatalogService";

const colProps = {
  xs: { span: 24 },
  md: { span: 8 },
};
const rowProps = {
  style: { marginBottom: "1em" },
};
const validations = {
  stateId: [{ required: true, message: "¡Este campo es requerido!" }],
};

async function getGenerations() {
  const response = await CatalogService.getGenerationsCatalogs();
  return response.generations.map((generation) => ({ id: generation.description, description: generation.description }));
}

export default function DegreeFilter({ onSubmit }) {
  const [form] = Form.useForm();
  const [catalogs, setCatalogs] = useState({ states: [], schools: [], careers: [] });
  const [loading, setLoading] = useState(true);
  const [generation, setGeneration] = useState({ generations: [] });


  useEffect(() => {
    async function loadGeneration() {
      const generations = await getGenerations();
      setGeneration({ generations });
    }
    loadGeneration();
  }, []);

  useEffect(() => {
    async function getStates() {
      const response = await DegreeCatalogService.getStates();
      if (!response) return;
      const states = response.degreeStates.map((state) => ({ id: state.id, description: state.description1 }));

      setCatalogs({ states, schools: [], careers: [] });
      setLoading(false);
    }

    getStates();
  }, []);

  const onChangeState = async (stateId) => {
    const response = await DegreeCatalogService.getSchools(stateId);
    if (!response) return;

    const schools = response.schools.map((school) => ({
      id: school.id,
      description: `${school.clave} - ${school.name}`,
    }));
    form.setFieldsValue({ schoolId: null, careerId: null });
    setCatalogs({ ...catalogs, schools, careers: [] });
  };

  const onChangeSchool = async (schoolId) => {
    const response = await DegreeCatalogService.getCarrers(schoolId);
    if (!response) return;
    const careers = response.careers.map((career) => ({
      id: career.id,
      description: `${career.description1} - ${career.description2}`,
    }));
    form.setFieldsValue({ careerId: null });
    setCatalogs({ ...catalogs, careers });
  };

  const handleFinish = async (values) => {
    setLoading(true);
    await onSubmit(values);
    setLoading(false);
  };

  const handleFinishFailed = () => {
    Alerts.warning("Favor de llenar correctamente", "Existen campos sin llenar.");
  };

  return (
    <Loading loading={loading}>
      <Form form={form} onFinish={handleFinish} onFinishFailed={handleFinishFailed} layout="vertical">
        <Row {...rowProps}>
          <Col {...colProps}>
            <Form.Item label="Estado:" name="stateId">
              <SearchSelect dataset={catalogs.states} onChange={onChangeState} />
            </Form.Item>
          </Col>
          <Col {...colProps}>
            <Form.Item label="Plantel:" name="schoolId">
              <SearchSelect dataset={catalogs.schools} onChange={onChangeSchool} />
            </Form.Item>
          </Col>
          <Col {...colProps}>
            <Form.Item label="Carrera:" name="careerId">
              <SearchSelect dataset={catalogs.careers} />
            </Form.Item>
          </Col>
        </Row>

        <Row {...rowProps}>
          <Col {...colProps}>
            {/* <Form.Item label="Generacion:" name="generation" rules={validations.generation}> */}
            <Form.Item label="Generacion:" name="generation">
              <SearchSelect dataset={generation.generations} />
            </Form.Item>
          </Col>
          <Col {...colProps}>
            <Form.Item label="Nombre/CURP/Matricula:" name="searchText">
              <Input placeholder="Nombre/CURP/Matricula" allowClear style={{ width: "90%" }} />
            </Form.Item>
          </Col>
        </Row>
        <Row {...rowProps}>
          <Col {...colProps}>
            <PrimaryButton loading={loading} icon={<SearchOutlined />}>
              Buscar
            </PrimaryButton>
          </Col>
        </Row>
      </Form>
    </Loading>
  );
}
