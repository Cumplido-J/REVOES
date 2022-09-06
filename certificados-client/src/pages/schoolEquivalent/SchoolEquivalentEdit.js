import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Tabs, Row, Col, Breadcrumb, Alert } from "antd";
import { HomeOutlined } from "@ant-design/icons";
import { PageLoading, Title, Loading } from "../../shared/components";
import SchoolService from "../../service/SchoolService";
import alerts from "../../shared/alerts";
import CatalogService from "../../service/CatalogService";

import SchoolEquivalentForm from "./SchoolEquivalentForm";

export default function SchoolEquivalentEdit(props) {
    const { cct } = props.match.params;
    const { stateId, schoolId } = props.match.params;

    const [schoolData, setSchoolData] = useState({});
    const [loading, setLoading] = useState(true);
    const getSchoolData = async (schoolId) => {
        const response = await SchoolService.selectSchoolEquivalent(schoolId);
        setSchoolData(response.schoolData[0]);
        setLoading(false);
    };
    useEffect(() => {
        getSchoolData(schoolId);
    }, [schoolId]);

    const editSchool = async (form) => {
        const response = await SchoolService.updateSchoolEquivalent(form)
        if (!response.success) return;
        alerts.success("Plantel guardado", "Plantel actualizado correctamente");
        await getSchoolData(schoolId);
        //props.history.push(`/Planteles/Editar/${response.schoolData.cct}`);
    };

    const [school, setSchool] = useState({});
    const searchSchools = async function (values, schoolId) {
        setLoading(true);
        const response = await SchoolService.schoolEquivalentSearch(values);
        if (!response.success) return;
        setLoading(false);
        const list = response.schoolList.find(i => i.idschool == schoolId);
        setSchool(list);
        
    };
    useEffect(() => {
        if (stateId != null && schoolId != null) searchSchools(stateId, schoolId);
    }, [stateId]);

    return (
        <>
            <Breadcrumb>
                <Breadcrumb.Item>
                    <Link to="/" style={{ color: "black" }}>
                        <HomeOutlined />
                    </Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item>
                    <Link to="/PlantelesEquivalentes/" style={{ color: "black" }}>
                        <span>Lista de planteles</span>
                    </Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item style={{ color: "black" }}>
                    <span>Editar plantel</span>
                </Breadcrumb.Item>
            </Breadcrumb>

            <Row style={{ marginTop: "1em" }}>
                <Col xs={{ span: 24 }}>
                    <Title>Editar plantel</Title>
                </Col>
            </Row>

            <Loading loading={loading}>
                {school.name != null && (<>
                    <Row style={{ marginTop: "1em" }}>
                        <Col lg={6} style={{ border: '1px solid #ccc', padding: '4px', borderRadius: '0px', }}>
                            {`CCT: ${school.cct}`}
                        </Col>
                        <Col lg={1}></Col>
                        <Col lg={17} style={{ border: '1px solid #ccc', padding: '4px', borderRadius: '0px', }}>
                            {`Plantel: ${school.name}`}
                        </Col>
                    </Row>
                </>)}
            </Loading>
            <hr></hr>

            <PageLoading loading={loading}>
                <>
                    <SchoolEquivalentForm {...props} schoolData={schoolData} onSubmit={editSchool} stateId={stateId} />
                </>
            </PageLoading>
        </>
    );
}

function SchoolNotFound() {
    return (
        <Alert
            message={<strong>Atención</strong>}
            description="No se ha encontrado ningún plantel con este cct. Favor de verificarlo."
            type="warning"
            showIcon
        />
    );
}
