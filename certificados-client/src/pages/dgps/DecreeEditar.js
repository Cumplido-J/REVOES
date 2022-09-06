import React from "react";
import { Link } from "react-router-dom";

import { HomeOutlined, CheckCircleOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { Form, Row, Col, Breadcrumb, Input } from "antd";

import { Loading, Title, PrimaryButton, ButtonCustomLink } from "../../shared/components";
import { useEffect, useState } from "react";

import Alerts from "../../shared/alerts";
import DgpServices from "../../service/DgpServices";

const colProps = {
  xs: { span: 24 },
  md: { span: 8 },
};
const rowProps = {
  style: { marginBottom: "1em" },
};

const validations = {
  name: [{ required: true, message: "¡El nombre es requerido!" }],
  clave: [{ required: true, message: "¡La Clave es requerido!" }],
  state: [{ required: true, message: "¡El estado es requerido!" }],
  cityName: [{required: true, message: "¡El municipio es requerido!"}],
};

export default function DecreeEditar({ match }) {
  const decreeId = match.params.decreeId;
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const onChangeDecree = async () => {
      setLoading(true);
      if (decreeId == "") return setLoading(false);
      const response = await DgpServices.selectAllDecree(decreeId);
      form.setFieldsValue(response.state[0]);
      setLoading(false);
    }
    onChangeDecree();
  }, [decreeId]);


  const handleFinish = async (values) => {
    setLoading(true);
    const response = await DgpServices.updateStateDecree(values);
    setLoading(false);
    if (!response.success) return;
    Alerts.success("Decreto guardado", "Decreto actualizado correctamente");
  };

  const handleFinishFailed = () => {
    Alerts.warning("Favor de llenar correctamente", "Existen campos sin llenar.");
  };

  return (
    <>
      <DgpSchoolEditarHeader />
      <Loading loading={loading}>

        <Form form={form} onFinish={handleFinish} onFinishFailed={handleFinishFailed} layout="vertical">
          <Row {...rowProps}>
            <Form.Item name="id" >
              <Input type="hidden" style={{ width: "90%" }} />
            </Form.Item>
            <Col {...colProps}>
              <Form.Item label="Estado:" name="name" rules={validations.clave}>
                <Input placeholder="Nombre" disabled style={{ width: "90%" }} />
              </Form.Item>
            </Col>

            <Col {...colProps}>
              <Form.Item label="Abreviación:" name="abbreviation" rules={validations.name}>
                <Input placeholder="Nombre" disabled style={{ width: "90%" }} />
              </Form.Item>
            </Col>
            <Col {...colProps}>
              <Form.Item label="Municipio:" name="cityName" rules={validations.cityName}>
                <Input placeholder="Municipio" style={{ width: "90%" }} />
              </Form.Item>
            </Col>
          </Row>
          <Row {...rowProps}>
            <Col {...colProps}>
              <Form.Item label="Número de decreto:" name="decreeNumber" >
                <Input placeholder="Numero" style={{ width: "90%" }} />
              </Form.Item>
            </Col>

            <Col {...colProps}>
              <Form.Item label="Fecha de decreto:" name="decreeDate" rules={validations.state}>
                <Input type="date" format="DD/MM/YYYY" style={{ width: "90%" }} />
              </Form.Item>
            </Col>

          </Row>
          <Form.Item name="state" >
            <Input type="hidden" style={{ width: "90%" }} />
          </Form.Item>
          <Row {...rowProps}>
            <Col {...colProps}>
              <ButtonCustomLink link="/Dgp/Decreto" size="large" icon={<ArrowLeftOutlined />} color="red">
                Regresar
              </ButtonCustomLink>
            </Col>
            <Col {...colProps}>
              <PrimaryButton icon={<CheckCircleOutlined />} loading={loading} size="large" fullWidth={false}>
                Guardar Decreto
              </PrimaryButton>
            </Col>
          </Row>
        </Form>
      </Loading>

    </>
  );
}

function DgpSchoolEditarHeader() {
  return (
    <>
      <Breadcrumb>
        <Breadcrumb.Item>
          <Link to="/" style={{ color: "black" }}>
            <HomeOutlined />
          </Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item style={{ color: "black" }}>
          <Link to="/Dgp/Decreto" style={{ color: "black" }}>
            <span>Decreto estatal</span>
          </Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item style={{ color: "black" }}>
          <span>Edición de Decreto</span>
        </Breadcrumb.Item>
      </Breadcrumb>

      <Row style={{ marginTop: "1em" }}>
        <Col xs={{ span: 24 }}>
          <Title>Decretos estatales </Title>
        </Col>
      </Row>
    </>
  );
}