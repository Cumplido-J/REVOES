import React from "react";
import { Col, Form, Input, Row, Typography } from "antd";
import { LockOutlined } from "@ant-design/icons";
import { Loading, PrimaryButton } from "../../../shared/components";
import useUpdatePassword from "./useUpdatePassword";

const styles = {
  colProps: {
    xs: { span: 24 },
    md: { span: 8 },
  },
  rowProps: {
    style: { marginBottom: "1em" },
  },
};

const UpdatePassword = () => {
  const [validations, form, loading, handleFinish, handleFinishFailed] =
    useUpdatePassword();
  return (
    <Loading loading={loading}>
      <Typography.Title level={4}>Actualizar contraseña</Typography.Title>
      <Form
        form={form}
        onFinish={handleFinish}
        onFinishFailed={handleFinishFailed}
        layout="vertical"
      >
        <Row {...styles.rowProps}>
          <Col {...styles.colProps}>
            <Form.Item
              label="Contraseña actual"
              name="old_password"
              rules={validations.required}
            >
              <Input.Password
                placeholder="Contraseña actual"
                style={{ width: "90%" }}
                disabled={loading}
              />
            </Form.Item>
          </Col>
          <Col {...styles.colProps}>
            <Form.Item
              label="Nueva contraseña"
              name="password"
              rules={validations.required}
            >
              <Input.Password
                placeholder="Nueva contraseña"
                style={{ width: "90%" }}
                disabled={loading}
              />
            </Form.Item>
          </Col>
          <Col {...styles.colProps}>
            <Form.Item
              label="Confirme su nueva contraseña"
              name="password_confirmation"
              rules={[
                ...validations.required,
                (formInstance) => validations.passwordMatch(formInstance),
              ]}
              dependencies={["password"]}
            >
              <Input.Password
                placeholder="Confirmación de contraseña"
                style={{ width: "90%" }}
                disabled={loading}
              />
            </Form.Item>
          </Col>
          <Col xs={24}>
            <PrimaryButton
              size="large"
              loading={loading}
              icon={<LockOutlined />}
              fullWidth
            >
              Actualizar contraseña
            </PrimaryButton>
          </Col>
        </Row>
      </Form>
      <hr />
    </Loading>
  );
};
export default UpdatePassword;
