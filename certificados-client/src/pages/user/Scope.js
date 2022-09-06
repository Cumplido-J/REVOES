import React, { useEffect, useState } from "react";

import { Form, Row, Col,  Card, Table, Tooltip,Alert } from "antd";
import { CheckCircleOutlined, EditOutlined,DeleteOutlined } from "@ant-design/icons";
import Alerts from "../../shared/alerts";
import { ButtonIcon,PrimaryButton, Loading, SearchSelect } from "../../shared/components";
import CatalogService from "../../service/CatalogService";
import Columns, { columnProps } from "../../shared/columns";
import UserService from "../../service/UserService";



import { studentStatusCatalog } from "../../shared/catalogs";
import ModalEditScope from "./ModalEditScope";

import ModalDeleteAdminScope from "./ModalDeleteAdminScope";


const colProps = {
    xs: { span: 24 },
    md: { span: 8 },
  };
  const rowProps = {
    style: { marginBottom: "1em" },
  };

  const validations = {
    name: [{ required: true, message: "¡El nombre del grupo es requerido! " }],
    stateId: [{ required: true, message: "¡El estado es requerido!" }],
    statusId: [{ required: true, message: "¡El estatus es requerido!" }],
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

const Scope = () => {

    const columns  = () => [
        {
        ...columnProps,
        title: "Opciones",
        render: (row) => {
            return (
            <>
    
                <ButtonIcon
                    tooltip="Editar"
                    icon={<EditOutlined />}
                    color="green"
                    onClick={() =>selectModalUpdate(row.id,"Editar")}
                />
            </>
            );
        },
        },
        Columns.descriptionGrup7,
        Columns.descriptionGrup4,
        Columns.descriptionGrup5,
        {
            ...columnProps,
            title: "Estatus",
            render: (row) => {
                return (
                <>
                <Tooltip placement="topLeft" title="Estatus para certificar o titular">
                    {row.description4}
                    </Tooltip>   
                </>
                );
            },
        },

        {
        ...columnProps,
        title: "Eliminar",
        render: (row) => {
            return (
            <>
            <ButtonIcon
                onClick={() =>selectModalDelete(row.id,row.description2,row.description3,"Eliminar")}
                tooltip="Eliminar"
                icon={<DeleteOutlined />}
                color="red"  
            />
            </>
            );
        },
        },    
    ];

    const [loading, setLoading] = useState(false);
    const [dataSet, setDataSet] = useState();
    const [CatalogData, setCatalogData] = useState();
    const [Count, setCount] = useState(0);
    const [form] = Form.useForm();
    const [id, setId] = useState(null);
    const [catalogs, setCatalogs] = useState({ states: [], schools: [] });
    const [modalFielVisibleEdit, setModalFielVisibleEdit] = useState(false);
    const [modalFielVisibleDelete, setModalFielVisibleDelete] = useState(false);

    const [dataScopeSet, setDataScopeSet] = useState();

    useEffect(() => {
        
        getAllScope()
        
    }, [setDataSet,CatalogData]);
    
    const getAllScope = async () => {
        setLoading(true);
        form.setFieldsValue({ stateId:null,schoolId:null,statusId:2});
        const {scope} = await UserService.getAllScopeDetail()
        setDataSet(scope)
        setCount(scope.length);
        const states = await getStates();
        setCatalogs({ states, schools: [] });
        setLoading(false);
    }

    const handleFinish = async (values) => {
        setLoading(true);
        await addNewScope(values)
        
        setCatalogData(values)
        form.setFieldsValue({ stateId:null,schoolId:null,statusId:2});
        setLoading(false);
    };
    const handleFinishFailed = () => {
        Alerts.warning("Favor de llenar correctamente", "Existen campos sin llenar.");
    };

    const addNewScope = async (form) => {
        const response = await UserService.addNewScope(form);
        if (!response.success) return;
        Alerts.success("Alcance guardado", "Alcance insertado correctamente");
    };

    async function onChangeState(stateId) {
        const schools = await getSchools(stateId);
        form.setFieldsValue({ schoolId: null, careerId: null });
        setCatalogs({ ...catalogs, schools, careers: [] });
    }

    const selectModalUpdate = (id,caso) =>{
        (caso==="Editar")&&toggleModalFielEdit();
        setId(id);
    }
    const toggleModalFielEdit = () => {
        setModalFielVisibleEdit(!modalFielVisibleEdit);
    };
      
    const selectModalDelete = (id,description2,description3,caso) =>{
        setDataScopeSet({description2:description2,description3:description3});
        (caso==="Eliminar")&&toggleModalFielDelete();
        setId(id);
    };
    
    const toggleModalFielDelete = () => {
        setModalFielVisibleDelete(!modalFielVisibleDelete);
    };



    const getByIdScope = async (id) => {
        const { scopeData } = await UserService.getByIdScope(id);
        return scopeData;
    }
    
    const updateScope = async (form) => {
        const response = await UserService.updateScope(form);
        if (!response.success) return;
        Alerts.success("Alcance actualizado", "Grupo alcance correctamente");
        setCatalogData(form);
        };
      
    const deleteScope = async (form) => {
        const response = await UserService.deleteScope(form);
        if (!response.success) return;
        Alerts.success("Alcance eliminado", "Alcacne eliminado correctamente");
        setCatalogData(form);
    };

    return (
        <>
        <Loading loading={loading}>
        <Row style={{ marginBottom: "1em" }}>
            <Col xs={{ span: 24 }}>
                <Alert
                    message={<strong>Alcance</strong>}
                    description={
                    <>
                        <p>El alcance permite separar el nivel de institutos que estan clasificados en estatal y plantel:</p>
                    <ul>
                        <li>Unicamente se deberá crear un alcance cuando en el catálogo de alcance no tenga alguno disponible.
                        </li>
                        <li>
                            Sí desea un alcance estatal solo se deberá seleccionar un estado,para nivel plantel se deberá seleccionar algun dato del segundo combo. 
                        </li>
                        <li>
                            Unicamente se deberá poner el estatus activo al estado en el que certificará o titulará el usuario dentro de un grupo.
                        </li>
                    </ul>
                    </>
                    }
                    type="warning"
                    showIcon
                />
            </Col>
        </Row>  

        <Row align="center">    
        <Card title="Crear grupo"  style={{ width: 800 }}>
            <Form form={form} onFinish={handleFinish} onFinishFailed={handleFinishFailed} layout="vertical">
            
                <Row {...rowProps}>
                <Col span={8}>
                <Form.Item label="Estado:" name="stateId" rules={validations.stateId}>
                    <SearchSelect dataset={catalogs.states} onChange={onChangeState} />
                </Form.Item>
                </Col>
                <Col span={8}>
                <Form.Item label="Plantel:" name="schoolId" >
                    <SearchSelect dataset={catalogs.schools} />
                </Form.Item>
                </Col>

                <Col span={8}>
                <Form.Item label="Estatus:" name="statusId" rules={validations.statusId}>
                <SearchSelect dataset={studentStatusCatalog} />
                </Form.Item>
                </Col>    

                </Row>
                <Row align="center" {...rowProps}>
                <Col  {...colProps}>
                
                <PrimaryButton icon={<CheckCircleOutlined />} loading={loading} size="large" fullWidth={false}>
                    Guardar alcance
                </PrimaryButton>
                </Col>
                </Row>

            </Form>
        </Card>
        </Row>
            <Table
                rowKey="id"
                bordered
                pagination={{ position: ["topLeft", "bottomLeft"] }}
                columns={columns()}
                scroll={{ x: columns.length * 200 }}
                dataSource={dataSet}
                size="small"
            />
            <p>
            <strong>Registros encontrados: </strong> {Count}
            </p>
            <ModalEditScope id = { id } nameIsForm = "Alcance" setId={ setId }
            toggleModalFielEdit={toggleModalFielEdit} modalFielVisibleEdit={modalFielVisibleEdit}
            onSubmit={updateScope} getById={getByIdScope}
            />  
            <ModalDeleteAdminScope id = { id } nameIsForm = "Alcance" setId={ setId }
            toggleModalFielDelete={toggleModalFielDelete} modalFielVisibleDelete={modalFielVisibleDelete}
            onSubmit={deleteScope} getById={getByIdScope} dataScope={dataScopeSet}
            /> 
        </Loading>  
        </>
    )
}

export default Scope
