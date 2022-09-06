import React, { useEffect, useState } from "react";

import { Form, Row, Col, Input, Card, Table, Alert  } from "antd";
import { CheckCircleOutlined, EditOutlined,EyeOutlined,DeleteOutlined, FileAddOutlined } from "@ant-design/icons";
import Alerts from "../../shared/alerts";
import { ButtonIcon,PrimaryButton, Loading } from "../../shared/components";
import Columns, { columnProps } from "../../shared/columns";
import UserService from "../../service/UserService";
import ModalEditAdminScope from "./ModalEditAdminScope";
import ModalDeleteAdminScope from "./ModalDeleteAdminScope";
import ModalCatScope from "./ModalCatScope";
import ModalToAssignCatScopeAndScope from "./ModalToAssignCatScopeAndScope";



const colProps = {
    xs: { span: 24 },
    md: { span: 8 },
};
const rowProps = {
    style: { marginBottom: "1em" },
};

const validations = {
    name: [{ required: true, message: "¡El nombre del grupo es requerido! " }],
};

const CatalogScope = () => {

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
                <ButtonIcon
                    tooltip="Mostrar alcance"
                    icon={<EyeOutlined />}
                    color="blue"  
                    onClick={() =>selectModalCat(row.id,"VerCat")}
                />
                <ButtonIcon
                    tooltip="Asignacion de alcance"
                    icon={<FileAddOutlined />}
                    color="geekblue"  
                    onClick={() =>selectModalToAssign(row.id,"Asignar")}
                />
            </>
            );
        },
        },
        Columns.descriptionGrup1,
        Columns.descriptionGrup3,
        {
        ...columnProps,
        title: "Eliminar",
        render: (row) => {
            return (
            <>
            <ButtonIcon
                onClick={() =>selectModalDelete(row.id,"Eliminar")}
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
    const [modalFielVisibleEdit, setModalFielVisibleEdit] = useState(false);
    const [modalFielVisibleDelete, setModalFielVisibleDelete] = useState(false);
    const [modalFielVisibleCat, setModalFielVisibleCat] = useState(false);
    const [modalFielVisibleToAssign, setModalFielVisibleToAssign] = useState(false);

    useEffect(() => {
        
        getAllScope()
        
    }, [setDataSet,CatalogData]);
    
    const getAllScope = async () => {
        setLoading(true);
        const {scope} = await UserService.getAllScopeDescription()
        setDataSet(scope)
        setCount(scope.length);
        setLoading(false);
    }

    const addNewCatScope = async (form) => {
        const response = await UserService.addNewCatScope(form);
        if (!response.success) return;
        Alerts.success("Catálogo de alcance guardado", "Catálogo de alcance insertado correctamente");
    };

    const handleFinish = async (values) => {
        setLoading(true);
        await addNewCatScope(values);
        setCatalogData(values)
        form.setFieldsValue({ description2:null, description3:null});
        setLoading(false);
    };
    const handleFinishFailed = () => {
        Alerts.warning("Favor de llenar correctamente", "Existen campos sin llenar.");
    };

    const selectModalUpdate = (id,caso) =>{
        (caso==="Editar")&&toggleModalFielEdit();
        setId(id);
    }  
    const toggleModalFielEdit = () => {
        setModalFielVisibleEdit(!modalFielVisibleEdit);
    };
    const updateCat = async (form) => {
        const response = await UserService.editCatScope(form);
        if (!response.success) return;
        Alerts.success("Catálogo de alcance actualizado", "Catálogo de alcance actualizado correctamente");
        setCatalogData(form);
    };
    const getGroupDataById = async (id) => {
            const { scopeData } = await UserService.getByIdCatScope(id);
            return scopeData;
    }

    const selectModalDelete = (id,caso) =>{
        (caso==="Eliminar")&&toggleModalFielDelete();
        setId(id);
      };
    
      const toggleModalFielDelete = () => {
        setModalFielVisibleDelete(!modalFielVisibleDelete);
      };

    const deleteCat = async (form) => {
        const response = await UserService.deleteCatScope(form);
        if (!response.success) return;
        Alerts.success("Catálogo de alcance eliminado", "Catálogo de alcance eliminado correctamente");
        setCatalogData(form);
      };    

      const selectModalCat = (id,caso) =>{
        (caso==="VerCat")&&toggleModalFielCat();
        setId(id);
      };
    
      const toggleModalFielCat = () => {
        setModalFielVisibleCat(!modalFielVisibleCat);
      };

    const selectModalToAssign = (id,caso) =>{
        (caso==="Asignar")&&toggleModalFielToAssign();
        setId(id);
    };
    
    const toggleModalFielToAssign = () => {
        setModalFielVisibleToAssign(!modalFielVisibleToAssign);
    };
    return (
        <>
        <Loading loading={loading}>
        <Row style={{ marginBottom: "1em" }}>
            <Col xs={{ span: 24 }}>
                <Alert
                    message={<strong>Catálogo de alcance</strong>}
                    description={
                    <>
                        <p>El catálogo del alcance permite agrupar un conjunto de uno o muchas vistas hacia los planteles:</p>
                    <ul>
                        <li>Unicamente se deberá crear un cátalogo nuevo cuando se combinen nuevos alcances.
                        </li>
                        <li>
                            Sí no existen alcances disponibles estos se deberán crear primero. 
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
                <Col span={12}>
                    <Form.Item label="Nombre del catalogo del alcance:" name="description2" rules={validations.name}>
                    <Input placeholder="Nombre del catalogo del alcance" style={{ width: "90%" }} />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item label="Descripción:" name="description3" >
                    <Input placeholder="Descripción" style={{ width: "90%" }} />
                    </Form.Item>
                </Col>
                </Row>
                <Row align="center" {...rowProps}>
                <Col  {...colProps}>
                
                <PrimaryButton icon={<CheckCircleOutlined />} loading={loading} size="large" fullWidth={false}>
                    Guardar grupo
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
            <ModalEditAdminScope id = { id } nameIsForm = "Catálogo" setId={ setId }
            toggleModalFielEdit={toggleModalFielEdit} modalFielVisibleEdit={modalFielVisibleEdit}
            onSubmit={updateCat} getById={getGroupDataById}
            />
            <ModalDeleteAdminScope id = { id } nameIsForm = "Grupo" setId={ setId }
            toggleModalFielDelete={toggleModalFielDelete} modalFielVisibleDelete={modalFielVisibleDelete}
            onSubmit={deleteCat} getById={getGroupDataById}
            />
            <ModalCatScope id = { id } setId={ setId }
            toggleModalFielCat={toggleModalFielCat} modalFielVisibleCat={modalFielVisibleCat}/>

            <ModalToAssignCatScopeAndScope id = { id } setId={ setId }
            toggleModalFielToAssign={toggleModalFielToAssign} modalFielVisibleToAssign={modalFielVisibleToAssign}
            />

        </Loading>    
        </>
    )
}

export default CatalogScope