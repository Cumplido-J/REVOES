import React, { useState, useEffect } from "react";
import { Link, Router } from "react-router-dom";

import { Row, Col, Breadcrumb } from "antd";
import { HomeOutlined } from "@ant-design/icons";

import { Loading, Title } from "../../shared/components";
import alerts from "../../shared/alerts";

import SchoolService from "../../service/SchoolService";
import SchoolEquivalentForm from "./SchoolEquivalentForm";
export default function SchoolEquivalentAdd(props) {
    const { stateId, schoolId } = props.match.params;
    const addSchoolEquivalent = async (form) => {
        const response = await SchoolService.addchoolEquivaalent(form);
        if (!response.success) return;
        alerts.success("Plantel guardado", "Plantel insertado correctamente");
        //props.history.push(`/Planteles/Editar/${response.schoolData.cct}`);
    };
    const [school, setSchool] = useState({});
    const [loading, setLoading] = useState(false);
    const searchSchools = async function (values, schoolId) {
        setLoading(true);
        const response = await SchoolService.schoolEquivalentSearch(values);
        if (!response.success) return;
        setLoading(false);
        console.log(JSON.stringify(response.schoolList));
        const list = response.schoolList.find(i => i.idschool == schoolId);
        console.log(list);
        console.log(list.idschool)
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
                    <span>Agregar plantel equivalente</span>
                </Breadcrumb.Item>
            </Breadcrumb>

            <Row style={{ marginTop: "1em" }}>
                <Col xs={{ span: 24 }}>
                    <Title>Agregar plantel</Title>
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
            <SchoolEquivalentForm {...props} onSubmit={addSchoolEquivalent} stateId={stateId} />
        </>
    );
}
