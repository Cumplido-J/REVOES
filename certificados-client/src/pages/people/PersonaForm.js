import React, { useEffect, useState } from "react";

import { Form, Row, Col, Input } from "antd";
import { CheckCircleOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { validateCurp } from "../../shared/functions";
import { ButtonCustomLink, Loading, PrimaryButton, SearchSelect } from "../../shared/components";
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
  curp: [
    {
      required: true,
      validator: (_, value) => {
        return validateCurp(value) ? Promise.resolve() : Promise.reject("¡Ingresa una CURP correcta!");
      },
    },
  ],
  name: [{ required: true, message: "¡El nombre es requerido!" }],
  ape1: [{ required: true, message: "¡El nombre es requerido!" }],
  ape2: [{ required: true, message: "¡El nombre es requerido!" }],
  stateId: [{ required: true, message: "¡El estado es requerido!" }], 
};

async function getStates() {
  const response = await CatalogService.getStateCatalogs();
  return response.states.map((state) => ({ id: state.id, description: state.description1 }));
}


export default function PersonaForm({ onSubmit,personaData }) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [catalogs, setCatalogs] = useState({ states: []});

  useEffect(() => {
    async function loadStates() {
      const states = await getStates();
      setCatalogs({ states});
      form.setFieldsValue({ ...personaData });
    }
    loadStates();
  }, [personaData, form]);


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
            <Form.Item label="CURP:" name="curp" rules={validations.curp}>
              <Input placeholder="CURP" style={{ width: "90%" }} />
            </Form.Item>
          </Col>          
          <Col {...colProps}>
            <Form.Item label="Nombre:" name="name" rules={validations.name}>
              <Input placeholder="Nombre" style={{ width: "90%" }} />
            </Form.Item>
          </Col>
          <Col {...colProps}>
            <Form.Item label="Apellido paterno:" name="ape1" rules={validations.ape1}>
              <Input placeholder="Apellido paterno" style={{ width: "90%" }} />
            </Form.Item>
          </Col>         
        </Row>

        <Row {...rowProps}>
        <Col {...colProps}>
            <Form.Item label="Apellido materno:" name="ape2" rules={validations.ape2}>
              <Input placeholder="Apellido materno" style={{ width: "90%" }} />
            </Form.Item>
          </Col>           
        <Col {...colProps}>
            <Form.Item label="Estado:" name="stateId" rules={validations.stateId}>
              <SearchSelect dataset={catalogs.states} />
            </Form.Item>
          </Col>
        </Row>
        <Row {...rowProps}>
          <Col {...colProps}>
            <ButtonCustomLink link="/Persona/" size="large" icon={<ArrowLeftOutlined />} color="red">
              Regresar a lista de personas
            </ButtonCustomLink>
          </Col>
          <Col {...colProps}>
            <PrimaryButton icon={<CheckCircleOutlined />} loading={loading} size="large" fullWidth={false}>
              Guardar persona
            </PrimaryButton>
          </Col>
        </Row>
      </Form>
    </Loading>
  );
}