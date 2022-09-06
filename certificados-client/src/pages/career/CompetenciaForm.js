import React, { useEffect, useState } from "react";
import { Form, Row, Col, Input} from "antd";
import { CheckCircleOutlined} from "@ant-design/icons";
import {Loading, PrimaryButton} from "../../shared/components";
import Alerts from "../../shared/alerts";

const colProps = {
  xs: { span: 24 },
  md: { span: 12 },
};
const rowProps = {
  style: { marginBottom: "1em" },
};
const validations = {
  module: [{ required: true, message: "¡El modulo es requerido!" }]
};


export default function CompetenciaForm({competenceData, onSubmit }) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.getElementById("module-form").reset();
    if(!competenceData)return;
    async function loadEstudio() {
      setLoading(true);
      form.setFieldsValue({ ...competenceData });
      setLoading(false);
    }
    loadEstudio();
  }, [competenceData,form]);

  const handleFinish = async (values) => {
    setLoading(true);
    await onSubmit(values);
    setLoading(false);
    ///if(!competenceData)return;
    form.setFieldsValue({ module: null});
  };

  const handleFinishFailed = () => {
    Alerts.warning("Favor de llenar correctamente", "Existen campos sin llenar.");
  };

  return (
    <Loading loading={loading}>
      <Form  id="module-form" form={form} onFinish={handleFinish} onFinishFailed={handleFinishFailed} layout="vertical">
        <Row {...rowProps}>
            <Col {...colProps}>
                <Form.Item label="Módulo:" name="module" rules={validations.module}>
                    <Input placeholder="Módulo" style={{ width: "90%" }} />
                </Form.Item>
            </Col>
            <Col {...colProps}>
                <Form.Item label="EMSAD Competencia:" name="emsadCompetence" >
                    <Input placeholder="Clave carrera" style={{ width: "90%" }} />
                </Form.Item>
            </Col>                     
        </Row>
        <Row {...rowProps}>
          <Col {...colProps}>
            &nbsp;
          </Col>
          <Col {...colProps}>
            <PrimaryButton icon={<CheckCircleOutlined />} loading={loading} size="large" fullWidth={false}>
              Guardar
            </PrimaryButton>
          </Col>
        </Row>
      </Form>
    </Loading>
  );
}