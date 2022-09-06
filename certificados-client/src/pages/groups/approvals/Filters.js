import { Col, Form, Row } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import PermissionValidator from "../../../components/PermissionValidator";
import useStatesCatalog from "../../../hooks/catalogs/useStatesCatalog";
import useSchoolCatalog from "../../../hooks/catalogs/useSchoolCatalog";
import { Semesters } from "../../../shared/catalogs";
import {
  Loading,
  PrimaryButton,
  SearchSelect,
} from "../../../shared/components";
import { permissionList } from "../../../shared/constants";
import FormColumnStyles from "../../../shared/FormColumnStyles";

const Filters = ({ onSearch = () => {}, parentLoading = false }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState();
  const [statesLoading, states] = useStatesCatalog();
  const [schoolsLoading, schools, setSchoolStateFilter] = useSchoolCatalog();

  const handleOnStateChange = (stateId) => {
    setLoading(true);
    setSchoolStateFilter(stateId);
  };

  const submitForm = ({ plantel_id, semestre }) => {
    const params = {};
    if (plantel_id) params.plantel_id = plantel_id;
    if (semestre) params.semestre = semestre;
    onSearch(params);
  };

  useEffect(() => {
    setLoading(statesLoading || schoolsLoading || parentLoading);
  }, [statesLoading, schoolsLoading, parentLoading]);

  return (
    <div style={{ marginBottom: "10px" }}>
      <Loading loading={loading}>
        <Form form={form} layout="vertical" onFinish={submitForm}>
          <Row {...FormColumnStyles.rowProps}>
            <PermissionValidator
              permissions={[permissionList.NACIONAL, permissionList.ESTATAL]}
              allPermissions={false}
            >
              <Col {...FormColumnStyles.colProps}>
                <Form.Item name="state_id" label="Estado">
                  <SearchSelect
                    dataset={states}
                    onChange={handleOnStateChange}
                  />
                </Form.Item>
              </Col>
            </PermissionValidator>
            <Col {...FormColumnStyles.colProps}>
              <Form.Item name="plantel_id" label="Plantel">
                <SearchSelect dataset={schools} disabled={!schools.length} />
              </Form.Item>
            </Col>
            <Col {...FormColumnStyles.colProps}>
              <Form.Item name="semestre" label="Semestre">
                <SearchSelect dataset={Semesters} />
              </Form.Item>
            </Col>
          </Row>
          <Row {...FormColumnStyles.rowProps}>
            <Col {...FormColumnStyles.colProps}>
              <PrimaryButton loading={loading} icon={<SearchOutlined />}>
                Buscar
              </PrimaryButton>
            </Col>
          </Row>
        </Form>
      </Loading>
    </div>
  );
};

export default Filters;
