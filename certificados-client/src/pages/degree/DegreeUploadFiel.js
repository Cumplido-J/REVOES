import React, { useState } from "react";

import { Row, Col, Input, Form, Alert, Modal, Upload, Button } from "antd";
import { CheckCircleOutlined, UploadOutlined } from "@ant-design/icons";

import alerts from "../../shared/alerts";
import { PrimaryButton } from "../../shared/components";
import { fileInputToBase64, getFilenameExtension } from "../../shared/functions";

import "./DegreeValidate.css";

const colProps = {
  xs: { span: 24 },
  md: { span: 16, offset: 4 },
};
const rowProps = {
  style: { marginBottom: "1em" },
};

const normFile = (e) => {
  if (e.fileList) return [e.fileList[e.fileList.length - 1]];
};
const validateMessages = { required: "¡Este campo es requerido!" };
const validations = {
  cer: [
    {
      required: true,
      validator: (rule, value) => {
        if (!value || value.length === 0) return Promise.reject("Debes seleccionar un archivo.");
        if (getFilenameExtension(value[0].name) === "cer") return Promise.resolve();
        return Promise.reject("Debes seleccionar un archivo con extensión .cer");
      },
    },
  ],
  key: [
    {
      required: true,
      validator: (rule, value) => {
        if (!value || value.length === 0) return Promise.reject("Debes seleccionar un archivo.");
        if (getFilenameExtension(value[0].name) === "key") return Promise.resolve();
        return Promise.reject("Debes seleccionar un archivo con extensión .key");
      },
    },
  ],
  default: [{ required: true }],
};

export default function DegreeUploadFiel({ modalFielVisible, toggleModalFiel, degreeStudents }) {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const handleFinishFailed = () => {
    alerts.warning("Favor de llenar correctamente", "Existen campos sin llenar.");
  };
  const handleFinish = async (values) => {
    setErrorMessage(null);
    setLoading(true);

    const form = {};
    form.cer = await fileInputToBase64(values.cer[0].originFileObj);
    form.key = await fileInputToBase64(values.key[0].originFileObj);
    form.password = values.password;

    const response = await degreeStudents(form);
    if (response.success) toggleModalFiel();
    else setErrorMessage(response.message);
    setLoading(false);
  };

  return (
    <Modal zIndex="1040" title="Seleccionar Fiel" visible={modalFielVisible} footer={null} onCancel={toggleModalFiel}>
      <Form
        layout="vertical"
        onFinishFailed={handleFinishFailed}
        onFinish={handleFinish}
        validateMessages={validateMessages}
      >
        <Row {...rowProps}>
          <Col {...colProps}>
            <Form.Item
              name="cer"
              label="Archivo .cer"
              getValueFromEvent={normFile}
              rules={validations.cer}
              valuePropName="fileList"
            >
              <Upload multiple={false} beforeUpload={() => false} accept=".cer">
                <Button>
                  <UploadOutlined /> Seleccionar archivo
                </Button>
              </Upload>
            </Form.Item>
          </Col>
          <Col {...colProps}>
            <Form.Item
              name="key"
              label="Archivo .key"
              getValueFromEvent={normFile}
              rules={validations.key}
              valuePropName="fileList"
            >
              <Upload multiple={false} beforeUpload={() => false} accept=".key">
                <Button>
                  <UploadOutlined /> Seleccionar archivo
                </Button>
              </Upload>
            </Form.Item>
          </Col>
          <Col {...colProps}>
            <Form.Item label="Contraseña FIEL:" name="password" rules={validations.default}>
              <Input.Password style={{ width: "90%" }} />
            </Form.Item>
          </Col>

          <Col {...colProps}>
            <PrimaryButton loading={loading} icon={<CheckCircleOutlined />}>
              Titular alumnos
            </PrimaryButton>
          </Col>
        </Row>
        <Row {...rowProps}>
          {loading && (
            <Alert
              message={<strong>Procesando</strong>}
              description="Favor de no cerrar esta ventana. Se están procesando los alumnos, este proceso puede tardar varios minutos..."
              type="info"
              showIcon
            />
          )}
          {errorMessage && (
            <Col {...colProps}>
              <Alert
                message={<strong>Ocurrió un Error</strong>}
                description={errorMessage}
                type="error"
                showIcon
                closable
              />
            </Col>
          )}
        </Row>
      </Form>
    </Modal>
  );
}
