import React, { useState } from "react";
import { Form, Input, Button, Row, Col, Drawer, Alert } from "antd";
import { LoginOutlined, InfoCircleOutlined, LinkOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

import { validateCurp } from "../../shared/functions";
import { Loading, PrimaryButton } from "../../shared/components";
import LoginService from "../../service/LoginService";
import ResetPassword from "./ResetPassword";

const itemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
const validations = {
  username: [
    {
      required: true,
      validator: (_, value) => {
        return validateCurp(value)
          ? Promise.resolve()
          : Promise.reject("¡Ingresa una CURP correcta!");
      },
    },
  ],
  password: [
    {
      required: true,
      message: "¡Ingresa tu contraseña!",
    },
  ],
};

export default function Login(props) {
  const folioSearchRedirect = () => {
    props.history.push("/Folio");
  };
  const folioSearchLink = () => {
    props.history.push("/FolioDegree");
  }
  return (
    <>
      <Row justify="center">
        <Col xs={{ span: 24 }} md={{ span: 16 }}>
          <div className="panel panel-info">
            <div className="panel-heading text-center">
              <div style={{ float: 'right' }}><InfoName style={{ alignRight: '20px' }} /></div>
              <h3 style={{ marginTop: "0.5em" }}>Iniciar sesión</h3>

            </div>
            <div className="panel-body">
              <LoginForm {...props} />
            </div>
          </div>
        </Col>
      </Row>
      <Row justify="center">
        <Col>
          <Button type="link" size="large" onClick={folioSearchRedirect}>
            Validar folio de certificado digital
          </Button>
        </Col>
        <Col>
          <Button type="link" size="large" onClick={folioSearchLink}>
          <LinkOutlined /> Validar folio de título digital
          </Button>
        </Col>
      </Row>
    </>
  );
}

function LoginForm({ history, getUserProfile }) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleLogin = async (values) => {
    setLoading(true);
    const response = await LoginService.login(values, values.isLoginSISEC = true);
    if (response.success) {
      LoginService.successfulLogin(response.jwt);
      await getUserProfile();
      history.push("/");
    }
    setLoading(false);
  };

  return (
    <Loading loading={loading}>
      <Form form={form} onFinish={handleLogin}>
        <Form.Item
          {...itemLayout}
          label="Usuario:"
          name="username"
          rules={validations.username}
        >
          <Input />
        </Form.Item>

        <Form.Item
          {...itemLayout}
          label="Contraseña"
          name="password"
          rules={validations.password}
        >
          <Input.Password />
        </Form.Item>
        <Row justify="center">
          <Form.Item>
            <PrimaryButton
              fullWidth={true}
              size="large"
              icon={<LoginOutlined />}
            >
              Iniciar sesión
            </PrimaryButton>
          </Form.Item>
        </Row>
      </Form>
      {/* <Row justify="center">
        <Col>
          <ResetPassword />
        </Col>
      </Row> */}
    </Loading>
  );
}

function InfoName() {
  const [visible, setVisible] = useState(false);
  const showDrawer = () => {
    setVisible(true);
  };
  const onClose = () => {
    setVisible(false);
  };
  return (
    <>
      <Link to="#" onClick={showDrawer}>
        Aviso de privacidad
      </Link>
      <Drawer title={<><InfoCircleOutlined /> AVISO DE PRIVACIDAD</>} placement="top" height="1000vh" onClose={onClose} visible={visible}>
        <Alert
          message=""
          description={<><p style={{ textAlign: 'justify' }}>Los datos personales recabados serán incorporados en la base de datos de la Coordinación de ODES de los CECyTEs, con fundamento en lo establecido en los artículos 1, 7, 23, 68, 116 Ley General de Transparencia y Acceso a la información Pública; 4, 5, 7 Ley General de protección de Datos Personales en Posesión de Sujetos Obligados; Décimo sexto, Decimoséptimo, de los Lineamientos de Protección de los Datos Personales. La finalidad de recabar dichos datos personales es para dar cumplimiento a las disposiciones en materia educativa que existen en el país, sus datos quedarán registrados en el Listado de sistemas de datos personales ante el Instituto Federal de Acceso a la Información Pública (www.inai.org.mx) y podrán ser transmitidos a instancias correspondientes dentro de la SEP y a las autoridades competentes en materia educativa, además de otras transmisiones previstas en la Ley. La Unidad Administrativa responsable del Sistema de datos personales es la Coordinación de ODES de los CECyTEs.</p>
            <p style={{ textAlign: 'justify' }}>Los datos personales recabados serán incorporados en la base de datos de la Coordinación de ODES de los CECyTEs, con fundamento en lo establecido en los artículos 1, 7, 23, 68, 116 Ley General de Transparencia y Acceso a la información Pública; 4, 5, 7 Ley General de protección de Datos Personales en Posesión de Sujetos Obligados; Décimo sexto, Decimoséptimo, de los Lineamientos de Protección de los Datos Personales. La finalidad de recabar dichos datos personales es para dar cumplimiento a las disposiciones en materia educativa que existen en el país, sus datos quedarán registrados en el Listado de sistemas de datos personales ante el Instituto Federal de Acceso a la Información Pública (www.inai.org.mx) y podrán ser transmitidos a instancias correspondientes dentro de la SEP y a las autoridades competentes en materia educativa, además de otras transmisiones previstas en la Ley. La Unidad Administrativa responsable del Sistema de datos personales es la Coordinación de ODES de los CECyTEs.</p>
            <p style={{ textAlign: 'justify' }}>El presente aviso de privacidad puede sufrir modificaciones, cambios o actualizaciones derivadas de nuevos requerimientos legales o por otras causas.</p>
            <p style={{ textAlign: 'justify' }}>Nos comprometemos a mantenerlo informado sobre los cambios que pueda sufrir el presente aviso de privacidad a través de la página web del CECyTE en la dirección <a href="https://certificados.cecyte.edu.mx" target="_blank">https://certificados.cecyte.edu.mx</a></p></>}
          type="info"
        />
      </Drawer>
    </>
  );
}


