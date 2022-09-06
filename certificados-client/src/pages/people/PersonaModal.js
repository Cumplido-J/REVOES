import React, { useEffect, useState } from "react";

import { Form, Row, Col, Input} from "antd";
import { CheckCircleOutlined} from "@ant-design/icons";
import { validateCurp,validateRfc } from "../../shared/functions";
import { Loading, PrimaryButton, SearchSelect } from "../../shared/components";
import Alerts from "../../shared/alerts";

import CatalogService from "../../service/CatalogService";
import { schoolStatusCatalog } from "../../shared/catalogs";

const colProps = {
  xs: { span: 24 },
  md: { span: 8 },
};
const rowProps = {
  style: { marginBottom: "1em" },
};
const validations = {
  curp: [
    { 
      required: true,
      validator: (_, value) => {
        return validateCurp(value) ? Promise.resolve() : Promise.reject("¡Ingresa una CURP correcta!");
      },
    },
  ],
  rfc:[
    {
      required:true,
      validator:(_,value)=>{
        return validateRfc(value)?Promise.resolve():Promise.reject("¡Ingresa una RFC correcta!");
      }
    }
  ],
  name: [{ required: true, message: "¡El nombre es requerido!" }],
  ape1: [{ required: true, message: "¡El nombre es requerido!" }],
  ape2: [{ required: true, message: "¡El nombre es requerido!" }],
  stateId: [{ required: true, message: "¡El estado es requerido!" }],
  statusId: [{ required: true, message: "¡El estatus de operación es requerido!" }],
  CargoId: [{ required: true, message: "¡El cargo es requerido!" }],  
};

async function getStates() {
  const response = await CatalogService.getStateCatalogs();
  return response.states.map((state) => ({ id: state.id, description: state.description1 }));
}
async function getCargos() {
  const response = await CatalogService.getCargosCatalogs();
  return response.cargos.map((cargo) => ({ id: cargo.id, description: cargo.description1 }));
}

export default function PersonaForm({personaData, onSubmit }) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [catalogs, setCatalogs] = useState({ states: []});
  const [catalogs2, setCatalogs2] = useState({cargos: []});
  
  useEffect(() => {
    async function loadCargos() { 
      const cargos = await getCargos();
      setCatalogs2({ cargos});
    }
    loadCargos();
  }, []);

  useEffect(() => {
    //if (!personaData) return;
    async function loadStates() { 
      const states = await getStates();
      setCatalogs({ states});
      form.setFieldsValue({ ...personaData });
    }
    loadStates();
  }, [personaData, form]);


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
            <Form.Item label="CURP:" name="curp" rules={validations.curp}>
              <Input placeholder="CURP" style={{ width: "90%" }} />
            </Form.Item>
          </Col>
          <Col {...colProps}>
            <Form.Item label="RFC:" name="rfc" rules={validations.rfc}>
              <Input placeholder="RFC" style={{ width: "90%" }} />
            </Form.Item>
          </Col>                     
          <Col {...colProps}>
            <Form.Item label="Nombre:" name="name" rules={validations.name}>
              <Input placeholder="Nombre" style={{ width: "90%" }} />
            </Form.Item>
          </Col>         
        </Row>
        <Row {...rowProps}>
          <Col {...colProps}>
            <Form.Item label="Apellido paterno:" name="ape1" rules={validations.ape1}>
              <Input placeholder="Apellido paterno" style={{ width: "90%" }} />
            </Form.Item>
          </Col>          
          <Col {...colProps}>
            <Form.Item label="Apellido materno:" name="ape2" rules={validations.ape2}>
              <Input placeholder="Apellido materno" style={{ width: "90%" }} />
            </Form.Item>
          </Col>
          <Col {...colProps}>
            <Form.Item label="Estado:" name="stateId" rules={validations.stateId}>
              <SearchSelect dataset={catalogs.states} />
            </Form.Item>
          </Col>          
        </Row>
        <Row {...rowProps}>
          <Col {...colProps}>
            <Form.Item label="Estatus de operación:" name="statusId" rules={validations.statusId}>
              <SearchSelect dataset={schoolStatusCatalog} />
            </Form.Item>
          </Col>
          <Col {...colProps}>
            <Form.Item label="Cargo:" name="cargoId" rules={validations.cargoId}>
              <SearchSelect dataset={catalogs2.cargos} />
            </Form.Item>
          </Col>                    
        </Row>        
        <Row {...rowProps}>
        <Col {...colProps}>&nbsp;</Col>
        <Col {...colProps}>&nbsp;</Col>
          <Col {...colProps}>
            <PrimaryButton icon={<CheckCircleOutlined />} loading={loading} size="large" fullWidth={false}>
              Guardar
            </PrimaryButton>
          </Col>
        </Row>
      </Form>
    </Loading>
  );
}