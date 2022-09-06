import React from "react";
import { Link } from "react-router-dom";
import { Form, Row, Col, Breadcrumb, Input } from "antd";
import Alerts from "../../shared/alerts";
import { HomeOutlined, CheckCircleOutlined } from "@ant-design/icons";
import { Loading, SearchSelect, Title, PrimaryButton } from "../../shared/components";
import { useEffect, useState } from "react";

import DegreeCatalogService from "../../service/DegreeCatalogService";
import DgpCareersTable from "./DgpCareersTable";
import DgpServices from "../../service/DgpServices";

const colProps = {
    xs: { span: 24 },
    md: { span: 8 },
};
const rowProps = {
    style: { marginBottom: "1em" },
};


const validations = {
    schoolId: [{ required: true, message: "¡El plantel es requerido!" }],
    careerId: [{ required: true, message: "¡La carrera es requerido!" }]
};


async function getAllSchoolDgp() {
    const response = await DegreeCatalogService.careerAllDgp();
    return response.careers.map((career) => ({ id: career.id, description: `${career.description1} - ${career.description2}` }));
}

async function getSchool(schoolId) {
    const response = await DegreeCatalogService.getCarrers(schoolId);
    return response;
}

export default function DgpCareers({ match }) {
    const schoolId = match.params.schoolId;
    const [form] = Form.useForm();
    const [catalogs, setCatalogs] = useState({ careers: [] });
    const [careerDgp, setCareerDgp] = useState({ careers: [] });
    const [school, setSchool] = useState({ school: [] });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        async function loadCareers() {
            const careers = await getAllSchoolDgp();
            setCareerDgp({ careers });
        }
        loadCareers();
    }, []);


    useEffect(() => {
        const onChangeSchool = async () => {
            setLoading(true);
            const response = await DegreeCatalogService.getCarrers(schoolId);
            if (!response) return;
            const careers = response.careers.map((career) => ({
                id: career.id,
                clave: career.description1,
                career: career.description2
            }));
            setCatalogs({ careers });
            setLoading(false);
        };
        onChangeSchool();
        const getSchool = async () => {
            setLoading(true);
            const response = await DegreeCatalogService.searSchoolDgp(schoolId);
            if (!response) return;
            const school = response.school.map((school) => ({
                id: school.id,
                description: `${school.description1} - ${school.description2}`
            }));
            setSchool({ school });
            setLoading(false);
        }
        getSchool();

    }, [schoolId])

    const getCareer = async (schoolId) => {
        const response = await getSchool(schoolId);
        if (!response) return;
        const careers = response.careers.map((career) => ({
            id: career.id,
            clave: career.description1,
            career: career.description2
        }));
        setCatalogs({ careers });
    }

    const handleFinish = async (values) => {
        setLoading(true);
        const response = await DgpServices.addCombinationCareer(values);
        setLoading(false);
        if (!response.success) return;
        Alerts.success("Carrera guardado", "Carrera assignada correctamente");
        await getCareer(schoolId);
    };

    const handleFinishFailed = () => {
        Alerts.warning("Favor de llenar correctamente", "Existen campos sin llenar.");
    };

    return (
        <div>
            <DgpCareersHeader />

            <Loading loading={loading}>
                <Form form={form} onFinish={handleFinish} onFinishFailed={handleFinishFailed} layout="vertical">
                    <Row {...rowProps}>
                        <Col xs={24} sm={24} xl={8}>
                            <Form.Item label="Plantel en DGP:" name="schoolId" rules={validations.schoolId}>
                                <SearchSelect dataset={school.school} />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={24} xl={8}>
                            <Form.Item label="Carrera en DGP:" name="careerId" rules={validations.careerId}>
                                <SearchSelect dataset={careerDgp.careers} />
                            </Form.Item>
                        </Col>

                        <Col xs={24} sm={24} xl={8}>
                            <br></br>
                            <PrimaryButton icon={<CheckCircleOutlined />} loading={loading} size="large" fullWidth={false}>
                                Agregar Carrera
                            </PrimaryButton>
                        </Col>
                    </Row>
                   
                </Form>
                <hr />
                <DgpCareersTable dataset={catalogs.careers} />
            </Loading>

        </div>
    );
}

function DgpCareersHeader() {
    return (
        <>
            <Breadcrumb>
                <Breadcrumb.Item>
                    <Link to="/" style={{ color: "black" }}>
                        <HomeOutlined />
                    </Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item style={{ color: "black" }}>
                    <Link to="/Dgp/Planteles" style={{ color: "black" }}>
                        <span>Planteles en DGP</span>
                    </Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item style={{ color: "black" }}>
                    <span>Carreras en DGP</span>
                </Breadcrumb.Item>
            </Breadcrumb>

            <Row style={{ marginTop: "1em" }}>
                <Col xs={{ span: 24 }}>
                    <Title>Carreras en DGP</Title>
                </Col>
            </Row>
        </>
    );
}
