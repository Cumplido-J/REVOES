import React from "react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { HomeOutlined, UnorderedListOutlined, SafetyOutlined } from "@ant-design/icons";
import { Form, Row, Col, Breadcrumb, Progress, Modal, Table, List, Button } from "antd";

import { Loading, Title, ButtonIconLink } from "../../shared/components";


import DegreeCatalogService from "../../service/DegreeCatalogService";


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

export default function DgpStatisticsSchool() {
    const [form] = Form.useForm();
    const [state, setState] = useState();
    const [dgpState, setDgpState] = useState({ states: [] });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        async function loadState() {
            setLoading(true);
            const states = await getStates();
            setLoading(false);
            setDgpState({ states });
        }
        loadState();
    }, []);

    useEffect(() => {
        if (state) {
            console.log(state)
        }

    }, [state])


    return (
        <>
            <DgpStatisticsSchoolHeader />
            <Loading loading={loading}>

                <Row {...rowProps}>
                    <Col lg={24}>
                        <table className="table table-striped" style={{ width: '100%', }}>
                            <thead>
                                <tr>
                                    <th>Estados</th>
                                    <th>Planteles</th>
                                    <th>Total</th>
                                    <th>Detalle</th>
                                </tr>
                            </thead>
                            <tbody>
                                {dgpState.states.map((s) => {
                                    if (s.id != 6 && s.id != 9) {
                                        return (
                                            <tr>
                                                <td>{s.description}</td>
                                                <td>
                                                    <ListSchool id={s.id} />
                                                </td>

                                                <GraficaProgreso id={s.id} name={s.description} />

                                            </tr>
                                        );
                                    }
                                })}
                            </tbody>

                        </table>
                    </Col>
                </Row>
            </Loading>

        </>
    );
}

function DgpStatisticsSchoolHeader() {

    return (
        <>
            <Breadcrumb>
                <Breadcrumb.Item>
                    <Link to="/" style={{ color: "black" }}>
                        <HomeOutlined />
                    </Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item style={{ color: "black" }}>
                    <Link to="/Dgp/DgpStatisticsSchool" style={{ color: "black" }}>
                        <span>Gráficas</span>
                    </Link>
                </Breadcrumb.Item>
            </Breadcrumb>

            <Row style={{ marginTop: "1em" }}>
                <Col xs={{ span: 24 }}>
                    <Title>Estadística: Planteles en DGP </Title>
                </Col>
            </Row>
        </>
    );
}

function ListSchool({ id }) {
    const [loading, setLoading] = useState(false);
    const [catalogs, setCatalogs] = useState([]);
    useEffect(() => {
        const getSchoolDgp = async () => {
            setLoading(true);
            if (id == "") return setLoading(false);
            const response = await DegreeCatalogService.getSchools(id);
            if (!response) return;
            const schools = response.schools.map((school) => ({
                id: school.id,
                clave: school.description1,
                school: school.description2
            }));
            setCatalogs(schools);
            setLoading(false);
        }
        getSchoolDgp();
    }, [id]);
    return (
        <>
            <div>
                {catalogs.length > 0 && (<Progress percent={100} steps={catalogs.length} size="large" strokeColor="#52c41a" />)}
                {catalogs.length == 0 && (<Progress percent={0} steps={0} size="large" strokeColor="#ccc" />)}
            </div>

        </>
    );
}


function GraficaProgreso({ id, name }) {
    const [loading, setLoading] = useState(false);
    const [catalogs, setCatalogs] = useState([]);
    useEffect(() => {
        const getSchoolDgp = async () => {
            setLoading(true);
            if (id == "") return setLoading(false);
            const response = await DegreeCatalogService.getSchools(id);
            if (!response) return;
            const schools = response.schools.map((school) => ({
                key: school.id,
                id: school.id,
                clave: school.clave,
                school: school.name
            }));
            setCatalogs(schools);
            setLoading(false);
        }
        getSchoolDgp();
    }, [id]);
    return (
        <>
            <td>
                <div>
                    <Progress type="circle" percent={catalogs.length} format={percent => `${percent} `} width={50} />
                </div>
            </td>
            <SchoolDgp size={catalogs.length} schools={catalogs} name={name} />
        </>
    );
}

function SchoolDgp({ size, schools, name }) {
    const [visible, setVisible] = useState(false);


    const columns = [
        {
            title: 'Clave Plantel',
            dataIndex: 'clave',
            key: 'clave',
        },
        {

            title: 'Nombre Plantel',
            dataIndex: 'school',
            key: 'school',
        },
        {
            title: 'Total de Carreras',
            key: 'action',
            render: (text, record) => {

                return (
                    <>
                        <GraphCareer schoolId={record.id} />
                    </>
                )
            },
        },
    ];
    return (<>
        <td>
            <ButtonIconLink
                tooltip="Ver"
                icon={<UnorderedListOutlined />}
                color="green"
                onClick={() => setVisible(true)}
            />
            <Modal
                title="Planteles en DGP"

                style={{ top: 20 }}
                visible={visible}
                onCancel={() => setVisible(false)}
                width={1000}
                footer={[
                    <Button key="back" onClick={() => setVisible(false)} >
                        Cerrar
                    </Button>,
                ]}
            >
                <Table columns={columns}
                    expandable={{
                        expandedRowRender: record => <p style={{ margin: 0 }}>
                            <LitsCareer schoolId={record.id} />
                        </p>,
                        rowExpandable: record => record.clave !== null,
                    }}
                    dataSource={schools}
                    size="small"
                    title={() => <>
                        <Row>
                            <Col xs={12} sm={12} md={12} lg={12} xl={12}><h6>Colegio: {name}</h6></Col>
                            <Col xs={12} sm={12} md={12} lg={12} xl={12}><h6 style={{ alignText: "center" }}>Total de registros: {size}</h6></Col>
                        </Row>
                    </>}
                />
            </Modal>
        </td>
    </>);
}

function LitsCareer({ schoolId }) {
    const [career, setCareer] = useState([]);
    useEffect(() => {
        const onChangeSchool = async () => {
            const response = await DegreeCatalogService.getCarrers(schoolId);
            if (!response) return;
            const careers = response.careers.map((career) => ({
                id: career.id,
                clave: career.description1,
                career: career.description2
            }));
            setCareer({ careers });
        };
        onChangeSchool()
    }, [schoolId]);
    return (
        <>
            <List
                itemLayout="horizontal"
                dataSource={career.careers}
                renderItem={item => (
                    <List.Item>
                        <List.Item.Meta
                            avatar={<SafetyOutlined style={{ fontSize: '18px', color: '#08c' }} />}
                            title={`Clave: ${item.clave}`}
                            description={`Carrera: ${item.career}`}
                        />
                    </List.Item>
                )}
            />
        </>
    );
}

function GraphCareer({ schoolId }) {
    const [career, setCareer] = useState([]);
    useEffect(() => {
        const onChangeSchool = async () => {
            const response = await DegreeCatalogService.getCarrers(schoolId);
            if (!response) return;
            const careers = response.careers.map((career) => ({
                id: career.id,
                clave: career.description1,
                career: career.description2
            }));
            setCareer(response.careers);
        };
        onChangeSchool()
    }, [schoolId]);
    return (
        <>
            <Progress type="circle" percent={career.length} format={percent => `${percent}`} width={40} />
        </>
    );
}