import React, { useEffect, useState } from "react";
import { Loading, PrimaryButton } from "../../shared/components";
import { CheckCircleOutlined } from "@ant-design/icons";
import { Col, Form, Input, Row } from "antd";
import {
  passwordResetEmail,
  validateToken,
} from "../../service/PasswordService";
import { useHistory } from "react-router";
import alerts from "../../shared/alerts";

const PasswordReset = ({ match }) => {
  const [loading, setLoading] = useState(true);
  const [form] = Form.useForm();
  const history = useHistory();

  const tokenValidationProcess = async () => {
    setLoading(true);
    const tokenValidationResponse = await validateToken(match.params.token);
    if (tokenValidationResponse.success) {
      setLoading(false);
    } else {
      history.push("/");
    }
    setLoading(false);
  };
  useEffect(() => {
    tokenValidationProcess();
  }, []);

  const validations = {
    email: [{ required: true, type: "email" }],
    password: [{ required: true, message: "¡Ingresa tu contraseña!" }],
  };

  const handleSend = ({ email, password, passwordConfirmation }) => {
    if (password !== passwordConfirmation) {
      alerts.error("Ha ocurrido un error", "Las contraseñas no coinciden");
    } else {
      sendResetPassword(
        email,
        password,
        passwordConfirmation,
        match.params.token
      );
    }
  };

  const sendResetPassword = async (
    email,
    password,
    passwordConfirmation,
    token
  ) => {
    setLoading(true);
    const response = await passwordResetEmail(
      email,
      password,
      passwordConfirmation,
      token
    );
    if (response.success) {
      history.push("/");
      alerts.success("Listo", response.message);
    }
    setLoading(false);
  };

  const handleSendFailed = () => {};

  return (
    <Row justify="center">
      <Col xs={{ span: 24 }} md={{ span: 16 }}>
        <div className="panel panel-info">
          <div className="panel-heading text-center">
            <h3 style={{ marginTop: "0.5em" }}>Recuperar contraseña</h3>
          </div>
          <div className="panel-body">
            <Loading loading={loading}>
              <Form
                form={form}
                layout="vertical"
                onFinish={handleSend}
                onFinishFailed={handleSendFailed}
              >
                <Form.Item
                  label="Correo Electrónico"
                  name="email"
                  rules={validations.email}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  label="Nueva contraseña"
                  name="password"
                  rules={validations.password}
                >
                  <Input.Password />
                </Form.Item>
                <Form.Item
                  label="Confirmar nueva contraseña"
                  name="passwordConfirmation"
                  rules={validations.password}
                >
                  <Input.Password />
                </Form.Item>
                <Form.Item>
                  <PrimaryButton
                    fullWidth={true}
                    size="large"
                    icon={<CheckCircleOutlined />}
                  >
                    Guardar contraseña nueva
                  </PrimaryButton>
                </Form.Item>
              </Form>
            </Loading>
          </div>
        </div>
      </Col>
    </Row>
  );
};

export default PasswordReset;
