import React, { useEffect, useState } from "react";

import { Form, Row, Col, Input} from "antd";
import { CheckCircleOutlined} from "@ant-design/icons";

import {Loading, PrimaryButton, SearchSelect } from "../../shared/components";
import Alerts from "../../shared/alerts";

import CatalogService from "../../service/CatalogService";
import { schoolStatusCatalog } from "../../shared/catalogs";
import { userHasRole } from "../../shared/functions";

const colProps = {
  xs: { span: 24 },
  md: { span: 8 },
};
const rowProps = {
  style: { marginBottom: "1em" },
};
const validations = {
  name: [{ required: true, message: "¡El nombre es requerido!" }],
  careerKey: [{ required: true, message: "¡La clave es requerido!" }],
  totalCredits:[{required: true, message: "¡Total de créditos es requerido!" }],
  profileType: [{ required: true, message: "¡El tipo perfil es requerido!" }],
  studyType: [{ required: true, message: "¡El tipo estudio es requerido!" }],
  disciplinaryField: [{ required: true, message: "¡El campo disciplinaria es requerido!" }],
  statusId: [{ required: true, message: "¡El estatus de operación es requerido!" }],
};

async function getPerfil() {
  const response = await CatalogService.getPerfilCatalogs();
  return response.perfiles.map((perfil) => ({ id: perfil.id, description: perfil.description1 }));
}
async function getEstudio() {
    const response = await CatalogService.getEstudioCatalogs();
    return response.estudios.map((estudio) => ({ id: estudio.id, description: estudio.description1 }));
  }
  async function getDiciplinar() {
    const response = await CatalogService.getDiciplinarCatalogs();
    return response.diciplinas.map((diciplina) => ({ id: diciplina.id, description: diciplina.description1}));
  }
  async function getSubject() {
    const response = await CatalogService.getSubjectCatalogs();
    return response.subjects.map((subject) => ({ id: subject.id, description: subject.description1 }));
  }  
export default function CareerForm({careerData,onSubmit, userProfile }) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [catalogs, setCatalogs] = useState({ perfiles: [],estudios: [],diciplinas:[],subjects:[]});
  const [activo, setActivo] = useState(false);
  useEffect(() => {
    //if (!careerData) return;
    async function loadEstudio() {
      setLoading(true);
      const [perfiles, estudios,diciplinas,subjects] = await Promise.all([getPerfil(),getEstudio(),
                getDiciplinar(),getSubject()]);
      setCatalogs({ perfiles,estudios,diciplinas,subjects});
      form.setFieldsValue({ ...careerData });
      setLoading(false);
    }
    loadEstudio();
  }, [careerData,form]);

  const handleFinish = async (values) => {
    setLoading(true);
    await onSubmit(values);
    form.setFieldsValue({ name:null, careerKey:null,totalCredits:null,profileType:null});
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
                <Form.Item label="Nombre:" name="name" rules={validations.name}>
                  {userHasRole.dev(userProfile.roles) ? <Input placeholder="Nombre" style={{ width: "90%" }}  /> : <Input placeholder="Nombre" style={{ width: "90%" }} disabled />}                    
                </Form.Item>
            </Col>
            <Col {...colProps}>
                <Form.Item label="Clave:" name="careerKey" rules={validations.careerKey}>
                    {userHasRole.dev(userProfile.roles) ? <Input placeholder="Clave carrera" style={{ width: "90%" }} /> : <Input placeholder="Clave carrera" style={{ width: "90%" }} disabled />}
                </Form.Item>
            </Col>
            <Col {...colProps}>
                <Form.Item label="Créditos:" name="totalCredits" rules={validations.totalCredits}>
                {userHasRole.dev(userProfile.roles) ? <Input placeholder="Total de creditos" style={{ width: "90%" }} /> :  <Input placeholder="Total de creditos" style={{ width: "90%" }} disabled /> }
                </Form.Item>
            </Col>                      
        </Row>
        <Row>
            <Col {...colProps}>
                <Form.Item label="Tipo perfil:" name="profileType" rules={validations.profileType}>
                {userHasRole.dev(userProfile.roles) ? <SearchSelect dataset={catalogs.perfiles} /> : <SearchSelect dataset={catalogs.perfiles} disabled /> }
                </Form.Item>
            </Col>            
            <Col {...colProps}>
                <Form.Item label="Tipo estudio:" name="studyType" rules={validations.studyType}>
                {userHasRole.dev(userProfile.roles) ? <SearchSelect dataset={catalogs.estudios} /> : <SearchSelect dataset={catalogs.estudios} disabled /> }
                </Form.Item>
            </Col> 
            <Col {...colProps}>
                <Form.Item label="Campo Disciplinaria:" name="disciplinaryField" rules={validations.disciplinaryField}>
                {userHasRole.dev(userProfile.roles) ? <SearchSelect dataset={catalogs.diciplinas} /> : <SearchSelect dataset={catalogs.diciplinas} disabled /> }
                </Form.Item>
            </Col>                       
        </Row>
        <Row {...rowProps}>
        <   Col {...colProps}>
                <Form.Item label="Tipo UAC:" name="subjectType" >
                {userHasRole.dev(userProfile.roles) ? <SearchSelect dataset={catalogs.subjects} /> : <SearchSelect dataset={catalogs.subjects} disabled /> }
                </Form.Item>
            </Col>             
            <Col {...colProps}>
                <Form.Item label="Estatus de operación:" name="statusId" rules={validations.statusId}>
                {userHasRole.dev(userProfile.roles) ? <SearchSelect dataset={schoolStatusCatalog} /> : <SearchSelect dataset={schoolStatusCatalog} disabled /> }
                </Form.Item>
            </Col>
        </Row>
        <Row {...rowProps}>
          <Col {...colProps}>
            &nbsp;
          </Col>
          <Col {...colProps}>
          {(userHasRole.dev(userProfile.roles)) && (
            <PrimaryButton icon={<CheckCircleOutlined />} loading={loading} size="large" fullWidth={false} disabled={activo}>
              Guardar carrera
            </PrimaryButton>
            )}
          </Col>
        </Row>
      </Form>
    </Loading>
  );
}