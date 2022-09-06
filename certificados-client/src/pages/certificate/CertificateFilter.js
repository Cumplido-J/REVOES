import React, { useEffect, useState } from "react";

import { Form, Row, Col, Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";

import { Loading, PrimaryButton, SearchSelect } from "../../shared/components";
import { certificateTypeCatalog, generationCatalog } from "../../shared/catalogs";
import Alerts from "../../shared/alerts";

import CatalogService from "../../service/CatalogService";

const colProps = {
  xs: { span: 24 },
  md: { span: 8 },
};
const rowProps = {
  style: { marginBottom: "1em" },
};
const validations = {
  //   generation: [
  //     {
  //       required: true,
  //       message: "¡Este campo es requerido!",
  //     },
  //   ],
  certificateTypeId: [{ required: true, message: "¡Este campo es requerido!" }],
  stateId: [{ required: true, message: "¡Este campo es requerido!" }],
};
export default function CertificateFilter({ changeCertificateType, onSubmit }) {
  const [form] = Form.useForm();
  const [catalogs, setCatalogs] = useState({ states: [], schools: [], careers: [] });
  const [loading, setLoading] = useState(true);
  //const [rolUser, setRolUser] = useState();
  const [cycle, setCycle]= useState([]);

  useEffect(() => {
    async function getStates() {
      const response = await CatalogService.getStateCatalogs();

      if (!response) return;
      const states = response.states.map((state) => ({ id: state.id, description: state.description1 }));

      setCatalogs({ states, schools: [], careers: [] });
      setLoading(false);
    }
    const getCycle = async () => {
      await cycleState();
    }

    getStates();
    getCycle();
  }, []);

  const cycleState = async () => {
    const {cycle} = await CatalogService.getSchoolCycle();
    const cy = cycle.map(ciclo => ({ id: ciclo.description1, description: ciclo.description1  }) )
    setCycle(cy);
  }

  const onChangeState = async (stateId) => {
    const response = await CatalogService.getSchoolCatalogs(stateId);
    if (!response) return;

    const schools = response.schools.map((school) => ({
      id: school.id,
      description: `${school.description1} - ${school.description2}`,
    }));
    form.setFieldsValue({ schoolId: null, careerId: null });
    setCatalogs({ ...catalogs, schools, careers: [] });
  };

  const onChangeSchool = async (schoolId) => {
    const response = await CatalogService.getCareerCatalogs(schoolId);
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
              <SearchSelect dataset={cycle} />
            </Form.Item>
          </Col>
          <Col {...colProps}>
            <Form.Item label="Nombre/CURP/Matricula:" name="searchText">
              <Input placeholder="Nombre/CURP/Matricula" allowClear style={{ width: "90%" }} />
            </Form.Item>
          </Col>
          <Col {...colProps}> 

            <Form.Item label="Tipo de certificado:" name="certificateTypeId" rules={validations.certificateTypeId}>
                <SearchSelect dataset={certificateTypeCatalog}  onChange={changeCertificateType} />
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
