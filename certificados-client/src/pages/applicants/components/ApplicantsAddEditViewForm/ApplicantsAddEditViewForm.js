import React from "react";
import {
  Loading,
  PrimaryButton,
  SearchSelect,
} from "../../../../shared/components";
import useApplicantsAddEditViewForm from "./useApplicantsAddEditViewForm";
import { Col, DatePicker, Form, Input, Row } from "antd";
import StateSchoolCareerInputs from "../../../../components/StateSchoolCareerInputs";
import { validateCurp } from "../../../../shared/functions";
import { CheckCircleOutlined } from "@ant-design/icons";
import { paymentStatuses } from "../../../../shared/constants";
const styles = {
  colProps: {
    xs: { span: 24 },
    md: { span: 8 },
  },
  rowProps: {
    style: { marginBottom: "1em" },
  },
};
const validations = {
  required: [
    {
      required: true,
      message: "Este campo es requerido",
    },
  ],
  email: [
    {
      required: true,
      type: "email",
      message: "The input is not valid E-mail!",
    },
  ],
  curp: [
    {
      required: true,
      validator: (_, value) => {
        return validateCurp(value)
          ? Promise.resolve()
          : Promise.reject("¡Ingresa una CURP correcta!");
      },
    },
  ],
};
const ApplicantsAddEditViewForm = ({ applicantId }) => {
  const [
    loading,
    form,
    handleFinish,
    handleFinishFailed,
    handleOnStateSchoolSelectsChange,
    stateSchoolInputsRef,
  ] = useApplicantsAddEditViewForm(applicantId);
  return (
    <Loading loading={loading}>
      <Form
        form={form}
        onFinish={handleFinish}
        onFinishFailed={handleFinishFailed}
        layout="vertical"
      >
        <Row {...styles.rowProps}>
          <Col {...styles.colProps}>
            <Form.Item label="Nombre" name="name" rules={validations.required}>
              <Input style={{ width: "90%" }} placeholder="Nombre" />
            </Form.Item>
          </Col>
          <Col {...styles.colProps}>
            <Form.Item
              label="Primer apellido"
              name="firstLastName"
              rules={validations.required}
            >
              <Input style={{ width: "90%" }} placeholder="Primer apellido" />
            </Form.Item>
          </Col>
          <Col {...styles.colProps}>
            <Form.Item label="Segundo apellido" name="secondLastName">
              <Input style={{ width: "90%" }} placeholder="Segundo apellido" />
            </Form.Item>
          </Col>
          <Col {...styles.colProps}>
            <Form.Item label="CURP" name="curp" rules={validations.curp}>
              <Input style={{ width: "90%" }} placeholder="CURP" />
            </Form.Item>
          </Col>
          <StateSchoolCareerInputs
            form={form}
            colProps={styles.colProps}
            onValuesChange={handleOnStateSchoolSelectsChange}
            ref={stateSchoolInputsRef}
          />
          <Col {...styles.colProps}>
            <Form.Item label="Teléfono" name="phone">
              <Input style={{ width: "90%" }} placeholder="Teléfono" />
            </Form.Item>
          </Col>
          <Col {...styles.colProps}>
            <Form.Item
              label="Correo electrónico institucional"
              name="email"
              rules={!!applicantId ? validations.required : undefined}
            >
              <Input
                style={{ width: "90%" }}
                placeholder="Correo electrónico institucional"
              />
            </Form.Item>
          </Col>
          <Col {...styles.colProps}>
            <Form.Item label="Fecha de nacimiento" name="birthday">
              <DatePicker format="YYYY-MM-DD" style={{ width: "90%" }} />
            </Form.Item>
          </Col>
          <Col {...styles.colProps}>
            <Form.Item label="Dirección" name="domicilio">
              <Input style={{ width: "90%" }} placeholder="Dirección" />
            </Form.Item>
          </Col>
        </Row>
        <Row {...styles.rowProps}>
          <PrimaryButton
            fullWidth
            loading={loading}
            icon={<CheckCircleOutlined />}
          >
            Guardar
          </PrimaryButton>
        </Row>
      </Form>
    </Loading>
  );
};

export default ApplicantsAddEditViewForm;
