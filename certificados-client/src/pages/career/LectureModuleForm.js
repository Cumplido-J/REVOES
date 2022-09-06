import React, { useEffect, useState } from "react";

import { Form, Row, Col, Input } from "antd";
import { CheckCircleOutlined } from "@ant-design/icons";

import { Loading, PrimaryButton, SearchSelect } from "../../shared/components";
import Alerts from "../../shared/alerts";


const colProps = {
  xs: { span: 24 },
  md: { span: 8 },
};
const colProps2 = {
  xs: { span: 16 },
  md: { span: 4 },
};
const rowProps = {
  style: { marginBottom: "1em" },
};
const validations = {
  module: [{ required: true, message: "¡La competencia es requerido!" }],
  credits: [{ required: true, message: "¡El campo creditos es requerido!" }],
};

export default function LectureForm({moduleData,onSubmit }) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  console.log(moduleData);

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
                <Form.Item label="Buscar por nombre o clave de materia:" name="busqueda" rules={validations.careerkey}>
                  <Input placeholder="nombre o clave" style={{ width: "90%" }} />
                </Form.Item>
            </Col>            

        </Row>
        <Row {...rowProps}>
            <Col {...colProps2}>
            <br></br>
            <PrimaryButton icon={<CheckCircleOutlined />} loading={loading} size="large" fullWidth={false}>
              Buscar
            </PrimaryButton>
          </Col>                      
        </Row>
      </Form>
    </Loading>
  );
}