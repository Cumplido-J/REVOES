import React, { useState } from "react";

import { Form, Row, Col, Input } from "antd";
import { CheckCircleOutlined, ArrowLeftOutlined } from "@ant-design/icons";

import { ButtonCustomLink, Loading, PrimaryButton } from "../../shared/components";
import Alerts from "../../shared/alerts";

const colProps = {
  xs: { span: 24 },
  md: { span: 8 },
};
const rowProps = {
  style: { marginBottom: "1em" },
};
const validations = {
  password: [{ required: true, message: "¡La contraseña es requerida!" }],
  passwordConfirm: [
    { required: true, message: "La confirmación de contraseña es requerida" },
    ({ getFieldValue }) => ({
      validator(_, value) {
        if (!value || getFieldValue("password") === value) return Promise.resolve();
        return Promise.reject("¡Las contraseñas deben coincidir!");
      },
    }),
  ],
};
export default function StudentEditPasswordForm({ onSubmit }) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleFinish = async (values) => {
    setLoading(true);
    await onSubmit(values);
    form.resetFields();
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
            <Form.Item label="Contraseña:" name="password" rules={validations.password}>
              <Input.Password placeholder="Contraseña" style={{ width: "90%" }} />
            </Form.Item>
          </Col>
          <Col {...colProps}>
            <Form.Item label="Confirmación de contraseña:" name="passwordConfirm" rules={validations.passwordConfirm}>
              <Input.Password placeholder="Confirmación de contraseña" style={{ width: "90%" }} />
            </Form.Item>
          </Col>
        </Row>
        <Row {...rowProps}>
          <Col {...colProps}>
            <ButtonCustomLink link="/Alumnos/" size="large" icon={<ArrowLeftOutlined />} color="red">
              Regresar a lista de alumnos
            </ButtonCustomLink>
          </Col>
          <Col {...colProps}>
            <PrimaryButton icon={<CheckCircleOutlined />} loading={loading} size="large" fullWidth={false}>
              Actualizar contraseña
            </PrimaryButton>
          </Col>
        </Row>
      </Form>
    </Loading>
  );
}
