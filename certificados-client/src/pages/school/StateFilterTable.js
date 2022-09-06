import React, { useEffect, useState } from "react";

import { Form, Row, Col, Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";

import { Loading, PrimaryButton, SearchSelect } from "../../shared/components";
import { schoolTypeCatalog } from "../../shared/catalogs";
import StatesDatesConfig from "./statesDatesConfig/statesDatesConfig";
import Alerts from "../../shared/alerts";

import CatalogService from "../../service/CatalogService";

const colProps = {
  xs: { span: 24 },
  md: { span: 8 },
};
const rowProps = {
  style: { marginBottom: "1em" },
};
export default function StateFilterTable({ history, userProfile, onSubmit }) {
  const [form] = Form.useForm();
  const [catalogs, setCatalogs] = useState({ states: [], careers: [] });
  const [stateId, setStateId] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getStates() {
      const response = await CatalogService.getStateCatalogs();
      if (!response) return;
      const states = response.states.map((state) => ({ id: state.id, description: state.description1 }));

      setCatalogs({ states});
      setLoading(false);
    }

    getStates();
  }, []);

  const onChangeState = async (state) => {
    setStateId(state);
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
            <Form.Item label="Estado:" name="stateId">
              <SearchSelect dataset={catalogs.states} onChange={onChangeState} />
            </Form.Item>
            
          </Col>
        </Row>
      </Form>
      <StatesDatesConfig stateId={stateId} />
    </Loading>
  );
}
