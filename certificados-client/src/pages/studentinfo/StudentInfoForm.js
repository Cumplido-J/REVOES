import React, { useEffect, useState } from "react";

import { Form, Row, Col, Input, InputNumber } from "antd";
import { CheckCircleOutlined, ArrowLeftOutlined } from "@ant-design/icons";

import { ButtonCustomLink, Loading, PrimaryButton, SearchSelect } from "../../shared/components";
import Alerts from "../../shared/alerts";

import StudentInfoCatalogs from "./StudentInfoCatalogs";

const colProps = {
  xs: { span: 24 },
  md: { span: 8 },
};
const rowProps = {
  style: { marginBottom: "1em" },
};
const validateMessages = {
  required: "¡Este campo es requerido!",
  types: {
    email: "¡Ingresa un correo electrónico válido!",
  },
};
const validations = {
  email: [{ required: true, type: "email" }],
  //postalCode: [{required: true, type: "number", message: "¡El código postal es requerido!"}],
  phoneNumber: [
    {
      required: true,
      validator: (_, value) => {
        const valid = value && value.toString().length === 10 && !isNaN(parseInt(value));
        return valid ? Promise.resolve() : Promise.reject("¡Ingresa un número telefónico a 10 dígitos!");
      },
    },
  ],
  default: [{ required: true }],
};

export default function StudentInfoForm({ studentInfo, onSubmit }) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [checks, setChecks] = useState({
    disability: false,
    language: false,
    ethnicGroup: false,
    indigenousLanguage: false,
    entrepreneurship: false,
    continueStudies: false,
  });
  useEffect(() => {
    if (studentInfo) {
      form.setFieldsValue({ ...studentInfo.studentInfo });
      setChecks(studentInfo.checks);
    }
    setLoading(false);
  }, [studentInfo, form]);

  const updateCheck = (name, value) => {
    setChecks({ ...checks, [name]: value });
  };
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
      <Form
        form={form}
        initialValues={studentInfo}
        onFinish={handleFinish}
        onFinishFailed={handleFinishFailed}
        layout="vertical"
        validateMessages={validateMessages}
      >
        <Row {...rowProps}>
          <Col {...colProps}>
            <Form.Item label="Correo electrónico:" name="email" rules={validations.email}>
              <Input placeholder="Email" style={{ width: "90%" }} />
            </Form.Item>

            <Form.Item label="Código Postal:" name="postalCode" rules={validations.default}>
              <InputNumber style={{ width: "90%" }} max={99999} min={0} />
            </Form.Item>

            <Form.Item
              label="Teléfono/Celular de contacto (10 dígitos)"
              name="phoneNumber"
              rules={validations.phoneNumber}
            >
              <InputNumber style={{ width: "90%" }} />
            </Form.Item>

            <Form.Item label="¿Con quien vives actualmente?" name="home" rules={validations.default}>
              <SearchSelect dataset={StudentInfoCatalogs.homeOptions} />
            </Form.Item>

            <Form.Item label="¿Participaste en algún programa especial?" name="program" rules={validations.default}>
              <SearchSelect dataset={StudentInfoCatalogs.programOptions} />
            </Form.Item>

            <Form.Item
              label="Autorizas compartir tu información para alguna empresa o vacante"
              name="shareInformation"
              rules={validations.default}
            >
              <SearchSelect dataset={StudentInfoCatalogs.yesNoOptions} />
            </Form.Item>
          </Col>
          <Col {...colProps}>
            <Form.Item label="¿Tienes alguna discapacidad?" name="disabilityCheck" rules={validations.default}>
              <SearchSelect
                dataset={StudentInfoCatalogs.yesNoOptions}
                onChange={(value) => {
                  updateCheck("disability", value);
                }}
              />
            </Form.Item>
            {checks.disability === "1" && (
              <Form.Item label="¿Cuál es tu discapacidad?" name="disability" rules={validations.default}>
                <Input placeholder="¿Cuál es tu discapacidad?" style={{ width: "90%" }} />
              </Form.Item>
            )}

            <Form.Item label="¿Perteneces a algún grupo étnico?" name="ethnicGroupCheck" rules={validations.default}>
              <SearchSelect
                dataset={StudentInfoCatalogs.yesNoOptions}
                onChange={(value) => {
                  updateCheck("ethnicGroup", value);
                }}
              />
            </Form.Item>
            {checks.ethnicGroup === "1" && (
              <Form.Item label="¿Cuál es tu grupo étnico?" name="ethnicGroup" rules={validations.default}>
                <Input placeholder="¿Cuál es tu grupo étnico?" style={{ width: "90%" }} />
              </Form.Item>
            )}

            <Form.Item label="¿Hablas alguna lengua?" name="indigenousLanguageCheck" rules={validations.default}>
              <SearchSelect
                dataset={StudentInfoCatalogs.yesNoOptions}
                onChange={(value) => {
                  updateCheck("indigenousLanguage", value);
                }}
              />
            </Form.Item>
            {checks.indigenousLanguage === "1" && (
              <Form.Item label="¿Cuál lengua hablas?" name="indigenousLanguage" rules={validations.default}>
                <Input placeholder="¿Cuál lengua hablas?" style={{ width: "90%" }} />
              </Form.Item>
            )}

            <Form.Item
              label="¿Hablas otro idioma diferente al español?"
              name="languageCheck"
              rules={validations.default}
            >
              <SearchSelect
                dataset={StudentInfoCatalogs.yesNoOptions}
                onChange={(value) => {
                  updateCheck("language", value);
                }}
              />
            </Form.Item>
            {checks.language === "1" && (
              <Form.Item label="¿Cuál idioma hablas?" name="language" rules={validations.default}>
                <Input placeholder="¿Cuál idioma hablas?" style={{ width: "90%" }} />
              </Form.Item>
            )}
          </Col>
          <Col {...colProps}>
            <Form.Item label="¿Has emprendido algun negocio?" name="entrepreneurshipCheck" rules={validations.default}>
              <SearchSelect
                dataset={StudentInfoCatalogs.yesNoOptions}
                onChange={(value) => {
                  updateCheck("entrepreneurship", value);
                }}
              />
            </Form.Item>

            {checks.entrepreneurship === "1" && (
              <>
                <Form.Item
                  label="¿Tu emprendimiento está relacionado con tu carrera?"
                  name="entrepreneurshipCareer"
                  rules={validations.default}
                >
                  <SearchSelect dataset={StudentInfoCatalogs.yesNoOptions} />
                </Form.Item>
                <Form.Item
                  label="¿Tu emprendimiento se derivó de algún proyecto escolar / concurso / prototipo / emprendedurismo?"
                  name="entrepreneurshipDerivated"
                  rules={validations.default}
                >
                  <SearchSelect dataset={StudentInfoCatalogs.yesNoOptions} />
                </Form.Item>
                <Form.Item
                  label="¿Como va tu emprendimiento?"
                  name="entrepreneurshipStatus"
                  rules={validations.default}
                >
                  <SearchSelect dataset={StudentInfoCatalogs.entrepreneurshipOptions} />
                </Form.Item>
              </>
            )}

            <Form.Item
              label="¿Al egresar del bachillerato continuarás con tus estudios?"
              name="continueStudiesCheck"
              rules={validations.default}
            >
              <SearchSelect
                dataset={StudentInfoCatalogs.yesNoOptions}
                onChange={(value) => {
                  updateCheck("continueStudies", value);
                }}
              />
            </Form.Item>
            
            {checks.continueStudies === "1" && (
              <>
                <Form.Item label="¿Aprobaste el exámen de admisión?" name="exam" rules={validations.default}>
                  <SearchSelect dataset={StudentInfoCatalogs.examOptions} />
                </Form.Item>
                <Form.Item label="¿A qué institución deseas entrar?" name="futureSchool" rules={validations.default}>
                  <Input placeholder="¿A qué institución deseas entrar?" style={{ width: "90%" }} />
                </Form.Item>
              </>
            )}
          </Col>
        </Row>

        <Row {...rowProps}>
          <Col {...colProps}>
            <ButtonCustomLink link="/" size="large" icon={<ArrowLeftOutlined />} color="red">
              Regresar a inicio
            </ButtonCustomLink>
          </Col>
          <Col {...colProps}>
            <PrimaryButton icon={<CheckCircleOutlined />} loading={loading} size="large" fullWidth={false}>
              Actualizar datos
            </PrimaryButton>
          </Col>
        </Row>
      </Form>
    </Loading>
  );
}
