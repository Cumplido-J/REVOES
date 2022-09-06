import React, { useEffect, useState } from "react";

import { Form, Row, Col, Input, DatePicker, message } from "antd";
import { CheckCircleOutlined, ArrowLeftOutlined } from "@ant-design/icons";

import { ButtonCustomLink, Loading, PrimaryButton, SearchSelect } from "../../shared/components";
import { schoolTypeCatalog } from "../../shared/catalogs";
import Alerts from "../../shared/alerts";

import CatalogService from "../../service/CatalogService";
import { validateCCT } from "../../shared/functions";
import { schoolStatusCatalog } from "../../shared/catalogs";

const colProps = {
    xs: { span: 24 },
    md: { span: 8 },
};
const rowProps = {
    style: { marginBottom: "1em" },
};
const validations = {
    cct: [{ required: true, message: "La cct es requerido!" }],
    name: [{ required: true, message: "¡El nombre es requerido!" }],
    stateId: [{ required: true, message: "¡El estado es requerido!" }],
    gender: [{ required: true, message: "¡El genero es requerido!"}],
    cityId: [{ required: true, message: "¡El municipio es requerido!" }],
    schoolTypeId: [{ required: true, message: "¡El tipo de plantel es requerido!" }],
    schoolStatusId: [{ required: true, message: "¡El estatus de operación es requerido!" }],
};

async function getStates() {
    const response = await CatalogService.getStateCatalogs();
    return response.states.map((state) => ({ id: state.id, description: state.description1 }));
}

async function getCities(stateId) {
    const response = await CatalogService.getCityCatalogs(stateId);
    return response.cities.map((city) => ({
        id: city.id,
        description: city.description1,
    }));
}
export default function SchoolEquivalentForm({ schoolData, onSubmit, stateId, match }) {
    const schoolId = match.params.schoolId;
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [catalogs, setCatalogs] = useState({ states: [], cities: [] });
    useEffect(() => {
        async function loadCity() {
            setLoading(true);
            if (!stateId) return;
            const cities = await getCities(stateId);
            setCatalogs({ ...catalogs, cities });
            setLoading(false);
        }
        loadCity();
    }, [stateId]);

    useEffect(() => {
        if (!schoolData) return;
        async function loadCities() {
            setLoading(true);
            const [cities] = await Promise.all([getCities(schoolData.stateId)]);
            setCatalogs({ ...catalogs, cities });
            form.setFieldsValue({ ...schoolData });
            setLoading(false);
        }
        loadCities();
    }, [schoolData, form]);

    const handleFinish = async (values) => {
        setLoading(true);
        await onSubmit(values);
        setLoading(false);
    };

    const genderSchool =
        [
            {
                id: 1, description: "El"
            },
            {
                id: 2, description: "La",
            }
        ];

    const handleFinishFailed = () => {
        Alerts.warning("Favor de llenar correctamente", "Existen campos sin llenar.");
    };
    form.setFieldsValue({ 'schoolId': schoolId })
    return (
        <Loading loading={loading}>
            <Form form={form} onFinish={handleFinish} onFinishFailed={handleFinishFailed} layout="vertical">
                <Row {...rowProps}>
                    <Form.Item name="schoolId">
                        <Input type="hidden" style={{ width: "80%" }} />
                    </Form.Item>
                    <Col xs={24} sm={12} xl={4}>
                        <Form.Item label="CCT:" name="cct" rules={validations.cct}>
                            <Input placeholder="CCT" style={{ width: "80%" }} />
                        </Form.Item>
                    </Col>

                    <Col xs={24} sm={12} xl={2}>
                        <Form.Item label="Genero:" name="gender" rules={validations.gender}>
                            <SearchSelect dataset={genderSchool} placeholder="Nombre" style={{ width: "90%" }} />
                        </Form.Item>
                    </Col>

                    <Col xs={24} sm={12} xl={12}>
                        <Form.Item label="Nombre Pdf:" name="pdfName" rules={validations.name}>
                            <Input placeholder="Nombre" style={{ width: "90%" }} />
                        </Form.Item>
                    </Col>

                    <Col xs={24} sm={12} xl={6}>
                        <Form.Item label="Municipio:" name="cityId" rules={validations.cityId}>
                            <SearchSelect dataset={catalogs.cities} />
                        </Form.Item>
                    </Col>

                </Row>

                <Row {...rowProps}>
                    <Col {...colProps}>
                        <ButtonCustomLink link="/PlantelesEquivalentes" size="large" icon={<ArrowLeftOutlined />} color="red">
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
    );
}