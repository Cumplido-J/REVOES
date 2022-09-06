import React from "react";
import { Link } from "react-router-dom";

import { HomeOutlined, CheckCircleOutlined, ArrowLeftOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { Form, Row, Col, Breadcrumb, Input } from "antd";

import { Loading, SearchSelect, Title, PrimaryButton, ButtonCustomLink } from "../../shared/components";
import { useEffect, useState } from "react";

import DegreeCatalogService from "../../service/DegreeCatalogService";
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
  school: [{ required: true, message: "¡El plantel es requerido!" }],
};

async function getStates() {
  const response = await DegreeCatalogService.getStates();
  return response.degreeStates.map((degreeState) => ({ id: degreeState.id, description: degreeState.description1 }));
}

async function schoolsNormalAll() {
  const response = await DegreeCatalogService.schoolsNormalAll();
  return response.school.map((s) => ({ id: s.id, description: `${s.description1} - ${s.description2}` }))
}

export default function DgpSchoolEditar({ match }) {
  const schoolId = match.params.schoolId;
  const [form] = Form.useForm();
  const [catalogs, setCatalogs] = useState({ schools: [] });
  const [dgpState, setDgpState] = useState({ states: [] });
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState("");


  useEffect(() => {
    async function loadState() {
      const states = await getStates();
      setDgpState({ states });
    }
    async function loadSchool() {
      const schools = await schoolsNormalAll();
      setCatalogs({ schools });
    }
    loadState();
    loadSchool();
  }, []);
  

  useEffect(() => {
    async function loadSchool() {
      setLoading(true);
      const response = await DgpServices.selectSchoolDgp(schoolId);
      form.setFieldsValue(response.school);
      setLoading(false);
    }
    loadSchool();

  }, [schoolId]);

  const handleFinish = async (values) => {
    setLoading(true);
    const response = await DgpServices.updateSchoolDgp(values);
    //alert(JSON.stringify(response))
    setLoading(false);
    if(!response.success) return;
    Alerts.success("Plantel guardado", "Plantel actualizado correctamente");   
  };

  const handleFinishFailed = () => {
    Alerts.warning("Favor de llenar correctamente", "Existen campos sin llenar.");
  };

  const toInputUppercase = e => {
    e.target.value = ("" + e.target.value).toUpperCase();
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
            <Col xs={24} sm={12} xl={8}>
              <Form.Item label="Clave:" name="clave" rules={validations.clave}>
                <Input placeholder="clave" style={{ width: "90%" }} />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12} xl={16}>
              <Form.Item label="Nombre en DGP:" name="name" rules={validations.name}>
                <Input placeholder="C.E.C. Y T.E. DE " onChange={e => setName(e.target.value)} onInput={toInputUppercase}   style={{ width: "95%" }} />
              </Form.Item>
            </Col>
          </Row>
          <Row {...rowProps}>
            <Col xs={24} sm={24} xl={24}>
              <Form.Item label="Nombre Completo:" name="complete">
                <Input placeholder="COLEGIO DE ESTUDIOS CIENTÍFICOS Y TECNOLÓGICOS DEL ESTADO DE" onChange={e => setName(e.target.value)} onInput={toInputUppercase} style={{ width: "97%" }} />
              </Form.Item>
            </Col>
          </Row>
          <Row {...rowProps}>
            <Col xs={24} sm={12} xl={12}>
              <Form.Item label="Estado:" name="state" rules={validations.state}>
                <SearchSelect dataset={dgpState.states} style={{ width: "96%" }} />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12} xl={12}>
              <Form.Item label="Plantel Comun(equivalente al DGP):" name="school" rules={validations.school}>
                <SearchSelect dataset={catalogs.schools}  style={{ width: "96%" }} />
              </Form.Item>
            </Col>

          </Row>
          <Row {...rowProps}>
            <Col {...colProps}>
              <ButtonCustomLink link="/Dgp/Planteles" size="large" icon={<ArrowLeftOutlined />} color="red">
                Regresar a lista de planteles
              </ButtonCustomLink>
            </Col>
            <Col {...colProps}>
              <PrimaryButton icon={<CheckCircleOutlined />} loading={loading} size="large" fullWidth={false}>
                Guardar plantel
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
          <Link to="/Dgp/Planteles" style={{ color: "black" }}>
            <span>Planteles en DGP</span>
          </Link>
        </Breadcrumb.Item>
      </Breadcrumb>

      <Row style={{ marginTop: "1em" }}>
        <Col xs={{ span: 24 }}>
          <Title>Lista de Planteles en DGP</Title>
        </Col>
      </Row>
    </>
  );
}