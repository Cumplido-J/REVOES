import React from "react";
import { Form, Input, Row, Col } from "antd";
import { FileSearchOutlined } from "@ant-design/icons";

import { PrimaryButton, Subtitle } from "../../shared/components";
const validations = {
  folio: [
    {
      required: true,
      message: "¡Ingresa un folio para buscar!",
    },
  ],
};
const rowProps = {
  style: { marginBottom: "1em" },
};
export default function FolioSearch({ history }) {
  const handleSearch = (values) => {
    history.push(`/folio/${values.folio}`);
  };
  return (
    <div className="container">
      <Subtitle>Validar folio de certificado digital</Subtitle>
      <Form onFinish={handleSearch}>
        <Row align="center" {...rowProps}>
          <Col xs={24} sm={12} xl={12}>
            <Form.Item label="Folio:" name="folio" rules={validations.folio}>
              <Input allowClear style={{ width: "90%" }}
                placeholder="00000000-0000-0000-0000-000000000000"
                size="large" />

            </Form.Item>
          </Col>
          <Col xs={24} sm={12} xl={6}>
            <Form.Item>
              <PrimaryButton fullWidth={true} size="large" icon={<FileSearchOutlined />}>
                Buscar información del folio
              </PrimaryButton>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  );
}
