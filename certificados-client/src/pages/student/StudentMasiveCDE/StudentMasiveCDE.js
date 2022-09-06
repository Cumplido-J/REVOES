import { Breadcrumb, Col, Input, Row, Form, Modal, Table, Collapse } from "antd";
import { Link } from "react-router-dom";
import * as XLSX from "xlsx";
import { useState, useEffect } from 'react';
import { CheckCircleOutlined } from "@ant-design/icons";
import * as React from 'react';
import CatalogService from "../../../service/CatalogService";
import alerts from "../../../shared/alerts";
import { ButtonCustom, ButtonCustomLink, Loading, PrimaryButton, SearchSelect, Subtitle } from "../../../shared/components";
import StudentMasiveLoadService from "../../../service/StudentMasiveLoadService";
import { ExportExcel } from "../StudentMasiveLoadGraduates/ExportExcel";

const { Panel } = Collapse;

const validations = {

    stateId: [{ required: true, message: "¡El estado es requerido!" }],
    schoolId: [{ required: true, message: "¡El plantel es requerido!" }],
    careerId: [{ required: true, message: "¡La carrera es requerida!" }],
    generationId: [{ required: true, message: "¡La generación es requerida!" }],
    file: [{ required: true, message: "¡El archivo es requerido" }],
};

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

async function getCareers(schoolId) {
    const response = await CatalogService.getCareerCatalogs(schoolId);
    return response.careers.map((career) => ({
        id: career.id,
        description: `${career.description1} - ${career.description2}`,
    }));
}

async function getGenerations() {
    const response = await CatalogService.getGenerationsCatalogs();
    return response.generations.map((generation) => ({
        id: generation.id,
        description: generation.description
    }));
}

const getDisplinaryCompetence = async () => {

    const response = await CatalogService.getdiciplinaryCompentence();
    return response.competence.map(displinary => ({
        key: displinary.id,
        id: displinary.id,
        description: `${displinary.description1} / ${displinary.description2}`
    }));

}
/////////////////

export default function StudentMasiveCDE(props) {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [catalogs, setCatalogs] = useState({ states: [], schools: [], careers: [], generations: [] });
    const [estate, setEstate] = useState({
        hoja: "",
        hojas: [],
        file: false,
        disabled: true,
        studentData: ""
    });

    const [data, setData] = useState([]);
    const [active, setActive] = useState(false);

    const [idCarrera, setIdCarrera] = useState(0);
    const [idGeneration, setIdGeneration] = useState("");
    const [idEntidad, setIdEntidad] = useState("");
    const [hiddenExcel, setHiddenExcel] = useState(true);
    const [fecha, setFecha] = useState(null);

    const [stateId, setStateId] = useState();
    const [generation, setGeneration] = useState();
    const [period, setPeriod] = useState([]);
    const [visible, setVisible] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [disciplinary, setDisciplinary] = useState([]);
    const [error, setError] = useState([]);

    useEffect(() => {
        async function getDiciplinar() {
            const response = await getDisplinaryCompetence();
            setDisciplinary(response);
        }
        getDiciplinar();
    }, [])

    const upDateIdCarrera = (id) => {
        setIdCarrera(id)
    }

    const upDateIdGeneration = (id) => {
        setIdGeneration(id)
    }

    const upDateIdEntidad = (id) => {
        setIdEntidad(id)
    }



    async function onChangeState(stateId) {
        if (stateId != null) setStateId(stateId);
        const schools = await getSchools(stateId);
        upDateIdEntidad(stateId);
        form.setFieldsValue({ schoolId: null, careerId: null, generationId: null });
        setCatalogs({ ...catalogs, schools, careers: [], generations: [] });
        setHiddenExcel(true);
        setEstate({
            hoja: "",
            hojas: [],
            file: false,
            disabled: true,
            studentData: ""
        });
    }

    async function onChangeSchool(schoolId) {
        const careers = await getCareers(schoolId);
        form.setFieldsValue({ careerId: null, generationId: null });
        setCatalogs({ ...catalogs, careers, generations: [] });
        setHiddenExcel(true);
        setEstate({
            hoja: "",
            hojas: [],
            file: false,
            disabled: true,
            studentData: ""
        });
    }



    ///para masiveload cuando cambia el id lo actualizamos
    async function onChangeCareer(careerId) {

        console.log(`careerId careerId= ${careerId} hiddenExcel=${hiddenExcel}`);
        const generations = await getGenerations();
        form.setFieldsValue({ generationId: null });
        upDateIdCarrera(careerId);
        setCatalogs({ ...catalogs, generations });
        setHiddenExcel(true);
        setEstate({
            hoja: "",
            hojas: [],
            file: false,
            disabled: true,
            studentData: ""
        });
    }

    async function onChangeGenerations(generationId) {
        if (generationId == "" || generationId == null) {
            setHiddenExcel(true);
        } else {
            setGeneration(generationId);
            upDateIdGeneration(generationId);
            setHiddenExcel(false);
        }
        console.log(`generationId generationId= ${generationId} hiddenExcel=${hiddenExcel}`);
        setEstate({
            hoja: "",
            hojas: [],
            file: false,
            disabled: true,
            studentData: "",
            generation: generationId
        });
        console.log("id de generation:" + estate.generation);

    }

    useEffect(() => {
        async function loadStates() {
            const states = await getStates();
            setCatalogs({ states, schools: [], careers: [], periods: [], generations: [] });
        }
        loadStates();
    }, []);



    const handleFinishFailed = () => {
        alerts.warning("Favor de llenar correctamente", "Existen campos sin llenar.");
    };



    const handleOnImport = (e) => {
        const [file] = e.target.files;
        const reader = new FileReader();
        console.log('==>: ' + e.target.files[0].name.lastIndexOf('xlsx'))
        if (e.target.files[0].name.lastIndexOf('xlsx') >= 0) {

            reader.onload = (val) => {
                const bstr = (val.target.result);
                const wb = XLSX.read(bstr, { type: "array" });
                const wsname = wb.SheetNames[0];
                const ws = wb.Sheets[wsname];
                //const data = XLSX.utils.sheet_to_csv(ws, { header: 1 });
                var data = XLSX.utils.sheet_to_row_object_array(ws, { raw: true, defval: null });

                let json = [];
                data.forEach((item, i) => {
                    json.push({ key: i, curp: item.curp, disciplinaryId: item.disciplinaryId });
                });
                console.log(JSON.stringify(json))
                setData(json);
            }
        } else {
            alerts.warning("¡Advertencia!", "¡La extension es incorrecta.!");
        }
        reader.readAsArrayBuffer(file);
    }

    useEffect(() => {
        async function loadData() {
            if (data != "") {
                setActive(true);
                console.log(active + "-->::" + data)
            }
        }
        loadData();
        console.log(active)
    }, [data, active])
    //console.log(JSON.stringify(data))


    const handleFinish = async (values) => {
        const list = data.map((item) =>
            ({ stateId: values.stateId, schoolId: values.schoolId, careerId: values.careerId, generation: values.generationId, curp: item.curp, disciplinaryId: item.disciplinaryId })
        );
        if (list.length > 0) {
            setLoading(true);
            const response = await StudentMasiveLoadService.loadingMasiveDiciplinary(list);
            setLoading(false);
            if (response.success) {

                alerts.success("Aviso!", "Operacion exitoso");
                console.log(JSON.stringify(response.data))
            } else {

            }
        } else {
            alerts.warning("Aviso!", "Ocurrio un error con la collección.");
        }

    };
    const setModal = (e) => {
        setShowModal(e);
    }

    const columns = [
        {
            title: 'Identificador',
            dataIndex: 'id',
            key: 'id'
        },
        {
            title: 'Descripción',
            dataIndex: 'description',
            key: 'description',
        },];

    const column = [
        {
            'curp': '', 'disciplinaryId': '',
        },
    ];

    return (
        <>
            <PrimaryButton onClick={() => setModal(true)}>Campo diciplinar</PrimaryButton>
            <Modal
                onCancel={() => {
                    setModal(false);
                }}
                visible={showModal}
                width="100%"
                zIndex={1040}
                centered
                title={"Actualización masiva de la Competencia disciplinar extendida"}
                footer={null}
            >
                {/*<Subtitle>Competencia disciplinar extendida</Subtitle>*/}
                <Row gutter={[16, 16]}>
                    <Col xs={24} md={12} xl={16}>
                        <Collapse accordion>
                            <Panel header="Competencia disciplinar" key="1">
                                <Table columns={columns} dataSource={disciplinary} size="small" />
                            </Panel>
                        </Collapse>
                    </Col>
                    <Col xs={24} md={12} xl={8}>

                        <Form.Item label="Archivo de carga:">
                            <ExportExcel fileName="carga_competencia_diciplinar" dataSet={column} />
                        </Form.Item>

                    </Col>
                </Row>
                <hr></hr>

                <Loading loading={loading} >
                    <Form form={form} onFinish={handleFinish} onFinishFailed={handleFinishFailed} layout="vertical">
                        <Row gutter={[16, 16]}>
                            <Col xs={24} md={12} xl={8}>
                                <Form.Item label="Estado:" name="stateId" rules={validations.stateId}>
                                    <SearchSelect dataset={catalogs.states} onChange={onChangeState} />
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={12} xl={8}>
                                <Form.Item label="Plantel:" name="schoolId" rules={validations.schoolId}>
                                    <SearchSelect dataset={catalogs.schools} onChange={onChangeSchool} />
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={12} xl={8}>
                                <Form.Item label="Carrera:" name="careerId" rules={validations.careerId}>
                                    <SearchSelect dataset={catalogs.careers} onChange={onChangeCareer} />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={[16, 16]}>
                            <Col xs={24} md={12} xl={8}>
                                <Form.Item label="Generación:" name="generationId" rules={validations.generationId}>
                                    <SearchSelect dataset={catalogs.generations} onChange={onChangeGenerations} />
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={12} xl={8}>
                                <Form.Item label="Archivo:" name="fileExcel" rules={validations.file}>
                                    <Input type="file" onChange={handleOnImport} />
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={12} xl={8}>
                                {data.length > 0 && (
                                    <Form.Item label="Enviar" >
                                        <PrimaryButton icon={<CheckCircleOutlined />} loading={loading} fullWidth={true}>
                                            Enviar registros
                                        </PrimaryButton>
                                    </Form.Item>
                                )}
                            </Col>
                        </Row>
                    </Form>
                </Loading>

            </Modal>
        </>
    );

}


