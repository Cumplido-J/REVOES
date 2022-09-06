import React from "react";
import { Link } from "react-router-dom";

import { HomeOutlined, CheckCircleOutlined, ArrowLeftOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { Form, Row, Col, Breadcrumb, Input } from "antd";

import { Loading, SearchSelect, Title, PrimaryButton, ButtonCustomLink } from "../../shared/components";
import { useEffect, useState } from "react";

import DegreeCatalogService from "../../service/DegreeCatalogService";
import Alerts from "../../shared/alerts";
import DgpServices from "../../service/DgpServices";
import DecreeTable from "../dgps/DecreeTable";

const colProps = {
    xs: { span: 24 },
    md: { span: 8 },
};
const rowProps = {
    style: { marginBottom: "1em" },
};

const validations = {
    name: [{ required: true, message: "¡El nombre es requerido!" }],
    clave: [{ required: true, message: "¡La Clave es requerido!" }],
    state: [{ required: true, message: "¡El estado es requerido!" }],
    school: [{ required: true, message: "¡El plantel es requerido!" }],
};

async function getStates() {
    const response = await DegreeCatalogService.getStates();
    return response.degreeStates.map((degreeState) => ({ id: degreeState.id, description: degreeState.description1 }));
}

export default function DgpSchoolEditar() {
    const [form] = Form.useForm();
    const [decree, setDecree] = useState([]);
    const [dgpState, setDgpState] = useState({ states: [] });
    const [loading, setLoading] = useState(false);
    const [catalogs, setCatalogs] = useState([]);

    useEffect(() => {
        async function loadState() {
            const states = await getStates();
            setDgpState({ states });
        }
        loadState();
    }, []);

    useEffect(() => {
        const onChangeDecree = async () => {
            setLoading(true);
            if (decree == "") return setLoading(false);
            const response = await DgpServices.selectAllDecree(decree);
            const states = response.state.map((s) => ({
                id: s.id,
                name: s.name,
                abbreviation: s.abbreviation,
                decreeNumber: s.decreeNumber,
                decreeDate: s.decreeDate,
                state: s.state,
                cityName: s.cityName
            }));
            setCatalogs(states)
            setLoading(false);
        }
        onChangeDecree();
    }, [decree]);

    return (
        <>
            <DgpSchoolEditarHeader />
            <Loading loading={loading}>

                <Row {...rowProps}>
                    <Col {...colProps}>
                        <SearchSelect dataset={dgpState.states} onChange={setDecree} value={decree} />
                    </Col>
                </Row>
                <th/>
                <DecreeTable dataset={catalogs} />
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
                    <Link to="/Dgp/Decreto" style={{ color: "black" }}>
                        <span>Decreto estatal</span>
                    </Link>
                </Breadcrumb.Item>
            </Breadcrumb>

            <Row style={{ marginTop: "1em" }}>
                <Col xs={{ span: 24 }}>
                    <Title>Decretos estatales </Title>
                </Col>
            </Row>
        </>
    );
}