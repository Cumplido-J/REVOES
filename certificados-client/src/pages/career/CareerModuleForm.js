import React, { useEffect, useState } from "react";

import { Form, Row, Col, Input, DatePicker } from "antd";
import { CheckCircleOutlined, ArrowLeftOutlined } from "@ant-design/icons";

import { ButtonCustomLink, Loading, PrimaryButton, SearchSelect } from "../../shared/components";
import { schoolTypeCatalog } from "../../shared/catalogs";
import Alerts from "../../shared/alerts";

import CatalogService from "../../service/CatalogService";
import { schoolStatusCatalog } from "../../shared/catalogs";

const colProps = {
  xs: { span: 24 },
  md: { span: 8 },
};
const colProps2 = {
  xs: { span: 16 },
  md: { span: 4 },
};
const rowProps = {
  style: { marginBottom: "1em" },
};
const validations = {
  module: [{ required: true, message: "¡La competencia es requerido!" }],
  credits: [{ required: true, message: "¡El campo creditos es requerido!" }],
  hours:[{required: true, message: "¡El campo horas es requerido!" }],
  order: [{ required: true, message: "¡El campo orden es requerido!" }],
};

async function getCompetencias() {
  const response = await CatalogService.getCompetenciasCatalogs();
  return response.competencias.map((competencia) => ({ id: competencia.id, description: competencia.description2 ? competencia.description1+'-EMSaD' : competencia.description1 }));
}
export default function CareerForm({moduleData, onSubmit, onEdit }) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [catalogs, setCatalogs] = useState({ competencias: []});

  useEffect(() => {
    async function loadCompetencias() {
      setLoading(true);
      const competencias = await getCompetencias();
      setCatalogs({ competencias});
      form.setFieldsValue({ ...moduleData });
      setLoading(false);
    }
    loadCompetencias();
  }, [moduleData,form]);

  const handleFinish = async (values) => {
    setLoading(true);
    if(!moduleData.id){
      await onSubmit(values);
    }
    else{
      await onEdit(values);
    }
    form.setFieldsValue({ id:null,module:null,credits:null,order:null,hours:null});   
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
                <Form.Item label="Competencias:" name="module" rules={validations.module}>
                    <SearchSelect dataset={catalogs.competencias} />
                </Form.Item>
            </Col>            
            <Col {...colProps2}>
                <Form.Item label="Creditos:" name="credits" rules={validations.credits}>
                    <Input placeholder="Creditos" style={{ width: "90%" }} />
                </Form.Item>
            </Col>
            <Col {...colProps2}>
                <Form.Item label="Orden:" name="order" rules={validations.order}>
                    <Input placeholder="Orden" style={{ width: "90%" }} />
                </Form.Item>
            </Col>
            <Col {...colProps2}>
                <Form.Item label="Horas:" name="hours" rules={validations.hours}>
                    <Input placeholder="Horas" style={{ width: "90%" }} />
                </Form.Item>
            </Col>
            <Col {...colProps2}>
            <br></br>
            <PrimaryButton icon={<CheckCircleOutlined />} loading={loading} size="large" fullWidth={false}>
              Guardar
            </PrimaryButton>
          </Col>                      
        </Row>
      </Form>
    </Loading>
  );
}