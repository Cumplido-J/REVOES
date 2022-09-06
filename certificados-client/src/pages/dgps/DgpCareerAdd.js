import React from "react";
import { Link } from "react-router-dom";

import { HomeOutlined, CheckCircleOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { Form, Row, Col, Breadcrumb, Input } from "antd";

import { Loading, Title, PrimaryButton, ButtonCustomLink } from "../../shared/components";
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
    clave: [{ required: true, message: "¡La clave es requerido!" }],
    modality: [{ required: true, message: "¡La modalidad es requerido!" }],
    level: [{ required: true, message: "¡El nivel es requerido!" }],
};

export default function DgpSchoolEditar() {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const [name, setName] = useState("");    

    const handleFinish = async (values) => {
        setLoading(true);
        const response = await DgpServices.addNewCareerDgp(values);
        setLoading(false);
        if (!response.success) return;
        Alerts.success("Carrera guardado", "Carrera guardada correctamente");
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
                        <Col xs={24} sm={12} xl={4}>
                            <Form.Item label="Clave:" name="clave" rules={validations.clave}>
                                <Input placeholder="clave" style={{ width: "80%" }} />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12} xl={10}>
                            <Form.Item label="Modalidad:" name="modality" rules={validations.modality}>
                                <Input placeholder="ej: ESCOLARIZADA" onChange={e => setName(e.target.value)} onInput={toInputUppercase} style={{ width: "90%" }} />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12} xl={10}>
                            <Form.Item label="Nivel:" name="level" rules={validations.level}>
                                <Input placeholder="ej: TÉCNICO" onChange={e => setName(e.target.value)} onInput={toInputUppercase} style={{ width: "90%" }} />
                            </Form.Item>
                        </Col>

                    </Row>

                    <Row {...rowProps}>
                        
                        <Col xs={24} sm={12} xl={12}>
                            <Form.Item label="Nombre en DGP:" name="carrer" >
                                <Input placeholder="ej: ASISTENCIA EN DIRECCIÓN Y CONTROL DE PYMES	" onChange={e => setName(e.target.value)} onInput={toInputUppercase} style={{ width: "90%" }} />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12} xl={12}>
                            <Form.Item label="Nombre final en DGP:" name="name" rules={validations.name}>
                                <Input placeholder="ej: TÉCNICO EN ASISTENCIA EN DIRECCIÓN Y CONTROL DE PYMES" onChange={e => setName(e.target.value)} onInput={toInputUppercase} style={{ width: "90%" }} />
                            </Form.Item>
                        </Col>
                    </Row>


                    <Row {...rowProps}>
                        <Col xs={24} sm={12} xl={8}>
                            <ButtonCustomLink link="/Dgp/Carreras/List" size="large" icon={<ArrowLeftOutlined />} color="red">
                                Regresar a la lista de carreras
                            </ButtonCustomLink>
                        </Col>
                        <Col xs={24} sm={12} xl={8}>
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
                    <Link to="/Dgp/Carreras/Add" style={{ color: "black" }}>
                        <span>Carrera en DGP</span>
                    </Link>
                </Breadcrumb.Item>
            </Breadcrumb>

            <Row style={{ marginTop: "1em" }}>
                <Col xs={{ span: 24 }}>
                    <Title>Carrera en DGP</Title>
                </Col>
            </Row>
        </>
    );
}