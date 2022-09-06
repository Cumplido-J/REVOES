import React, { useEffect, useState } from "react";

import { Form, Row, Col, Input, DatePicker } from "antd";
import { CheckCircleOutlined, ArrowLeftOutlined } from "@ant-design/icons";

import { ButtonCustomLink, Loading, PrimaryButton, SearchSelect } from "../../shared/components";
import { schoolTypeCatalog } from "../../shared/catalogs";
import Alerts from "../../shared/alerts";

import CatalogService from "../../service/CatalogService";
import { validateCCT } from "../../shared/functions";
import { schoolStatusCatalog } from "../../shared/catalogs";

const colProps = {
  xs: { span: 24 },
  md: { span: 8 },
};
const rowProps = {
  style: { marginBottom: "1em" },
};
const validations = {
  cct: [
    {
      required: true,
      validator: (_, value) => {
        return validateCCT(value) ? Promise.resolve() : Promise.reject("¡Ingresa un CCT correcta!");
      },
    },
  ],
  name: [{ required: true, message: "¡El nombre es requerido!" }],
  stateId: [{ required: true, message: "¡El estado es requerido!" }],
  cityId: [{ required: true, message: "¡El municipio es requerido!" }],
  schoolTypeId: [{ required: true, message: "¡El tipo de plantel es requerido!" }],
  schoolStatusId: [{ required: true, message: "¡El estatus de operación es requerido!" }],
};

async function getStates() {
  const response = await CatalogService.getStateCatalogs();
  return response.states.map((state) => ({ id: state.id, description: state.description1 }));
}

async function getCities(stateId) {
  const response = await CatalogService.getCityCatalogs(stateId);
  return response.cities.map((city) => ({
    id: city.id,
    description: city.description1,
  }));
}
export default function SchoolForm({ schoolData, onSubmit }) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [catalogs, setCatalogs] = useState({ states: [], cities: [] });

  async function onChangeState(stateId) {
    const cities = await getCities(stateId);
    form.setFieldsValue({ cityId: null });
    setCatalogs({ ...catalogs, cities });
  }

  useEffect(() => {
    async function loadStates() {
      const states = await getStates();
      setCatalogs({ states, cities: [] });
    }
    loadStates();
  }, []);

  useEffect(() => {
    if (!schoolData) return;
    async function loadCities() {
      setLoading(true);
      const [states, cities] = await Promise.all([getStates(), getCities(schoolData.stateId)]);
      setCatalogs({ states, cities });
      form.setFieldsValue({ ...schoolData });
      setLoading(false);
    }
    loadCities();
  }, [schoolData, form]);

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
            <Form.Item label="CCT:" name="cct" rules={validations.cct}>
              <Input placeholder="CCT" style={{ width: "90%" }} />
            </Form.Item>
          </Col>
          <Col {...colProps}>
            <Form.Item label="Nombre:" name="name" rules={validations.name}>
              <Input placeholder="Nombre" style={{ width: "90%" }} />
            </Form.Item>
          </Col>
          <Col {...colProps}>
            <Form.Item label="Estado:" name="stateId" rules={validations.stateId}>
              <SearchSelect dataset={catalogs.states} onChange={onChangeState} />
            </Form.Item>
          </Col>
        </Row>
        <Row {...rowProps}>
          <Col {...colProps}>
            <Form.Item label="Municipio:" name="cityId" rules={validations.cityId}>
              <SearchSelect dataset={catalogs.cities} />
            </Form.Item>
          </Col>
          <Col {...colProps}>
            <Form.Item label="Tipo plantel:" name="schoolTypeId" rules={validations.schoolTypeId}>
              <SearchSelect dataset={schoolTypeCatalog} />
            </Form.Item>
          </Col>
          <Col {...colProps}>
            <Form.Item label="Fecha sinems:" name="sinemsDate" rules={validations.sinemsDate}>
              <DatePicker format="DD/MM/YYYY" style={{ width: "90%" }} />
            </Form.Item>
          </Col>
        </Row>
        <Row {...rowProps}>
          <Col {...colProps}>
            <Form.Item label="Estatus de operación:" name="status" rules={validations.schoolStatusId}>
              <SearchSelect dataset={schoolStatusCatalog} />
            </Form.Item>
          </Col>
        </Row>
        <Row {...rowProps}>
          <Col {...colProps}>
            <ButtonCustomLink link="/Planteles/" size="large" icon={<ArrowLeftOutlined />} color="red">
              Regresar a lista de planteles
            </ButtonCustomLink>
          </Col>
          <Col {...colProps}>
            <PrimaryButton icon={<CheckCircleOutlined />} loading={loading} size="large" fullWidth={false}>
              Guardar plantel
            </PrimaryButton>
          </Col>
        </Row>
      </Form>
    </Loading>
  );
}