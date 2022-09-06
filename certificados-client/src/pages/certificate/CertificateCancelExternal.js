import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Breadcrumb, Row, Col, Form, Input, Switch } from "antd";
import { HomeOutlined, FileSearchOutlined } from "@ant-design/icons";
import { Subtitle, SearchSelect, PrimaryButton, Loading } from "../../shared/components";
import Alerts from "../../shared/alerts";

import { validateCurp } from "../../shared/functions";
import CatalogService from "../../service/CatalogService";
import DegreeService from "../../service/DegreeService";
import { certificateTypeCatalog } from "../../shared/catalogs";

async function getStates() {
    const response = await CatalogService.getStateCatalogs();
    return response.states.map((state) => ({ id: state.id, description: state.description1 }));
}

const validations = {
    stateId: [{ required: true, message: "¡El estado es requerido!" }],
    curp: [
        {
            required: true,
            validator: (_, value) => {
                return validateCurp(value) ? Promise.resolve() : Promise.reject("¡Ingresa una CURP correcta!");
            },
        },
    ],
    folio: [{ required: true, message: "¡El folio es requerido!" }],
    certificateTypeId: [{ required: true, message: "¡El tipo es requerido!" }],
}

export default function CertificateCancelExternal() {
    const [loading, setLoading] = useState(false)
    const [catalogs, setCatalogs] = useState({ states: [] })

    useEffect(() => {
        async function loadStates() {
            const states = await getStates();
            setCatalogs({ states });
        }
        loadStates();
    }, []);


    return (
        <>
            <Header />
            <Loading loading={loading}>
                <FormRegistre loading={loading} setLoading={setLoading} catalogs={catalogs} />
            </Loading>
        </>
    );
}

function Header() {
    return (
        <>
            <Breadcrumb>
                <Breadcrumb.Item>
                    <Link to="/" style={{ color: "black" }}>
                        <HomeOutlined />
                    </Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item style={{ color: "black" }}>
                    <span>Cancelar certificado</span>
                </Breadcrumb.Item>
            </Breadcrumb>

            <Row style={{ marginTop: "1em" }}>
                <Col xs={{ span: 24 }}>
                    <Subtitle>Cancelar certificado externo</Subtitle>
                </Col>
            </Row>
        </>
    );
}

function FormRegistre({ loading, setLoading, catalogs }) {
    const [certificateTypeId, setCertificateTypeId] = useState(0);
    const [name, setName] = useState("");
    const handleFinish = async (values) => {
        if (values.stateServer == null || values.stateServer == false) values.stateServer = false;
        setLoading(true);
        const response = await DegreeService.cancelExternalStamps(values);
        setLoading(false);

        if (!response.success) return;
        Alerts.success("Aviso!", "¡El proceso de cancelación fue exitoso!");
    };
    const changeCertificateType = (certificateTypeId) => {
        setCertificateTypeId(certificateTypeId);
    };
    const toInputUppercase = e => {
        e.target.value = ("" + e.target.value).toUpperCase();
    };
    const handleFinishFailed = () => {
        Alerts.warning("Favor de llenar correctamente", "Existen campos sin llenar.");
    };
   
    return (
        <>
            <Form onFinish={handleFinish} onFinishFailed={handleFinishFailed} layout="vertical">

                <div className="row">
                    <div className="col-sm-6 col-md-4">
                        <Form.Item label="Estado:" name="stateId" rules={validations.stateId}>
                            <SearchSelect dataset={catalogs.states} />
                        </Form.Item>
                    </div>
                    <div className="col-sm-6 col-md-4">
                        <Form.Item label="CURP:" name="curp" rules={validations.curp}>
                            <Input onChange={e => setName(e.target.value)} onInput={toInputUppercase} style={{ width: "90%" }} />
                        </Form.Item>
                    </div>
                    <div className="col-sm-6 col-md-4">
                        <Form.Item label="Folio:" name="folio" rules={validations.folio}>
                            <Input type="text" style={{ width: "90%" }} />
                        </Form.Item>
                    </div>

                </div>
                <div className="row">
                    <div className="col-sm-6 col-md-4">
                        <Form.Item label="Tipo de certificado:" name="stampedType" rules={validations.certificateTypeId}>
                            <SearchSelect dataset={certificateTypeCatalog} onChange={changeCertificateType} />
                        </Form.Item>
                    </div>
                    <div className="col-sm-6 col-md-4">
                        <Form.Item label="Estado del servidor:" name="stateServer" >
                            <Switch checkedChildren="Productivo" unCheckedChildren="Test" />
                        </Form.Item>
                    </div>
                    <div className="col-sm-6 col-md-4">
                        <Form.Item label="." name="" >
                            <PrimaryButton loading={loading} icon={<FileSearchOutlined />}>
                                Cancelar
                            </PrimaryButton>
                        </Form.Item>
                    </div>
                </div>

            </Form>
        </>
    );
}