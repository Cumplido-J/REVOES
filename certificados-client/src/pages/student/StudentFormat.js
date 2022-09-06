import React from "react";
import { Link } from "react-router-dom";

import { Alert, Breadcrumb, Row, Col, Form } from "antd";
import { HomeOutlined, CloudDownloadOutlined, SearchOutlined } from "@ant-design/icons";

import { Loading, SearchSelect, Title, PrimaryButton } from "../../shared/components";
import { useEffect, useState } from "react";

import CatalogService from "../../service/CatalogService";
import Alerts from "../../shared/alerts";

import StudentService from "../../service/StudentService";
import StudentFormatTable from "./StudentFormatTable";
const colProps = {
    xs: { span: 24 },
    md: { span: 8 },
};
const rowProps = {
    style: { marginBottom: "1em" },
};

const validations = {
    stateId: [{ required: true, message: "¡El estado es requerido!" }],
    schoolId: [{ required: true, message: "¡El plantel es requerido!" }],
    generation: [{ required: true, message: "¡La generación es requerida!" }],
}

async function getStates() {
    const response = await CatalogService.getStateCatalogs();
    return response.states.map((state) => ({ id: state.id, description: state.description1 }));
}
async function getSchools(stateId) {
    const response = await CatalogService.getSchoolCatalogs(stateId);
    return response.schools.map((school) => ({
        id: school.id,
        description: `${school.description1} - ${school.description2}`,
    }));
}

async function getGenerations() {
    const response = await CatalogService.getGenerationsCatalogs();
    return response.generations.map((generation) => ({ id: generation.id, description: generation.description }));
}

export default function StudentFormat() {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [studentFormat, setStudentFormat] = useState([]);
    const [opState, setOpState] = useState();
    const [opSchool, setOpSchool] = useState();
    const [opGeneration, setOpGeneration] = useState();
    const [catalogs, setCatalogs] = useState({ states: [], schools: [], generations: [] });

    async function onChangeState(stateId) {
        const schools = await getSchools(stateId);
        form.setFieldsValue({ schoolId: null });
        const generations = await getGenerations();
        setCatalogs({ ...catalogs, schools, generations });
    }

    useEffect(() => {
        async function loadStates() {
            const states = await getStates();
            const generations = await getGenerations();
            setCatalogs({ states, schools: [], generations });
        }
        loadStates();
    }, []);

    const handleFinish = async (values) => {
        setLoading(true);
        const response = await StudentService.studentFormatDownload(values);
        setLoading(false);
        if (!response.success) return;
        setStudentFormat(response.studentFormat);
    };

    const handleFinishFailed = () => {
        Alerts.warning("Favor de llenar correctamente", "Existen campos sin llenar.");
    };

    return (
        <div>
            <StudentFormatHeader />
            <Loading loading={loading}>

                <Form form={form} onFinish={handleFinish} onFinishFailed={handleFinishFailed} layout="vertical">
                    <Row {...rowProps}>
                        <Col {...colProps}>
                            <Form.Item label="Estado" name="stateId" rules={validations.stateId}>
                                <SearchSelect dataset={catalogs.states} onChange={onChangeState} />
                            </Form.Item>
                        </Col>

                        <Col {...colProps}>
                            <Form.Item label="Plantel" name="schoolId" rules={validations.schoolId}>
                                <SearchSelect dataset={catalogs.schools} onChange={setOpSchool} />
                            </Form.Item>
                        </Col>

                        <Col {...colProps}>
                            <Form.Item label="Generaci&oacute;n" name="generation" rules={validations.generation}>
                                <SearchSelect dataset={catalogs.generations} onChange={setOpGeneration} />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row {...rowProps}>
                        <Col {...colProps}>
                            <PrimaryButton icon={<SearchOutlined />} loading={loading} size="media" fullWidth={false}>
                                Buscar
                            </PrimaryButton>
                        </Col>
                    </Row>
                </Form>


                <Row>
                    <Col span={24}>
                        <StudentFormatTable dataset={studentFormat} />
                    </Col>
                </Row>

            </Loading>


        </div>
    );
}

function StudentFormatHeader() {
    return (
        <>
            <Breadcrumb>
                <Breadcrumb.Item>
                    <Link to="/" style={{ color: "black" }}>
                        <HomeOutlined />
                    </Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item style={{ color: "black" }}>
                    <span>Formatos</span>
                </Breadcrumb.Item>
            </Breadcrumb>

            <Row style={{ marginTop: "1em" }}>
                <Col xs={{ span: 24 }}>
                    <Title><CloudDownloadOutlined /> Descarga de formato para certificado de término.</Title>
                </Col>
            </Row>
        </>
    );
}