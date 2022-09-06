import React, { useEffect, useState } from "react";
import { Modal, Form, Table, Col, Row } from "antd";
import { HomeOutlined, CheckCircleOutlined } from "@ant-design/icons";
import { Loading, SearchSelect, PrimaryButton } from "../../shared/components";
import Alerts from "../../shared/alerts";
import { columnProps } from "../../shared/columns";
import DegreeCatalogService from "../../service/DegreeCatalogService";
import DgpServices from "../../service/DgpServices";
import DgpCareersTable from "./DgpCareersTable";

const columns = [{
    ...columnProps,
    title: "Nombre en DGP",
    align: 'left',
    render: (row) => {
        return (
            row.description2
        )
    }
},
{
    ...columnProps,
    title: "Clave en DGP",
    width: '25%',
    render: (row) => {
        return (
            row.description1
        )
    }
},
];

async function getAllSchoolDgp() {
    const response = await DegreeCatalogService.careerAllDgp();
    return response.careers.map((career) => ({ id: career.id, description: `${career.description1} - ${career.description2}` }));
}

async function getSchool(schoolId) {
    const response = await DegreeCatalogService.getCarrers(schoolId);
    return response;
}

const rowProps = {
    style: { marginBottom: "1em" },
};


const validations = {
    schoolId: [{ required: true, message: "¡El plantel es requerido!" }],
    careerId: [{ required: true, message: "¡La carrera es requerido!" }]
};
export default function SchoolCombination({ combination, setCombination, userProfile, stateId, getSchoolDgp }) {
    const [form] = Form.useForm();
    const [catalogs, setCatalogs] = useState({ careers: [] });
    const [careerDgp, setCareerDgp] = useState({ careers: [] });
    const [school, setSchool] = useState({ school: [] });
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const getCareerData = async () => {
            setLoading(true);
            setLoading(false);
            setShowModal(true);
        };
        const onChangeSchool = async () => {
            setLoading(true);
            const response = await DegreeCatalogService.getCarrers(combination);
            if (!response) return;
            const careers = response.careers.map((career) => ({
                id: career.id,
                clave: career.description1,
                career: career.description2
            }));
            setCatalogs({ careers });
            setLoading(false);
        };
        const getSchool = async () => {
            setLoading(true);
            const response = await DegreeCatalogService.searSchoolDgp(combination);
            if (!response) return;
            const school = response.school.map((school) => ({
                id: school.id,
                description: `${school.description1} - ${school.description2}`
            }));
            form.setFieldsValue({ 'schoolId': school.id, });
            setSchool({ school });
            setLoading(false);
        }

        if (combination === null) {
            setShowModal(false);
            if (stateId) {
                getSchoolDgp(stateId);
            }
        } else {
            getCareerData();
            onChangeSchool();
            getSchool();
            //searchCareerData(combination);
        }
    }, [combination, stateId]);


    useEffect(() => {
        async function loadCareers() {
            const careers = await getAllSchoolDgp();
            setCareerDgp({ careers });
        }
        loadCareers();
    }, []);



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
        Alerts.success("Carrera guardado", "Carrera asignada correctamente");
        await getCareer(combination);
    };

    const handleFinishFailed = () => {
        Alerts.warning("Favor de llenar correctamente", "Existen campos sin llenar.");
    };

    const deleteCombination = async (values) => {
        setLoading(true);
        const response = await DgpServices.deleteCombinationCareer(values);
        setLoading(false);
        if (!response.success) return;
        Alerts.success("Aviso", "Combinación eliminada");
        await getCareer(combination);
    }



    return (
        <Modal
            onCancel={() => {
                setCombination(null);
            }}
            visible={showModal}
            width="100%"
            zIndex={1040}
            centered
            title={"Carreras del plantel en DGP"}
            footer={null}
        >
            <Loading loading={loading}>

                <>
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
                                    <label style={{ color: "#fff" }}>Agregar</label>
                                    <PrimaryButton icon={<CheckCircleOutlined />} loading={loading} size="medium" fullWidth={false}>
                                        Agregar Carrera
                                    </PrimaryButton>
                                </Col>
                            </Row>

                        </Form>
                        <hr />
                        <DgpCareersTable dataset={catalogs.careers} userProfile={userProfile} deleteCombination={deleteCombination} />
                    </Loading>

                </>

            </Loading>
        </Modal>
    );
}