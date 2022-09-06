import React, { useEffect, useState } from "react";

import { Form, Row, Col, Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";

import { Loading, PrimaryButton, SearchSelect } from "../../shared/components";

import Alerts from "../../shared/alerts";

import CatalogService from "../../service/CatalogService";

const colProps = {
  xs: { span: 24 },
  md: { span: 8 },
};
const rowProps = {
  style: { marginBottom: "1em" },
};
const validations = {
  //adminTypeId: [{ required: true, message: "Este campo es requerido" }],
  checkAdminCatalogNivel: [{ required: true, message: "¡El cargo es necesario!" }],
  superUserId: [{ required: true, message: "¡Super usuario de control escolar es requerido!" }],
  default: [{ required: true }],
};

export default function UserSearchFilter({ history, userProfile, onSubmit }) {
  const [form] = Form.useForm();
  const [catalogs, setCatalogs] = useState({ states: [], schools: [] });
  const [adminType, setAdminType] = useState(0);
  const [loading, setLoading] = useState(false);

  const [rol, setRol] = useState([]);
  const [state, setState] = useState(0);

  useEffect(() => {
    async function getRol() {
      const response = await CatalogService.getRoleCatalogs();
      if (!response) return;
      const rol = response.states.map((rol) => ({id: rol.id, description: rol.description2}));
      setRol(rol);
      setLoading(false);
    }
    getRol();
  },[]);

  useEffect(() => {
    async function getStates() {
      const response = await CatalogService.getStateCatalogs();
      if (!response) return;
      const states = response.states.map((state) => ({ id: state.id, description: state.description1 }));
      setCatalogs({ states, schools: [] });
      setLoading(false);
    }

    getStates();
  }, []);

  const onChangeAdminType = (value) => {
    setAdminType(value);
  };

  const onChangeState = async (stateId) => {
    setState(stateId);
    setLoading(true);
    const response = await CatalogService.getSchoolCatalogs(stateId);
    if (!response) return;

    const schools = response.schools.map((school) => ({
      id: school.id,
      description: `${school.description1} - ${school.description2}`,
    }));
    form.setFieldsValue({ schoolId: null, careerId: null });
    setCatalogs({ ...catalogs, schools, careers: [] });
    setLoading(false);
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
      <Form form={form} onFinish={handleFinish} onFinishFailed={handleFinishFailed} layout="vertical">
        <Row {...rowProps}>
          <Col {...colProps}>
            <Form.Item label="Tipo de administrador:" name="adminTypeId" rules={validations.adminTypeId}>
              <SearchSelect dataset={rol} onChange={onChangeAdminType} />
            </Form.Item>
          </Col>
          {adminType !== 1 && adminType !== 0 && (
            <>
              {adminType !== 1 && (
                <Col {...colProps}>
                  <Form.Item label="Estado:" name="stateId">
                    <SearchSelect dataset={catalogs.states} onChange={onChangeState} />
                  </Form.Item>
                </Col>
              )}
              {state !== 0 && state > 0 && state !== "" && (
                <Col {...colProps}>
                  <Form.Item label="Plantel:" name="schoolId">
                    <SearchSelect dataset={catalogs.schools} />
                  </Form.Item>
                </Col>
              )}
            </>
          )}

        </Row>
        <Row {...rowProps}>
          <Col {...colProps}>
            <Form.Item label="Username:" name="username">
              <Input placeholder="Username" style={{ width: "90%" }} />
              </Form.Item>
          </Col>
        </Row>
        <Row {...rowProps}>
          <Col {...colProps}>
            <PrimaryButton loading={loading} icon={<SearchOutlined />}>
              Buscar
            </PrimaryButton>
          </Col>
        </Row>
      </Form>
    </Loading>
  );
}